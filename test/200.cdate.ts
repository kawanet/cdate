#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cDate} from "../";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    const date = new Date("2023/04/05 06:07:08.090");

    it(`cDate(number)`, () => {
        const dt = cDate(+date);
        assert.equal(+dt, +date);
        assert.equal(dt.valueOf(), date.valueOf(), ".valueOf()");
        assert.ok(dt.toDate() instanceof Date, ".date()");
        assert.equal(+dt.toDate(), +date, ".date()");
    });

    it(`cDate(Date)`, () => {
        const dt = cDate(date);
        assert.equal(+dt, +date);
    });

    it(`cDate(string)`, () => {
        const dt = cDate((date).toJSON());
        assert.equal(+dt, +date);
    });

    it(`cDate().text()`, () => {
        assert.equal(cDate(date).text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.090");
    });

    it(`cDate().toJSON()`, () => {
        assert.equal(cDate(date).toJSON(), date.toJSON());
        assert.equal(JSON.stringify(cDate(date)), JSON.stringify(date));
    });

    it(`cDate().toString()`, () => {
        assert.match(cDate(date).toString(), /^2023-04-05T06:07:08\.090[+-][012][0-9]:?[0-5][0-9]$/);
    });
});
