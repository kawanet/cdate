#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import samsonjs_strftime from "strftime";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import moment from "moment";
import "moment-timezone"; // side effects only

import {cdate} from "../index.js";

dayjs.extend(utc)
dayjs.extend(timezone)

const samsonjs = {strftime: samsonjs_strftime};

/**
 * Standard Time (STD)
 */
const STD = {
    "Asia/Tokyo": "+0900", // Japan Standard Time (JST)
    "Asia/Shanghai": "+0800",
    "Asia/Kathmandu": "+0545",
    "Europe/London": "+0000", // Greenwich Mean Time (GMT)
    "America/St_Johns": "-0330", // Newfoundland Standard Time (NST)
    "America/Sao_Paulo": "-0300",
    "America/Los_Angeles": "-0800", // Pacific Standard Time (PST)
    "Pacific/Niue": "-1100",
    "Pacific/Kiritimati": "+1400",
} as const;

/**
 * Daylight Saving Time (DST)
 */
const DST = {
    "Asia/Tokyo": "+0900", // Japan Standard Time (JST)
    "Asia/Shanghai": "+0800",
    "Asia/Kathmandu": "+0545",
    "Europe/London": "+0100", // British Summer Time (BST)
    "America/St_Johns": "-0230", // Newfoundland Daylight Time (NDT)
    "America/Sao_Paulo": "-0300",
    "America/Los_Angeles": "-0700", // Pacific Daylight Time (PDT)
    "Pacific/Niue": "-1100",
    "Pacific/Kiritimati": "+1400",
} as const;

const TITLE = "400.timezone.ts";

describe(TITLE, () => {
    describe(`moment().tz(name)`, () => {
        runTests((dt, tz) => moment(dt).tz(tz).format("YYYY/MM/DD HH:mm:ss.SSS Z"));
    });

    describe(`dayjs().tz(name)`, () => {
        runTests((dt, tz) => dayjs(dt).tz(tz).format("YYYY/MM/DD HH:mm:ss.SSS Z"));
    });

    describe(`samsonjs/strftime.timezone(offset)`, () => {
        runTests((dt, tz, map) => samsonjs.strftime.timezone(map[tz])("%Y/%m/%d %H:%M:%S.%L %:z", dt));
    });

    describe(`cdate().timezone(offset)`, () => {
        runTests((dt, tz, map) => cdate(dt).tz(map[tz]).text("%Y/%m/%d %H:%M:%S.%L %:z"));
    });

    describe(`cdate().timezone(name)`, () => {
        runTests((dt, tz) => cdate(dt).tz(tz).text("%Y/%m/%d %H:%M:%S.%L %:z"));
    });
});

function runTests(fn: (dt: Date, tz: keyof typeof STD, map?: typeof STD | typeof DST) => string) {
    const winter = new Date("2022-01-02T00:00:00.000Z");
    const summer = new Date("2022-08-02T00:00:00.000Z");

    it("Asia/Tokyo", () => {
        assert.equal(fn(winter, "Asia/Tokyo", STD), "2022/01/02 09:00:00.000 +09:00");
        assert.equal(fn(summer, "Asia/Tokyo", DST), "2022/08/02 09:00:00.000 +09:00");
    });

    it("Asia/Shanghai", () => {
        assert.equal(fn(winter, "Asia/Shanghai", STD), "2022/01/02 08:00:00.000 +08:00");
        assert.equal(fn(summer, "Asia/Shanghai", DST), "2022/08/02 08:00:00.000 +08:00");
    });

    it("Asia/Kathmandu", () => {
        assert.equal(fn(winter, "Asia/Kathmandu", STD), "2022/01/02 05:45:00.000 +05:45");
        assert.equal(fn(summer, "Asia/Kathmandu", DST), "2022/08/02 05:45:00.000 +05:45");
    });

    it("Europe/London", () => {
        assert.equal(fn(winter, "Europe/London", STD), "2022/01/02 00:00:00.000 +00:00");
        assert.equal(fn(summer, "Europe/London", DST), "2022/08/02 01:00:00.000 +01:00");
    });

    it("America/St_Johns", () => {
        assert.equal(fn(winter, "America/St_Johns", STD), "2022/01/01 20:30:00.000 -03:30");
        assert.equal(fn(summer, "America/St_Johns", DST), "2022/08/01 21:30:00.000 -02:30");
    });

    it("America/Sao_Paulo", () => {
        assert.equal(fn(winter, "America/Sao_Paulo", STD), "2022/01/01 21:00:00.000 -03:00");
        assert.equal(fn(summer, "America/Sao_Paulo", DST), "2022/08/01 21:00:00.000 -03:00");
    });

    it("America/Los_Angeles (PST)", () => {
        assert.equal(fn(winter, "America/Los_Angeles", STD), "2022/01/01 16:00:00.000 -08:00");
        assert.equal(fn(summer, "America/Los_Angeles", DST), "2022/08/01 17:00:00.000 -07:00");
    });

    it("Pacific/Niue", () => {
        assert.equal(fn(winter, "Pacific/Niue", STD), "2022/01/01 13:00:00.000 -11:00");
        assert.equal(fn(summer, "Pacific/Niue", DST), "2022/08/01 13:00:00.000 -11:00");
    });

    it("Pacific/Kiritimati", () => {
        assert.equal(fn(winter, "Pacific/Kiritimati", STD), "2022/01/02 14:00:00.000 +14:00");
        assert.equal(fn(summer, "Pacific/Kiritimati", DST), "2022/08/02 14:00:00.000 +14:00");
    });
}
