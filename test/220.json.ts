#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {cdate} from "../";

const TITLE = __filename.split("/").pop()!;

describe(TITLE, () => {
    it(`Date#toJSON()`, () => {
        runTests((dt) => dt.toJSON());
    });

    it(`cdate().strftime()`, () => {
        runTests((dt) => cdate(dt).utc().text("%Y-%m-%dT%H:%M:%S.%LZ"));
    });
});

function runTests(fn: (dt: Date) => string) {
    let dt = new Date("2023-01-01T00:00:00.000Z");
    assert.equal(fn(dt), "2023-01-01T00:00:00.000Z");

    dt.setUTCFullYear(1970);
    assert.equal(fn(dt), "1970-01-01T00:00:00.000Z");

    dt.setUTCFullYear(1);
    assert.equal(fn(dt), "0001-01-01T00:00:00.000Z");

    dt.setUTCFullYear(0);
    assert.equal(fn(dt), "0000-01-01T00:00:00.000Z");

    dt.setUTCFullYear(-1);
    assert.equal(fn(dt), "-000001-01-01T00:00:00.000Z");

    dt.setUTCFullYear(10000);
    assert.equal(fn(dt), "+010000-01-01T00:00:00.000Z");

    /**
     * April 20, 271821 BCE - September 13, 275760 CE
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
     */
    dt.setUTCFullYear(-271820);
    assert.equal(fn(dt), "-271820-01-01T00:00:00.000Z");

    dt.setUTCFullYear(275760);
    assert.equal(fn(dt), "+275760-01-01T00:00:00.000Z");
}
