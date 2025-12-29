import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const boosty = defineWebsite({
    mode: 'and',
    checker: [{
        type: 'endhost',
        value: 'boosty.to'
    }, {
        // /app/ 路径下为非创作者的网站自身页面
        type: 'startpath',
        value: '/app/',
        invert: true
    }, {
        // 排除网站首页
        type: 'path',
        value: '/',
        invert: true
    }],
    pages: {
        // 帖子内部：跳转到对应帖子页面
        post: {
            checker: {
                type: 'regpath',
                value: /^\/[^\/]+\/posts\/[0-9a-f\-]+\/?$/
            },
            url() {
                const match = location.pathname.match(/^\/([^\/]+)\/posts\/([0-9a-f\-]+)\/?$/);
                const userID = match![1];
                const postID = match![2];
                return `https://${ domain }/boosty/user/${ userID }/post/${ postID }`;
            },
        },

        // 通用跳转：跳转到创作者页面
        general: {
            checker: {
                type: 'switch',
                value: true
            },
            url() {
                const userID = location.pathname.substring(1).split('/', 1)[0];
                return `https://${ domain }/boosty/user/${ userID }`;
            }
        },
    },
    dark: ref(false),
});