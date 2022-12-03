import type {cdateNS} from "../types/cdate";

const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const en_US: cdateNS.Locale = {
    /**
     * %a     The abbreviated weekday name according to the current locale. (en-only)
     */
    "%a": dt => weekdaysShort[dt.getDay()],

    /**
     * %A     The full weekday name according to the current locale. (en-only)
     */
    "%A": dt => weekdays[dt.getDay()],

    /**
     * %b     The abbreviated month name according to the current locale. (en-only)
     */
    "%b": dt => monthsShort[dt.getMonth()],

    /**
     * %B     The full month name according to the current locale. (en-only)
     */
    "%B": dt => months[dt.getMonth()],

    /**
     * %p     Either "AM" or "PM"
     */
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    "%P": dt => (dt.getHours() < 12 ? "am" : "pm"),

    /**
     * formats
     */
    "%c": "%a %d %b %Y %X %Z",
    "%D": "%m/%d/%y",
    "%F": "%Y-%m-%d",
    "%R": "%H:%M",
    "%r": "%I:%M:%S %p",
    "%T": "%H:%M:%S",
    "%v": "%e-%b-%Y",
    "%X": "%r",
    "%x": "%D"
};
