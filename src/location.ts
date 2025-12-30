import { ref, watch, toRaw } from 'vue';
import * as rules from './rules/main.js';
import { logger, testChecker, URLChangeMonitor } from './utils/main.js';
import { register, unregister } from './themes/main.js';

// 根据rules获取当前所处的网站和页面
const locate = () => {
    for (const [websiteName, website] of Object.entries(rules)) {
        if (website.checker && !testChecker(website.checker, website.mode ?? 'or')) continue;
        for (const [pageName, page] of Object.entries(website.pages)) {
            if (testChecker(page.checker, page.mode ?? 'or')) {
                return { website, page, websiteName, pageName };
            }
        }
    }
    return { website: null, page: null, websiteName: 'unknown', pageName: 'unknown' };
};
const location = locate();
export const website = ref(location.website);
export const page = ref(location.page);
export const websiteName = ref(location.websiteName);
export const pageName = ref(location.pageName);
logger.simple('Detail', `Initial location: ${ websiteName.value } / ${ pageName.value }`)

// 当页面url改变时，更新当前所处的网站和页面
const urlMonitor = new URLChangeMonitor();
urlMonitor.init();
urlMonitor.onUrlChange(() => {
    const location = locate();
    website.value = location.website;
    page.value = location.page;
    websiteName.value = location.websiteName;
    pageName.value = location.pageName;
    logger.simple('Detail', `Updated location: ${ websiteName.value } / ${ pageName.value }`);
});

// 当匹配的网站/页面规则变化时，回调enter/leave生命周期钩子，
// 并注册新规则提供的主题、注销旧规则提供的主题
// 注意这里在判断是否有themes属性时使用Object.hasOwn而不是可选链运算符
// 是因为themes属性重度依赖于网站/页面，因而可能被写成getter实时生成
// 此时使用Object.hasOwn判断属性是否存在可以节省一次计算（调用）
watch(website, (newWebsite, oldWebsite) => {
    const o = toRaw(oldWebsite);
    const n = toRaw(newWebsite);
    o?.leave?.();
    n?.enter?.();
    Object.hasOwn(o ?? {}, 'themes') && Object.keys(o!.themes!).forEach(id => unregister(id));
    Object.hasOwn(n ?? {}, 'themes') && Object.entries(n!.themes!).forEach(([id, css]) => register(id, css));
}, {
    immediate: true,
});
watch(page, (newPage, oldPage) => {
    const o = toRaw(oldPage);
    const n = toRaw(newPage);
    o?.leave?.();
    n?.enter?.();
    Object.hasOwn(o ?? {}, 'themes') && Object.keys(o!.themes!).forEach(id => unregister(id));
    Object.hasOwn(n ?? {}, 'themes') && Object.entries(n!.themes!).forEach(([id, css]) => register(id, css));
}, {
    immediate: true,
});
