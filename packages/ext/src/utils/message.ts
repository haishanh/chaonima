import * as z from 'zod';

export const MESSAGE_START = 'MESSAGE_START';

export const MessageStart = z.object({
  type: z.literal(MESSAGE_START),
  payload: z.object({
    checkState: z.boolean().optional(),
  }),
});

export const MESSAGE_CHECKING_REMOTE_SAVED = 'MESSAGE_CHECKING_REMOTE_SAVED';

export const MessageCheckingRemoteSaved = z.object({
  type: z.literal(MESSAGE_CHECKING_REMOTE_SAVED),
});

export const MESSAGE_UPDATE_INFO = 'MESSAGE_UPDATE_INFO';

export const MessageUpdateInfo = z.object({
  type: z.literal(MESSAGE_UPDATE_INFO),
  payload: z.object({
    url: z.string(),
    currentPage: z.number().min(1),
    comments: z.array(
      z.object({
        user: z.string(),
        reply: z.string(),
      }),
    ),
    title: z.string().optional(),
    body: z.string().optional(),
    author: z.string().optional(),
    totalPages: z.number().min(1).optional(),
  }),
});

export const MESSAGE_RETRIEVE_POST_INFO = 'MESSAGE_RETRIEVE_POST_INFO';

export const MessageRetrievePostInfo = z.object({
  type: z.literal(MESSAGE_RETRIEVE_POST_INFO),
  payload: z.object({ url: z.string() }),
});

export const MESSAGE_RETRIEVE_COMMENTS = 'MESSAGE_RETRIEVE_COMMENTS';

export const MessageRetrieveComments = z.object({
  type: z.literal(MESSAGE_RETRIEVE_COMMENTS),
  payload: z.object({ url: z.string() }),
});

export const MESSAGE_LLM_TEXT_CHUNK = 'MESSAGE_LLM_TEXT_CHUNK';

export const MessageLlmTextChunk = z.object({
  type: z.literal(MESSAGE_LLM_TEXT_CHUNK),
  payload: z.object({
    text: z.string(),
    firstChunk: z.boolean().optional(),
  }),
});

export const MESSAGE_REMOTE_TEXT = 'MESSAGE_REMOTE_TEXT';

export const MessageRemoteText = z.object({
  type: z.literal(MESSAGE_REMOTE_TEXT),
  payload: z.object({
    text: z.string(),
  }),
});
