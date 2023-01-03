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

        // MySQL DATETIME does not have separator "T"
        assert.equal(cdateFn("2023-04-05 06:07:08").text("%Y-%m-%d %H:%M:%S.%L"), "2023-04-05 06:07:08.000");

        // Clock Changes in Los Angeles
        assert.equal(cdateFn("2022-03-13 01:59:59.999").text("%Y-%m-%d %H:%M:%S.%L"), "2022-03-13 01:59:59.999");
        assert.equal(cdateFn("2022-03-13 03:00:00.001").text("%Y-%m-%d %H:%M:%S.%L"), "2022-03-13 03:00:00.001");
        assert.equal(cdateFn("2022-11-06 00:59:59.999").text("%Y-%m-%d %H:%M:%S.%L"), "2022-11-06 00:59:59.999");
        assert.equal(cdateFn("2022-11-06 02:00:00.001").text("%Y-%m-%d %H:%M:%S.%L"), "2022-11-06 02:00:00.001");
    }
});
