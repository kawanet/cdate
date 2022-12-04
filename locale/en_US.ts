import type {cdateNS} from "../types/cdate";

const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const en_US: cdateNS.Specifiers = {
    "%a": dt => weekdaysShort[dt.getDay()],
    "%A": dt => weekdays[dt.getDay()],
    "%b": dt => monthsShort[dt.getMonth()],
    "%B": dt => months[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    "%P": dt => (dt.getHours() < 12 ? "am" : "pm"),

    "%c": "%a %d %b %Y %X %Z",
    "%D": "%m/%d/%y",
    "%r": "%I:%M:%S %p",
    "%X": "%r",
    "%x": "%D",
};
