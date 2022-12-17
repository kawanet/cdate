/**
 * cache
 */
export const cached = <T, U = string>(fn: ((key: U) => T)): ((key: U) => T) => {
    let cached: { [key: string]: T } = {};
    return key => (cached[key as string] || (cached[key as string] = fn(key)));
};
