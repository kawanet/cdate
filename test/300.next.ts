#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import moment from "moment";

import {cdate} from "../index.js";
import type {cdateNS} from "../types/cdate";

const TITLE = "300.next.ts";

describe(TITLE, () => {
    describe(`moment().add()`, () => {
        runTests((dt, unit) => moment(dt).add(1, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`dayjs().add()`, () => {
        runTests((dt, unit) => dayjs(dt).add(1, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate().next()`, () => {
        runTests((dt, unit) => cdate(dt).next(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: cdateNS.UnitForNext) => string) {
    const dt1 = new Date("2023-01-01 00:00:00.000");
    const dt2 = new Date("2023-04-05 06:07:08.090");
    const dt3 = new Date("2023-12-31 23:59:59.999");

    it(`next("year")`, () => {
        (["year"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2024/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2024/04/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2024/12/31 23:59:59.999");
        });
    });

    it(`next("month")`, () => {
        (["month"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/02/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/05/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2024/01/31 23:59:59.999");
        });
    });

    it(`next("week")`, () => {
        (["week"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/08 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/12 06:07:08.090");
            assert.equal(fn(dt3, unit), "2024/01/07 23:59:59.999");
        });
    });

    it(`next("day")`, () => {
        (["day"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/02 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/06 06:07:08.090");
            assert.equal(fn(dt3, unit), "2024/01/01 23:59:59.999");
        });
    });

    it(`next("hour")`, () => {
        (["hour"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 01:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 07:07:08.090");
            assert.equal(fn(dt3, unit), "2024/01/01 00:59:59.999");
        });
    });

    it(`next("minute")`, () => {
        (["minute"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:01:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:08:08.090");
            assert.equal(fn(dt3, unit), "2024/01/01 00:00:59.999");
        });
    });

    it(`next("second")`, () => {
        (["second"] as const).forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:01.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:09.090");
            assert.equal(fn(dt3, unit), "2024/01/01 00:00:00.999");
        });
    });
}
