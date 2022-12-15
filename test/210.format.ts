#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import moment from "moment";

import {cdate} from "../index.js";

dayjs.extend(advancedFormat);

const TITLE = "210.format.ts";

describe(TITLE, () => {
    it(`moment().format()`, () => {
        runTests((dt) => moment(dt));
    });

    it(`dayjs().format()`, () => {
        runTests((dt) => dayjs(dt));
    });

    it(`cdate().format()`, () => {
        runTests((dt) => cdate(dt));
    });

    it("Do", () => {
        const thMap = ["th", "st", "nd", "rd"];
        const th = (num: number) => num + (thMap[num] || (num > 20 && thMap[num % 10]) || thMap[0]);
        const c = cdate("2023-01-01").handler({
            Do: dt => th(dt.getDate()),
        });

        assert.equal(c.format("MMMM Do"), "January 1st");
        assert.equal(c.set("date", 1).format("MMMM Do"), "January 1st");
        assert.equal(c.set("date", 2).format("MMMM Do"), "January 2nd");
        assert.equal(c.set("date", 3).format("MMMM Do"), "January 3rd");
        assert.equal(c.set("date", 4).format("MMMM Do"), "January 4th");
        assert.equal(c.set("date", 10).format("MMMM Do"), "January 10th");
        assert.equal(c.set("date", 11).format("MMMM Do"), "January 11th");
        assert.equal(c.set("date", 12).format("MMMM Do"), "January 12th");
        assert.equal(c.set("date", 13).format("MMMM Do"), "January 13th");
        assert.equal(c.set("date", 20).format("MMMM Do"), "January 20th");
        assert.equal(c.set("date", 21).format("MMMM Do"), "January 21st");
        assert.equal(c.set("date", 22).format("MMMM Do"), "January 22nd");
        assert.equal(c.set("date", 23).format("MMMM Do"), "January 23rd");
        assert.equal(c.set("date", 24).format("MMMM Do"), "January 24th");
        assert.equal(c.set("date", 30).format("MMMM Do"), "January 30th");
        assert.equal(c.set("date", 31).format("MMMM Do"), "January 31st");
    });
});

function runTests(fn: (dt: Date) => { format: (format: string) => string }) {
    const dt = new Date("2023-04-05 06:07:08.090");

    const tests = {
        "YYYY/MM/DD HH:mm:ss.SSS": "2023/04/05 06:07:08.090",
        "[Year:]YYYY [Month:]MMMM [Date:]D": "Year:2023 Month:April Date:5",
        "[YYYY/MM/DD]": "YYYY/MM/DD",
        "[%y/%m/%d]": "%y/%m/%d",
        YY: "23",
        YYYY: "2023",
        M: "4",
        MM: "04",
        MMM: "Apr",
        MMMM: "April",
        D: "5",
        Do: "5th", // dayjs does not support this
        DD: "05",
        d: "3",
        dd: "We",
        ddd: "Wed",
        dddd: "Wednesday",
        H: "6",
        HH: "06",
        h: "6",
        hh: "06",
        m: "7",
        mm: "07",
        s: "8",
        ss: "08",
        SSS: "090",
        A: "AM",
        a: "am",
    };

    Object.keys(tests).forEach((format: keyof typeof tests) => {
        assert.equal(fn(dt).format(format), tests[format], format);
    });
}
