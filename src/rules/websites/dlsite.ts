import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const dlsite = defineWebsite({
    pages: {
        makerid: {
            mode: 'and',
            checker: [{
                type: 'endhost',
                value: 'dlsite.com'
            }, {
                type: 'regpath',
                value: /^\/home\/circle\/profile\/=\/maker_id\/RG\d+(\.html)?(\/|$)/
            }],
            url() {
                const userID = location.pathname.match(/^\/home\/circle\/profile\/=\/maker_id\/(RG\d+)(\.html)?(\/|$)/)![1];
                return `https://${ domain }/dlsite/user/${ userID }`;
            }
        }
    },
    dark: ref(false),
});