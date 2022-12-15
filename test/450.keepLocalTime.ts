#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import moment from "moment";

import {cdate} from "../index.js";

dayjs.extend(utc)

const TITLE = "450.keepLocalTime.ts";

interface Common {
    utc(keepLocalTime?: boolean): Common;

    utcOffset(offset: string | number, keepLocalTime?: boolean): Common;

    utcOffset(): number;

    tz(timeZone: string, keepLocalTime?: boolean): Common;

    format(fmt: string): string;
}

describe(TITLE, () => {
    it(`moment().utc(true)`, () => testFn(dt => moment(dt)));

    it(`dayjs().utc(true)`, () => testFn(dt => dayjs(dt)));

    it(`cdate().utc(true)`, () => testFn(dt => cdate(dt)));

    function testFn(fn: (dt: Date) => Common) {
        const dt = new Date("2023-01-01 12:00:00");
        const format = "YYYY/MM/DD HH:mm:ss";
        const formatZ = "YYYY/MM/DD HH:mm:ss Z";

        assert.equal(fn(dt).format(format), "2023/01/01 12:00:00");
        assert.equal(fn(dt).utc(true).format(format), "2023/01/01 12:00:00");

        assert.equal(fn(dt).utcOffset(9, true).format(formatZ), "2023/01/01 12:00:00 +09:00");
        assert.equal(fn(dt).utcOffset("-03:00", true).format(formatZ), "2023/01/01 12:00:00 -03:00");

        assert.equal(fn(dt).tz("Asia/Tokyo", true).format(formatZ), "2023/01/01 12:00:00 +09:00");
        assert.equal(fn(dt).tz("America/Sao_Paulo", true).format(formatZ), "2023/01/01 12:00:00 -03:00");
    }
});
