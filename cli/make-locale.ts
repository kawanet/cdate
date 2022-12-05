#!/usr/bin/env node

import {cdate, cdateNS} from "../";

const main = async (lang: string) => {
    // Sun Jan 02 2022
    const start = new Date(2022, 0, 2, 3, 4, 5);
    const months = new Array(12).fill(0).map((_, i) => i);
    const days = new Array(7).fill(0).map((_, i) => i);
    const hours = [0, 12];

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

    const dt = cdate(start).extend(locale);

    {
        const format = Intl.DateTimeFormat(lang, {weekday: "short"});
        weekdayShort = days.map(month => format.format(+dt.add(month, "day")));
        console.warn("weekdayShort:", weekdayShort.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, {weekday: "long"});
        weekdayLong = days.map(month => format.format(+dt.add(month, "day")));
        console.warn("weekdayLong: ", weekdayLong.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, {month: "short"});
        monthShort = months.map(month => format.format(+dt.add(month, "month")));
        console.warn("monthShort:  ", monthShort.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, {month: "long"});
        monthLong = months.map(month => format.format(+dt.add(month, "month")));
        console.warn("monthLong:   ", monthLong.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, {timeStyle: "long", hour12: true});
        ampm = hours.map(hour => format.formatToParts(+dt.add(hour, "hour")).find(v => v.type === "dayPeriod").value);
        console.warn("ampm:  ", ampm.join(" "));
    }

    {
        const format = Intl.DateTimeFormat(lang, {dateStyle: "medium"});
        const parts = format.formatToParts(+dt);
        style.x = parts.map(parsePart).join("");
        sample.x = dt.extend({"%x": style.x}).text("%x");
        console.warn("Intl:  ", format.format(+dt));
        console.warn("cdate: ", sample.x);
        console.warn(`locale: "${style.x}"`);
    }

    {
        const format = Intl.DateTimeFormat(lang, {timeStyle: "medium"});
        const parts = format.formatToParts(+dt);
        style.X = parts.map(parsePart).join("");
        sample.X = dt.extend({"%X": style.X}).text("%X");
        console.warn("Intl:  ", format.format(+dt));
        console.warn("cdate: ", sample.X);
        console.warn(`locale: "${style.X}"`);
    }

    {
        const format = Intl.DateTimeFormat(lang, {dateStyle: "full", timeStyle: "long", timeZoneName: "short"});
        const parts = format.formatToParts(+dt);
        style.c = parts.map(parsePart).join("");
        sample.c = dt.extend({"%c": style.c}).text("%c");
        console.warn("Intl:  ", format.format(+dt));
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
            throw new Error(`not found: ${v.type} = ${v.value}`);
        }
        if (v.type === "weekday") {
            if (v.value === weekdayLong[0]) return "%A";
            if (v.value === weekdayShort[0]) return "%a";
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
};

main.apply(null, process.argv.slice(2)).catch(console.error);
