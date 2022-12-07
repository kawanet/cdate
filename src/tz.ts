import {cached, lazy} from "./u.js";

type DTFPartsParser = (parts: Intl.DateTimeFormatPart[], dt?: Date) => number;
type TimezoneOffsetFn = (ms: number) => number;

const parseTZ = cached((tz: string): number => {
    const matched = tz.match(/(?:^|GMT)?(?:([+-])([01]?\d):?(\d[05])|$)|UTC$/);
    if (!matched) return;
    const offset = ((+matched[2]) * 60 + (+matched[3])) | 0;
    return (matched[1] === "-") ? -offset : offset;
});

let longOffset = "longOffset" as const;

const getDateTimeFormat = cached((timeZone: string): Intl.DateTimeFormat => {
    return new Intl.DateTimeFormat("en-US", longOffset ?
        // node v18
        {timeZone, timeZoneName: longOffset} :
        // node v16
        {timeZone, hour12: false, weekday: "short", day: "numeric", hour: "numeric", minute: "numeric"});
});

/**
 * Node v16 and below does NOT support {timeZoneName: "longOffset"} option
 * Node v18 however supports it.
 */
const getPartsParser = lazy((): DTFPartsParser => {
    try {
        getDateTimeFormat("UTC");
        return parseTimeZoneName; // node v18
    } catch (e) {
        // RangeError: Value longOffset out of range for Intl.DateTimeFormat options property timeZoneName
        longOffset = null;
        return calcTimeZoneOffset; // node v16
    }
});

const parseTimeZoneName: DTFPartsParser = (parts) => {
    const part = parts.find(v => v.type === "timeZoneName");
    if (part) return parseTZ(part.value);
};

const weekdayMap = lazy(() => {
    const map: { [key: string]: number } = {};
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((key, idx) => (map[key] = idx));
    return map;
});

const calcTimeZoneOffset: DTFPartsParser = (parts, dt) => {
    const index: { [key in Intl.DateTimeFormatPartTypes]?: any } = {};
    parts.forEach(v => (index[v.type] = v.value));
    const day = (7 + dt.getUTCDay() - weekdayMap()[index.weekday]) % 7;
    const hour = dt.getUTCHours() - (index.hour) % 24;
    const minutes = dt.getUTCMinutes() - index.minute;

    return -((day * 24 + hour) * 60 + minutes);
};

export const getTZ = cached<TimezoneOffsetFn>(tz => {
    if (!/\//.test(tz)) {
        const fixed = parseTZ(tz);
        return (_: number) => fixed;
    }

    // last offset prev
    let prev: { [ms: string]: number };

    return (ms: number) => {
        let offset = prev && prev[ms];
        if (offset != null) return offset;

        const partsToOffset = getPartsParser();
        const dtf = getDateTimeFormat(tz);
        const parts = dtf && dtf.formatToParts(ms);

        const dt = new Date(ms);
        if (parts) {
            offset = partsToOffset(parts, dt);
        }
        if (offset == null) {
            // fallback to local time zone
            offset = -dt.getTimezoneOffset();
        }

        prev = {};
        prev[ms] = offset;
        return offset;
    };
});
