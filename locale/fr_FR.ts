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
    
    // dimanche 2 janvier 2022 à 03:04:05 +09:00
    "%c": "%A %-d %B %Y à %H:%M:%S %:z",

    // 2 janv. 2022
    "%x": "%-d %b %Y",

    // 03:04:05
    "%X": "%H:%M:%S",
};
