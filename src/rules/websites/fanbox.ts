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
                type: 'startpath',
                value: '/posts/'
            }],
            async url() {
                // fanbox存在Cloudflare保护，其中用到的Partitioned Cookie技术尚未被ViolentMonkey支持，
                // 因此这里不用GM_xmlhttpRequest而是改用原生fetch
                const userName = location.hostname.split('.', 1)[0];
                const response = await fetch(`https://api.fanbox.cc/creator.get?creatorId=${ userName }`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json, text/plain, */*',
                    },
                });
                const data = await response.json();
                const userID = data.body.user.userId as string;
                return `https://${ domain }/fanbox/user/${ userID }`;
            },
        },
    },
});