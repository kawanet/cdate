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

/**
 * build an on-demand Handlers for the language specified
 */
const makeLocale = (lang: string): cdateNS.Handlers => {
    const DateTimeFormat = Intl.DateTimeFormat;

    // build a handler function which converts from Date to string
    const makeFn = (options: Intl.DateTimeFormatOptions): ((dt: Date) => string) => {
        const format = new DateTimeFormat(lang, options);
        return dt => format.format(dt);
    };

    // stringify a single Date to string
    const stringify = (dt: Date, options: Intl.DateTimeFormatOptions): string => {
        // force UTC instead of local time
        const offset = dt.getTimezoneOffset();

        // stringify
        const format = new DateTimeFormat(lang, options);
        let text = format.format(+dt - offset * d.MINUTE);

        // remove UTC for some cases given
        if (text) return text.replace(/\s*UTC$/, "");
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

export const getLocaleOptions = () => {
    const digits = "2-digit";
    const medium = "medium";
    const numeric = "numeric";
    const short = "short";
    const long = "long";

    // Note: "timeZoneName" parameter is not allowed here!
    const options: { [specifier in localeFormatSpecifiers]: Intl.DateTimeFormatOptions } = {
        a: {weekday: short},
        A: {weekday: long},
        b: {month: short},
        B: {month: long},
        c: {weekday: short, year: numeric, month: short, day: numeric, hour: digits, minute: digits, second: digits},
        r: {timeStyle: medium, hour12: true},
        x: {dateStyle: short},
        X: {timeStyle: medium}, // hour12: default
    };

    // force UTC instead of local time
    Object.keys(options).forEach((key: keyof typeof options) => options[key].timeZone = "UTC");

    return options;
}

const localeCache: { [lang: string]: cdateNS.Handlers } = {};

const styleOptions = getLocaleOptions();

export const getLocale = (lang: string) => (localeCache[lang] || (localeCache[lang] = makeLocale(lang)));
