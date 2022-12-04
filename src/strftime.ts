import type {cdateNS} from "../types/cdate";

type ToNumber = (dt: Date) => number;
type ToString = (dt: Date) => string;

const pad2 = (fn: ToNumber): ToString => dt => ("0" + fn(dt)).substr(-2, 2);
const pad2S = (fn: ToNumber): ToString => dt => (" " + fn(dt)).substr(-2, 2);
const pad3 = (fn: ToNumber): ToString => dt => ("00" + fn(dt)).substr(-3, 3);
const pad4 = (fn: ToNumber): ToString => dt => ("000" + fn(dt)).substr(-4, 4);

/**
 * %C     The century number (year/100) as a 2-digit integer. (SU)
 */
const C: ToNumber = dt => Math.floor(dt.getFullYear() / 100);

/**
 * %c     The preferred date and time representation for the current locale. [NOT IMPLEMENTED]
 * %d     The day of the month as a decimal number (range 01 to 31).
 */
const d: ToNumber = dt => dt.getDate();

/**
 * %H     The hour as a decimal number using a 24-hour clock (range 00 to 23).
 */
const H: ToNumber = dt => dt.getHours();

/**
 * %I     The hour as a decimal number using a 12-hour clock (range 01 to 12).
 */
const I: ToNumber = dt => (((dt.getHours() + 11) % 12) + 1);

/***
 * %L - Millisecond of the second (000..999)
 */
const L: ToNumber = dt => dt.getMilliseconds();

/**
 * %m     The month as a decimal number (range 01 to 12).
 */
const m: ToNumber = dt => (dt.getMonth() + 1);

/**
 * %M     The minute as a decimal number (range 00 to 59).
 */
const M: ToNumber = dt => dt.getMinutes();

/**
 * %S     The second as a decimal number (range 00 to 60)
 */
const S: ToNumber = dt => dt.getSeconds();

/**
 * %U     The week number [NOT IMPLEMENTED]
 * %y     The year as a decimal number without a century (range 00 to 99).
 */
const y: ToNumber = dt => dt.getFullYear() % 100;

/**
 * %Y     The year as a decimal number including the century.
 */
const Y: ToNumber = dt => dt.getFullYear();

/**
 * %z     The +hhmm or -hhmm numeric timezone (that is, the hour and minute offset from UTC). (SU)
 */
const makeZ = (delim: string): ToString => {
    return dt => {
        let offset = -dt.getTimezoneOffset();
        const isMinus = (offset < 0);
        if (isMinus) offset = -offset;
        const hour = Math.floor(offset / 60);
        const min = offset % 60;
        return (isMinus ? "-" : "+") + (hour < 10 ? "0" + hour : hour) + delim + (min < 10 ? "0" + min : min);
    }
};

export const strftimeMap = {
    "%-C": C,
    "%C": pad2(C),
    "%-d": d,
    "%d": pad2(d),
    "%e": pad2S(d),
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
    "%-S": S,
    "%S": pad2(S),
    "%-y": y,
    "%y": pad2(y),
    "%-Y": Y,
    "%Y": pad4(Y),
    "%w": dt => dt.getDay(),
    "%:z": makeZ(":"),
    "%z": makeZ(""),
    "%%": () => "%",  // %%     A literal '%' character.
    "%n": () => "\n", // %n     A newline character. (SU)
    "%t": () => "\t", // %t     A tab character. (SU)
} as cdateNS.Locale;
