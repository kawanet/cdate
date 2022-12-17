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

    {
        const January = (date: number) => new Date(2023, 0, date, 0, 0, 0);

        assert.equal(fn(January(1)).format("MMMM Do"), "January 1st");
        assert.equal(fn(January(2)).format("MMMM Do"), "January 2nd");
        assert.equal(fn(January(3)).format("MMMM Do"), "January 3rd");
        assert.equal(fn(January(4)).format("MMMM Do"), "January 4th");
        assert.equal(fn(January(10)).format("MMMM Do"), "January 10th");
        assert.equal(fn(January(11)).format("MMMM Do"), "January 11th");
        assert.equal(fn(January(12)).format("MMMM Do"), "January 12th");
        assert.equal(fn(January(13)).format("MMMM Do"), "January 13th");
        assert.equal(fn(January(20)).format("MMMM Do"), "January 20th");
        assert.equal(fn(January(21)).format("MMMM Do"), "January 21st");
        assert.equal(fn(January(22)).format("MMMM Do"), "January 22nd");
        assert.equal(fn(January(23)).format("MMMM Do"), "January 23rd");
        assert.equal(fn(January(24)).format("MMMM Do"), "January 24th");
        assert.equal(fn(January(30)).format("MMMM Do"), "January 30th");
        assert.equal(fn(January(31)).format("MMMM Do"), "January 31st");
    }
}
