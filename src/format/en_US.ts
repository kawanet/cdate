import type {cdate} from "../../index.js";

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const en_US: cdate.Handlers = {
    // "%a": the locale's abbreviated weekday name
    "%a": dt => weekdayShort[dt.getDay()],

    // "%A": the locale's full weekday name
    "%A": dt => weekdayLong[dt.getDay()],

    // "%b": the locale's abbreviated month name
    "%b": dt => monthShort[dt.getMonth()],

    // "%B": the locale's full month name
    "%B": dt => monthLong[dt.getMonth()],

    // "%p": the locale's equivalent of either `AM` or `PM`
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),

    // "%r": the locale's representation of 12-hour clock time using AM/PM notation
    // 3:04:05 AM
    "%r": "%-I:%M:%S %p",

    // "%x": the locale's appropriate date representation
    // 1/2/22
    "%x": "%-m/%-d/%y",

    // "%X": the locale's appropriate time representation
    // 3:04:05 AM
    "%X": "%-I:%M:%S %p",
};
