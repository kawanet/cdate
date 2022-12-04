import type {cdateNS} from "../types/cdate";

const weekdaysShort = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const weekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const monthsShort = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

export const fr_FR: cdateNS.Specifiers = {
    "%a": dt => weekdaysShort[dt.getDay()],
    "%A": dt => weekdays[dt.getDay()],
    "%b": dt => monthsShort [dt.getMonth()],
    "%B": dt => months[dt.getMonth()],

    "%c": "%a %d %b %Y %X %Z",
    "%D": "%d/%m/%Y",
    "%r": "%I:%M:%S %p",
    "%X": "%T",
    "%x": "%D",
};
