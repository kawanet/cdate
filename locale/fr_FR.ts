// fr_FR.ts

import type {cdateNS} from "../";

const weekdayShort = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const weekdayLong = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const monthShort = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const monthLong = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

export const fr_FR: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),
    
    // dimanche 2 janvier 2022 à 03:04:05 +00:00
    "%c": "%A %-d %B %Y à %H:%M:%S %:z",

    // 03:04:05 AM
    "%r": "%H:%M:%S %p",

    // 02/01/2022
    "%x": "%d/%m/%Y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
