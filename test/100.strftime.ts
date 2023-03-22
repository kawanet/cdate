#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import samsonjs_strftime from "strftime";
import * as cdatejs from "../index.js";

const TITLE = "100.strftime.ts";

const samsonjs = {strftime: samsonjs_strftime};

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

describe(TITLE, () => {
    describe("samsonjs/strftime", () => {
        runTests(samsonjs.strftime);
    });

    describe("kawanet/cdate", () => {
        runTests(cdatejs.strftime);
    });
});

type strftime = (fmt: string, dt?: Date) => string;

function runTests(strftime: strftime) {
    const dt = new Date("2023-04-05T06:07:08.090"); // local time

    it(`strftime`, () => {
        // without Date given
        const year = String(new Date().getFullYear());
        assert.equal(strftime("%Y"), year);

        // UNIX time
        const dt = new Date();
        assert.equal(strftime("%s", dt), String(Math.floor(+dt / 1000)));
    });

    const testOne = (fmt: string, dt: Date, expected: string | RegExp) => {
        if (expected instanceof RegExp) {
            assert.match(strftime(fmt, dt), expected, fmt);
        } else {
            assert.equal(strftime(fmt, dt), expected, fmt);
        }
    };

    const testIt = (fmt: string, dt: Date, interval: number, expected: string[]) => {
        it(`"${fmt}"`, () => {
            for (let i = 0; i < expected.length; i++) {
                assert.equal(strftime(fmt, dt), expected[i], `"${fmt}" #${i + 1}`);
                dt = new Date(+dt + interval);
            }
        })
    };

    // "%a": the locale's abbreviated weekday name
    testIt("%a", dt, d.DAY, [
        "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"
    ]);

    // "%A": the locale's full weekday name
    testIt("%A", dt, d.DAY, [
        "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"
    ]);

    // "%w": the weekday (Sunday as the first day of the week) as a decimal number
    testIt("%w", dt, d.DAY, [
        "3", "4", "5", "6", "0", "1", "2"
    ]);

    // "%u": the weekday (Monday as the first day of the week) as a decimal number
    testIt("%u", dt, d.DAY, [
        "3", "4", "5", "6", "7", "1", "2"
    ]);

    // "%b": the locale's abbreviated month name
    testIt("%b", dt, 31 * d.DAY, [
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ]);

    // "%B": the locale's full month name
    testIt("%B", dt, 31 * d.DAY, [
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December", "January", "February", "March"
    ]);

    // "%C": the century as a decimal number
    testIt("%C", dt, -10 * 365 * d.DAY, ["20", "20", "20", "19", "19"]);

    // "%d": the day of the month as a decimal number
    testIt("%d", dt, d.DAY, [
        "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "01", "02", "03", "04",
    ]);

    testIt("%-d", dt, -d.DAY, [
        "5", "4", "3", "2", "1", "31",
    ]);

    // "%e": the day of month as a decimal number
    testIt("%e", dt, d.DAY, [
        " 5", " 6", " 7", " 8", " 9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        " 1", " 2", " 3", " 4",
    ]);

    // "%H": the hour (24-hour clock) as a decimal number
    testIt("%H", dt, d.HOUR, [
        "06", "07", "08", "09", "10", "11", "12",
        "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
        "00", "01", "02", "03", "04", "05",
    ]);

    testIt("%-H", dt, -d.HOUR, [
        "6", "5", "4", "3", "2", "1", "0",
    ]);

    // "%I": the hour (12-hour clock) as a decimal number
    testIt("%I", dt, d.HOUR, [
        "06", "07", "08", "09", "10", "11", "12",
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
        "01", "02", "03", "04", "05",
    ]);

    testIt("%-I", dt, -d.HOUR, [
        "6", "5", "4", "3", "2", "1", "12",
    ]);

    // "%k": the hour (24-hour clock) as a decimal number
    testIt("%k", dt, d.HOUR, [
        " 6", " 7", " 8", " 9", "10", "11", "12",
        "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
        " 0", " 1", " 2", " 3", " 4", " 5",
    ]);

    // "%l": the hour (12-hour clock) as a decimal number
    testIt("%l", dt, d.HOUR, [
        " 6", " 7", " 8", " 9", "10", "11", "12",
        " 1", " 2", " 3", " 4", " 5", " 6", " 7", " 8", " 9", "10", "11", "12",
        " 1", " 2", " 3", " 4", " 5",
    ]);

    // "%L": the millisecond as a decimal number
    testIt("%L", dt, 182, [
        "090", "272", "454", "636", "818", "000"
    ]);

    testIt("%-L", dt, -30, [
        "090", "060", "030", "000", "970", "940"
    ]);

    // "%m": the month as a decimal number
    testIt("%m", dt, 31 * d.DAY, [
        "04", "05", "06", "07", "08", "09",
        "10", "11", "12", "01", "02", "03",
    ]);

    testIt("%-m", dt, -31 * d.DAY, [
        "4", "3", "2", "1", "12"
    ]);

    // "%M": the minute as a decimal number
    testIt("%M", dt, 19 * d.MINUTE, [
        "07", "26", "45", "04"
    ]);

    testIt("%-M", dt, -d.MINUTE, [
        "7", "6", "5", "4", "3", "2", "1", "0", "59"
    ]);

    // "%p": the locale's equivalent of either `AM` or `PM`
    testIt("%p", dt, d.HOUR, [
        "AM", "AM", "AM", "AM", "AM", "AM",
        "PM", "PM", "PM", "PM", "PM", "PM",
        "PM", "PM", "PM", "PM", "PM", "PM",
        "AM", "AM", "AM", "AM", "AM", "AM",
    ]);

    // "%S": the second as a decimal number
    testIt("%S", dt, 13 * d.SECOND, [
        "08", "21", "34", "47", "00"
    ]);

    testIt("%-S", dt, -d.SECOND, [
        "8", "7", "6", "5", "4", "3", "2", "1", "0", "59"
    ]);

    // "%y": the year without century as a decimal number
    testIt("%y", dt, 365 * d.DAY, [
        "23", "24", "25", "26", "27"
    ]);

    testIt("%-y", dt, -365 * d.DAY, [
        "23", "22", "21", "20", "19"
    ]);

    // "%Y": the year with century as a decimal number
    testIt("%Y", dt, 365 * d.DAY, [
        "2023", "2024", "2025", "2026", "2027"
    ]);

    testIt("%-Y", dt, -365 * d.DAY, [
        "2023", "2022", "2021", "2020", "2019"
    ]);

    /**
     * Formats
     */
    it("Formats", () => {
        // "%D": the date in the format `%m/%d/%y`
        testOne(`%D`, dt, `04/05/23`);

        // "%F": the date in the format `%Y-%m-%d`
        testOne(`%F`, dt, `2023-04-05`);

        // "%R": the time in the format `%H:%M`
        testOne(`%R`, dt, `06:07`);

        // "%T": the time in the format `%H:%M:%S`
        testOne(`%T`, dt, `06:07:08`);

        // "%v": the date in the format `%e-%b-%Y`
        testOne(`%v`, dt, ` 5-Apr-2023`);
    });

    /**
     * Literals
     */
    it("Literals", () => {
        // "%%": a literal `%` character
        testOne(`"%%"`, dt, `"%"`);

        // "%n": a newline character
        testOne(`"%n"`, dt, `"\n"`);

        // "%t": a tab character
        testOne(`"%t"`, dt, `"\t"`);

        // unsupported literals
        testOne(`"%q"`, dt, `"%q"`);
    });
}