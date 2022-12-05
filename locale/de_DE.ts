// de_DE.ts

import type {cdateNS} from "../";

const weekdayShort = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const weekdayLong = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const monthShort = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const monthLong = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export const de_DE: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    
    // Sonntag, 2. Januar 2022 um 03:04:05 +00:00
    "%c": "%A, %-d. %B %Y um %H:%M:%S %:z",

    // 03:04:05 AM
    "%r": "%H:%M:%S %p",

    // 02.01.22
    "%x": "%d.%m.%y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
