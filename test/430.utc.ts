#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as moment from "moment";

import {cdate} from "../";

dayjs.extend(utc)

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    /**
     * Clock Changes in London, England, United Kingdom 2022
     * Sunday, 27 March 2022, 01:00:00 clocks were turned forward 1 hour to
     * Sunday, 27 March 2022, 02:00:00 local daylight time instead.
     * @see https://www.timeanddate.com/time/change/uk/london?year=2022
     */
    const std = new Date("2022-03-27T00:59:59+00:00");
    const dst = new Date("2022-03-27T02:00:01+01:00");
    const format = "YYYY/MM/DD HH:mm:ss Z";

    it(`moment().utc()`, () => {
        assert.equal(moment(std).utc().format(format), "2022/03/27 00:59:59 +00:00");
        assert.equal(moment(dst).utc().format(format), "2022/03/27 01:00:01 +00:00");

        assert.equal(moment(dst).utc().add(+1, "second").format(format), "2022/03/27 01:00:02 +00:00", "+1 second");
        assert.equal(moment(dst).utc().add(-2, "seconds").format(format), "2022/03/27 00:59:59 +00:00", "-2 seconds");
        assert.equal(moment(dst).utc().add(-1, "minute").format(format), "2022/03/27 00:59:01 +00:00", "-1 minute");
        assert.equal(moment(dst).utc().add(-1, "hour").format(format), "2022/03/27 00:00:01 +00:00", "-1 hour");
        assert.equal(moment(dst).utc().add(-24, "hours").format(format), "2022/03/26 01:00:01 +00:00", "-24 hours");
        assert.equal(moment(dst).utc().add(-1, "day").format(format), "2022/03/26 01:00:01 +00:00", "-1 day");
        assert.equal(moment(dst).utc().add(-28, "days").format(format), "2022/02/27 01:00:01 +00:00", "-28 days");
        assert.equal(moment(dst).utc().add(-1, "month").format(format), "2022/02/27 01:00:01 +00:00", "-1 month");
        assert.equal(moment(dst).utc().add(-12, "months").format(format), "2021/03/27 01:00:01 +00:00", "-12 months");
        assert.equal(moment(dst).utc().add(-1, "year").format(format), "2021/03/27 01:00:01 +00:00", "-1 year");

        assert.equal(moment(dst).utc().startOf("day").format(format), "2022/03/27 00:00:00 +00:00", "startOf day");
        assert.equal(moment(dst).utc().startOf("month").format(format), "2022/03/01 00:00:00 +00:00", "startOf month");
        assert.equal(moment(dst).utc().startOf("year").format(format), "2022/01/01 00:00:00 +00:00", "startOf year");

        assert.equal(moment(dst).utc().endOf("day").format(format), "2022/03/27 23:59:59 +00:00", "endOf day");
        assert.equal(moment(dst).utc().endOf("month").format(format), "2022/03/31 23:59:59 +00:00", "endOf month");
        assert.equal(moment(dst).utc().endOf("year").format(format), "2022/12/31 23:59:59 +00:00", "endOf year");
    });

    it(`dayjs().utc()`, () => {
        assert.equal(dayjs(std).utc().format(format), "2022/03/27 00:59:59 +00:00");
        assert.equal(dayjs(dst).utc().format(format), "2022/03/27 01:00:01 +00:00");

        assert.equal(dayjs(dst).utc().add(+1, "second").format(format), "2022/03/27 01:00:02 +00:00", "+1 second");
        assert.equal(dayjs(dst).utc().add(-2, "seconds").format(format), "2022/03/27 00:59:59 +00:00", "-2 seconds");
        assert.equal(dayjs(dst).utc().add(-1, "minute").format(format), "2022/03/27 00:59:01 +00:00", "-1 minute");
        assert.equal(dayjs(dst).utc().add(-1, "hour").format(format), "2022/03/27 00:00:01 +00:00", "-1 hour");
        assert.equal(dayjs(dst).utc().add(-24, "hours").format(format), "2022/03/26 01:00:01 +00:00", "-24 hours");
        assert.equal(dayjs(dst).utc().add(-1, "day").format(format), "2022/03/26 01:00:01 +00:00", "-1 day");
        assert.equal(dayjs(dst).utc().add(-28, "days").format(format), "2022/02/27 01:00:01 +00:00", "-28 days");
        assert.equal(dayjs(dst).utc().add(-1, "month").format(format), "2022/02/27 01:00:01 +00:00", "-1 month");
        assert.equal(dayjs(dst).utc().add(-12, "months").format(format), "2021/03/27 01:00:01 +00:00", "-12 months");
        assert.equal(dayjs(dst).utc().add(-1, "year").format(format), "2021/03/27 01:00:01 +00:00", "-1 year");

        assert.equal(dayjs(dst).utc().startOf("day").format(format), "2022/03/27 00:00:00 +00:00", "startOf day");
        assert.equal(dayjs(dst).utc().startOf("month").format(format), "2022/03/01 00:00:00 +00:00", "startOf month");
        assert.equal(dayjs(dst).utc().startOf("year").format(format), "2022/01/01 00:00:00 +00:00", "startOf year");

        assert.equal(dayjs(dst).utc().endOf("day").format(format), "2022/03/27 23:59:59 +00:00", "endOf day");
        assert.equal(dayjs(dst).utc().endOf("month").format(format), "2022/03/31 23:59:59 +00:00", "endOf month");
        assert.equal(dayjs(dst).utc().endOf("year").format(format), "2022/12/31 23:59:59 +00:00", "endOf year");
    });

    it(`cdate().utc()`, () => {
        assert.equal(cdate(std).utc().format(format), "2022/03/27 00:59:59 +00:00");
        assert.equal(cdate(dst).utc().format(format), "2022/03/27 01:00:01 +00:00");

        assert.equal(cdate(dst).utc().add(+1, "second").format(format), "2022/03/27 01:00:02 +00:00", "+1 second");
        assert.equal(cdate(dst).utc().add(-2, "seconds").format(format), "2022/03/27 00:59:59 +00:00", "-2 seconds");
        assert.equal(cdate(dst).utc().add(-1, "minute").format(format), "2022/03/27 00:59:01 +00:00", "-1 minute");
        assert.equal(cdate(dst).utc().add(-1, "hour").format(format), "2022/03/27 00:00:01 +00:00", "-1 hour");
        assert.equal(cdate(dst).utc().add(-24, "hours").format(format), "2022/03/26 01:00:01 +00:00", "-24 hours");
        assert.equal(cdate(dst).utc().add(-1, "day").format(format), "2022/03/26 01:00:01 +00:00", "-1 day");
        assert.equal(cdate(dst).utc().add(-28, "days").format(format), "2022/02/27 01:00:01 +00:00", "-28 days");
        assert.equal(cdate(dst).utc().add(-1, "month").format(format), "2022/02/27 01:00:01 +00:00", "-1 month");
        assert.equal(cdate(dst).utc().add(-12, "months").format(format), "2021/03/27 01:00:01 +00:00", "-12 months");
        assert.equal(cdate(dst).utc().add(-1, "year").format(format), "2021/03/27 01:00:01 +00:00", "-1 year");

        assert.equal(cdate(dst).utc().startOf("day").format(format), "2022/03/27 00:00:00 +00:00", "startOf day");
        assert.equal(cdate(dst).utc().startOf("month").format(format), "2022/03/01 00:00:00 +00:00", "startOf month");
        assert.equal(cdate(dst).utc().startOf("year").format(format), "2022/01/01 00:00:00 +00:00", "startOf year");

        assert.equal(cdate(dst).utc().endOf("day").format(format), "2022/03/27 23:59:59 +00:00", "endOf day");
        assert.equal(cdate(dst).utc().endOf("month").format(format), "2022/03/31 23:59:59 +00:00", "endOf month");
        assert.equal(cdate(dst).utc().endOf("year").format(format), "2022/12/31 23:59:59 +00:00", "endOf year");
    });
});
