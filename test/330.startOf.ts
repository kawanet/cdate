#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as dayjs from "dayjs";
import * as moment from "moment";

import {cdate, cdateNS} from "../";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe(`moment().startOf()`, () => {
        runTests((dt, unit) => moment(dt).startOf(unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`dayjs().startOf()`, () => {
        runTests((dt, unit) => dayjs(dt).startOf(unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate().startOf()`, () => {
        runTests((dt, unit) => cdate(dt).startOf(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: cdateNS.UnitForStart) => string) {
    const dt1 = new Date("2023-01-01 00:00:00.000");
    const dt2 = new Date("2023-04-05 06:07:08.090");
    const dt3 = new Date("2023-12-31 23:59:59.999");

    it(`startOf("year")`, () => {
        (["year", "y"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/01/01 00:00:00.000");
        });
    });

    it(`startOf("month")`, () => {
        (["month", "M"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/01 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/01 00:00:00.000");
        });
    });

    it(`startOf("week")`, () => {
        (["week", "w"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/02 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 00:00:00.000");
        });
    });

    it(`startOf("day")`, () => {
        (["day", "d"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 00:00:00.000");
        });
    });

    it(`startOf("hour")`, () => {
        (["hour", "h"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 23:00:00.000");
        });
    });

    it(`startOf("minute")`, () => {
        (["minute", "m"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:00.000");
        });
    });

    it(`startOf("second")`, () => {
        (["second", "s"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:08.000");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.000");
        });
    });
}
