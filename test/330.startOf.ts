#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cDate} from "../";
import * as dayjs from "dayjs";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe(`dayjs`, () => {
        runTests((dt, unit: any) => dayjs(dt).startOf(unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate`, () => {
        runTests((dt, unit: any) => cDate(dt).startOf(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: string) => string) {
    const dt1 = new Date("2023/01/01 00:00:00.000");
    const dt2 = new Date("2023/04/05 06:07:08.090");
    const dt3 = new Date("2023/12/31 23:59:59.999");

    it(`startOf("year")`, () => {
        ["year"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/01/01 00:00:00.000");
        });
    });

    it(`startOf("month")`, () => {
        ["month"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/01 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/01 00:00:00.000");
        });
    });

    it(`startOf("week")`, () => {
        ["week"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/02 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 00:00:00.000");
        });
    });

    it(`startOf("day")`, () => {
        ["day"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 00:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 00:00:00.000");
        });
    });

    it(`startOf("hour")`, () => {
        ["hour"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:00:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 23:00:00.000");
        });
    });

    it(`startOf("minute")`, () => {
        ["minute"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:00.000");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:00.000");
        });
    });

    it(`startOf("second")`, () => {
        ["second"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:08.000");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.000");
        });
    });
}
