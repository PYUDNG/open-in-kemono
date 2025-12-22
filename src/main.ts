import { GM_registerMenuCommand } from '$';
import { detectDom } from './utils/main.js';
import { createApp } from 'vue';
import App from './App.vue';
import storage from './storage.js';

createApp(App).mount(
    (() => {
        const app = document.createElement('div');
        app.style.cssText = 'position: fixed; right: 0; bottom: 0; padding: 0; margin: 0; border: 0; z-index: 1000;';
        detectDom('body').then(body => body.append(app));
        return app;
    }) (),
);

let newtabMenuId: number | string;
const registerNewTabMenu = () => newtabMenuId = GM_registerMenuCommand(
    storage.get('newtab') ? '[✔] 在新标签页中打开' : '[-] 在新标签页中打开',
    () => storage.set('newtab', !storage.get('newtab')),
    {
        id: newtabMenuId,
        autoClose: false,
        title: '跳转到Kemono时，是新建标签页打开Kemono页面，还是直接将当前标签页跳转到Kemono页面'
    }
);
registerNewTabMenu();
storage.watch('newtab', () => registerNewTabMenu());

let domainMenuId: number | string;
const registerDomainMenu = () => domainMenuId = GM_registerMenuCommand(
    `跳转域名: ${ storage.get('domain') }`,
    () => {
        const domain = prompt('请设置希望跳转的kemono域名：', storage.get('domain'));
        domain === '' ? storage.delete('domain') :
            domain && storage.set('domain', domain);
    },
    {
        id: domainMenuId,
        autoClose: false,
        title: '跳转到Kemono时，是新建标签页打开Kemono页面，还是直接将当前标签页跳转到Kemono页面'
    }
);
registerDomainMenu();
storage.watch('domain', () => registerDomainMenu());