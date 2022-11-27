import type {cDateNS} from "../types/cdate";

const weekdaysShort = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const weekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const monthsShort = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

export const fr_FR: cDateNS.Locale = {
    "%a": dt => weekdaysShort[dt.getDay()],
    "%A": dt => weekdays[dt.getDay()],
    "%b": dt => monthsShort [dt.getMonth()],
    "%B": dt => months[dt.getMonth()],

    /**
     * formats
     */
    "%c": "%a %d %b %Y %X %Z",
    "%D": "%d/%m/%Y",
    "%F": "%Y-%m-%d",
    "%R": "%H:%M",
    "%r": "%I:%M:%S %p",
    "%T": "%H:%M:%S",
    "%v": "%e-%b-%Y",
    "%X": "%T",
    "%x": "%D",
};
