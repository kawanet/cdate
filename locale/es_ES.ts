// es_ES.ts

import type {cdateNS} from "../";

const weekdayShort = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const weekdayLong = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const monthShort = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const monthLong = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export const es_ES: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "a.m." : "p.m."),
    
    // domingo, 2 de enero de 2022, 3:04:05 +09:00
    "%c": "%A, %-d de %B de %Y, %-H:%M:%S %:z",

    // 2 ene 2022
    "%x": "%-d %b %Y",

    // 3:04:05
    "%X": "%-H:%M:%S",
};
