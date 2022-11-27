#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as samsonjs_strftime from "strftime";
import {strftime as cdate_strftime} from "../src/strftime";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe("samsonjs/strftime", () => {
        runTests(tz => samsonjs_strftime.timezone(tz));
    });

    describe("kawanet/cdate", () => {
        runTests(tz => cdate_strftime.timezone(tz));
    });
});

type strftime = (fmt: string, dt: Date) => string;

function runTests(importer: (tz: number) => strftime) {
    const dt = new Date("2023-04-05T06:07:08.090Z"); // UTC
    const fmt = "%Y/%m/%d %H:%M:%S.%L %:z";

    it("+09:00 Asia/Tokyo", () => {
        const strftime = importer(540);
        assert.equal(strftime(fmt, dt), "2023/04/05 15:07:08.090 +09:00");
    });

    it("+08:00 Asia/Shanghai", () => {
        const strftime = importer(480);
        assert.equal(strftime(fmt, dt), "2023/04/05 14:07:08.090 +08:00");
    });

    it("+05:45 Asia/Kathmandu", () => {
        const strftime = importer(5 * 60 + 45);
        assert.equal(strftime(fmt, dt), "2023/04/05 11:52:08.090 +05:45");
    });

    it("+00:00 Europe/London", () => {
        const strftime = importer(0);
        assert.equal(strftime(fmt, dt), "2023/04/05 06:07:08.090 +00:00");
    });

    it("-08:00 America/Los_Angeles (PST)", () => {
        const strftime = importer(-480);
        assert.equal(strftime(fmt, dt), "2023/04/04 22:07:08.090 -08:00");
    });

    it("-11:00 Pacific/Niue", () => {
        const strftime = importer(-660);
        assert.equal(strftime(fmt, dt), "2023/04/04 19:07:08.090 -11:00");
    })

    it("+14:00 Pacific/Kiritimati", () => {
        const strftime = importer(14 * 60);
        assert.equal(strftime(fmt, dt), "2023/04/05 20:07:08.090 +14:00");
    });
}