import defaultTheme from './default.css?style';
import dark from './dark.css?style';
import light from './light.css?style';
import { styling } from '@/styling';

const importedStyles = { defaultTheme, dark, light };
const themes = Object.entries(importedStyles).reduce(
    (obj, [id, style]) => Object.assign(obj, { [id]: style.innerHTML }),
    {} as Record<string, string>
);
Object.entries(themes).forEach(([id, css]) => register(id, css));

/**
 * 注册一个新主题
 * @param id 主题id
 * @param css 主题css代码
 */
export function register(id: string, css: string) {
    themes[id] = css;
    styling.setStyle(`theme-${id}`, css);
}

export function unregister(id: string) {
    delete themes[id];
    styling.deleteStyle(`theme-${id}`);
}