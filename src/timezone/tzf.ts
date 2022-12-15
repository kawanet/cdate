import {cached} from "../cache.js";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    MINUTE15 = 15 * MINUTE,
}

export type TZF = (ms: number) => number;

const shorten = (s: any) => String(s).toLowerCase().substr(0, 2);
const weekdayMap = {su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6};

const calcTimeZoneOffset = (dtf: Intl.DateTimeFormat, dt: Date) => {
    const parts = dtf.formatToParts(dt);
    const index: { [key in Intl.DateTimeFormatPartTypes]?: any } = {};
    parts.forEach(v => (index[v.type] = v.value));

    // difference of days:
    const wday = weekdayMap[shorten(index.weekday) as keyof typeof weekdayMap];
    let day = (7 + dt.getUTCDay() - wday) % 7;
    if (day > 3) day -= 7;

    // difference of hours: some locales use h24
    const hour = dt.getUTCHours() - (index.hour % 24);

    // difference of minutes:
    const minutes = dt.getUTCMinutes() - index.minute;

    // difference in minutes:
    return -((day * 24 + hour) * 60 + minutes);
};

export const getTZF = cached<TZF>(tz => {
    // cache latest results
    let cache: { [minute15: string]: number } = {};
    let count = 0;
    let dtf: Intl.DateTimeFormat;

    return ms => {
        // time zone offset never changes within every 15 minutes
        const minute15 = Math.floor(ms / d.MINUTE15);

        // check cached result
        let offset = cache && cache[minute15];
        if (offset != null) return offset;

        // reset all cache simply at every 24 x 4 times
        if (count++ > 96) {
            cache = {};
            count = 0;
        }

        const dt = new Date(ms);

        // DateTimeFormat is much slow
        if (!dtf) {
            dtf = new Intl.DateTimeFormat("en-US", {timeZone: tz, hour12: false, weekday: "short", hour: "numeric", minute: "numeric"});
        }
        offset = calcTimeZoneOffset(dtf, dt);

        // fallback to local time zone
        if (offset == null) {
            offset = -dt.getTimezoneOffset();
        }

        // write to cache
        cache[minute15] = offset;
        return offset;
    };
});
