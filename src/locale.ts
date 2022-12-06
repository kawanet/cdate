import type {cdateNS} from "../";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

/**
 * build an on-demand Handlers for the language specified
 */
const makeLocale = (lang: string): cdateNS.Handlers => {
    const DateTimeFormat = Intl.DateTimeFormat;

    // build a handler function which converts from Date to string
    const makeHandler = (options: Intl.DateTimeFormatOptions): cdateNS.Handler => {
        let format: Intl.DateTimeFormat;

        return dt => {
            // cached DateTimeFormat instance
            if (!format) format = new DateTimeFormat(lang, options);

            // force UTC instead of local time
            const offset = dt.getTimezoneOffset();

            // stringify
            const text = format.format(+dt - offset * d.MINUTE);

            // remove "UTC" string for some cases given
            if (text) return text.replace(/\s*UTC$/, "");
        };
    };

    // cache the results like Monday, January, etc.
    const cacheHandler = (options: Intl.DateTimeFormatOptions, keyFn: cdateNS.Handler): cdateNS.Handler => {
        const handler = makeHandler(options);
        const cache: { [key: string]: ReturnType<cdateNS.Handler> } = {};
        return dt => {
            const key = keyFn(dt);
            return cache[key] || (cache[key] = handler(dt));
        };
    };

    // keyFn
    const getDay = (dt: Date) => dt.getDay();
    const getMonth = (dt: Date) => dt.getMonth();

    // Handlers
    return {
        "%a": cacheHandler(styleOptions.a, getDay),
        "%A": cacheHandler(styleOptions.A, getDay),
        "%b": cacheHandler(styleOptions.b, getMonth),
        "%B": cacheHandler(styleOptions.B, getMonth),
        "%c": makeHandler(styleOptions.c),
        "%r": makeHandler(styleOptions.r),
        "%x": makeHandler(styleOptions.x),
        "%X": makeHandler(styleOptions.X),
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
