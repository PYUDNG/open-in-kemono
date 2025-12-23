/** @satisfies {Record<string, (...args: any[]) => boolean>} */
const checkers = {
    'switch': (val: any) => !!val,
    'url': (val: string) => location.href === val,
    'path': (val: string) => location.pathname === val,
    'host': (val: string) => location.host === val,
    'regurl': (val: RegExp) => !!location.href.match(val),
    'regpath': (val: RegExp) => !!location.pathname.match(val),
    'reghost': (val: RegExp) => !!location.host.match(val),
    'starturl': (val: string) => location.href.startsWith(val),
    'startpath': (val: string) => location.pathname.startsWith(val),
    'endhost': (val: string) => location.host.endsWith(val),
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
 * 检查给定checker是否通过
 */
export function testChecker(
    checker: Checker | Checker[],
    mode: 'and' | 'or' = 'or',
): boolean {
    if (Array.isArray(checker)) {
        // 数组场景
        if (mode === 'and')
            return checker.every(c => testChecker(c));
        else
            return checker.some(c => testChecker(c))
    }

    // 单个 Checker 场景：调用对应 checker 函数
    return checkers[checker.type](checker.value);
}