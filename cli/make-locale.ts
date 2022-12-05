#!/usr/bin/env node

import {cdate, cdateNS} from "../";
import {formatOptions} from "../src/locale";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const getDateArray = (dt: Date, size: number, days: number): Date[] => {
    return new Array(size).fill(0).map((_, idx) => new Date(+dt + idx * days * d.DAY));
};

const main = async (lang: string) => {
    const initDate = new Date("2022-01-02T03:04:05Z");
    const months = getDateArray(initDate, 12, 31);
    const days = getDateArray(initDate, 7, 1);
    const hours = getDateArray(initDate, 2, .5);

    let weekdayShort: string[];
    let weekdayLong: string[];
    let monthShort: string[];
    let monthLong: string[];
    let ampm: string[];
    const style: { [key: string]: string } = {};
    const sample: { [key: string]: string } = {};
    const locale: cdateNS.Specifiers = {
        "%a": dt => weekdayShort[dt.getDay()],
        "%A": dt => weekdayLong[dt.getDay()],
        "%b": dt => monthShort[dt.getMonth()],
        "%B": dt => monthLong[dt.getMonth()],
        "%p": dt => (dt.getHours() < 12 ? ampm[0] : ampm[1]),
    };

    const dt = cdate(initDate).utc().extend(locale);

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.a);
        weekdayShort = days.map(dt => format.format(dt));
        console.warn("weekdayShort:", weekdayShort.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.A);
        weekdayLong = days.map(dt => format.format(dt));
        console.warn("weekdayLong: ", weekdayLong.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.b);
        monthShort = months.map(dt => format.format(dt));
        console.warn("monthShort:  ", monthShort.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.B);
        monthLong = months.map(dt => format.format(dt));
        console.warn("monthLong:   ", monthLong.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.r);
        ampm = hours.map(dt => format.formatToParts(dt).find(v => v.type === "dayPeriod").value);
        console.warn("ampm:  ", ampm.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.x);
        const parts = format.formatToParts(initDate);
        style.x = fixHours(parts.map(parsePart).join(""));
        sample.x = dt.extend({"%x": style.x}).text("%x");
        console.warn("Intl:  ", format.format(initDate));
        console.warn(`locale: "${style.x}"`);
        console.warn("cdate: ", sample.x);
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.X);
        const parts = format.formatToParts(initDate);
        style.X = fixHours(parts.map(parsePart).join(""));
        sample.X = dt.extend({"%X": style.X}).text("%X");
        console.warn("Intl:  ", format.format(initDate));
        console.warn("cdate: ", sample.X);
        console.warn(`locale: "${style.X}"`);
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.r);
        const parts = format.formatToParts(initDate);
        style.r = fixHours(parts.map(parsePart).join(""));
        sample.r = dt.extend({"%r": style.r}).text("%r");
        console.warn("Intl:  ", format.format(initDate));
        console.warn("cdate: ", sample.r);
        console.warn(`locale: "${style.r}"`);
    }

    {
        const format = Intl.DateTimeFormat(lang, formatOptions.c);
        const parts = format.formatToParts(initDate);
        style.c = fixHours(parts.map(parsePart).join(""), /%-?H/);
        sample.c = dt.extend({"%c": style.c}).text("%c");
        console.warn("Intl:  ", format.format(initDate));
        console.warn("cdate: ", sample.c);
        console.warn(`locale: "${style.c}"`);
    }

    const _lang = lang.replace(/-/g, "_");
    const toJSON = (list: string[]) => JSON.stringify(list).replace(/","/g, '", "');

    // language=ts
    let fmt = `// ${_lang}.ts

        import type {cdateNS} from "../";

        const weekdayShort = ${toJSON(weekdayShort)};
        const weekdayLong = ${toJSON(weekdayLong)};
        const monthShort = ${toJSON(monthShort)};
        const monthLong = ${toJSON(monthLong)};

        export const ${_lang}: cdateNS.Specifiers = {
            "%a": dt => weekdayShort[dt.getDay()],
            "%A": dt => weekdayLong[dt.getDay()],
            "%b": dt => monthShort[dt.getMonth()],
            "%B": dt => monthLong[dt.getMonth()],
            "%p": dt => (dt.getHours() < 12 ? "${ampm[0]}" : "${ampm[1]}"),
            
            // ${sample.c}
            "%c": "${style.c}",

            // ${sample.r}
            "%r": "${style.r}",

            // ${sample.x}
            "%x": "${style.x}",

            // ${sample.X}
            "%X": "${style.X}",
        };\n`.replace(/^        /mg, "");

    if (lang === "en-US") {
        fmt = fmt.replace(/("%c")/, "// $1");
    }

    // NBSP
    fmt = fmt.replace(/\xa0/g, "");

    // result
    process.stdout.write(fmt);

    function parsePart(v: Intl.DateTimeFormatPart): string {
        if (v.type === "year") {
            return (v.value.length === 4) ? "%Y" : "%y";
        }
        if (v.type === "month") {
            if (/\d$/.test(v.value)) {
                return (v.value.length === 2) ? "%m" : "%-m";
            }
            if (v.value === monthLong[0]) return "%B";
            if (v.value === monthShort[0]) return "%b";
            if (v.value === monthShort[0] + ".") return "%b.";
            throw new Error(`not found: ${v.type} = ${v.value}`);
        }
        if (v.type === "weekday") {
            if (v.value === weekdayLong[0]) return "%A";
            if (v.value === weekdayShort[0]) return "%a";
            if (v.value === weekdayShort[0] + ".") return "%a.";
            throw new Error(`not found: ${v.type} = ${v.value}`);
        }
        if (v.type === "day") return (v.value.length === 2) ? "%d" : "%-d";
        if (v.type === "hour") return (v.value.length === 2) ? "%H" : "%-H";
        if (v.type === "minute") return (v.value.length === 2) ? "%M" : "%-M";
        if (v.type === "second") return (v.value.length === 2) ? "%S" : "%-S";
        if (v.type === "dayPeriod") return /^(am|pm)$/.test(v.value) ? "%P" : "%p";
        if (v.type === "timeZoneName") return "%:z";
        if (v.type === "literal") return v.value;
    }

    function fixHours(style: string, match?: RegExp): string {
        return (/%p/i.test(style)) ? style.replace(match || /%-H/, "%-I") : style;
    }
};

main.apply(null, process.argv.slice(2)).catch(console.error);
