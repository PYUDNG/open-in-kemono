// 此文件会在脚本执行之初加载，处于页面早期加载阶段，可以用来执行一些早于页面代码的任务

export const console: {
    [K in keyof Console]: Console[K]
} = Object.assign(Object.create(null), window.console);

export const fetch = window.fetch;