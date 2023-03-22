#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import moment from "moment";

import {cdate} from "../index.js";

const TITLE = "340.endOf.ts";

describe(TITLE, () => {
    describe(`moment().endOf()`, () => {
        runTests((dt, unit) => moment(dt).endOf(unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`dayjs().endOf()`, () => {
        runTests((dt, unit) => dayjs(dt).endOf(unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate().endOf()`, () => {
        runTests((dt, unit) => cdate(dt).endOf(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: cdate.UnitForStart) => string) {
    const dt1 = new Date("2023-01-01T00:00:00.000"); // local time
    const dt2 = new Date("2023-04-05T06:07:08.090");
    const dt3 = new Date("2023-12-31T23:59:59.999");

    it(`endOf("year")`, () => {
        (["year", "y"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("month")`, () => {
        (["month", "M"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/31 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/30 23:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("week")`, () => {
        (["week", "w"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/07 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/08 23:59:59.999");
            assert.equal(fn(dt3, unit), "2024/01/06 23:59:59.999");
        });
    });

    it(`endOf("day")`, () => {
        (["day", "d"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/05 23:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("hour")`, () => {
        (["hour", "h"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/05 06:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("minute")`, () => {
        (["minute", "m"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:59.999");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("second")`, () => {
        (["second", "s"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.999");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:08.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("millisecond")`, () => {
        (["millisecond", "milliseconds", "ms"] as unknown as cdate.UnitForStart[]).forEach((unit) => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("INVALID")`, () => {
        (["INVALID"] as unknown as cdate.UnitForStart[]).forEach((unit) => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });
}
