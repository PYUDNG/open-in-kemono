import { GM_registerMenuCommand } from '$';
import { detectDom } from './utils/main.js';
import { createApp } from 'vue';
import i18n from './i18n/main.js';
import JumpButton from './ui/JumpButton/App.vue';
import storage from './storage.js';

const t = i18n.global.t;

createApp(JumpButton).use(i18n).mount(
    (() => {
        const app = document.createElement('div');
        app.style.cssText = 'position: fixed; right: 0; bottom: 0; padding: 0; margin: 0; border: 0; z-index: 10000;';
        detectDom('body').then(body => body.append(app));
        return app;
    }) (),
);

let newtabMenuId: number | string;
const registerNewTabMenu = () => newtabMenuId = GM_registerMenuCommand(
    storage.get('newtab') ? t('menu.newtab.true') : t('menu.newtab.false'),
    () => storage.set('newtab', !storage.get('newtab')),
    {
        id: newtabMenuId,
        autoClose: false,
        title: t('menu.newtab.title')
    }
);
registerNewTabMenu();
storage.watch('newtab', () => registerNewTabMenu());

let domainMenuId: number | string;
const registerDomainMenu = () => domainMenuId = GM_registerMenuCommand(
    t('menu.domain.label', { domain: storage.get('domain') }),
    () => {
        const domain = prompt(t('menu.domain.prompt'), storage.get('domain'));
        domain === '' ? storage.delete('domain') :
            domain && storage.set('domain', domain);
    },
    {
        id: domainMenuId,
        autoClose: false,
        title: t('menu.domain')
    }
);
registerDomainMenu();
storage.watch('domain', () => registerDomainMenu());