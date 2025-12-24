import { requestJson } from '@/utils/main.js';
import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const fantia = defineWebsite({
    checker: {
        type: 'endhost',
        value: 'fantia.jp',
    },
    pages: {
        fanclubs: {
            checker: {
                type: 'regpath',
                value: /^\/fanclubs\/\d+\/?/,
            },
            url() {
                const userID = location.pathname.match(/^\/fanclubs\/(\d+)\/?/)![1];
                return `https://${ domain }/fantia/user/${ userID }`;
            },
        },
        posts: {
            checker: {
                type: 'regpath',
                value: /^\/posts\/\d+\/?/,
            },
            async url() {
                const postID = location.pathname.match(/^\/posts\/(\d+)\/?/)![1];
                const csrfToken = document.querySelector('meta[name="csrf-token"]')!.getAttribute('content')!;
                const data = await requestJson({
                    method: 'GET',
                    url: `https://fantia.jp/api/v1/posts/${ postID }`,
                    headers: {
                        referer: location.href,
                        'x-csrf-token': csrfToken,
                        'x-requested-with': 'XMLHttpRequest',
                    }
                });
                const userID = data.post.fanclub.id as number;
                return `https://${ domain }/fantia/user/${ userID }/post/${ postID }`;
            },
        },
    },
    dark: ref(false),
});