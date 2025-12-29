import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import { default as pkg } from './package.json';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: {
          '': 'Open in Kemono',
          'en': 'Open in Kemono',
          'zh': '在Kemono中打開',
          'zh-CN': '在Kemono中打开',
          'zh-TW': '在Kemono中打開',
        },
        description: {
          '': 'Open corresponding kemono page from multiple services',
          'en': 'Open corresponding kemono page from multiple services',
          'zh': '从多个资源平台网站打开Kemono中的对应页面',
          'zh-CN': '从多个资源平台网站打开Kemono中的对应页面',
          'zh-TW': '從多個資源平臺網站打開Kemono中的對應頁面',
        },
        version: pkg.version,
        author: 'PY-DNG',
        license: 'GPL-3.0-or-later',
        icon: 'https://kemono.cr/assets/favicon-CPB6l7kH.ico',
        namespace: 'https://greasyfork.org/zh-CN/users/667968-pyudng',
        match: [
          'http*://*.pixiv.net/*',
          'http*://*.fantia.jp/*',
          'http*://*.subscribestar.adult/*',
          'http*://*.subscribestar.com/*',
          'http*://*.dlsite.com/*',
          'http*://*.fanbox.cc/*',
          'http*://www.patreon.com/*',
          'http*://*.boosty.to/*',
        ],
        "run-at": 'document-start',
      },
      server: {
        open: true,
        mountGmApi: true,
      },
      build: {
        fileName: pkg.name + '.user.js',
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: true,
    emptyOutDir: false,
  },
});
