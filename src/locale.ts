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

// Sun Jan 02 2022 (1641081600000)
const initDate = new Date(2022, 0, 2);
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

const styleOptions: { [specifier in localeFormatSpecifiers]: Intl.DateTimeFormatOptions } = {
    a: {weekday: "short"},
    A: {weekday: "long"},
    b: {month: "short"},
    B: {month: "long"},
    c: {dateStyle: "full", timeStyle: "long", timeZoneName: "short"},
    r: {timeStyle: "medium", timeZone: "UTC", hour12: true},
    x: {dateStyle: "short", timeZone: "UTC"},
    X: {timeStyle: "medium", timeZone: "UTC", hour12: false},
};

const toUTCDate = (dt: Date): Date => {
    const offset = dt.getTimezoneOffset();
    return new Date(+dt - offset * d.MINUTE);
};

const localeCache: { [lang: string]: cdateNS.Specifiers } = {};

export const formatOptions = styleOptions;

export const getLocale = (lang: string) => (localeCache[lang] || (localeCache[lang] = makeLocale(lang)));
