import type {cdateNS} from "../";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const lazy = <T>(fn: (() => T)): (() => T) => {
    let cached: T;
    return () => (cached || (cached = fn()));
};

const getDateArray = (dt: Date, size: number, days: number): Date[] => {
    return new Array(size).fill(0).map((_, idx) => new Date(+dt + idx * days * d.DAY));
}

// "2022-01-02T00:00:00Z" (1641081600000)
const initDate = new Date(1641081600000);
const getMonthArray = lazy(() => getDateArray(initDate, 12, 31));
const getWeekdayArray = lazy(() => getDateArray(initDate, 7, 1));

const makeLocale = (lang: string): cdateNS.Specifiers => {
    const DateTimeFormat = Intl && Intl.DateTimeFormat;

    // make a filter function from Date to string
    const makeFn = (options: Intl.DateTimeFormatOptions): ((dt: Date) => string) => {
        const format = new DateTimeFormat(lang, options);
        return dt => format.format(dt);
    };

    // stringify a single Date to string
    const stringify = (dt: Date, options: Intl.DateTimeFormatOptions): string => {
        const format = new DateTimeFormat(lang, options);
        return format.format(toUTCDate(dt));
    };

    // lazy build the array on demand
    const array_a = lazy(() => getWeekdayArray().map(makeFn(styleOptions.a)));
    const array_A = lazy(() => getWeekdayArray().map(makeFn(styleOptions.A)));
    const array_b = lazy(() => getMonthArray().map(makeFn(styleOptions.b)));
    const array_B = lazy(() => getMonthArray().map(makeFn(styleOptions.B)));

    return {
        "%a": (dt) => array_a()[dt.getDay()],
        "%A": (dt) => array_A()[dt.getDay()],
        "%b": (dt) => array_b()[dt.getMonth()],
        "%B": (dt) => array_B()[dt.getMonth()],
        "%c": (dt) => stringify(dt, styleOptions.c),
        "%r": (dt) => stringify(dt, styleOptions.r),
        "%x": (dt) => stringify(dt, styleOptions.x),
        "%X": (dt) => stringify(dt, styleOptions.X),
    };
};

type localeFormatSpecifiers = "a" | "A" | "b" | "B" | "c" | "r" | "x" | "X";
const UTC = "UTC";

const styleOptions: { [specifier in localeFormatSpecifiers]: Intl.DateTimeFormatOptions } = {
    a: {timeZone: UTC, weekday: "short"},
    A: {timeZone: UTC, weekday: "long"},
    b: {timeZone: UTC, month: "short"},
    B: {timeZone: UTC, month: "long"},
    c: {timeZone: UTC, dateStyle: "full", timeStyle: "long"},
    r: {timeZone: UTC, timeStyle: "medium", hour12: true},
    x: {timeZone: UTC, dateStyle: "short"},
    X: {timeZone: UTC, timeStyle: "medium"}, // hour12: default
};

const toUTCDate = (dt: Date): Date => {
    const offset = dt.getTimezoneOffset();
    return new Date(+dt - offset * d.MINUTE);
};

const localeCache: { [lang: string]: cdateNS.Specifiers } = {};

export const formatOptions = styleOptions;

export const getLocale = (lang: string) => (localeCache[lang] || (localeCache[lang] = makeLocale(lang)));
