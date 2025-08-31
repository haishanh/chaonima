import { ChaonimaLogo } from '../components/ChaonimaLogo';
import { StarAi } from '../components/Star';
import { Button } from '../components/StartButton';
import { XIcon } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { VisuallyHidden } from 'radix-ui';

export const Route = createFileRoute('/loading')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ButtonPreivew />
    </div>
  );
}

function ButtonPreivew() {
  return (
    <div>
      <div>
        <Button>他们在吵什么</Button>
      </div>
      <div>
        <Button loading />
      </div>
      <div>
        <Button loading disabled>
          他们在吵什么
        </Button>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
        }}
      >
        <Button>
          <span>他们在吵什么</span>
        </Button>
      </div>
      <div>
        <Button iconOnly>
          <XIcon />
          <VisuallyHidden.Root>close</VisuallyHidden.Root>
        </Button>
      </div>
      <div>
        <Button iconOnly>
          <ChaonimaLogo size={32} />
          <VisuallyHidden.Root>他们在吵什么</VisuallyHidden.Root>
        </Button>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '8rem',
          right: '2rem',
        }}
      >
        <Button>他们在吵什么</Button>
        <StarAi style={{ position: 'absolute', right: 0, top: 0 }} />
      </div>
    </div>
  );
}
