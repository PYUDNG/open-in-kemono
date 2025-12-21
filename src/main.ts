import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount(
  (() => {
    const app = document.createElement('div');
    app.style.cssText = 'position: fixed; right: 0; bottom: 0; padding: 0; margin: 0; border: 0;';
    document.body.append(app);
    return app;
  })(),
);
