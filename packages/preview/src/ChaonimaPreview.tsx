import { ChaonimaBody } from './ChaonimaBody';
import { getChaonima } from './getChaonima';

const loremMarkdown = ``;

export function ChaonimaPreview() {
  return (
    <div className="fixed top-10 left-4 w-full h-[900px] overflow-hidden border border-neutral-400 rounded-lg max-w-xl mx-auto">
      <div className="py-8 px-4 overflow-y-auto h-full">
        <div>
          <button
            onClick={() => {
              getChaonima('给我写一段1200字以上的文章介绍一下 Gemini');
            }}
          >
            start
          </button>
        </div>
        <ChaonimaBody content={loremMarkdown} />
      </div>
    </div>
  );
}
