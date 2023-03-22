#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import moment from "moment";

import {cdate} from "../index.js";

const TITLE = "310.prev.ts";

describe(TITLE, () => {
    describe(`moment().subtract()`, () => {
        runTests((dt, unit) => moment(dt).subtract(1, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`dayjs().subtract()`, () => {
        runTests((dt, unit) => dayjs(dt).subtract(1, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate().prev()`, () => {
        runTests((dt, unit) => cdate(dt).prev(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: cdate.UnitForNext) => string) {
    const dt1 = new Date("2023-01-01T00:00:00.000"); // local time
    const dt2 = new Date("2023-04-05T06:07:08.090");
    const dt3 = new Date("2023-12-31T23:59:59.999");

    it(`prev("year")`, () => {
        (["year"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2022/04/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2022/12/31 23:59:59.999");
        });
    });

    it(`prev("month")`, () => {
        (["month"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/03/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/11/30 23:59:59.999");
        });
    });

    it(`prev("week")`, () => {
        (["week"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/25 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/03/29 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/24 23:59:59.999");
        });
    });

    it(`prev("day")`, () => {
        (["day"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/04 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/30 23:59:59.999");
        });
    });

    it(`prev("hour")`, () => {
        (["hour"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 23:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 05:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/31 22:59:59.999");
        });
    });

    it(`prev("minute")`, () => {
        (["minute"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 23:59:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:06:08.090");
            assert.equal(fn(dt3, unit), "2023/12/31 23:58:59.999");
        });
    });

    it(`prev("second")`, () => {
        (["second"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 23:59:59.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:07.090");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:58.999");
        });
    });
}
