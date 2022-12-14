#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import moment from "moment";

import {cdate} from "../index.js";

const TITLE = "350.get.ts";

describe(TITLE, () => {
    describe(`moment()`, () => runTests((dt) => moment(dt)));

    describe(`dayjs()`, () => runTests((dt) => dayjs(dt)));

    describe(`cdate()`, () => runTests((dt) => cdate(dt)));
});


function runTests(fn: (dt: Date) => { get: (unit: cdate.UnitForGet) => number }) {
    const dt1 = new Date("2022-01-02 03:04:05.006");
    const dt2 = new Date("2022-12-31 23:59:58.999");

    it(`get("year")`, () => {
        (["year", "y"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 2022);
            assert.equal(fn(dt2).get(unit), 2022);
        });
    });

    it(`get("month")`, () => {
        (["month", "M"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 0);
            assert.equal(fn(dt2).get(unit), 11);
        });
    });

    it(`get("date")`, () => {
        (["date", "D"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 2);
            assert.equal(fn(dt2).get(unit), 31);
        });
    });

    it(`get("day")`, () => {
        (["day", "d"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 0); // Sunday
            assert.equal(fn(dt2).get(unit), 6);
        });
    });

    it(`get("hour")`, () => {
        (["hour", "h"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 3);
            assert.equal(fn(dt2).get(unit), 23);
        });
    });

    it(`get("minute")`, () => {
        (["minute", "m"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 4);
            assert.equal(fn(dt2).get(unit), 59);
        });
    });

    it(`get("second")`, () => {
        (["second", "s"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 5);
            assert.equal(fn(dt2).get(unit), 58);
        });
    });

    it(`get("millisecond")`, () => {
        (["millisecond", "ms"] as const).forEach(unit => {
            assert.equal(fn(dt1).get(unit), 6);
            assert.equal(fn(dt2).get(unit), 999);
        });
    });
}
