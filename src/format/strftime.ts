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

    /**
     * %C     The century number (year/100) as a 2-digit integer. (SU)
     */
    const C: ToNumber = dt => Math.floor(Y(dt) / 100);

    /**
     * %d     The day of the month as a decimal number (range 01 to 31).
     */
    const d = getUnit[Unit.date];

    /**
     * %H     The hour as a decimal number using a 24-hour clock (range 00 to 23).
     */
    const H = getUnit[Unit.hour];

    /**
     * %I     The hour as a decimal number using a 12-hour clock (range 01 to 12).
     */
    const I: ToNumber = dt => (((H(dt) + 11) % 12) + 1);

    /***
     * %L - Millisecond of the second (000..999)
     */
    const L = getUnit[Unit.millisecond];

    /**
     * %m     The month as a decimal number (range 01 to 12).
     */
    const m: ToNumber = dt => (_m(dt) + 1);
    const _m = getUnit[Unit.month];

    /**
     * %M     The minute as a decimal number (range 00 to 59).
     */
    const M = getUnit[Unit.minute];

    /**
     * %S     The second as a decimal number (range 00 to 60)
     */
    const S = getUnit[Unit.second];
    const s = getUnit[Unit.time];

    /**
     * %U     The week number [NOT IMPLEMENTED]
     * %y     The year as a decimal number without a century (range 00 to 99).
     */
    const y: ToNumber = dt => (Y(dt) % 100);

    /**
     * %Y     The year as a decimal number including the century.
     */
    const Y = getUnit[Unit.year];

    /**
     * %z     The +hhmm or -hhmm numeric timezone (that is, the hour and minute offset from UTC). (SU)
     */
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
        "%c": "%a %b %e %T %Y",
        "%-C": C,
        "%C": pad2(C),
        "%-d": d,
        "%d": pad2(d),
        "%D": "%m/%d/%y",
        "%e": pad2S(d),
        "%F": "%Y-%m-%d", // ISO
        "%-H": H,
        "%H": pad2(H),
        "%-I": I,
        "%I": pad2(I),
        "%k": pad2S(H),
        "%l": pad2S(I),
        "%-L": pad3(L),
        "%L": pad3(L),
        "%-m": m,
        "%m": pad2(m),
        "%-M": M,
        "%M": pad2(M),
        "%P": dt => (H(dt) < 12 ? "am" : "pm"),
        "%R": "%H:%M",
        "%s": dt => Math.floor(s(dt) / 1000),
        "%-S": S,
        "%S": pad2(S),
        "%T": "%H:%M:%S",
        "%-y": y,
        "%y": pad2(y),
        "%-Y": Y,
        "%Y": padY(Y),
        "%v": "%e-%b-%Y", // VMS
        "%w": getUnit[Unit.day],
        "%::z": makeZ(":", true),
        "%:z": makeZ(":"),
        "%z": makeZ(""),
        "%%": () => "%",  // %%     A literal '%' character.
        "%n": () => "\n", // %n     A newline character. (SU)
        "%t": () => "\t", // %t     A tab character. (SU)
    };
};
