import { browser, defineBackground, type Browser } from '#imports';
import { logger } from '@/utils/log.utils';
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
  MessageCheckingRemoteSaved,
  MESSAGE_REMOTE_TEXT,
  MessageRemoteText,
} from '@/utils/message';
import { fetchTextStream } from 'preview/plain';
import * as z from 'zod';

export default defineBackground(() => {
  armListeners();
});

type Sender = Browser.runtime.MessageSender;
type Tab = Browser.tabs.Tab;

type PostInfo = {
  time: number;
  url: string;
  title: string;
  body: string;
  author: string;
  totalPages: number;
  commentsByPage: Record<string, any>;
};

const PostByUrl = new Map<string, Partial<PostInfo>>();

const handler = {
  [MESSAGE_START]: async (m: unknown, sender: Sender) => {
    const msg = MessageStart.parse(m);

    const tab = await getCurrentTab(sender);
    if (!tab || !tab.url || !tab.id) {
      throw new Error(`Invalid tab url=${tab?.url} id=${tab?.id}`);
    }
    const id = await getPostId(tab.url);
    if (!id) {
      throw new Error('Can not get post id');
    }

    const info = PostByUrl.get(id);

    if (msg.payload.checkState && !info) {
      logger.info('noop as user have not initiated a "start" yet');
      return;
    }

    if (msg.payload.checkState && info?.time) {
      const now = Date.now();
      const diff = now - info.time;
      if (diff > 60_000) {
        logger.info(`looks like a staled session info.time=${info.time} now=${now}`);
        PostByUrl.delete(id);
        return;
      }
    }

    browser.tabs.sendMessage(tab.id, {
      type: MESSAGE_CHECKING_REMOTE_SAVED,
    } satisfies z.infer<typeof MessageCheckingRemoteSaved>);
    const text = await fetchSummary(id);
    if (text) {
      browser.tabs.sendMessage(tab.id, {
        type: MESSAGE_REMOTE_TEXT,
        payload: { text },
      } satisfies z.infer<typeof MessageRemoteText>);
      return;
    }

    if (!info && !msg.payload.checkState) {
      PostByUrl.set(id, { time: Date.now(), url: id });
      deletePost10MinLater(id);
      browser.tabs.sendMessage(tab.id, {
        type: MESSAGE_RETRIEVE_POST_INFO,
        payload: { url: id },
      } satisfies z.infer<typeof MessageRetrievePostInfo>);
    } else if (info) {
      if (info.title) {
        browser.tabs.sendMessage(tab.id, {
          type: MESSAGE_RETRIEVE_COMMENTS,
          payload: { url: id },
        } satisfies z.infer<typeof MessageRetrieveComments>);
      } else {
        browser.tabs.sendMessage(tab.id, {
          type: MESSAGE_RETRIEVE_POST_INFO,
          payload: { url: id },
        } satisfies z.infer<typeof MessageRetrievePostInfo>);
      }
    }
  },

  [MESSAGE_UPDATE_INFO]: async (m: unknown, sender: Sender) => {
    const msg = MessageUpdateInfo.parse(m);
    const payload = msg.payload;
    const url = payload?.url;
    if (!url) throw new Error('Expect url in message payload');

    const info = updatePost(url, payload);

    const tab = await getCurrentTab(sender);
    if (!tab || !tab.id) {
      throw new Error('handle update_info: tab is not available');
    }

    // dont proceed if we dont have enough info
    if (!info.title) return;

    if (!loadNextPage(url, tab.id)) {
      const text = generateText(info);
      if (text) getChaonima(text, url, tab);
    }
  },
};

function loadNextPage(id: string, tabId: number) {
  const info = PostByUrl.get(id);
  if (!info) {
    throw new Error(`info not found for ${id}`);
  }
  const totalPages = info.totalPages;
  const commentsByPage = info.commentsByPage;
  if (typeof totalPages !== 'number' || !commentsByPage) {
    throw new Error(`invalid totalPages or missing commentsByPage for ${id}`);
  }

  for (let i = 1; i <= totalPages; i++) {
    if (!commentsByPage[i]) {
      const url = info.url + '?p=' + i;
      browser.tabs.update(tabId, { url });
      return true;
    }
  }
  return false;
}

function generateText(info: Partial<PostInfo>) {
  if (!info.commentsByPage) {
    logger.error('Not able to generateText - commentsByPage is undefined');
    return;
  }

  const comments: string[] = [];
  for (const key of Object.keys(info.commentsByPage)) {
    for (const { user, reply } of info.commentsByPage[key]) {
      comments.push(`${user} 说:\n---\n${reply}\n---\n`);
    }
  }
  const parts = [`帖子标题:\n${info.title}`];
  if (info.author) {
    parts.push(`作者:\n${info.author}`);
  }
  if (info.body) {
    parts.push(`帖子内容:\n${info.body}`);
  } else {
    // it's allowed to not have post content
    parts.push(`帖子内容:\n${info.title}`);
  }
  if (comments.length > 0) {
    parts.push(`下面都是大家的评论:\n${comments.join('\n')}`);
  } else {
    parts.push(`该文章目前还没有评论`);
  }
  return parts.join('\n\n');
}

function armListeners() {
  browser.runtime.onMessage.addListener((msg, sender, _reply) => {
    logger.info('==> %s %s', msg.type, sender.url);

    const handle = handler[msg.type as keyof typeof handler];
    if (!handle) {
      logger.error(`No handler for message type: %s`, msg.type);
      return false;
    }

    (async () => {
      try {
        await handle(msg, sender);
      } catch (e) {
        logger.error('message handler error %o', e);
      }
    })();
    return false;
  });
}

async function getCurrentTab(sender?: Browser.runtime.MessageSender) {
  if (sender && 'tab' in sender) return sender.tab;

  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

async function getPostId(url: string) {
  const u = new URL(url);
  return `${u.origin}${u.pathname}`;
}

async function getChaonima(text: string, id: string, tab: Tab) {
  const port = browser.tabs.connect(tab.id!);

  let ret = '';
  let firstChunk = true;
  function onmessage(text: string) {
    ret += text;
    const msg = {
      type: MESSAGE_LLM_TEXT_CHUNK,
      payload: { text, firstChunk },
    } satisfies z.infer<typeof MessageLlmTextChunk>;
    port.postMessage(msg);
    firstChunk = false;
  }

  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v2ex/streamGenerateContent`;
  try {
    await fetchTextStream(url, {
      method: 'POST',
      body: JSON.stringify({ text, id }),
      onmessage,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_KEY,
      },
    });
    PostByUrl.delete(id);
  } catch (e) {
    port.disconnect();
  }
}

function updatePost(id: string, payload: z.infer<typeof MessageUpdateInfo>['payload']) {
  let info = PostByUrl.get(id);
  if (!info) {
    throw new Error(`Expect post ${id} info is already in store`);
  }

  if ('title' in payload && payload.title) {
    info.title = payload.title;
    info.body = payload.body;
    info.author = payload.author;
    info.totalPages = payload.totalPages;
  }

  info.commentsByPage = {
    ...info.commentsByPage,
    [payload.currentPage]: payload.comments,
  };
  info.time = Date.now();

  deletePost10MinLater(id);

  return info;
}

function deletePost10MinLater(id: string) {
  setTimeout(() => {
    PostByUrl.delete(id);
  }, 600_000 /* 10 minutes */);
}

async function fetchSummary(id: string) {
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v2ex/summaries?${new URLSearchParams({ id })}`;
  const res = await fetch(url, { headers: { 'x-api-key': import.meta.env.VITE_API_KEY } });
  if (!res.ok) return;
  return await res.text();
}
