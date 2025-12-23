import storage from './storage.js';
import { Checker, requestJson, getSearchParam } from './utils/main.js';

interface Page {
    /**
     * checker的多条件联立关系，'and'表示所有条件均需通过才算通过，'or'表示任意条件通过即算通过  
     * @default 'or'
     */
    mode?: 'and' | 'or';

    /**
     * 页面匹配条件
     */
    checker: Checker | Checker[];

    /**
     * 从该页面获取跳转目标url的方法
     * @param args 任意参数
     * @returns 跳转目标url，应基于用户设置的domain（kemono域名）
     */
    url: (...args: any[]) => string | Promise<string>;
};

let domain = storage.get('domain');
storage.watch('domain', (_, __, newValue, ___) => domain = newValue as string || 'kemono.cr');

const rules: Record<string, Record<string, Page>> = {
    pixiv: {
        users: {
            mode: 'and',
            checker: [{
                type: 'endhost',
                value: 'pixiv.net',
            }, {
                type: 'regpath',
                value: /^\/users\/\d+/,
            }],
            url() {
                const userID = location.pathname.match(/^\/users\/(\d+)/)![1];
                return `https://${ domain }/fanbox/user/${ userID }`;
            },
        },
        artworks: {
            mode: 'and',
            checker: [{
                type: 'endhost',
                value: 'pixiv.net',
            }, {
                type: 'regpath',
                value: /^\/artworks\/\d+/,
            }],
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
            mode: 'and',
            checker: [{
                type: 'endhost',
                value: 'pixiv.net',
            }, {
                type: 'path',
                value: '/novel/show.php',
            }],
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
            mode: 'and',
            checker: [{
                type: 'endhost',
                value: 'pixiv.net',
            }, {
                type: 'regpath',
                value: /^\/novel\/series\/\d+$/
            }],
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
    fantia: {
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
    subscribestar: {
        user: {
            mode: 'and',
            checker: [{
                type: 'reghost',
                value: /^(www\.)?subscribestar\.(com|adult)/
            }, {
                type: 'func',
                value: () => location.pathname.length > 1
            }],
            url() {
                const userID = location.pathname.substring(1).split('/', 1)[0];
                return `https://${ domain }/subscribestar/user/${ userID }`;
            }
        }
    },
};

export default rules;