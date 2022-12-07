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
export const cached = <T>(fn: ((key: string) => T)): ((key: string) => T) => {
    let cached: { [key: string]: T } = {};
    return key => (cached[key] || (cached[key] = fn(key)));
};
