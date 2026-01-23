import { ref } from "vue";
import { defineWebsite } from "../types";
import { domain } from "../helpers";
import { fetch } from "@/hooks";

export const fanbox = defineWebsite({
    checker: {
        type: 'endhost',
        value: 'fanbox.cc'
    },
    theme: ref('light'),
    pages: {
        posts: {
            mode: 'or',
            checker: [{
                type: 'regpath',
                value: /^(\/@[^\/]+)?\/posts\/(\d+)$/
            }],
            async url() {
                const userName = extractUsername();
                const userID = await getUserID(userName);
                const postID = location.pathname.match(/^(\/@[^\/]+)?\/posts\/(\d+)$/)![2];
                return `https://${ domain }/fanbox/user/${ userID }/post/${ postID }`;
            },
        },
        creator: {
            mode: 'or',
            checker: [{
                type: 'path',
                value: '/'
            }, {
                type: 'path',
                value: '/posts'
            }, {
                type: 'path',
                value: '/plans'
            }, {
                type: 'regpath',
                value: /^\/@[^\/]+\/((posts|plans)\/?)?/
            }],
            async url() {
                const userName = extractUsername();
                const userID = await getUserID(userName);
                return `https://${ domain }/fanbox/user/${ userID }`;
            },
        },
    },
});

/**
 * 在各种fanbox子域名下导出用户名
 * @returns 用户名
 */
function extractUsername() {
    return location.pathname.startsWith('/@') ?
        location.pathname.substring(2, location.pathname.indexOf('/', 1)) :
        location.hostname.split('.', 1)[0];
}

async function getUserID(userName: string) {
    // fanbox存在Cloudflare保护，其中用到的Partitioned Cookie技术尚未被ViolentMonkey支持，
    // 因此这里不用GM_xmlhttpRequest而是改用原生fetch
    const response = await fetch(`https://api.fanbox.cc/creator.get?creatorId=${ userName }`, {
        method: 'GET',
        headers: {
            accept: 'application/json, text/plain, */*',
        },
    });
    const data = await response.json();
    const userID = data.body.user.userId as string;
    return userID;
}