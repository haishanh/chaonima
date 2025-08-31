import { ChaonimaBody, Button } from '../export.react';
import clazz from './Summary.module.scss';
import { XIcon } from '@phosphor-icons/react';
import cn from 'clsx';
import { VisuallyHidden } from 'radix-ui';
import type { MouseEventHandler } from 'react';

export function Summary({
  onClickCloseButton,
  content,
}: {
  onClickCloseButton: MouseEventHandler<HTMLButtonElement>;
  content?: string;
}) {
  return (
    <div className={clazz.contentContainer}>
      <div className={cn('box cell', clazz.content)}>
        <div className={clazz.buttonContainer}>
          <Button
            style={{ padding: 5, background: 'transparent', color: 'inherit' }}
            iconOnly
            onClick={onClickCloseButton}
          >
            <XIcon />
            <VisuallyHidden.Root>close</VisuallyHidden.Root>
          </Button>
        </div>
        <div className="topic_content">
          <ChaonimaBody content={content || ''} />
        </div>
        <div className={clazz.footer}>
          <p>
            以上内容由 AI 总结生成 via{' '}
            <a target="_blank" href="https://github.com/haishanh/chaonima">
              chaonima
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
