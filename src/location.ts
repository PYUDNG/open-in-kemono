import { ref, watch, toRaw } from 'vue';
import * as rules from './rules/main.js';
import { testChecker, URLChangeMonitor } from './utils/main.js';

// 根据rules获取当前所处的网站和页面
const locate = () => {
    for (const website of Object.values(rules)) {
        if (website.checker && !testChecker(website.checker, website.mode ?? 'or')) continue;
        for (const page of Object.values(website.pages)) {
            if (testChecker(page.checker, page.mode ?? 'or')) {
                return { website, page };
            }
        }
    }
    return { website: null, page: null };
};
const location = locate();
export const website = ref(location.website);
export const page = ref(location.page);

// 当页面url改变时，更新当前所处的网站和页面
const urlMonitor = new URLChangeMonitor();
urlMonitor.init();
urlMonitor.onUrlChange(() => {
    const location = locate();
    website.value = location.website;
    page.value = location.page;
});

// 当匹配的网站/页面规则变化时，回调enter/leave生命周期钩子
watch(website, (newWebsite, oldWebsite) => {
    toRaw(oldWebsite)?.leave?.();
    toRaw(newWebsite)?.enter?.();
}, {
    immediate: true,
});
watch(page, (newPage, oldPage) => {
    toRaw(oldPage)?.leave?.();
    toRaw(newPage)?.enter?.();
}, {
    immediate: true,
});