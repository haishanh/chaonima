import { browser, defineContentScript } from '#imports';
import { ContentUi } from './ContentUi';
import { setLoading } from './Start';
import { setGlobalContext, StartUi } from './StartUi';
import {
  MESSAGE_LLM_TEXT_CHUNK,
  MESSAGE_RETRIEVE_POST_INFO,
  MESSAGE_RETRIEVE_COMMENTS,
  MESSAGE_START,
  MESSAGE_UPDATE_INFO,
  MessageLlmTextChunk,
  MessageRetrieveComments,
  MessageRetrievePostInfo,
  MessageStart,
  MessageUpdateInfo,
  MESSAGE_CHECKING_REMOTE_SAVED,
  MESSAGE_REMOTE_TEXT,
  MessageRemoteText,
} from '@/utils/message';
import { appendText } from 'preview/react';
import * as z from 'zod';

export default defineContentScript({
  matches: ['*://*.v2ex.com/t/*'],
  async main(ctx) {
    // does not look like a v2ex topic page
    if (!document.querySelector<HTMLDivElement>('#Main')) return;

    setGlobalContext(ctx);

    armListeners();

    browser.runtime.sendMessage({
      type: MESSAGE_START,
      payload: { checkState: true },
    } satisfies z.infer<typeof MessageStart>);

    StartUi.mount();
  },
});

async function handleRetrievePostInfo(msg: { payload: { url: string } }) {
  setLoading(true);

  const main = document.querySelector<HTMLDivElement>('#Main');
  // does not look like a v2ex topic page
  if (!main) return;

  const pi = getPageInfo();
  const pc = getPostContent();
  const comments = getComments(main);
  const url = msg.payload.url;

  await browser.runtime.sendMessage({
    type: MESSAGE_UPDATE_INFO,
    payload: { ...pc, ...pi, comments, url },
  } satisfies z.infer<typeof MessageUpdateInfo>);
}

async function handleRetrieveComments(msg: { payload: { url: string } }) {
  setLoading(true);

  const main = document.querySelector<HTMLDivElement>('#Main');
  // does not look like a v2ex topic page
  if (!main) return;

  const pi = getPageInfo();
  const comments = getComments(main);
  await browser.runtime.sendMessage({
    type: MESSAGE_UPDATE_INFO,
    payload: {
      url: msg.payload.url,
      currentPage: pi.currentPage,
      comments,
    },
  } satisfies z.infer<typeof MessageUpdateInfo>);
}

function armListeners() {
  browser.runtime.onMessage.addListener((m, sender, reply) => {
    switch (m.type) {
      case MESSAGE_RETRIEVE_POST_INFO: {
        const msg = MessageRetrievePostInfo.parse(m);
        handleRetrievePostInfo(msg);
        return false;
      }

      case MESSAGE_RETRIEVE_COMMENTS: {
        const msg = MessageRetrieveComments.parse(m);
        handleRetrieveComments(msg);
        return false;
      }

      case MESSAGE_CHECKING_REMOTE_SAVED: {
        setLoading(true);
        return false;
      }

      case MESSAGE_REMOTE_TEXT: {
        ContentUi.mount();
        StartUi.unmount();
        setLoading(false);
        const message = MessageRemoteText.parse(m);
        const text = message.payload.text;
        appendText(text);
        return false;
      }

      default: {
        throw new Error(`Unknown message type: ${m.type}`);
      }
    }
  });

  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((m, port) => {
      switch (m.type) {
        case MESSAGE_LLM_TEXT_CHUNK: {
          ContentUi.mount();

          const message = MessageLlmTextChunk.parse(m);

          if (message.payload.firstChunk) {
            StartUi.unmount();
            setLoading(false);
          }

          const text = message.payload.text;
          appendText(text);
          return false;
        }
        default: {
          throw new Error(`Unknown message type: ${m.type}`);
        }
      }
    });
  });
}

function getPageInfo() {
  const ps = document.querySelector('#Main .ps_container');
  // post which has only one page does not have this element
  if (!ps) return { currentPage: 1, totalPages: 1 };

  const pageLinks = Array.from(ps.querySelectorAll('td:first-child a'));
  const currentPageStr = pageLinks.find((x) => x.classList.contains('page_current'))?.textContent;

  if (!currentPageStr) {
    throw new Error(`Unable to locate current page in .ps_container`);
  }

  const currentPage = parseInt(currentPageStr, 10);
  if (isNaN(currentPage)) {
    throw new Error(`Invalid current page number [${currentPageStr}]`);
  }

  const totalPages = pageLinks.length;
  return { currentPage, totalPages };
}

function getPostContent() {
  const title = document.querySelector('#Main .header h1')?.textContent;
  if (!title) {
    throw new Error(`Unable to retrieve post title`);
  }

  const author = document.querySelector('#Main .header a[href^="/member/"]')?.textContent || '';

  const body = document.querySelector('#Main .topic_content')?.textContent || '';
  return { title, body, author };
}

function getComments(main: HTMLDivElement) {
  const comments: Array<{ user: string; reply: string }> = [];
  main.querySelectorAll('.cell[id^=r_]').forEach((cell) => {
    const user = cell.querySelector('td a[href^="/member/"]')?.textContent;
    const reply = cell.querySelector('.reply_content')?.textContent;
    if (!user || !reply) return;
    comments.push({ user, reply });
  });
  return comments;
}
