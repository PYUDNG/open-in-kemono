<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import { ref } from 'vue';
    import { website, page } from '@/location';
    import { GM_openInTab } from '$';
    import storage from '@/storage.js';
    import { logger } from '@/utils/main';

    // Vue i18n
    const { t } = useI18n();

    /** 是否正在获取kemono跳转目标url */
    const loading = ref(false);

    /** 是否发生了错误 */
    const error = ref(false);

    /**
     * 根据当前页面的对应规则，执行跳转
     */
    async function doJump() {
        // 避免重复跳转
        if (loading.value) return;
        // 仅在支持的页面上跳转
        if (!website.value || !page.value) return;

        // 进入加载状态
        loading.value = true;

        // 根据规则逻辑获取跳转目标url
        let url;
        try {
            url = await Promise.resolve(page.value.url());
        } catch(err) {
            logger.simple('Error', 'error while getting url');
            logger.log('Error', 'raw', 'error', err);
            loading.value = false;
            error.value = true;
            return;
        }

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
    }
</script>

<template>
    <div
        class="oik-root"
        :class="{ 'oik-dark': page?.dark ?? website?.dark ?? false }"
    >
        <div
            v-show="page"
            class="oik-jump-button"
            :class="{ ['oik-disabled']: loading }"
            @click="doJump"
        >
            {{ loading ? t('button.loading') : error ? t('button.error') : t('button.jump') }}
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
        font-size: 14px;
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
    .oik-root.oik-dark {
        --color-text: #f9fafb;      /* 浅色文本 */
        --color-bg: #1f1f1f;        /* 深色背景 */
        --color-primary: #60a5fa;   /* 主色调（提亮适配深色） */
        --color-secondary: #1f2937; /* 辅助色 */
        --color-border: #374151;    /* 边框色 */
    }

    .oik-root .oik-disabled {
        filter: grayscale(1) brightness(0.8);
        cursor: not-allowed;
    }
</style>
