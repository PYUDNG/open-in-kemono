import storage from '@/storage.js';
import { ref } from 'vue';

/** 用户设置的kemono跳转域名 */
export let domain = storage.get('domain');
storage.watch('domain', (_, __, newValue, ___) => domain = newValue as string || 'kemono.cr');

/** 系统深色模式，与系统状态实时同步 */
export const systemDark = (function() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', e => systemDark.value = e.matches);
    return ref(darkModeQuery.matches);
}) ();