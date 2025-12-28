import { domain } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const patreon = defineWebsite({
    checker: {
        type: 'endhost',
        value: 'patreon.com'
    },
    pages: {
        makerid: {
            checker: {
                type: 'func',
                value: () => {
                    const hasElement = (selector: string): boolean => !!document.querySelector(selector);
                    const hasDataTag = (tag: string): boolean => hasElement(`[data-tag="${tag}"]`);
                    return hasElement('#__NEXT_DATA__') && [
                        'creator-become-a-patron-button', // 创作者首页/合集列表/关于
                        'creator-header-see-membership-options', // 帖子内部
                        'collections-share-button', // 合集内部
                    ].some(tag => hasDataTag(tag));
                }
            },
            url() {
                const dataElm = document.querySelector('#__NEXT_DATA__');
                if (!dataElm) throw new Error('#__NEXT_DATA__ not found');
                const data = JSON.parse(dataElm.innerHTML);
                const userID = data.props.pageProps.bootstrapEnvelope.pageBootstrap.campaign.included.find((o: any) => o.type === 'user').id as string;
                return `https://${ domain }/patreon/user/${ userID }`;
            }
        }
    },
    dark: ref(false),
});