// en_US.ts

import type {cdateNS} from "../";

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const en_US: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    
    // Sunday, January 2, 2022 at 3:04:05 AM +00:00
    // "%c": "%A, %B %-d, %Y at %-H:%M:%S %p %:z",

    // 3:04:05 AM
    "%r": "%-I:%M:%S %p",

    // 1/2/22
    "%x": "%-m/%-d/%y",

    // 3:04:05 AM
    "%X": "%-I:%M:%S %p",
};
