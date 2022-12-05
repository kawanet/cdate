// it_IT.ts

import type {cdateNS} from "../";

const weekdayShort = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const weekdayLong = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const monthShort = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const monthLong = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

export const it_IT: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    
    // domenica 2 gennaio 2022 03:04:05 +00:00
    "%c": "%A %-d %B %Y %H:%M:%S %:z",

    // 03:04:05 AM
    "%r": "%H:%M:%S %p",

    // 02/01/22
    "%x": "%d/%m/%y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
