import { createIntegratedUi, IntegratedContentScriptUi, type ContentScriptContext } from '#imports';
import { Start } from './Start';
import { logger } from '@/utils/log.utils';
import ReactDOM from 'react-dom/client';

let globalCtx: ContentScriptContext;

export function setGlobalContext(ctx: ContentScriptContext) {
  globalCtx = ctx;
}

export const StartUi = {
  ui: null as IntegratedContentScriptUi<unknown> | null,

  mount() {
    if (!globalCtx) return;

    this.ui = createIntegratedUi(globalCtx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(<Start />);
        return root;
      },
      onRemove: (root) => {
        logger.info('onRemove', this.ui);
        root?.unmount();
      },
    });

    this.ui.mount();
  },

  unmount() {
    this.ui?.remove();
  },
};
