import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const fantia = defineWebsite({
    pages: {
        fanclubs: {
            mode: 'and',
            checker: [{
                type: 'endhost',
                value: 'fantia.jp',
            }, {
                type: 'regpath',
                value: /^\/fanclubs\/\d+\/?/,
            }],
            url() {
                const userID = location.pathname.match(/^\/fanclubs\/(\d+)\/?/)![1];
                return `https://${ domain }/fantia/user/${ userID }`;
            },
        },
    },
    dark: ref(false),
});