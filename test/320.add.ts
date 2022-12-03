#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as dayjs from "dayjs";
import * as moment from "moment";

import {cdate, cdateNS} from "../";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe(`moment().add()`, () => {
        runTests((dt, diff, unit) => moment(dt).add(diff, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`dayjs().add()`, () => {
        runTests((dt, diff, unit) => dayjs(dt).add(diff, unit).format("YYYY/MM/DD HH:mm:ss.SSS"));
    });

    describe(`cdate().add()`, () => {
        runTests((dt, diff, unit) => cdate(dt).add(diff, unit).text("%Y/%m/%d %H:%M:%S.%L"));
    });
});

function runTests(fn: (dt: Date, diff: number, unit: cdateNS.UnitForAdd) => string) {
    const dt = new Date("2023/12/31 23:59:59.999");

    it(`add(number, "year")`, () => {
        (["year", "years", "y"] as const).forEach(unit => {
            assert.equal(fn(dt, -10, unit), "2013/12/31 23:59:59.999");
            assert.equal(fn(dt, -9, unit), "2014/12/31 23:59:59.999");
            assert.equal(fn(dt, -8, unit), "2015/12/31 23:59:59.999");
            assert.equal(fn(dt, -7, unit), "2016/12/31 23:59:59.999");
            assert.equal(fn(dt, -6, unit), "2017/12/31 23:59:59.999");
            assert.equal(fn(dt, -5, unit), "2018/12/31 23:59:59.999");
            assert.equal(fn(dt, -4, unit), "2019/12/31 23:59:59.999");
            assert.equal(fn(dt, -3, unit), "2020/12/31 23:59:59.999");
            assert.equal(fn(dt, -2, unit), "2021/12/31 23:59:59.999");
            assert.equal(fn(dt, -1, unit), "2022/12/31 23:59:59.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/12/31 23:59:59.999");
            assert.equal(fn(dt, 2, unit), "2025/12/31 23:59:59.999");
            assert.equal(fn(dt, 3, unit), "2026/12/31 23:59:59.999");
            assert.equal(fn(dt, 4, unit), "2027/12/31 23:59:59.999");
            assert.equal(fn(dt, 5, unit), "2028/12/31 23:59:59.999");
            assert.equal(fn(dt, 6, unit), "2029/12/31 23:59:59.999");
            assert.equal(fn(dt, 7, unit), "2030/12/31 23:59:59.999");
            assert.equal(fn(dt, 8, unit), "2031/12/31 23:59:59.999");
            assert.equal(fn(dt, 9, unit), "2032/12/31 23:59:59.999");
            assert.equal(fn(dt, 10, unit), "2033/12/31 23:59:59.999");
        });
    });

    it(`add(number, "year") // leap year`, () => {
        (["year"] as const).forEach(unit => {
            const dt = new Date("2024/02/29 12:34:56.789");
            assert.equal(fn(dt, -8, unit), "2016/02/29 12:34:56.789");
            assert.equal(fn(dt, -7, unit), "2017/02/28 12:34:56.789");
            assert.equal(fn(dt, -6, unit), "2018/02/28 12:34:56.789");
            assert.equal(fn(dt, -5, unit), "2019/02/28 12:34:56.789");
            assert.equal(fn(dt, -4, unit), "2020/02/29 12:34:56.789");
            assert.equal(fn(dt, -3, unit), "2021/02/28 12:34:56.789");
            assert.equal(fn(dt, -2, unit), "2022/02/28 12:34:56.789");
            assert.equal(fn(dt, -1, unit), "2023/02/28 12:34:56.789");
            assert.equal(fn(dt, 0, unit), "2024/02/29 12:34:56.789");
            assert.equal(fn(dt, 1, unit), "2025/02/28 12:34:56.789");
            assert.equal(fn(dt, 2, unit), "2026/02/28 12:34:56.789");
            assert.equal(fn(dt, 3, unit), "2027/02/28 12:34:56.789");
            assert.equal(fn(dt, 4, unit), "2028/02/29 12:34:56.789");
            assert.equal(fn(dt, 5, unit), "2029/02/28 12:34:56.789");
            assert.equal(fn(dt, 6, unit), "2030/02/28 12:34:56.789");
            assert.equal(fn(dt, 7, unit), "2031/02/28 12:34:56.789");
            assert.equal(fn(dt, 8, unit), "2032/02/29 12:34:56.789");
        });
    });

    it(`add(number, "month")`, () => {
        (["month", "months", "M"] as const).forEach(unit => {
            assert.equal(fn(dt, -12, unit), "2022/12/31 23:59:59.999");
            assert.equal(fn(dt, -11, unit), "2023/01/31 23:59:59.999");
            assert.equal(fn(dt, -10, unit), "2023/02/28 23:59:59.999");
            assert.equal(fn(dt, -9, unit), "2023/03/31 23:59:59.999");
            assert.equal(fn(dt, -8, unit), "2023/04/30 23:59:59.999");
            assert.equal(fn(dt, -7, unit), "2023/05/31 23:59:59.999");
            assert.equal(fn(dt, -6, unit), "2023/06/30 23:59:59.999");
            assert.equal(fn(dt, -5, unit), "2023/07/31 23:59:59.999");
            assert.equal(fn(dt, -4, unit), "2023/08/31 23:59:59.999");
            assert.equal(fn(dt, -3, unit), "2023/09/30 23:59:59.999");
            assert.equal(fn(dt, -2, unit), "2023/10/31 23:59:59.999");
            assert.equal(fn(dt, -1, unit), "2023/11/30 23:59:59.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/01/31 23:59:59.999");
            assert.equal(fn(dt, 2, unit), "2024/02/29 23:59:59.999");
            assert.equal(fn(dt, 3, unit), "2024/03/31 23:59:59.999");
            assert.equal(fn(dt, 4, unit), "2024/04/30 23:59:59.999");
            assert.equal(fn(dt, 5, unit), "2024/05/31 23:59:59.999");
            assert.equal(fn(dt, 6, unit), "2024/06/30 23:59:59.999");
            assert.equal(fn(dt, 7, unit), "2024/07/31 23:59:59.999");
            assert.equal(fn(dt, 8, unit), "2024/08/31 23:59:59.999");
            assert.equal(fn(dt, 9, unit), "2024/09/30 23:59:59.999");
            assert.equal(fn(dt, 10, unit), "2024/10/31 23:59:59.999");
            assert.equal(fn(dt, 11, unit), "2024/11/30 23:59:59.999");
            assert.equal(fn(dt, 12, unit), "2024/12/31 23:59:59.999");
            assert.equal(fn(dt, 13, unit), "2025/01/31 23:59:59.999");
        });
    });

    it(`add(number, "week")`, () => {
        (["week", "weeks", "w"] as const).forEach(unit => {
            assert.equal(fn(dt, -5, unit), "2023/11/26 23:59:59.999");
            assert.equal(fn(dt, -4, unit), "2023/12/03 23:59:59.999");
            assert.equal(fn(dt, -3, unit), "2023/12/10 23:59:59.999");
            assert.equal(fn(dt, -2, unit), "2023/12/17 23:59:59.999");
            assert.equal(fn(dt, -1, unit), "2023/12/24 23:59:59.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/01/07 23:59:59.999");
            assert.equal(fn(dt, 2, unit), "2024/01/14 23:59:59.999");
            assert.equal(fn(dt, 3, unit), "2024/01/21 23:59:59.999");
            assert.equal(fn(dt, 4, unit), "2024/01/28 23:59:59.999");
            assert.equal(fn(dt, 5, unit), "2024/02/04 23:59:59.999");
            assert.equal(fn(dt, 6, unit), "2024/02/11 23:59:59.999");
            assert.equal(fn(dt, 7, unit), "2024/02/18 23:59:59.999");
            assert.equal(fn(dt, 8, unit), "2024/02/25 23:59:59.999");
            assert.equal(fn(dt, 9, unit), "2024/03/03 23:59:59.999");
            assert.equal(fn(dt, 10, unit), "2024/03/10 23:59:59.999");
        });
    });

    it(`add(number, "day")`, () => {
        (["day", "days", "d"] as const).forEach(unit => {
            assert.equal(fn(dt, -5, unit), "2023/12/26 23:59:59.999");
            assert.equal(fn(dt, -4, unit), "2023/12/27 23:59:59.999");
            assert.equal(fn(dt, -3, unit), "2023/12/28 23:59:59.999");
            assert.equal(fn(dt, -2, unit), "2023/12/29 23:59:59.999");
            assert.equal(fn(dt, -1, unit), "2023/12/30 23:59:59.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/01/01 23:59:59.999");
            assert.equal(fn(dt, 2, unit), "2024/01/02 23:59:59.999");
            assert.equal(fn(dt, 3, unit), "2024/01/03 23:59:59.999");
            assert.equal(fn(dt, 4, unit), "2024/01/04 23:59:59.999");
            assert.equal(fn(dt, 5, unit), "2024/01/05 23:59:59.999");
        });
    });

    it(`add(number, "hour")`, () => {
        (["hour", "hours", "h"] as const).forEach(unit => {
            assert.equal(fn(dt, -5, unit), "2023/12/31 18:59:59.999");
            assert.equal(fn(dt, -4, unit), "2023/12/31 19:59:59.999");
            assert.equal(fn(dt, -3, unit), "2023/12/31 20:59:59.999");
            assert.equal(fn(dt, -2, unit), "2023/12/31 21:59:59.999");
            assert.equal(fn(dt, -1, unit), "2023/12/31 22:59:59.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/01/01 00:59:59.999");
            assert.equal(fn(dt, 2, unit), "2024/01/01 01:59:59.999");
            assert.equal(fn(dt, 3, unit), "2024/01/01 02:59:59.999");
            assert.equal(fn(dt, 4, unit), "2024/01/01 03:59:59.999");
            assert.equal(fn(dt, 5, unit), "2024/01/01 04:59:59.999");
        });
    });

    it(`add(number, "minute")`, () => {
        (["minute", "minutes", "m"] as const).forEach(unit => {
            assert.equal(fn(dt, -5, unit), "2023/12/31 23:54:59.999");
            assert.equal(fn(dt, -4, unit), "2023/12/31 23:55:59.999");
            assert.equal(fn(dt, -3, unit), "2023/12/31 23:56:59.999");
            assert.equal(fn(dt, -2, unit), "2023/12/31 23:57:59.999");
            assert.equal(fn(dt, -1, unit), "2023/12/31 23:58:59.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/01/01 00:00:59.999");
            assert.equal(fn(dt, 2, unit), "2024/01/01 00:01:59.999");
            assert.equal(fn(dt, 3, unit), "2024/01/01 00:02:59.999");
            assert.equal(fn(dt, 4, unit), "2024/01/01 00:03:59.999");
            assert.equal(fn(dt, 5, unit), "2024/01/01 00:04:59.999");
        });
    });

    it(`add(number, "second")`, () => {
        (["second", "seconds", "s"] as const).forEach(unit => {
            assert.equal(fn(dt, -5, unit), "2023/12/31 23:59:54.999");
            assert.equal(fn(dt, -4, unit), "2023/12/31 23:59:55.999");
            assert.equal(fn(dt, -3, unit), "2023/12/31 23:59:56.999");
            assert.equal(fn(dt, -2, unit), "2023/12/31 23:59:57.999");
            assert.equal(fn(dt, -1, unit), "2023/12/31 23:59:58.999");
            assert.equal(fn(dt, 0, unit), "2023/12/31 23:59:59.999");
            assert.equal(fn(dt, 1, unit), "2024/01/01 00:00:00.999");
            assert.equal(fn(dt, 2, unit), "2024/01/01 00:00:01.999");
            assert.equal(fn(dt, 3, unit), "2024/01/01 00:00:02.999");
            assert.equal(fn(dt, 4, unit), "2024/01/01 00:00:03.999");
            assert.equal(fn(dt, 5, unit), "2024/01/01 00:00:04.999");
        });
    });
}
