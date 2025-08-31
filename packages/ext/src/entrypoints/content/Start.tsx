import { browser } from '#imports';
import { MESSAGE_START, MessageStart } from '@/utils/message';
import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { Button, StarAi } from 'preview/react';
import { useCallback } from 'react';
import * as z from 'zod';

const loadingSignal = signal<boolean>(false);

export function setLoading(v: boolean) {
  loadingSignal.value = v;
}

export function Start() {
  useSignals();

  const onClick = useCallback(() => {
    setLoading(true);
    (async () => {
      const m = { type: MESSAGE_START, payload: {} } satisfies z.infer<typeof MessageStart>;
      browser.runtime.sendMessage(m);
    })();
  }, []);
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
      <Button onClick={onClick} loading={loadingSignal.value} disabled={loadingSignal.value}>
        {loadingSignal.value ? '读取评论中...' : '他们在吵什么'}
      </Button>
      <StarAi style={{ position: 'absolute', right: 0, top: 0 }} />
    </div>
  );
}
