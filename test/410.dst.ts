#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import * as moment from "moment";
import "moment-timezone"; // side effects only

import {cdate} from "../";

dayjs.extend(utc)
dayjs.extend(timezone)

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    const std = new Date("2022-03-13T01:59:59-08:00");
    const dst = new Date("2022-03-13T03:00:01-07:00");
    const format = "YYYY/MM/DD HH:mm:ss Z";
    const TZ = "America/Los_Angeles";

    it(`moment().tz(name)`, () => {
        assert.equal(moment(std).tz(TZ).format(format), "2022/03/13 01:59:59 -08:00");
        assert.equal(moment(dst).tz(TZ).format(format), "2022/03/13 03:00:01 -07:00");

        assert.equal(moment(dst).tz(TZ).add(+1, "second").format(format), "2022/03/13 03:00:02 -07:00", "+1 second");
        assert.equal(moment(dst).tz(TZ).add(-2, "seconds").format(format), "2022/03/13 01:59:59 -08:00", "-2 seconds");
        assert.equal(moment(dst).tz(TZ).add(-1, "minute").format(format), "2022/03/13 01:59:01 -08:00", "-1 minute");
        assert.equal(moment(dst).tz(TZ).add(-1, "hour").format(format), "2022/03/13 01:00:01 -08:00", "-1 hour");
        assert.equal(moment(dst).tz(TZ).add(-24, "hours").format(format), "2022/03/12 02:00:01 -08:00", "-24 hours"); // -24 hours
        assert.equal(moment(dst).tz(TZ).add(-1, "day").format(format), "2022/03/12 03:00:01 -08:00", "-1 day"); // -23 hours
        assert.equal(moment(dst).tz(TZ).add(-28, "days").format(format), "2022/02/13 03:00:01 -08:00", "-28 days");
        assert.equal(moment(dst).tz(TZ).add(-1, "month").format(format), "2022/02/13 03:00:01 -08:00", "-1 month");
        assert.equal(moment(dst).tz(TZ).add(-12, "months").format(format), "2021/03/13 03:00:01 -08:00", "-12 months");
        assert.equal(moment(dst).tz(TZ).add(-1, "year").format(format), "2021/03/13 03:00:01 -08:00", "-1 year");

        assert.equal(moment(dst).tz(TZ).startOf("day").format(format), "2022/03/13 00:00:00 -08:00", "startOf day");
        assert.equal(moment(dst).tz(TZ).startOf("month").format(format), "2022/03/01 00:00:00 -08:00", "startOf month");
        assert.equal(moment(dst).tz(TZ).startOf("year").format(format), "2022/01/01 00:00:00 -08:00", "startOf year");

        assert.equal(moment(dst).tz(TZ).endOf("day").format(format), "2022/03/13 23:59:59 -07:00", "endOf day");
        assert.equal(moment(dst).tz(TZ).endOf("month").format(format), "2022/03/31 23:59:59 -07:00", "endOf month");
        assert.equal(moment(dst).tz(TZ).endOf("year").format(format), "2022/12/31 23:59:59 -08:00", "endOf year");
    });

    /**
     * we need to skip the test below because the dayjs has a bug.
     * @see https://github.com/iamkun/dayjs/issues/2152
     */
    const IT = (process.env.TZ === "Asia/Tokyo") ? it : it.skip;

    IT(`dayjs().tz(name)`, () => {
        assert.equal(dayjs(std).tz(TZ).format(format), "2022/03/13 01:59:59 -08:00");
        assert.equal(dayjs(dst).tz(TZ).format(format), "2022/03/13 03:00:01 -07:00");

        assert.equal(dayjs(dst).tz(TZ).add(+1, "second").tz(TZ).format(format), "2022/03/13 03:00:02 -07:00", "+1 second");
        assert.equal(dayjs(dst).tz(TZ).add(-2, "seconds").tz(TZ).format(format), "2022/03/13 01:59:59 -08:00", "-2 seconds");
        assert.equal(dayjs(dst).tz(TZ).add(-1, "minute").tz(TZ).format(format), "2022/03/13 01:59:01 -08:00", "-1 minute");
        assert.equal(dayjs(dst).tz(TZ).add(-1, "hour").tz(TZ).format(format), "2022/03/13 01:00:01 -08:00", "-1 hour");

        // dayjs has a different behavior
        // assert.equal(dayjs(dst).tz(TZ).add(-24, "hours").format(format), "2022/03/12 02:00:01 -08:00", "-24 hours"); // -24 hours
        // assert.equal(dayjs(dst).tz(TZ).add(-1, "day").format(format), "2022/03/12 03:00:01 -08:00", "-1 day"); // -23 hours
        // assert.equal(dayjs(dst).tz(TZ).add(-28, "days").format(format), "2022/02/13 03:00:01 -08:00", "-28 days");
        // assert.equal(dayjs(dst).tz(TZ).add(-1, "month").format(format), "2022/02/13 03:00:01 -08:00", "-1 month");
        // assert.equal(dayjs(dst).tz(TZ).add(-12, "months").format(format), "2021/03/13 03:00:01 -08:00", "-12 months");
        // assert.equal(dayjs(dst).tz(TZ).add(-1, "year").format(format), "2021/03/13 03:00:01 -08:00", "-1 year");

        assert.equal(dayjs(dst).tz(TZ).startOf("day").tz(TZ).format(format), "2022/03/13 00:00:00 -08:00", "startOf day");
        assert.equal(dayjs(dst).tz(TZ).startOf("month").tz(TZ).format(format), "2022/03/01 00:00:00 -08:00", "startOf month");
        assert.equal(dayjs(dst).tz(TZ).startOf("year").tz(TZ).format(format), "2022/01/01 00:00:00 -08:00", "startOf year");

        assert.equal(dayjs(dst).tz(TZ).endOf("day").tz(TZ).format(format), "2022/03/13 23:59:59 -07:00", "endOf day");
        assert.equal(dayjs(dst).tz(TZ).endOf("month").tz(TZ).format(format), "2022/03/31 23:59:59 -07:00", "endOf month");
        assert.equal(dayjs(dst).tz(TZ).endOf("year").tz(TZ).format(format), "2022/12/31 23:59:59 -08:00", "endOf year");
    });

    it(`cdate().tz(name)`, () => {
        assert.equal(cdate(std).tz(TZ).format(format), "2022/03/13 01:59:59 -08:00");
        assert.equal(cdate(dst).tz(TZ).format(format), "2022/03/13 03:00:01 -07:00");

        assert.equal(cdate(dst).tz(TZ).add(+1, "second").tz(TZ).format(format), "2022/03/13 03:00:02 -07:00", "+1 second");
        assert.equal(cdate(dst).tz(TZ).add(-2, "seconds").tz(TZ).format(format), "2022/03/13 01:59:59 -08:00", "-2 seconds");
        assert.equal(cdate(dst).tz(TZ).add(-1, "minute").tz(TZ).format(format), "2022/03/13 01:59:01 -08:00", "-1 minute");
        assert.equal(cdate(dst).tz(TZ).add(-1, "hour").tz(TZ).format(format), "2022/03/13 01:00:01 -08:00", "-1 hour");
        assert.equal(cdate(dst).tz(TZ).add(-24, "hours").tz(TZ).format(format), "2022/03/12 02:00:01 -08:00", "-24 hours"); // -24 hours
        assert.equal(cdate(dst).tz(TZ).add(-1, "day").tz(TZ).format(format), "2022/03/12 03:00:01 -08:00", "-1 day"); // -23 hours
        assert.equal(cdate(dst).tz(TZ).add(-28, "days").tz(TZ).format(format), "2022/02/13 03:00:01 -08:00", "-28 days");
        assert.equal(cdate(dst).tz(TZ).add(-1, "month").tz(TZ).format(format), "2022/02/13 03:00:01 -08:00", "-1 month");
        assert.equal(cdate(dst).tz(TZ).add(-12, "months").tz(TZ).format(format), "2021/03/13 03:00:01 -08:00", "-12 months");
        assert.equal(cdate(dst).tz(TZ).add(-1, "year").tz(TZ).format(format), "2021/03/13 03:00:01 -08:00", "-1 year");

        assert.equal(cdate(dst).tz(TZ).startOf("day").tz(TZ).format(format), "2022/03/13 00:00:00 -08:00", "startOf day");
        assert.equal(cdate(dst).tz(TZ).startOf("month").tz(TZ).format(format), "2022/03/01 00:00:00 -08:00", "startOf month");
        assert.equal(cdate(dst).tz(TZ).startOf("year").tz(TZ).format(format), "2022/01/01 00:00:00 -08:00", "startOf year");

        assert.equal(cdate(dst).tz(TZ).endOf("day").tz(TZ).format(format), "2022/03/13 23:59:59 -07:00", "endOf day");
        assert.equal(cdate(dst).tz(TZ).endOf("month").tz(TZ).format(format), "2022/03/31 23:59:59 -07:00", "endOf month");
        assert.equal(cdate(dst).tz(TZ).endOf("year").tz(TZ).format(format), "2022/12/31 23:59:59 -08:00", "endOf year");

    });
});
