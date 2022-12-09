import {cached, lazy} from "../cache.js";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    MINUTE15 = 15 * MINUTE,
}

type TZF = (ms: number) => number;

const parseTZ = cached((tz: string): number => {
    const matched = tz.match(/(?:^|GMT)?(?:([+-])([01]?\d):?(\d[05])|$)|UTC$/);
    if (!matched) return;
    const offset = ((+matched[2]) * 60 + (+matched[3])) | 0;
    return (matched[1] === "-") ? -offset : offset;
});

const weekdayMap = lazy(() => {
    const map: { [key: string]: number } = {};
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((key, idx) => (map[key] = idx));
    return map;
});

const calcTimeZoneOffset = (dtf: Intl.DateTimeFormat, dt: Date) => {
    const parts = dtf.formatToParts(dt);
    const index: { [key in Intl.DateTimeFormatPartTypes]?: any } = {};
    parts.forEach(v => (index[v.type] = v.value));

    // difference of days:
    let day = (7 + dt.getUTCDay() - weekdayMap()[index.weekday]) % 7;
    if (day > 3) day -= 7;

    // difference of hours: some locales use h24
    const hour = dt.getUTCHours() - (index.hour % 24);

    // difference of minutes:
    const minutes = dt.getUTCMinutes() - index.minute;

    // difference in minutes:
    return -((day * 24 + hour) * 60 + minutes);
};

export const getTZF = cached<TZF>(tz => {
    if (!/\//.test(tz)) {
        const fixed = parseTZ(tz);
        return _ => fixed;
    }

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
