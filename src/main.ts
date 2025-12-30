import './hooks.js';
import { GM_registerMenuCommand } from '$';
import { detectDom, injectUserscriptStyle } from './utils/main.js';
import { createApp } from 'vue';
import i18n from './i18n/main.js';
import JumpButton from './ui/JumpButton/App.vue';
import storage from './storage.js';

// 开发环境下，style会自动添加到文档，不会像生产环境一样通过vite-plugin-monkey的
// cssSideEffects制作成CSSStyleSheet，在这里手动制作
if (import.meta.env.DEV) {
    const convertDevStyles = () => {
        const styles = Array.from(document.querySelectorAll('style[data-vite-dev-id]')).map(s => {
            const style = new CSSStyleSheet();
            style.replaceSync(s.innerHTML);
            s.remove();
            return style;
        });
        (window as any)._oikStyles = styles;
    };
    document.readyState !== 'loading' ?
        convertDevStyles() :
        document.addEventListener('DOMContentLoaded', convertDevStyles, { once: true });
}

const t = i18n.global.t;

createApp(JumpButton).use(i18n).mount(
    (() => {
        const container = document.createElement('div');
        const shadowroot = container.attachShadow({ mode: 'open' });
        const app = document.createElement('div');
        app.style.cssText = 'position: fixed; right: 0; bottom: 0; padding: 0; margin: 0; border: 0; z-index: 10000;';
        injectUserscriptStyle(shadowroot);
        shadowroot.append(app);
        detectDom('body').then(body => body.append(container));
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
        title: t('menu.domain.label')
    }
);
registerDomainMenu();
storage.watch('domain', () => registerDomainMenu());