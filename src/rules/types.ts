import { Checker } from '@/utils/main.js';
import { Ref } from 'vue';

export interface Page<C = undefined> {
    /**
     * checker的多条件联立关系，'and'表示所有条件均需通过才算通过，'or'表示任意条件通过即算通过  
     * @default 'or'
     */
    mode?: 'and' | 'or';

    /**
     * 页面匹配条件
     */
    checker: Checker | Checker[];

    /**
     * 从该页面获取跳转目标url的方法
     * @returns 跳转目标url，应基于用户设置的domain（kemono域名）
     */
    url: () => string | Promise<string>;

    /**
     * 该页面是否处于深色模式
     * @default ref(false)
     */
    dark?: Ref<boolean>,

    /**
     * 生命周期回调：进入该页面时触发
     */
    enter?: () => void;

    /**
     * 生命周期回调：离开该页面时触发
     */
    leave?: () => void;

    /**
     * 用于动态存储规则内部变量的空间
     */
    context?: C;
};

type ExtractPageContext<P extends Page<any>> = P extends Page<infer C> 
    ? ('context' extends keyof P ? C : undefined) // 处理泛型默认值的情况
    : undefined;

export interface Website<
    Pages extends Record<string, Page<any>> = Record<string, Page<any>>,
    C = undefined
> {
    pages: Pages,

    /**
     * checker的多条件联立关系，'and'表示所有条件均需通过才算通过，'or'表示任意条件通过即算通过  
     * @default 'or'
     */
    mode?: 'and' | 'or';

    /**
     * 网站匹配条件
     */
    checker?: Checker | Checker[];

    dark: Ref<boolean>,

    /**
     * 生命周期回调：进入该网站时触发
     */
    enter?: () => void;

    /**
     * 生命周期回调：离开该网站时触发
     */
    leave?: () => void;

    /**
     * 用于动态存储规则内部变量的空间
     */
    context?: C;
};

export function defineWebsite<
    Pages extends Record<string, Page<any>>,
    C = Website<Pages> extends { context?: infer CTX } ? CTX : never
>(
    website: Website<Pages, C>
): Website<
    {
        [P in keyof Pages]: Page<ExtractPageContext<Pages[P]>>
    },
    C
> {
    return website;
}