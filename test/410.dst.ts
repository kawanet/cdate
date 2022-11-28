#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cDate} from "../";
import * as dayjs from "dayjs";

import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Standard Time (STD)
 const STD = {
    "Asia/Tokyo": "+0900",
    "Europe/London": "+0000", // BST - British Summer Time
    "America/St_Johns": "-0330", // NDT - Newfoundland Time Zone DST
    "America/Los_Angeles": "-0800", // PDT - Pacific Time Zone DST
};
 */


/**
 * Daylight Saving Time (DST)
 */
const DST = {
    "Asia/Tokyo": "+0900",
    "Europe/London": "+0100", // BST - British Summer Time
    "America/St_Johns": "-0230", // NDT - Newfoundland Time Zone DST
    "America/Los_Angeles": "-0700", // PDT - Pacific Time Zone DST
};

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    const dt = new Date("2022/03/13 03:00:01 -07:00");
    const format = "YYYY/MM/DD HH:mm:ss Z";
    const text = "%Y/%m/%d %H:%M:%S %:z";
    const TZ = "America/Los_Angeles";

    it(`dayjs`, () => {
        const date = dayjs(dt).tz(TZ);
        assert.equal(date.format(format), "2022/03/13 03:00:01 -07:00");

        // TODO
        // assert.equal(date.add(-2, "second").tz(TZ).format(format), "2022/03/13 01:59:59 -08:00");
    });

    it(`cDate`, () => {
        const date = cDate(dt).timezone(DST[TZ]);

        assert.equal(date.text(text), "2022/03/13 03:00:01 -07:00");

        // TODO
        // assert.equal(date.add(-2, "second").text(text), "2022/03/13 01:59:59 -08:00");
    });
});
