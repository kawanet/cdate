#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import samsonjs_strftime from "strftime";

import {cdate} from "../index.js";
import {locales} from "../locale/index.js";

const TITLE = "420.extend.ts";

const samsonjs = {strftime: samsonjs_strftime as any as { localizeByIdentifier: (locale: string) => typeof samsonjs_strftime }};

describe(TITLE, () => {
    describe("samsonjs/strftime", () => {
        /**
         * localizeByIdentifier function is missing at DefinitelyTyped
         * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/strftime/index.d.ts
         * @see https://github.com/samsonjs/strftime/blob/master/strftime.js
         */
        runTests(locale => (fmt, dt) => samsonjs.strftime.localizeByIdentifier(locale)(fmt, dt));
    });

    describe("kawanet/cdate", () => {
        runTests(locale => (fmt, dt) => cdate(dt).handler(locales[locale]).text(fmt));
    });
});

function runTests(fn: (locale: keyof typeof locales) => (fmt: string, dt: Date) => string) {
    const dt = new Date("2023-04-05 06:07:08.090");
    const fmt = "%Y/%m/%d %H:%M:%S.%L";

    it("en_US", () => {
        const strftime = fn("en_US");

        assert.equal(strftime(fmt, dt), "2023/04/05 06:07:08.090");
        assert.equal(strftime(`"%A"`, dt), `"Wednesday"`, `"%A"`);
        assert.equal(strftime(`"%a"`, dt), `"Wed"`, `"%a"`);
        assert.equal(strftime(`"%B"`, dt), `"April"`, `"%B"`);
        assert.equal(strftime(`"%b"`, dt), `"Apr"`, `"%b"`);
    });

    it("fr_FR", () => {
        const strftime = fn("fr_FR");

        assert.equal(strftime(fmt, dt), "2023/04/05 06:07:08.090");
        assert.equal(strftime(`"%A"`, dt), `"mercredi"`, `"%A"`);
        assert.equal(strftime(`"%a"`, dt), `"mer."`, `"%a"`);
        assert.equal(strftime(`"%B"`, dt), `"avril"`, `"%B"`);
        assert.match(strftime(`"%b"`, dt), /"(avril|avr.)"/, `"%b"`);
    });
}
