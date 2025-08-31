import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  srcDir: 'src',
  modules: ['@wxt-dev/module-react', '@wxt-dev/webextension-polyfill'],
  // @ts-ignore
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'chaonima 吵泥马',
    description: '这个插件可以总结 v2ex 帖子和网友评论',
    // permissions: ['activeTab'],
    icons: {
      16: '/icon/chaonima-main-16.png',
      32: '/icon/chaonima-main-32.png',
      48: '/icon/chaonima-main-48.png',
      128: '/icon/chaonima-main-128.png',
    },
  },
});
