#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../index.js";

const TITLE = "200.cdate.ts";

describe(TITLE, () => {
    const date = new Date("2023-04-05 06:07:08.090");

    it(`cdate(number)`, () => {
        const dt = cdate(+date);
        assert.equal(+dt, +date);
        assert.ok(dt.toDate() instanceof Date, ".date()");
        assert.equal(+dt.toDate(), +date, ".date()");
    });

    it(`cdate(Date)`, () => {
        const dt = cdate(date);
        assert.equal(+dt, +date);
    });

    it(`cdate(string)`, () => {
        const dt = cdate((date).toJSON());
        assert.equal(+dt, +date);
    });

    it(`cdate().text()`, () => {
        assert.equal(cdate(date).text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.090");

        // .text() does display milliseconds per default
        assert.match(cdate(date).text(), /^2023-04-05T06:07:08\.090[+-][012][0-9]:?[0-5][0-9]$/);
    });

    it(`cdate().toJSON()`, () => {
        assert.equal(cdate(date).toJSON(), date.toJSON());
        assert.equal(JSON.stringify(cdate(date)), JSON.stringify(date));
    });

    it(`cdate(invalid)`, () => {
        const dt = cdate("");
        assert.equal(String(+dt), String(NaN));
        assert.equal(dt.format(), "Invalid Date");
        assert.equal(dt.text(), "Invalid Date");
    });

    it(`cdate(ISODate)`, () => {
        // YYYY-MM-DD as is
        assert.equal(cdate("2023-04-05").text("%Y-%m-%d %H:%M:%S"), "2023-04-05 00:00:00");
        // YYYY-MM for YYYY-MM-01
        assert.equal(cdate("2023-04").text("%Y-%m-%d %H:%M:%S"), "2023-04-01 00:00:00");
        // YYYY for YYYY-01-01
        assert.equal(cdate("2023").text("%Y-%m-%d %H:%M:%S"), "2023-01-01 00:00:00");

        // more
        assert.equal(cdate("0001-01-01").text("%Y-%m-%d %H:%M:%S"), "0001-01-01 00:00:00");
        assert.equal(cdate("0099-01-01").text("%Y-%m-%d %H:%M:%S"), "0099-01-01 00:00:00");
        assert.equal(cdate("0100-01-01").text("%Y-%m-%d %H:%M:%S"), "0100-01-01 00:00:00");
        assert.equal(cdate("1900-01-01").text("%Y-%m-%d %H:%M:%S"), "1900-01-01 00:00:00");
        assert.equal(cdate("1999-01-01").text("%Y-%m-%d %H:%M:%S"), "1999-01-01 00:00:00");
        assert.equal(cdate("2000-01-01").text("%Y-%m-%d %H:%M:%S"), "2000-01-01 00:00:00");
    });
});
