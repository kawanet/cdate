#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as dayjs from "dayjs";
import * as samsonjs_strftime from "strftime";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

import {cdate} from "../";

dayjs.extend(utc)
dayjs.extend(timezone)

const samsonjs = {strftime: samsonjs_strftime};

// UTC offset as of April 5th, 2023

const timezoneMap = {
    "Asia/Tokyo": "+0900",
    "Asia/Shanghai": "+0800",
    "Asia/Kathmandu": "+0545",
    "Europe/London": "+0100", // BST - British Summer Time
    "America/St_Johns": "-0230", // NDT - Newfoundland Time Zone DST
    "America/Sao_Paulo": "-0300",
    "America/Los_Angeles": "-0700", // PDT - Pacific Time Zone DST
    "Pacific/Niue": "-1100",
    "Pacific/Kiritimati": "+1400",
};

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe(`dayjs().tz(name)`, () => {
        runTests((dt, tz) => dayjs(dt).tz(tz).format("YYYY/MM/DD HH:mm:ss.SSS Z"));
    });

    describe(`samsonjs/strftime.timezone(offset)`, () => {
        runTests((dt, tz) => samsonjs.strftime.timezone(timezoneMap[tz])("%Y/%m/%d %H:%M:%S.%L %:z", dt));
    });

    describe(`cdate().timezone(offset)`, () => {
        runTests((dt, tz) => cdate(dt).tz(timezoneMap[tz]).text("%Y/%m/%d %H:%M:%S.%L %:z"));
    });

    describe(`cdate().timezone(name)`, () => {
        runTests((dt, tz) => cdate(dt).tz(tz).text("%Y/%m/%d %H:%M:%S.%L %:z"));
    });
});

function runTests(fn: (dt: Date, tz: keyof typeof timezoneMap) => string) {
    const dt = new Date("2023/04/05 06:07:08.090Z");

    it("+09:00 Asia/Tokyo", () => {
        assert.equal(fn(dt, "Asia/Tokyo"), "2023/04/05 15:07:08.090 +09:00");
    });

    it("+08:00 Asia/Shanghai", () => {
        assert.equal(fn(dt, "Asia/Shanghai"), "2023/04/05 14:07:08.090 +08:00");
    });

    it("+05:45 Asia/Kathmandu", () => {
        assert.equal(fn(dt, "Asia/Kathmandu"), "2023/04/05 11:52:08.090 +05:45");
    });

    it("+01:00 Europe/London", () => {
        assert.equal(fn(dt, "Europe/London"), "2023/04/05 07:07:08.090 +01:00");
    });

    it("-02:30 America/St_Johns", () => {
        assert.equal(fn(dt, "America/St_Johns"), "2023/04/05 03:37:08.090 -02:30");
    });

    it("-03:00 America/Sao_Paulo", () => {
        assert.equal(fn(dt, "America/Sao_Paulo"), "2023/04/05 03:07:08.090 -03:00");
    });

    it("-07:00 America/Los_Angeles (PST)", () => {
        assert.equal(fn(dt, "America/Los_Angeles"), "2023/04/04 23:07:08.090 -07:00");
    });

    it("-11:00 Pacific/Niue", () => {
        assert.equal(fn(dt, "Pacific/Niue"), "2023/04/04 19:07:08.090 -11:00");
    })

    it("+14:00 Pacific/Kiritimati", () => {
        assert.equal(fn(dt, "Pacific/Kiritimati"), "2023/04/05 20:07:08.090 +14:00");
    });
}
