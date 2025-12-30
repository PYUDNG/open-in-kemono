import { logger } from '@/utils/main.js';
import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

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
        /*
        post: {
            checker: {
                type: 'regpath',
                value: /^\/[^\/]+\/posts\/[0-9a-f\-]+\/?$/
            },
            url() {
                const match = location.pathname.match(/^\/([^\/]+)\/posts\/([0-9a-f\-]+)\/?$/);
                const userID = match![1];
                const postID = match![2];
                return `https://${ domain }/gumroad/user/${ userID }/post/${ postID }`;
            },
        },
        */

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
                return `https://${ domain }/gumroad/user/${ userID }`;
            }
        },
    },
    dark: ref(false),
});