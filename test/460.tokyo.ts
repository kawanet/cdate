#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import moment from "moment";
import "moment-timezone"; // side effects only

import {cdate} from "../index.js";

dayjs.extend(utc)

const TITLE = "460.tokyo.ts";

interface Common {
    tz(timeZone: string, keepLocalTime?: boolean): Common;

    format(fmt: string): string;
}

describe(TITLE, () => {
    describe(`moment()`, () => testFn(dt => moment(dt)));

    describe(`dayjs()`, () => testFn(dt => dayjs(dt), true));

    describe(`cdate()`, () => {
        testFn(dt => cdate(dt));

        it(`%::z`, () => {
            const dt1 = new Date("1888-01-01T00:00:00+09:00");
            const dt2 = new Date(+dt1 - 1);
            assert.equal(cdate(dt1).tz("Asia/Tokyo").text("%Y/%m/%d %H:%M:%S.%L %::z"), "1888/01/01 00:00:00.000 +09:00:00");
            assert.equal(cdate(dt2).tz("Asia/Tokyo").text("%Y/%m/%d %H:%M:%S.%L %::z"), "1888/01/01 00:18:58.999 +09:18:59");
        });
    });
});

function testFn(fn: (dt: Date) => Common, skip?: boolean) {
    const dt1 = new Date("1888-01-01T00:00:00+09:00");
    const dt2 = new Date(+dt1 - 1);
    const format = "YYYY/MM/DD HH:mm:ss.SSS Z";

    /**
     * we need to skip the test below since dayjs has a bug to display an incorrect time zone offset +08:41
     * @see https://github.com/iamkun/dayjs/issues/2164
     */
    const IT = skip ? it.skip : it;

    IT(`tz("Asia/Tokyo") // 1 January 1888`, () => {
        assert.equal(fn(dt1).tz("Asia/Tokyo").format(format), "1888/01/01 00:00:00.000 +09:00");
        assert.equal(fn(dt2).tz("Asia/Tokyo").format(format), "1888/01/01 00:18:58.999 +09:18");
    });
}
