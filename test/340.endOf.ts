#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../";
import * as dayjs from "dayjs";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe(`dayjs`, () => {
        runTests((dt, unit: any) => dayjs(dt).endOf(unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate`, () => {
        runTests((dt, unit: any) => cdate(dt).endOf(unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, unit: string) => string) {
    const dt1 = new Date("2023/01/01 00:00:00.000");
    const dt2 = new Date("2023/04/05 06:07:08.090");
    const dt3 = new Date("2023/12/31 23:59:59.999");

    it(`endOf("year")`, () => {
        ["year"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("month")`, () => {
        ["month"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/31 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/30 23:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("week")`, () => {
        ["week"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/07 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/08 23:59:59.999");
            assert.equal(fn(dt3, unit), "2024/01/06 23:59:59.999");
        });
    });

    it(`endOf("day")`, () => {
        ["day"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 23:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/05 23:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("hour")`, () => {
        ["hour"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:59:59.999");
            assert.equal(fn(dt2, unit), "2023/04/05 06:59:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("minute")`, () => {
        ["minute"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:59.999");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:59.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });

    it(`endOf("second")`, () => {
        ["second"].forEach(unit => {
            assert.equal(fn(dt1, unit), "2023/01/01 00:00:00.999");
            assert.equal(fn(dt2, unit), "2023/04/05 06:07:08.999");
            assert.equal(fn(dt3, unit), "2023/12/31 23:59:59.999");
        });
    });
}
