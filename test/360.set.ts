#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import moment from "moment";

import {cdate} from "../index.js";

const TITLE = "360.set.ts";

describe(TITLE, () => {
    describe(`moment()`, () => runTests((dt) => moment(dt)));

    describe(`dayjs()`, () => runTests((dt) => dayjs(dt)));

    describe(`cdate()`, () => runTests((dt) => cdate(dt)));
});

function runTests(fn: (dt: Date) => { set: (unit: cdate.UnitForGet, value: number) => { format: (fmt: string) => string } }) {
    const dt = new Date("2022-01-31T01:02:03.004"); // local time

    it(`set("year")`, () => {
        (["year", "y"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 2020).format("YYYY-MM-DD HH:mm"), "2020-01-31 01:02");
            assert.equal(fn(dt).set(unit, 2021).format("YYYY-MM-DD HH:mm"), "2021-01-31 01:02");
            assert.equal(fn(dt).set(unit, 2022).format("YYYY-MM-DD HH:mm"), "2022-01-31 01:02");
        });
    });

    it(`set("month")`, () => {
        (["month", "M"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 0).format("YYYY-MM-DD HH:mm"), "2022-01-31 01:02");
            assert.equal(fn(dt).set(unit, 1).format("YYYY-MM-DD HH:mm"), "2022-02-28 01:02");
            assert.equal(fn(dt).set(unit, 2).format("YYYY-MM-DD HH:mm"), "2022-03-31 01:02");
            assert.equal(fn(dt).set(unit, 3).format("YYYY-MM-DD HH:mm"), "2022-04-30 01:02");
            assert.equal(fn(dt).set(unit, 4).format("YYYY-MM-DD HH:mm"), "2022-05-31 01:02");
            assert.equal(fn(dt).set(unit, 5).format("YYYY-MM-DD HH:mm"), "2022-06-30 01:02");
            assert.equal(fn(dt).set(unit, 6).format("YYYY-MM-DD HH:mm"), "2022-07-31 01:02");
            assert.equal(fn(dt).set(unit, 7).format("YYYY-MM-DD HH:mm"), "2022-08-31 01:02");
            assert.equal(fn(dt).set(unit, 8).format("YYYY-MM-DD HH:mm"), "2022-09-30 01:02");
            assert.equal(fn(dt).set(unit, 9).format("YYYY-MM-DD HH:mm"), "2022-10-31 01:02");
            assert.equal(fn(dt).set(unit, 10).format("YYYY-MM-DD HH:mm"), "2022-11-30 01:02");
            assert.equal(fn(dt).set(unit, 11).format("YYYY-MM-DD HH:mm"), "2022-12-31 01:02");
            assert.equal(fn(dt).set(unit, 12).format("YYYY-MM-DD HH:mm"), "2023-01-31 01:02");
        });
    });

    it(`set("date")`, () => {
        (["date", "D"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 1).format("YYYY-MM-DD HH:mm"), "2022-01-01 01:02");
            assert.equal(fn(dt).set(unit, 31).format("YYYY-MM-DD HH:mm"), "2022-01-31 01:02");
            assert.equal(fn(dt).set(unit, 32).format("YYYY-MM-DD HH:mm"), "2022-02-01 01:02");
        });
    });

    it(`set("day")`, () => {
        (["day", "d"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, -7).format("YYYY-MM-DD HH:mm"), "2022-01-23 01:02");
            assert.equal(fn(dt).set(unit, -6).format("YYYY-MM-DD HH:mm"), "2022-01-24 01:02");
            assert.equal(fn(dt).set(unit, -5).format("YYYY-MM-DD HH:mm"), "2022-01-25 01:02");
            assert.equal(fn(dt).set(unit, -4).format("YYYY-MM-DD HH:mm"), "2022-01-26 01:02");
            assert.equal(fn(dt).set(unit, -3).format("YYYY-MM-DD HH:mm"), "2022-01-27 01:02");
            assert.equal(fn(dt).set(unit, -2).format("YYYY-MM-DD HH:mm"), "2022-01-28 01:02");
            assert.equal(fn(dt).set(unit, -1).format("YYYY-MM-DD HH:mm"), "2022-01-29 01:02");
            assert.equal(fn(dt).set(unit, 0).format("YYYY-MM-DD HH:mm"), "2022-01-30 01:02"); // Sunday
            assert.equal(fn(dt).set(unit, 1).format("YYYY-MM-DD HH:mm"), "2022-01-31 01:02");
            assert.equal(fn(dt).set(unit, 2).format("YYYY-MM-DD HH:mm"), "2022-02-01 01:02");
            assert.equal(fn(dt).set(unit, 3).format("YYYY-MM-DD HH:mm"), "2022-02-02 01:02");
            assert.equal(fn(dt).set(unit, 4).format("YYYY-MM-DD HH:mm"), "2022-02-03 01:02");
            assert.equal(fn(dt).set(unit, 5).format("YYYY-MM-DD HH:mm"), "2022-02-04 01:02");
            assert.equal(fn(dt).set(unit, 6).format("YYYY-MM-DD HH:mm"), "2022-02-05 01:02");
            assert.equal(fn(dt).set(unit, 7).format("YYYY-MM-DD HH:mm"), "2022-02-06 01:02");
            assert.equal(fn(dt).set(unit, 8).format("YYYY-MM-DD HH:mm"), "2022-02-07 01:02");
        });
    });

    it(`set("hour")`, () => {
        (["hour", "h"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 0).format("YYYY-MM-DD HH:mm"), "2022-01-31 00:02");
            assert.equal(fn(dt).set(unit, 23).format("YYYY-MM-DD HH:mm"), "2022-01-31 23:02");
            assert.equal(fn(dt).set(unit, 24).format("YYYY-MM-DD HH:mm"), "2022-02-01 00:02");
        });
    });

    it(`set("minute")`, () => {
        (["minute", "m"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 0).format("HH:mm:ss.SSS"), "01:00:03.004");
            assert.equal(fn(dt).set(unit, 59).format("HH:mm:ss.SSS"), "01:59:03.004");
            assert.equal(fn(dt).set(unit, 60).format("HH:mm:ss.SSS"), "02:00:03.004");
        });
    });

    it(`set("second")`, () => {
        (["second", "s"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 0).format("HH:mm:ss.SSS"), "01:02:00.004");
            assert.equal(fn(dt).set(unit, 59).format("HH:mm:ss.SSS"), "01:02:59.004");
            assert.equal(fn(dt).set(unit, 60).format("HH:mm:ss.SSS"), "01:03:00.004");
        });
    });

    it(`set("millisecond")`, () => {
        (["millisecond", "ms"] as const).forEach(unit => {
            assert.equal(fn(dt).set(unit, 0).format("HH:mm:ss.SSS"), "01:02:03.000");
            assert.equal(fn(dt).set(unit, 999).format("HH:mm:ss.SSS"), "01:02:03.999");
            assert.equal(fn(dt).set(unit, 1000).format("HH:mm:ss.SSS"), "01:02:04.000");
        });
    });

    it(`set("INVALID")`, () => {
        (["INVALID"] as unknown as cdate.UnitForGet[]).forEach((unit) => {
            assert.equal(+fn(dt).set(unit, -1), +dt);
            assert.equal(+fn(dt).set(unit, 0), +dt);
            assert.equal(+fn(dt).set(unit, 1), +dt);
        });
    });
}
