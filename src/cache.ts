/**
 * lazy build
 */
export const lazy = <T>(fn: (() => T)): (() => T) => {
    let data: T;
    return () => (data || (data = fn()));
};

/**
 * cache
 */
export const cached = <T, U = string>(fn: ((key: U) => T)): ((key: U) => T) => {
    let cached: { [key: string]: T } = {};
    return key => (cached[key as string] || (cached[key as string] = fn(key)));
};
