import { addEventListener } from "./hooks.js";
import { detectDom, UserscriptStyling } from "./utils/main.js";

export const styling = new UserscriptStyling();

// 初始化直接加载的样式CSS代码
const load = () => {
    if (import.meta.env.PROD) {
        // 生产环境下，css会通过vite-plugin-monkey的cssSideEffects选项的
        // 自定义逻辑暂存在window._oikStyles变量
        const importedStyles = (window as any)._oikStyles as string[];
        importedStyles.forEach((css, i) => styling.setStyle(`__imported[${i}]__`, css));
    } else {
        // 开发环境下，css会被vite自动作为<style>元素添加到文档
        let i = 0;
        detectDom({
            selector: 'style[data-vite-dev-id]',
            callback(style: HTMLStyleElement) {
                styling.setStyle(`__imported[${i++}]__`, style.innerHTML);
                style.remove();
            },
        })
    }
};
document.readyState === 'loading' ?
    addEventListener.call(document, 'DOMContentLoaded', load, { once: true }) :
    load();
