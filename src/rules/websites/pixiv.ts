import { getSearchParam, requestJson } from '@/utils/main.js';
import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const pixiv = defineWebsite({
    checker: {
        type: 'endhost',
        value: 'pixiv.net',
    },
    pages: {
        users: {
            checker: {
                type: 'regpath',
                value: /^\/users\/\d+/,
            },
            url() {
                const userID = location.pathname.match(/^\/users\/(\d+)/)![1];
                return `https://${ domain }/fanbox/user/${ userID }`;
            },
        },
        artworks: {
            checker: {
                type: 'regpath',
                value: /^\/artworks\/\d+/,
            },
            async url() {
                const str_id = location.pathname.match(/^\/artworks\/(\d+)/)![1];
                const json = await requestJson({
                    method: 'GET',
                    url: `https://www.pixiv.net/ajax/illust/${ str_id }`,
                });
                const userID = json.body.userId as string;
                return `https://${ domain }/fanbox/user/${ userID }`;
            },
        },
        novel: {
            checker: {
                type: 'path',
                value: '/novel/show.php',
            },
            async url() {
                const str_id = getSearchParam('id');
                const json = await requestJson({
                    method: 'GET',
                    url: `https://www.pixiv.net/ajax/novel/${ str_id }`,
                });
                const userID = json.body.userId as string;
                return `https://${ domain }/fanbox/user/${ userID }`;
            },
        },
        series: {
            checker: {
                type: 'regpath',
                value: /^\/novel\/series\/\d+$/
            },
            async url() {
                const str_id = location.pathname.match(/^\/novel\/series\/(\d+)$/)![1];
                const json = await requestJson({
                    method: 'GET',
                    url: `https://www.pixiv.net/ajax/novel/series/${ str_id }`,
                });
                const userID = json.body.userId as string;
                return `https://${ domain }/fanbox/user/${ userID }`;
            }
        },
    },
    dark: ref(false),
    enter() {
        const html = document.querySelector('html')!;
        const updateDark = () => {
            this.dark.value = Object.hasOwn(html.dataset, 'theme') ?
                html.dataset.theme === 'dark' : false;
        }
        const observer = this.context!.observer = new MutationObserver(updateDark);
        observer.observe(html, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        updateDark();
    },
    leave() {
        this.context!.observer?.disconnect();
        this.context!.observer = null;
    },
    context: {
        observer: null as (MutationObserver | null),
    },
});