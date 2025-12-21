import { GM_getValue, GM_setValue, GM_registerMenuCommand, GM_addValueChangeListener } from '$';
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

let id: number | string;
const registerNewTabMenu = () => id = GM_registerMenuCommand(
    GM_getValue('newtab', true) ? '[✔] 在新标签页中打开' : '[-] 在新标签页中打开',
    () => GM_setValue('newtab', !GM_getValue('newtab', true)),
    {
        id,
        autoClose: false,
        title: '跳转到Kemono时，是新建标签页打开Kemono页面，还是直接将当前标签页跳转到Kemono页面'
    }
);
registerNewTabMenu();
GM_addValueChangeListener('newtab', () => registerNewTabMenu());