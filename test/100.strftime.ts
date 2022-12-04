#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as samsonjs_strftime from "strftime";

import {texter} from "../src/texter";

const TITLE = __filename.split("/").pop()!;

const samsonjs = {strftime: samsonjs_strftime};

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

describe(TITLE, () => {
    describe("samsonjs/strftime", () => {
        runTests(() => samsonjs.strftime);
    });

    describe("kawanet/cdate", () => {
        runTests(() => texter.strftime);
    });
});

type strftime = (fmt: string, dt: Date) => string;

function runTests(importer: () => strftime) {
    const dt = new Date("2023/04/05 06:07:08.090");
    const strftime = importer();

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

    /**
     * %a     The abbreviated weekday name according to the current locale. (en-only)
     */
    testIt("%a", dt, d.DAY, [
        "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"
    ]);

    /**
     * %A     The full weekday name according to the current locale. (en-only)
     */
    testIt("%A", dt, d.DAY, [
        "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"
    ]);

    /**
     * %b     The abbreviated month name according to the current locale. (en-only)
     */
    testIt("%b", dt, 31 * d.DAY, [
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ]);

    /**
     * %B     The full month name according to the current locale. (en-only)
     */
    testIt("%B", dt, 31 * d.DAY, [
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December", "January", "February", "March"
    ]);

    /**
     * %C     The century number (year/100) as a 2-digit integer. (SU)
     */
    testIt("%C", dt, -10 * 365 * d.DAY, ["20", "20", "20", "19", "19"]);

    /**
     * %c     The preferred date and time representation for the current locale. [NOT IMPLEMENTED]
     * %d     The day of the month as a decimal number (range 01 to 31).
     */
    testIt("%d", dt, d.DAY, [
        "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "01", "02", "03", "04",
    ]);

    testIt("%-d", dt, -d.DAY, [
        "5", "4", "3", "2", "1", "31",
    ]);

    testIt("%e", dt, d.DAY, [
        " 5", " 6", " 7", " 8", " 9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        " 1", " 2", " 3", " 4",
    ]);

    /**
     * %H     The hour as a decimal number using a 24-hour clock (range 00 to 23).
     */
    testIt("%H", dt, d.HOUR, [
        "06", "07", "08", "09", "10", "11", "12",
        "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
        "00", "01", "02", "03", "04", "05",
    ]);

    testIt("%-H", dt, -d.HOUR, [
        "6", "5", "4", "3", "2", "1", "0",
    ]);

    /**
     * %I     The hour as a decimal number using a 12-hour clock (range 01 to 12).
     */
    testIt("%I", dt, d.HOUR, [
        "06", "07", "08", "09", "10", "11", "12",
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
        "01", "02", "03", "04", "05",
    ]);

    testIt("%-I", dt, -d.HOUR, [
        "6", "5", "4", "3", "2", "1", "12",
    ]);

    testIt("%k", dt, d.HOUR, [
        " 6", " 7", " 8", " 9", "10", "11", "12",
        "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
        " 0", " 1", " 2", " 3", " 4", " 5",
    ]);

    testIt("%l", dt, d.HOUR, [
        " 6", " 7", " 8", " 9", "10", "11", "12",
        " 1", " 2", " 3", " 4", " 5", " 6", " 7", " 8", " 9", "10", "11", "12",
        " 1", " 2", " 3", " 4", " 5",
    ]);

    /**
     * %L - Millisecond of the second (000..999)
     */
    testIt("%L", dt, 182, [
        "090", "272", "454", "636", "818", "000"
    ]);

    testIt("%-L", dt, -30, [
        "090", "060", "030", "000", "970", "940"
    ]);

    /**
     * %m     The month as a decimal number (range 01 to 12).
     */
    testIt("%m", dt, 31 * d.DAY, [
        "04", "05", "06", "07", "08", "09",
        "10", "11", "12", "01", "02", "03",
    ]);

    testIt("%-m", dt, -31 * d.DAY, [
        "4", "3", "2", "1", "12"
    ]);

    /**
     * %M     The minute as a decimal number (range 00 to 59).
     */
    testIt("%M", dt, 19 * d.MINUTE, [
        "07", "26", "45", "04"
    ]);

    testIt("%-M", dt, -d.MINUTE, [
        "7", "6", "5", "4", "3", "2", "1", "0", "59"
    ]);

    /**
     * %p     Either "AM" or "PM"
     */
    testIt("%p", dt, d.HOUR, [
        "AM", "AM", "AM", "AM", "AM", "AM",
        "PM", "PM", "PM", "PM", "PM", "PM",
        "PM", "PM", "PM", "PM", "PM", "PM",
        "AM", "AM", "AM", "AM", "AM", "AM",
    ]);

    /**
     * %S     The second as a decimal number (range 00 to 60)
     */
    testIt("%S", dt, 13 * d.SECOND, [
        "08", "21", "34", "47", "00"
    ]);

    testIt("%-S", dt, -d.SECOND, [
        "8", "7", "6", "5", "4", "3", "2", "1", "0", "59"
    ]);

    /**
     * %U     The week number [NOT IMPLEMENTED]
     * %y     The year as a decimal number without a century (range 00 to 99).
     */
    testIt("%y", dt, 365 * d.DAY, [
        "23", "24", "25", "26", "27"
    ]);

    testIt("%-y", dt, -365 * d.DAY, [
        "23", "22", "21", "20", "19"
    ]);

    /**
     * %Y     The year as a decimal number including the century.
     */
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
        testOne(`%c`, dt, /^Wed 05 Apr 2023 06:07:08/);
        testOne(`%D`, dt, `04/05/23`);
        testOne(`%F`, dt, `2023-04-05`);
        testOne(`%R`, dt, `06:07`);
        testOne(`%r`, dt, `06:07:08 AM`);
        testOne(`%T`, dt, `06:07:08`);
        testOne(`%v`, dt, ` 5-Apr-2023`);
        testOne(`%X`, dt, `06:07:08 AM`);
        testOne(`%x`, dt, `04/05/23`);
    });

    /**
     * Literals
     */
    it("Literals", () => {
        // %%     A literal '%' character.
        testOne(`"%%"`, dt, `"%"`);

        // %n     A newline character. (SU
        testOne(`"%n"`, dt, `"\n"`);

        // %t     A tab character. (SU)
        testOne(`"%t"`, dt, `"\t"`);

        // unsupported literals
        testOne(`"%q"`, dt, `"%q"`);
    });
}