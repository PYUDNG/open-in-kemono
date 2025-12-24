import { domain, systemDark } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const subscribestar = defineWebsite({
    pages: {
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
    dark: ref(systemDark.value),
    enter() {
        const html = document.querySelector('html')!;
        const updateDark = () => {
            this.dark.value = Object.hasOwn(html.dataset, 'theme') ?
                html.dataset.theme === 'dark' : systemDark.value;
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
    }
});