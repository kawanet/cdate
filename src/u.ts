export const tzMinutes = (offset: number | string): number => {
    if ("string" === typeof offset) {
        offset = +offset;
        return Math.trunc(offset / 100) * 60 + (offset % 100);
    }

    if (!isNaN(offset)) return offset;
}
