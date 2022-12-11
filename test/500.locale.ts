#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../index.js";

const TITLE = "500.locale.ts";

describe(TITLE, () => {
    const date = new Date("2023-04-05T06:07:08.090Z");

    // Node v12 does not support DateTimeFormat
    const weekday = Intl.DateTimeFormat("ja", {weekday: "short"}).format(new Date());
    const IT = /[日月火水木金土]/.test(weekday) ? it : it.skip;

    it(`cdate()`, () => {
        const dt = cdate(date).utc();
        assert.equal(dt.text("%A = %a"), "Wednesday = Wed");
        assert.equal(dt.text("%B = %b"), "April = Apr");
        assert.equal(dt.text("%p"), "AM");
        assert.equal(dt.text("%x"), "4/5/23");
        assert.match(dt.text("%r"), /0?6:07:08/);
        assert.match(dt.text("%X"), /0?6:07:08/);
    });

    IT(`cdate().locale("en-US")`, () => {
        const dt = cdate(date).utc().locale("en-US");
        assert.equal(dt.text("%A = %a"), "Wednesday = Wed");
        assert.equal(dt.text("%B = %b"), "April = Apr");
        assert.equal(dt.text("%p"), "AM");
        assert.equal(dt.text("%x"), "4/5/23");
        assert.match(dt.text("%r"), /0?6:07:08/);
        assert.match(dt.text("%X"), /0?6:07:08/);
    });

    IT(`cdate().locale("fr-FR")`, () => {
        const dt = cdate(date).utc().locale("fr-FR");
        assert.equal(dt.text("%A = %a"), "mercredi = mer.");
        assert.equal(dt.text("%B = %b"), "avril = avr.");
        assert.equal(dt.text("%x"), "05/04/2023");
        assert.match(dt.text("%r"), /0?6:07:08/);
        assert.match(dt.text("%X"), /0?6:07:08/);
    });

    IT(`cdate().locale("ja-JP")`, () => {
        const dt = cdate(date).utc().locale("ja-JP");
        assert.equal(dt.text("%A = %a"), "水曜日 = 水");
        assert.equal(dt.text("%B = %b"), "4月 = 4月");
        assert.equal(dt.text("%p"), "午前");
        assert.equal(dt.text("%x"), "2023/04/05");
        assert.match(dt.text("%r"), /0?6:07:08/);
        assert.match(dt.text("%X"), /0?6:07:08/);
    });
});