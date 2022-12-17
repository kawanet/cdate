import type {cdate} from "../../index.js";
import {getUnit, Unit} from "../calc/unit.js";

type ToNumber = (dt: Date) => number;
type ToString = (dt: Date) => string;
type Pad = (fn: ToNumber) => ToString;

export const strftimeHandlers = (): cdate.Handlers => {
    const pad2: Pad = fn => (dt) => ("0" + fn(dt)).substr(-2);
    const pad2S: Pad = fn => (dt) => (" " + fn(dt)).substr(-2);
    const pad3: Pad = fn => (dt) => ("00" + fn(dt)).substr(-3);

    const padY: Pad = fn => (dt) => {
        let year = fn(dt);
        if (0 <= year && year <= 9999) {
            return ("000" + year).substr(-4);
        }

        let prefix = "+";
        if (year < 0) {
            prefix = "-";
            year = -year;
        }
        return prefix + (("00000" + year).substr(-6));
    };

    const C: ToNumber = dt => Math.floor(Y(dt) / 100);
    const d = getUnit[Unit.date];
    const H = getUnit[Unit.hour];
    const I: ToNumber = dt => (((H(dt) + 11) % 12) + 1);
    const L = getUnit[Unit.millisecond];
    const m: ToNumber = dt => (_m(dt) + 1);
    const _m = getUnit[Unit.month];
    const M = getUnit[Unit.minute];
    const S = getUnit[Unit.second];
    const s = getUnit[Unit.time];
    const y: ToNumber = dt => (Y(dt) % 100);
    const Y = getUnit[Unit.year];
    const tzo = getUnit[Unit.timeZoneOffset];
    const pad0 = (num: number) => (num < 10 ? "0" + num : num);

    const makeZ = (delim: string, hasSecond?: boolean): ToString => {
        return dt => {
            let offset = -tzo(dt);
            const isMinus = (offset < 0);
            if (isMinus) offset = -offset;
            const hour = Math.floor(offset / 60);
            const min = Math.floor(offset % 60);
            const second = hasSecond ? delim + pad0(Math.floor((offset % 1) * 60)) : "";
            return (isMinus ? "-" : "+") + pad0(hour) + delim + pad0(min) + second;
        }
    };

    /**
     * %c %r %x and %X are defined at locale files
     */

    return {
        // "%c": the locale's appropriate date and time representation
        "%c": "%a %b %e %T %Y",

        // "%C": the century as a decimal number
        "%-C": C,
        "%C": pad2(C),

        // "%d": the day of the month as a decimal number
        "%-d": d,
        "%d": pad2(d),

        // "%D": the date in the format `%m/%d/%y`
        "%D": "%m/%d/%y",

        // "%e": the day of month as a decimal number
        "%e": pad2S(d),

        // "%F": the date in the format `%Y-%m-%d`
        "%F": "%Y-%m-%d", // ISO

        // "%H": the hour (24-hour clock) as a decimal number
        "%-H": H,
        "%H": pad2(H),

        // "%I": the hour (12-hour clock) as a decimal number
        "%-I": I,
        "%I": pad2(I),

        // "%k": the hour (24-hour clock) as a decimal number
        "%k": pad2S(H),

        // "%l": the hour (12-hour clock) as a decimal number
        "%l": pad2S(I),

        // "%L": the millisecond as a decimal number
        "%-L": pad3(L),
        "%L": pad3(L),

        // "%m": the month as a decimal number
        "%-m": m,
        "%m": pad2(m),

        // "%M": the minute as a decimal number
        "%-M": M,
        "%M": pad2(M),
        "%P": dt => (H(dt) < 12 ? "am" : "pm"),

        // "%R": the time in the format `%H:%M`
        "%R": "%H:%M",

        // "%s": the number of seconds since the Epoch, UTC
        "%s": dt => Math.floor(s(dt) / 1000),

        // "%S": the second as a decimal number
        "%-S": S,
        "%S": pad2(S),

        // "%T": the time in the format `%H:%M:%S`
        "%T": "%H:%M:%S",

        // "%y": the year without century as a decimal number
        "%-y": y,
        "%y": pad2(y),

        // "%Y": the year with century as a decimal number
        "%-Y": Y,
        "%Y": padY(Y),

        // "%v": the date in the format `%e-%b-%Y`
        "%v": "%e-%b-%Y", // VMS

        // "%w": the weekday (Sunday as the first day of the week) as a decimal number
        "%w": getUnit[Unit.day],

        // "%z": the offset from UTC in the format `+HHMM` or `-HHMM`
        "%::z": makeZ(":", true),
        "%:z": makeZ(":"),
        "%z": makeZ(""),

        // "%%": a literal `%` character
        "%%": () => "%",

        // "%n": a newline character
        "%n": () => "\n",

        // "%t": a tab character
        "%t": () => "\t",

        // ==== NOT IMPLEMENTED BELOW ====
        // "%G": the ISO 8601 year with century as a decimal number
        // "%g": the ISO 8601 year without century as a decimal number
        // "%j": the day of the year as a decimal number
        // "%U": the week number of the year (Sunday as the first day of the week)
        // "%u": the weekday (Monday as the first day of the week) as a decimal number
        // "%V": the week number of the year (Monday as the first day of the week)
        // "%W": the week number of the year (Monday as the first day of the week)
        // "%Z": the time zone name
    };
};
