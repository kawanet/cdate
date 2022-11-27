#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cDate} from "../";
import * as dayjs from "dayjs";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe(`dayjs`, () => {
        runTests((dt, unit: any) => dayjs(dt).add(-1, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate`, () => {
        runTests((dt, unit: any) => cDate(dt).prev(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: string) => string) {
    const dt1 = new Date("2023/01/01 00:00:00.000");
    const dt2 = new Date("2023/04/05 06:07:08.090");
    const dt3 = new Date("2023/12/31 23:59:59.999");

    it(`prev("year")`, () => {
        ["year"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/01/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2022/04/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2022/12/31 23:59:59.999");
        });
    });

    it(`prev("month")`, () => {
        ["month"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/01 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/03/05 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/11/30 23:59:59.999");
        });
    });

    it(`prev("week")`, () => {
        ["week"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/25 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/03/29 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/24 23:59:59.999");
        });
    });

    it(`prev("day")`, () => {
        ["day"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 00:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/04 06:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/30 23:59:59.999");
        });
    });

    it(`prev("hour")`, () => {
        ["hour"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 23:00:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 05:07:08.090");
            assert.equal(fn(dt3, unit), "2023/12/31 22:59:59.999");
        });
    });

    it(`prev("minute")`, () => {
        ["minute"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 23:59:00.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:06:08.090");
            assert.equal(fn(dt3, unit), "2023/12/31 23:58:59.999");
        });
    });

    it(`prev("second")`, () => {
        ["second"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2022/12/31 23:59:59.000");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:07.090");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:58.999");
        });
    });
}
