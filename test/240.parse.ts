#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../index.js";

const TITLE = "240.parse.ts";

describe(TITLE, () => {
    // Local time
    it(`cdate()`, () => {
        runTests(cdate().cdateFn(), null);
    });

    // UTC
    it(`cdate().utc()`, () => {
        runTests(cdate().utc().cdateFn(), "+00:00");
    });

    // Gulf Standard Time (GST)
    it(`cdate().utcOffset(4)`, () => {
        runTests(cdate().utcOffset(4).cdateFn(), "+04:00");
    });

    it(`cdate().tz("Asia/Dubai")`, () => {
        runTests(cdate().tz("Asia/Dubai").cdateFn(), "+04:00");
    });

    // Eastern Standard Time (EST)
    it(`cdate().utcOffset(-5)`, () => {
        runTests(cdate().utcOffset(-5).cdateFn(), "-05:00");
    });

    it(`cdate().tz("America/Panama")`, () => {
        runTests(cdate().tz("America/Panama").cdateFn(), "-05:00");
    });

    /**
     * Clock Changes in Los Angeles, California, USA 2022
     * Sunday, 13 March 2022, 02:00:00 clocks were turned forward 1 hour to
     * Sunday, 13 March 2022, 03:00:00 local daylight time instead.
     * Sunday, 6 November 2022, 02:00:00 clocks were turned backward 1 hour to
     * Sunday, 6 November 2022, 01:00:00 local standard time instead.
     * @see https://www.timeanddate.com/time/change/usa/los-angeles?year=2022
     */
    it(`cdate().tz("America/Los_Angeles")`, () => {
        runTests(cdate().tz("America/Los_Angeles").cdateFn(), null);
    });

    function runTests(cdateFn: cdate.cdate, tzo: string) {
        if (tzo) {
            assert.equal(cdateFn().text("%:z"), tzo);
        }

        assert.equal(cdateFn("2023-04-05T06:07:08.009").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.009");
        assert.equal(cdateFn("2023-04-05T06:07:08.09").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.090");
        assert.equal(cdateFn("2023-04-05T06:07:08.9").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.900");
        assert.equal(cdateFn("2023-04-05T06:07:08").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.000");
        assert.equal(cdateFn("2023-04-05T06:07").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:00.000");

        // YYYY-MM-DD as is
        assert.equal(cdateFn("2023-04-05").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 00:00:00.000");

        // YYYY-MM for YYYY-MM-01
        assert.equal(cdateFn("2023-04").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-01 00:00:00.000");

        // YYYY for YYYY-01-01
        assert.equal(cdateFn("2023").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-01 00:00:00.000");

        // more
        assert.equal(cdateFn("0001-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "0001-01-01 00:00:00.000");
        assert.equal(cdateFn("0099-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "0099-01-01 00:00:00.000");
        assert.equal(cdateFn("0100-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "0100-01-01 00:00:00.000");
        assert.equal(cdateFn("1900-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "1900-01-01 00:00:00.000");
        assert.equal(cdateFn("1999-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "1999-01-01 00:00:00.000");
        assert.equal(cdateFn("2000-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "2000-01-01 00:00:00.000");

        // far future
        assert.equal(cdateFn("9999-12-30").text("%Y-%m-%d %H:%M:%S.%L"), "9999-12-30 00:00:00.000");
        assert.equal(cdateFn("+9999-12-31").text("%Y-%m-%d %H:%M:%S.%L"), "9999-12-31 00:00:00.000");
        assert.equal(cdateFn("+010000-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "+010000-01-01 00:00:00.000");
        assert.equal(cdateFn("+271821-01-01").text("%Y-%m-%d %H:%M:%S.%L"), "+271821-01-01 00:00:00.000");

        // MySQL DATETIME does not have separator "T"
        assert.equal(cdateFn("2023-04-05 06:07:08").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.000");

        // Clock Changes in Los Angeles
        assert.equal(cdateFn("2022-03-13 01:59:59.999").text("%Y-%m-%d %H:%M:%S.%L"), "2022-03-13 01:59:59.999");
        assert.equal(cdateFn("2022-03-13 03:00:00.001").text("%Y-%m-%d %H:%M:%S.%L"), "2022-03-13 03:00:00.001");
        assert.equal(cdateFn("2022-11-06 00:59:59.999").text("%Y-%m-%d %H:%M:%S.%L"), "2022-11-06 00:59:59.999");
        assert.equal(cdateFn("2022-11-06 02:00:00.001").text("%Y-%m-%d %H:%M:%S.%L"), "2022-11-06 02:00:00.001");

        // Loose formats
        // @see https://github.com/kawanet/cdate/issues/5
        assert.equal(cdateFn("2023-1-2").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-02 00:00:00.000");
        assert.equal(cdateFn("2023-1-3 3:4:5").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-03 03:04:05.000");
        assert.equal(cdateFn("2023-1-004 005:006:007").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-04 05:06:07.000");
        assert.equal(cdateFn("2023/1/5").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-05 00:00:00.000");
        assert.equal(cdateFn("2023/1/6 7:8:9").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-06 07:08:09.000");
        assert.equal(cdateFn("2023/001/007 008:009:010").text("%Y-%m-%d %H:%M:%S.%L"), "2023-01-07 08:09:10.000");
    }
});
