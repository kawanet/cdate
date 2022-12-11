#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../index.js";
import type {cdateNS} from "../types/cdate";

const TITLE = "230.handler.ts";

describe(TITLE, () => {
    const dt = new Date("2023-04-05 06:07:08.090");
    const fmt = "%Y/%m/%d %H:%M:%S.%L";

    it("fr_FR", () => {
        const weekdayShort = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
        const weekdayLong = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
        const monthShort = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
        const monthLong = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

        const fr_FR: cdateNS.Handlers = {
            "%a": dt => weekdayShort[dt.getDay()],
            "%A": dt => weekdayLong[dt.getDay()],
            "%b": dt => monthShort[dt.getMonth()],
            "%B": dt => monthLong[dt.getMonth()],
            "%p": dt => (dt.getHours() < 12 ? "AM" : "PM"),

            // dim. 2 janv. 2022, 03:04:05
            "%c": "%a %-d %b %Y, %H:%M:%S",

            // 03:04:05 AM
            "%r": "%H:%M:%S %p",

            // 02/01/2022
            "%x": "%d/%m/%Y",

            // 03:04:05
            "%X": "%H:%M:%S",
        };

        const c = cdate(dt).handler(fr_FR);

        assert.equal(c.text(fmt), "2023/04/05 06:07:08.090");
        assert.equal(c.text(`"%A"`), `"mercredi"`, `"%A"`);
        assert.equal(c.text(`"%a"`), `"mer."`, `"%a"`);
        assert.equal(c.text(`"%B"`), `"avril"`, `"%B"`);
        assert.equal(c.text(`"%b"`), `"avr."`, `"%b"`);

        assert.equal(c.format(`"dddd"`), `"mercredi"`, `"dddd"`);
        assert.equal(c.format(`"ddd"`), `"mer."`, `"ddd"`);
        assert.equal(c.format(`"MMMM"`), `"avril"`, `"MMMMM"`);
        assert.equal(c.format(`"MMM"`), `"avr."`, `"MMM"`);
    });
});
