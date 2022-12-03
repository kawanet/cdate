#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

import {cdate} from "../";

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Standard Time (STD)
 */
const STD = {
    "Asia/Tokyo": "+0900", // Japan Standard Time (JST)
    "Europe/London": "+0000", // Greenwich Mean Time (GMT)
    "America/St_Johns": "-0330", // Newfoundland Standard Time (NST)
    "America/Los_Angeles": "-0800", // Pacific Standard Time (PST)
};

/**
 * Daylight Saving Time (DST)
 */
const DST = {
    "Asia/Tokyo": "+0900", // Japan Standard Time (JST)
    "Europe/London": "+0100", // British Summer Time (BST)
    "America/St_Johns": "-0230", // Newfoundland Daylight Time (NDT)
    "America/Los_Angeles": "-0700", // Pacific Daylight Time (PDT)
};

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    const dt = new Date("2022/03/13 03:00:01 -07:00");
    const format = "YYYY/MM/DD HH:mm:ss Z";
    const text = "%Y/%m/%d %H:%M:%S %:z";
    const TZ = "America/Los_Angeles";

    /**
     * we need to skip the test below because the dayjs has a bug.
     * @see https://github.com/iamkun/dayjs/issues/2152
     */
    const IT = (process.env.TZ === "Asia/Tokyo") ? it : it.skip;

    IT(`dayjs().tz(name)`, () => {
        const date = dayjs(dt).tz(TZ);
        assert.equal(date.format(format), "2022/03/13 03:00:01 -07:00");

        assert.equal(date.add(-2, "second").format(format), "2022/03/13 02:59:59 -07:00");
        assert.equal(date.add(-2, "second").tz(TZ).format(format), "2022/03/13 01:59:59 -08:00");

        assert.equal(date.add(-1, "minute").format(format), "2022/03/13 02:59:01 -07:00");
        assert.equal(date.add(-1, "minute").tz(TZ).format(format), "2022/03/13 01:59:01 -08:00");

        assert.equal(date.add(-1, "hour").format(format), "2022/03/13 02:00:01 -07:00");
        assert.equal(date.add(-1, "hour").tz(TZ).format(format), "2022/03/13 01:00:01 -08:00");

        assert.equal(date.add(-1, "day").format(format), "2022/03/12 03:00:01 -07:00");
        assert.equal(date.add(-1, "day").tz(TZ).format(format), "2022/03/12 02:00:01 -08:00");

        assert.equal(date.add(-1, "month").format(format), "2022/02/13 03:00:01 -07:00");
        assert.equal(date.add(-1, "month").tz(TZ).format(format), "2022/02/13 02:00:01 -08:00");

        assert.equal(date.add(-1, "year").format(format), "2021/03/13 03:00:01 -07:00");
        assert.equal(date.add(-1, "year").tz(TZ).format(format), "2021/03/13 02:00:01 -08:00");

        assert.equal(date.startOf("day").format(format), "2022/03/13 00:00:00 -08:00"); // TZ changed
        assert.equal(date.startOf("day").tz(TZ).format(format), "2022/03/13 00:00:00 -08:00");

        assert.equal(date.startOf("month").format(format), "2022/03/01 00:00:00 -08:00"); // TZ changed
        assert.equal(date.startOf("month").tz(TZ).format(format), "2022/03/01 00:00:00 -08:00");

        assert.equal(date.startOf("year").format(format), "2022/01/01 00:00:00 -08:00"); // TZ changed
        assert.equal(date.startOf("year").tz(TZ).format(format), "2022/01/01 00:00:00 -08:00");

        assert.equal(date.endOf("day").format(format), "2022/03/13 23:59:59 -07:00");
        assert.equal(date.endOf("day").tz(TZ).format(format), "2022/03/13 23:59:59 -07:00");

        assert.equal(date.endOf("month").format(format), "2022/03/31 23:59:59 -07:00");
        assert.equal(date.endOf("month").tz(TZ).format(format), "2022/03/31 23:59:59 -07:00");

        assert.equal(date.endOf("year").format(format), "2022/12/31 23:59:59 -08:00"); // TZ changed
        assert.equal(date.endOf("year").tz(TZ).format(format), "2022/12/31 23:59:59 -08:00");
    });

    it(`cdate().tz(offset)`, () => {
        const date = cdate(dt).tz(DST[TZ]);
        assert.equal(date.text(text), "2022/03/13 03:00:01 -07:00");

        assert.equal(date.add(-2, "second").text(text), "2022/03/13 02:59:59 -07:00");
        assert.equal(date.add(-2, "second").tz(STD[TZ]).text(text), "2022/03/13 01:59:59 -08:00");

        assert.equal(date.add(-1, "minute").text(text), "2022/03/13 02:59:01 -07:00");
        assert.equal(date.add(-1, "minute").tz(STD[TZ]).text(text), "2022/03/13 01:59:01 -08:00");

        assert.equal(date.add(-1, "hour").text(text), "2022/03/13 02:00:01 -07:00");
        assert.equal(date.add(-1, "hour").tz(STD[TZ]).text(text), "2022/03/13 01:00:01 -08:00");

        assert.equal(date.add(-1, "day").text(text), "2022/03/12 03:00:01 -07:00");
        assert.equal(date.add(-1, "day").tz(STD[TZ]).text(text), "2022/03/12 02:00:01 -08:00");

        assert.equal(date.add(-1, "month").text(text), "2022/02/13 03:00:01 -07:00");
        assert.equal(date.add(-1, "month").tz(STD[TZ]).text(text), "2022/02/13 02:00:01 -08:00");

        assert.equal(date.add(-1, "year").text(text), "2021/03/13 03:00:01 -07:00");
        assert.equal(date.add(-1, "year").tz(STD[TZ]).text(text), "2021/03/13 02:00:01 -08:00");

        assert.equal(date.startOf("day").text(text), "2022/03/13 00:00:00 -07:00");
        // assert.equal(date.startOf("day").tz(STD[TZ]).text(text), "2022/03/12 23:00:00 -08:00"); // TZ changed

        assert.equal(date.startOf("month").text(text), "2022/03/01 00:00:00 -07:00");
        // assert.equal(date.startOf("month").tz(STD[TZ]).text(text), "2022/03/01 00:00:00 -08:00");

        assert.equal(date.startOf("year").text(text), "2022/01/01 00:00:00 -07:00");
        // assert.equal(date.startOf("year").tz(STD[TZ]).text(text), "2022/01/01 00:00:00 -08:00");

        assert.equal(date.endOf("day").text(text), "2022/03/13 23:59:59 -07:00");
        // assert.equal(date.endOf("day").tz(STD[TZ]).text(text), "2022/03/13 23:59:59 -07:00");

        assert.equal(date.endOf("month").text(text), "2022/03/31 23:59:59 -07:00");
        // assert.equal(date.endOf("month").tz(STD[TZ]).text(text), "2022/03/31 23:59:59 -07:00");

        assert.equal(date.endOf("year").text(text), "2022/12/31 23:59:59 -07:00");
        // assert.equal(date.endOf("year").tz(STD[TZ]).text(text), "2022/12/31 23:59:59 -08:00");
    });

    it(`cdate().tz(name)`, () => {
        const date = cdate(dt).tz(DST[TZ]);
        assert.equal(date.text(text), "2022/03/13 03:00:01 -07:00");

        assert.equal(date.add(-2, "second").text(text), "2022/03/13 02:59:59 -07:00");
        assert.equal(date.add(-2, "second").tz(TZ).text(text), "2022/03/13 01:59:59 -08:00");

        assert.equal(date.add(-1, "minute").text(text), "2022/03/13 02:59:01 -07:00");
        assert.equal(date.add(-1, "minute").tz(TZ).text(text), "2022/03/13 01:59:01 -08:00");

        assert.equal(date.add(-1, "hour").text(text), "2022/03/13 02:00:01 -07:00");
        assert.equal(date.add(-1, "hour").tz(TZ).text(text), "2022/03/13 01:00:01 -08:00");

        assert.equal(date.add(-1, "day").text(text), "2022/03/12 03:00:01 -07:00");
        assert.equal(date.add(-1, "day").tz(TZ).text(text), "2022/03/12 02:00:01 -08:00");

        assert.equal(date.add(-1, "month").text(text), "2022/02/13 03:00:01 -07:00");
        assert.equal(date.add(-1, "month").tz(TZ).text(text), "2022/02/13 02:00:01 -08:00");

        assert.equal(date.add(-1, "year").text(text), "2021/03/13 03:00:01 -07:00");
        assert.equal(date.add(-1, "year").tz(TZ).text(text), "2021/03/13 02:00:01 -08:00");

        assert.equal(date.startOf("day").text(text), "2022/03/13 00:00:00 -07:00");
        // assert.equal(date.startOf("day").tz(TZ).text(text), "2022/03/13 00:00:00 -08:00");

        assert.equal(date.startOf("month").text(text), "2022/03/01 00:00:00 -07:00");
        // assert.equal(date.startOf("month").tz(TZ).text(text), "2022/03/01 00:00:00 -08:00");

        assert.equal(date.startOf("year").text(text), "2022/01/01 00:00:00 -07:00");
        // assert.equal(date.startOf("year").tz(TZ).text(text), "2022/01/01 00:00:00 -08:00");

        assert.equal(date.endOf("day").text(text), "2022/03/13 23:59:59 -07:00");
        // assert.equal(date.endOf("day").tz(TZ).text(text), "2022/03/13 23:59:59 -07:00");

        assert.equal(date.endOf("month").text(text), "2022/03/31 23:59:59 -07:00");
        // assert.equal(date.endOf("month").tz(TZ).text(text), "2022/03/31 23:59:59 -07:00");

        assert.equal(date.endOf("year").text(text), "2022/12/31 23:59:59 -07:00");
        // assert.equal(date.endOf("year").tz(TZ).text(text), "2022/12/31 23:59:59 -08:00");
    });
});
