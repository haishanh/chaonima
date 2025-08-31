import { textSignal } from './ChaonimaBody.signal';
import { MemoizedMarkdown } from './MemoizedMarkdown';
import { useSignals } from '@preact/signals-react/runtime';

export function ChaonimaBody({ content }: { content: string }) {
  useSignals();
  return <MemoizedMarkdown content={textSignal.value || content} id="chaonima-md" />;
}
