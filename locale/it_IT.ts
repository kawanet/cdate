// it_IT.ts

import type {cdateNS} from "../";

const weekdayShort = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const weekdayLong = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const monthShort = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const monthLong = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

export const it_IT: cdateNS.Handlers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    
    // dom 2 gen 2022, 03:04:05
    "%c": "%a %-d %b %Y, %H:%M:%S",

    // 03:04:05 AM
    "%r": "%H:%M:%S %p",

    // 02/01/22
    "%x": "%d/%m/%y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
