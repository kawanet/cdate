#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as samsonjs_strftime from "strftime";
import {strftime as cdate_strftime} from "../src/strftime";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    describe("samsonjs/strftime", () => {
        runTests(() => samsonjs_strftime);
    });

    describe("kawanet/cdate", () => {
        runTests(() => cdate_strftime);
    });
});

type strftime = (fmt: string, dt: Date) => string;

function runTests(importer: () => { timezone: (tz: number | string) => strftime }) {
    const dt = new Date("2023-04-05T06:07:08.090Z"); // UTC
    const fmt = "%Y/%m/%d %H:%M:%S.%L %:z";

    it("+09:00 Asia/Tokyo", () => {
        const strftime = importer().timezone(540);
        assert.equal(strftime(fmt, dt), "2023/04/05 15:07:08.090 +09:00");
    });

    it("+08:00 Asia/Shanghai", () => {
        const strftime = importer().timezone("+0800");
        assert.equal(strftime(fmt, dt), "2023/04/05 14:07:08.090 +08:00");
    });

    it("+05:45 Asia/Kathmandu", () => {
        const strftime = importer().timezone(5 * 60 + 45);
        assert.equal(strftime(fmt, dt), "2023/04/05 11:52:08.090 +05:45");
    });

    it("+00:00 Europe/London", () => {
        const strftime = importer().timezone(0);
        assert.equal(strftime(fmt, dt), "2023/04/05 06:07:08.090 +00:00");
    });

    it("-03:30 America/St_Johns", () => {
        const strftime = importer().timezone("-0330");
        assert.equal(strftime(fmt, dt), "2023/04/05 02:37:08.090 -03:30");
    });

    it("-08:00 America/Los_Angeles (PST)", () => {
        const strftime = importer().timezone(-480);
        assert.equal(strftime(fmt, dt), "2023/04/04 22:07:08.090 -08:00");
    });

    it("-11:00 Pacific/Niue", () => {
        const strftime = importer().timezone("-1100");
        assert.equal(strftime(fmt, dt), "2023/04/04 19:07:08.090 -11:00");
    })

    it("+14:00 Pacific/Kiritimati", () => {
        const strftime = importer().timezone(14 * 60);
        assert.equal(strftime(fmt, dt), "2023/04/05 20:07:08.090 +14:00");
    });
}