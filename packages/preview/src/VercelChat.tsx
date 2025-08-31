import { MemoizedMarkdown } from './MemoizedMarkdown';
import { Chat, useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';

const api = `${import.meta.env.VITE_API_URL}/api/vercel/gemini`;

const chat = new Chat({
  transport: new DefaultChatTransport({ api }),
});

export function VercelChat() {
  const { messages } = useChat({
    chat,
    experimental_throttle: 50,
  });

  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch">
      <div>
        <button
          onClick={() => {
            chat.sendMessage({ text: '给我写一段800字以上的文章介绍一下 Gemini' });
          }}
        >
          send
        </button>
      </div>
      <div>
        {messages
          .filter((m) => m.role !== 'user')
          .map((m) => {
            return (
              <div key={m.id}>
                {m.parts
                  .filter((p) => p.type === 'text')
                  .map((p) => {
                    return <pre key={m.id}>{JSON.stringify(p, null, 2)}</pre>;
                  })}
              </div>
            );
          })}
      </div>
      <Messages messages={messages} />
    </div>
  );
}

function Messages({ messages }: { messages: UIMessage[] }) {
  return (
    <div className="space-y-8 mb-4">
      {messages
        .filter((m) => m.role !== 'user')
        .map((message) => (
          <div key={message.id}>
            <div className="prose space-y-2">
              {message.parts
                .filter((p) => p.type === 'text')
                .map((part) => {
                  return <MemoizedMarkdown key={`${message.id}-text`} id={message.id} content={part.text} />;
                })}
            </div>
          </div>
        ))}
    </div>
  );
}
