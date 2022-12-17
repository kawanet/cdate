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
    describe(`moment()`, () => testFn(dt => moment(dt)));

    describe(`dayjs()`, () => testFn(dt => dayjs(dt)));

    describe(`cdate()`, () => testFn(dt => cdate(dt), true));
});

function testFn(fn: (dt: Date) => Common, supportsDST?: boolean) {
    const dt = new Date("2023-01-01 12:00:00");
    const format = "YYYY/MM/DD HH:mm:ss";
    const formatZ = "YYYY/MM/DD HH:mm:ss Z";
    const IT = supportsDST ? it : it.skip;

    it(`utc(true)`, () => {
        assert.equal(fn(dt).format(format), "2023/01/01 12:00:00");
        assert.equal(fn(dt).utc(true).format(format), "2023/01/01 12:00:00");
    });

    it(`utcOffset(xx, true)`, () => {
        assert.equal(fn(dt).utcOffset(9, true).format(formatZ), "2023/01/01 12:00:00 +09:00");
        assert.equal(fn(dt).utcOffset("-03:00", true).format(formatZ), "2023/01/01 12:00:00 -03:00");
    });

    it(`tz(xx, true)`, () => {
        assert.equal(fn(dt).tz("Asia/Tokyo", true).format(formatZ), "2023/01/01 12:00:00 +09:00");
        assert.equal(fn(dt).tz("America/Sao_Paulo", true).format(formatZ), "2023/01/01 12:00:00 -03:00");
    });

    /**
     * we need to skip the tests below since the dayjs has incorrect behaviors around DST.
     * @see https://github.com/iamkun/dayjs/issues/2162
     */

    /**
     * Clock Changes in Los Angeles, California, USA 2022
     * Sunday, 13 March 2022, 02:00:00 clocks were turned forward 1 hour to
     * Sunday, 13 March 2022, 03:00:00 local daylight time instead.
     * @see https://www.timeanddate.com/time/change/usa/los-angeles?year=2022
     */
    IT(`tz(xx, true) // 13 March 2022`, () => {
        const std = new Date("2022-03-13T01:59:59Z"); // for -08:00
        const dst = new Date("2022-03-13T03:00:01Z"); // for -07:00
        const format = "YYYY/MM/DD HH:mm:ss Z";

        assert.equal(fn(std).utc().utcOffset(-8, true).format(format), "2022/03/13 01:59:59 -08:00", "GMT-8");
        assert.equal(fn(dst).utc().utcOffset(-7, true).format(format), "2022/03/13 03:00:01 -07:00", "GMT-7");

        assert.equal(fn(std).utc().tz("America/Los_Angeles", true).format(format), "2022/03/13 01:59:59 -08:00", "STD");
        assert.equal(fn(dst).utc().tz("America/Los_Angeles", true).format(format), "2022/03/13 03:00:01 -07:00", "DST");
    });

    /**
     * Clock Changes in Los Angeles, California, USA 2022
     * Sunday, 6 November 2022, 02:00:00 clocks were turned backward 1 hour to
     * Sunday, 6 November 2022, 01:00:00 local standard time instead.
     * @see https://www.timeanddate.com/time/change/usa/los-angeles?year=2022
     */
    IT(`tz(xx, true) // 6 November 2022`, () => {
        const dst = new Date("2022-11-06T00:59:59Z"); // for -07:00
        const std = new Date("2022-11-06T02:00:01Z"); // for -08:00
        const format = "YYYY/MM/DD HH:mm:ss Z";

        assert.equal(fn(dst).utc().utcOffset(-7, true).format(format), "2022/11/06 00:59:59 -07:00", "GMT-7");
        assert.equal(fn(std).utc().utcOffset(-8, true).format(format), "2022/11/06 02:00:01 -08:00", "GMT-8");

        assert.equal(fn(dst).utc().tz("America/Los_Angeles", true).format(format), "2022/11/06 00:59:59 -07:00", "DST");
        assert.equal(fn(std).utc().tz("America/Los_Angeles", true).format(format), "2022/11/06 02:00:01 -08:00", "STD");
    });
}
