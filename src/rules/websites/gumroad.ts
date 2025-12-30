import { detectDom, logger } from '@/utils/main.js';
import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

const body = await detectDom('body');

export const gumroad = defineWebsite({
    mode: 'and',
    checker: [{
        type: 'endhost',
        value: 'gumroad.com'
    }, {
        // gumroad.com 和 www.gumroad.com 为非创作者网站自身页面
        type: 'host',
        value: 'gumroad.com',
        invert: true
    }, {
        // gumroad.com 和 www.gumroad.com 为非创作者网站自身页面
        type: 'host',
        value: 'www.gumroad.com',
        invert: true
    }],
    pages: {
        // 帖子内部：跳转到对应帖子页面
        post: {
            checker: {
                type: 'startpath',
                value: '/l/'
            },
            url() {
                const data = JSON.parse(document.querySelector('.js-react-on-rails-component[data-component-name="ProfileProductPage"]')?.innerHTML ?? '{}');
                const userID = data?.creator_profile?.external_id as string | undefined;
                const postID = data?.product?.permalink as string | undefined;
                if ((userID ?? postID ?? null) === null) {
                    logger.simple('Error', 'cannot get userID or postID');
                    throw new Error('gumroad.url: cannot get userID or postID');
                }
                return `https://${domain}/gumroad/user/${userID}/post/${postID}`;
            },
        },

        // 通用跳转：跳转到创作者页面
        general: {
            checker: {
                type: 'switch',
                value: true
            },
            url() {
                const userID = JSON.parse(document.querySelector('.js-react-on-rails-component[data-component-name="Profile"]')?.innerHTML ?? '{}')?.creator_profile?.external_id ?? null as string | null;
                if (!userID) {
                    logger.simple('Error', 'cannot get userID');
                    throw new Error('gumroad.url: cannot get userID');
                }
                return `https://${domain}/gumroad/user/${userID}`;
            }
        },
    },

    // 自定义主题
    theme: ref('gumroad'),
    // 使用getter以延迟执行：仅在切换到gumroad时才执行，并保证每次获取时都是基于当前页面的最新值
    get themes() {
        const pageFG = getComputedStyle(body).color;
        const pageBG = getComputedStyle(body).backgroundColor
        const fg = pageFG;
        const bg = generateTransitionColor(pageFG, pageBG, 0.05);
        const border = generateTransitionColor(pageFG, pageBG, 0.2);

        return {
            gumroad: /* css */`
                .oik-root[data-theme="gumroad"] {
                    --color-text: ${fg};      /* 前景色 */
                    --color-bg: ${bg};        /* 深色背景 */
                    --color-border: ${border};    /* 边框色 */
                }
            `,
        }
    },
});

/**
 * 颜色过渡函数：从起始颜色向目标颜色过渡指定比例的中间色
 * @param targetColor - 目标颜色 (RGB/RGBA 格式字符串，如 "rgb(255,0,0)" 或 "rgba(255,0,0,0.5)")
 * @param startColor - 起始颜色 (RGB/RGBA 格式字符串)
 * @param transitionRatio - 过渡比例 (默认 0.1，即从起始色向目标色过渡 10%)
 * @returns 过渡后的 RGBA 颜色字符串
 */
function generateTransitionColor(
    targetColor: string,
    startColor: string,
    transitionRatio: number = 0.1
): string {
    // 解析 RGB/RGBA 颜色字符串的工具函数
    const parseRgbaColor = (colorStr: string): { r: number; g: number; b: number; a: number } => {
        // 匹配 RGB/RGBA 数值的正则表达式
        const rgbaPattern = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+)\s*)?\)/i;
        const matches = colorStr.match(rgbaPattern);

        // 解析失败时返回默认值（黑色）
        if (!matches) {
            return { r: 0, g: 0, b: 0, a: 1 };
        }

        // 提取并转换数值，确保在合法范围内
        const r = Math.min(255, Math.max(0, parseInt(matches[1], 10)));
        const g = Math.min(255, Math.max(0, parseInt(matches[2], 10)));
        const b = Math.min(255, Math.max(0, parseInt(matches[3], 10)));
        const a = matches[4] ? Math.min(1, Math.max(0, parseFloat(matches[4]))) : 1;

        return { r, g, b, a };
    };

    try {
        // 解析起始颜色和目标颜色
        const targetRgba = parseRgbaColor(targetColor);
        const startRgba = parseRgbaColor(startColor);

        // 计算过渡后的颜色值：起始值 + (目标值 - 起始值) × 过渡比例
        const newR = Math.round(startRgba.r + (targetRgba.r - startRgba.r) * transitionRatio);
        const newG = Math.round(startRgba.g + (targetRgba.g - startRgba.g) * transitionRatio);
        const newB = Math.round(startRgba.b + (targetRgba.b - startRgba.b) * transitionRatio);
        // 透明度同样按比例过渡，保留两位小数
        const newA = parseFloat((startRgba.a + (targetRgba.a - startRgba.a) * transitionRatio).toFixed(2));

        // 返回 RGBA 格式的颜色字符串
        return `rgba(${newR}, ${newG}, ${newB}, ${newA})`;
    } catch (error) {
        // 异常时返回浅灰色作为兜底
        logger.simple('Error', '颜色解析或计算失败，使用默认过渡色:');
        logger.log('Error', 'raw', 'error', error);
        return 'rgba(240, 240, 240, 0.9)';
    }
}