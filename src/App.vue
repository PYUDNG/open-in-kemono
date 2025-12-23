<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import { ref } from 'vue';
    import { testChecker, URLChangeMonitor } from './utils/main.js';
    import rules from './rules.js';
    import { GM_openInTab } from '$';
    import storage from './storage.js';

    // Vue i18n
    const { t } = useI18n();

    /** 当前页面是否为支持跳转的页面 */
    const isSupportedPage = ref(false);
    const calcIsSupportedPage = () => 
        isSupportedPage.value = Object.values(rules).some(website => 
            Object.values(website).some(page => testChecker(page.checker, page.mode ?? 'or'))
        );
    calcIsSupportedPage();

    // 当页面url改变时，重新计算当前页面是否支持跳转
    const urlMonitor = new URLChangeMonitor();
    urlMonitor.init();
    urlMonitor.onUrlChange(() => calcIsSupportedPage());

    /** 是否正在获取kemono跳转目标url */
    const loading = ref(false);

    /**
     * 根据当前页面，查找对应规则，执行跳转
     */
    async function doJump() {
        // 避免重复跳转
        if (loading.value) return;

        for (const website of Object.values(rules)) {
            for (const page of Object.values(website)) {
                if (testChecker(page.checker, page.mode ?? 'or')) {
                    loading.value = true;
                    const url = await Promise.resolve(page.url());
                    if (storage.get('newtab')) {
                        GM_openInTab(url, {
                            active: true,
                            insert: true,
                            setParent: true,
                        });
                    } else {
                        location.assign(url);
                    }
                    loading.value = false;
                    return;
                }
            }
        }
    }
</script>

<template>
    <div class="oik-root">
        <div
            v-show="isSupportedPage"
            class="oik-jump-button"
            :class="{ ['oik-disabled']: loading }"
            @click="doJump"
        >
            {{ loading ? t('button.loading') : t('button.jump') }}
        </div>
    </div>
</template>

<style scoped>
    .oik-jump-button {
        border: 2px solid var(--color-border);
        background-color: var(--color-bg);
        color: var(--color-text);
        padding: 0.25em;
        cursor: pointer;
    }
</style>

<style>
    /* 根元素：默认浅色模式变量 */
    .oik-root {
        --color-text: #1a1a1a;      /* 文本色 */
        --color-bg: #ffffff;        /* 背景色 */
        --color-primary: #2563eb;   /* 主色调 */
        --color-secondary: #f3f4f6; /* 辅助色 */
        --color-border: #e5e7eb;    /* 边框色 */
    }

    /* 深色模式跟随pixiv网页设置，而非用户系统的设置 */
    html[data-theme="dark"] .oik-root {
        --color-text: #f9fafb;      /* 浅色文本 */
        --color-bg: #1f1f1f;        /* 深色背景 */
        --color-primary: #60a5fa;   /* 主色调（提亮适配深色） */
        --color-secondary: #1f2937; /* 辅助色 */
        --color-border: #374151;    /* 边框色 */
    }

    /* 当没有显式设置深浅色时，跟随系统设置 */
    @media (prefers-color-scheme: dark) {
        html:not([data-theme]) .oik-root {
            --color-text: #f9fafb;      /* 浅色文本 */
            --color-bg: #1f1f1f;        /* 深色背景 */
            --color-primary: #60a5fa;   /* 主色调（提亮适配深色） */
            --color-secondary: #1f2937; /* 辅助色 */
            --color-border: #374151;    /* 边框色 */
        }
    }

    .oik-root .oik-disabled {
        filter: grayscale(1) brightness(0.8);
        cursor: not-allowed;
    }
</style>
