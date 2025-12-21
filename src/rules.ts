import { Checker, requestJson, getSearchParam } from './utils/main.js';

interface Page {
    checker: Checker | Checker[];
    url: (...args: any[]) => string | Promise<string>;
};

const rules: Record<string, Record<string, Page>> = {
    pixiv: {
        users: {
            checker: {
                type: 'regpath',
                value: /^\/users\/\d+/,
            },
            url() {
                const userID = location.pathname.match(/^\/users\/(\d+)/)![1];
                return `https://kemono.cr/fanbox/user/${ userID }`;
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
                return `https://kemono.cr/fanbox/user/${ userID }`;
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
                return `https://kemono.cr/fanbox/user/${ userID }`;
            },
        },
    }
};

export default rules;