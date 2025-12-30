import { domain, systemDark } from '../helpers.js';
import { defineWebsite } from '../types.js'
import { ref } from 'vue';

export const subscribestar = defineWebsite({
    checker: {
        type: 'reghost',
        value: /^(www\.)?subscribestar\.(com|adult)/
    },
    pages: {
        user: {
            mode: 'and',
            checker: {
                type: 'func',
                value: () => location.pathname.length > 1
            },
            url() {
                const userID = location.pathname.substring(1).split('/', 1)[0];
                return `https://${ domain }/subscribestar/user/${ userID }`;
            }
        }
    },
    theme: ref(systemDark.value ? 'dark' : 'light'),
    enter() {
        const html = document.querySelector('html')!;
        const updateDark = () => {
            this.theme!.value = Object.hasOwn(html.dataset, 'theme') ?
                html.dataset.theme as 'light' | 'dark':
                systemDark.value ? 'dark' : 'light';
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