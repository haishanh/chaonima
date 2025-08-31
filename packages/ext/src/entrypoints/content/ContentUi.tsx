import { StartUi } from './StartUi';
import { Summary } from 'preview/react';
import ReactDOM from 'react-dom/client';

export const ContentUi = {
  styleId: 'chaonima-v2ex-overrides',
  contentId: 'chaonima-v2ex-cnt',

  insertStyle() {
    const e = document.querySelector('#' + this.styleId);
    if (e) return;

    const styleElement = document.createElement('style');
    styleElement.id = this.styleId;
    const overrides = `
      #Top>.content {
        max-width: 1500px;
      }
      #Wrapper .content {
        max-width: 1500px;
        display: flex;
        margin: 0 auto;
      }
      #Leftbar, #Rightbar {
        display: none;
      }
      #Main {
        margin: 0;
        flex: 0 0 770px
      }
      `;
    styleElement.innerHTML = overrides;
    document.head.appendChild(styleElement);
  },

  render() {
    const cnt = document.querySelector('#Wrapper .content');
    if (!cnt) return;

    const e = document.querySelector('#' + this.contentId);
    if (e) return;

    const app = document.createElement('div');
    app.id = this.contentId;

    cnt.appendChild(app);

    const root = ReactDOM.createRoot(app);
    root.render(
      <Summary
        onClickCloseButton={() => {
          ContentUi.unmount();
          StartUi.mount();
        }}
      />,
    );
  },

  mount() {
    this.insertStyle();
    this.render();
  },

  unmount() {
    document.querySelector('#' + this.contentId)?.remove();
    document.querySelector('#' + this.styleId)?.remove();
  },
};
