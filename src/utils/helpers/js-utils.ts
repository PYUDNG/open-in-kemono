/** @satisfies {Record<string, (...args: any[]) => boolean>} */
const checkers = {
    'switch': (val: any) => !!val,
    'url': (val: string) => location.href === val,
    'path': (val: string) => location.pathname === val,
    'regurl': (val: RegExp) => !!location.href.match(val),
    'regpath': (val: RegExp) => !!location.pathname.match(val),
    'starturl': (val: string) => location.href.startsWith(val),
    'startpath': (val: string) => location.pathname.startsWith(val),
    'func': (val: Function) => !!val(),
};

export type CheckerType = keyof typeof checkers;

export type Checker = {
    [T in CheckerType]: {
        type: T;
        value: Parameters<typeof checkers[T]>[0];
    }
}[CheckerType];

/**
 * 改造 testChecker：支持单个 Checker 或 多个独立泛型的 Checker 数组
 */
export function testChecker(
    checker: Checker | Checker[],
): boolean {
    if (Array.isArray(checker)) {
        // 数组场景：逐个递归检查，满足一个即可
        return checker.some(c => testChecker(c));
    }

    // 单个 Checker 场景：调用对应 checker 函数
    return checkers[checker.type](checker.value);
}