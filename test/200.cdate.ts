#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    const date = new Date("2023/04/05 06:07:08.090");

    it(`cdate(number)`, () => {
        const dt = cdate(+date);
        assert.equal(+dt, +date);
        assert.equal(dt.valueOf(), date.valueOf(), ".valueOf()");
        assert.ok(dt.date() instanceof Date, ".date()");
        assert.equal(+dt.date(), +date, ".date()");
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
    });

    it(`cdate().toJSON()`, () => {
        assert.equal(cdate(date).toJSON(), date.toJSON());
        assert.equal(JSON.stringify(cdate(date)), JSON.stringify(date));
    });

    it(`cdate().toString()`, () => {
        assert.match(cdate(date).toString(), /^2023-04-05T06:07:08\.090[+-][012][0-9]:?[0-5][0-9]$/);
    });
});
