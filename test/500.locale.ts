#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../";
import {fr_FR} from "../locale/fr_FR";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    const date = new Date("2023-04-05T06:07:08.090Z");

    it(`cdate()`, () => {
        const dt = cdate(date).utc();
        assert.equal(dt.text("%A = %a"), "Wednesday = Wed");
        assert.equal(dt.text("%B = %b"), "April = Apr");
        assert.equal(dt.text("%x"), "4/5/23");
        assert.equal(dt.text("%X"), "6:07:08 AM");
    });

    it(`cdate().locale("en-US")`, () => {
        const dt = cdate(date).utc().locale("en-US");
        assert.equal(dt.text("%A = %a"), "Wednesday = Wed");
        assert.equal(dt.text("%B = %b"), "April = Apr");
        assert.equal(dt.text("%x"), "4/5/23");
        assert.equal(dt.text("%X"), "6:07:08 AM");
    });

    it(`cdate().extend(fr_FR)`, () => {
        const dt = cdate(date).utc().extend(fr_FR);
        assert.equal(dt.text("%A = %a"), "mercredi = mer.");
        assert.equal(dt.text("%B = %b"), "avril = avr.");
        assert.equal(dt.text("%x"), "05/04/2023");
        assert.equal(dt.text("%X"), "06:07:08");
    });

    it(`cdate().locale("fr-FR")`, () => {
        const dt = cdate(date).utc().locale("fr-FR");
        assert.equal(dt.text("%A = %a"), "mercredi = mer.");
        assert.equal(dt.text("%B = %b"), "avril = avr.");
        assert.equal(dt.text("%x"), "05/04/2023");
        assert.equal(dt.text("%X"), "06:07:08");
    });

    it(`cdate().locale("ja-JP")`, () => {
        const dt = cdate(date).utc().locale("ja-JP");
        assert.equal(dt.text("%A = %a"), "水曜日 = 水");
        assert.equal(dt.text("%B = %b"), "4月 = 4月");
        assert.equal(dt.text("%x"), "2023/04/05");
        assert.equal(dt.text("%X"), "6:07:08");
    });
});