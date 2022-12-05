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
    const list: Date[] = [];
    let t = +dt;
    for (let i = 0; i < size; i++) {
        list[i] = new Date(t);
        t += d.DAY * days;
    }
    return list;
}

// Sun Jan 02 2022 (1641081600000)
const initDate = new Date(2022, 0, 2);
const getMonthArray = lazy(() => getDateArray(initDate, 12, 31));
const getWeekdayArray = lazy(() => getDateArray(initDate, 7, 1));

class Locale {
    constructor(protected lang: string) {
        //
    }

    protected format(options: Intl.DateTimeFormatOptions) {
        return new Intl.DateTimeFormat(this.lang, options);
    }

    protected array(options: Intl.DateTimeFormatOptions, getArray: () => Date[]) {
        const format = this.format(options);
        return getArray().map(dt => format.format(dt));
    }

    private _a = lazy(() => this.array({weekday: "short"}, getWeekdayArray));
    private _A = lazy(() => this.array({weekday: "long"}, getWeekdayArray));
    private _b = lazy(() => this.array({month: "short"}, getMonthArray));
    private _B = lazy(() => this.array({month: "long"}, getMonthArray));

    locale(): cdateNS.Specifiers {
        return {
            "%a": (dt) => this._a()[dt.getDay()],
            "%A": (dt) => this._A()[dt.getDay()],
            "%b": (dt) => this._b()[dt.getMonth()],
            "%B": (dt) => this._B()[dt.getMonth()],
            "%c": (dt) => this.format(formatOptions.c).format(toUTCDate(dt)),
            "%r": (dt) => this.format(formatOptions.r).format(toUTCDate(dt)),
            "%x": (dt) => this.format(formatOptions.x).format(toUTCDate(dt)),
            "%X": (dt) => this.format(formatOptions.X).format(toUTCDate(dt)),
        }
    }
}

type localeFormatSpecifiers = "c" | "r" | "x" | "X";

export const formatOptions: { [specifier in localeFormatSpecifiers]: Intl.DateTimeFormatOptions } = {
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

export const getLocale = (lang: string) => (localeCache[lang] || (localeCache[lang] = new Locale(lang).locale()));
