import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import { default as pkg } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        version: '1.0.0',
        author: 'PY-DNG',
        icon: 'https://kemono.cr/assets/favicon-CPB6l7kH.ico',
        namespace: 'https://greasyfork.org/zh-CN/users/667968-pyudng',
        match: [
            'http*://*.pixiv.net/*',
        ],
        "run-at": 'document-start',
      },
      server: {
        open: true,
        mountGmApi: true,
      },
      build: {
        fileName: pkg.name + '.greasyfork.user.js',
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
  build: {
    minify: false,
    emptyOutDir: false,
  },
});
