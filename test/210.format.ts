#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import moment from "moment";

import {cdate} from "../index.js";

const TITLE = "210.format.ts";

describe(TITLE, () => {
    it(`moment().format()`, () => {
        runTests((dt, format) => moment(dt).format(format));
    });

    it(`dayjs().format()`, () => {
        runTests((dt, format) => dayjs(dt).format(format));
    });

    it(`cdate().format()`, () => {
        runTests((dt, format) => cdate(dt).format(format));
    });
});

function runTests(fn: (dt: Date, format: string) => string) {
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
        assert.equal(fn(dt, format), tests[format], format);
    });
}
