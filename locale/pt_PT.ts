// pt_PT.ts

import type {cdateNS} from "../";

const weekdayShort = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const weekdayLong = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const monthShort = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
const monthLong = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export const pt_PT: cdateNS.Specifiers = {
    "%a": dt => weekdayShort[dt.getDay()],
    "%A": dt => weekdayLong[dt.getDay()],
    "%b": dt => monthShort[dt.getMonth()],
    "%B": dt => monthLong[dt.getMonth()],
    
    // domingo, 2 de janeiro de 2022 às 03:04:05 +09:00
    "%c": "%A, %-d de %B de %Y às %H:%M:%S %:z",

    // 02/01/2022
    "%x": "%d/%m/%Y",

    // 03:04:05
    "%X": "%H:%M:%S",
};