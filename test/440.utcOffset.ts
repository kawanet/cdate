#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import moment from "moment";

import {cdate} from "../index.js";

dayjs.extend(utc)

const TITLE = "440.utcOffset.ts";

interface Common {
    utc(): Common;

    utcOffset(offset: string): Common;

    utcOffset(): number;

    format(fmt: string): string;
}

describe(TITLE, () => {
    it(`moment().utcOffset()`, () => testFn(dt => moment(dt)));

    it(`dayjs().utcOffset()`, () => testFn(dt => dayjs(dt)));

    it(`cdate().utcOffset()`, () => testFn(dt => cdate(dt)));

    function testFn(fn: (dt: Date) => Common) {
        /**
         * "America/Sao_Paulo": "-0300"
         */
        const dt = new Date("2023-01-01T12:00:00+00:00");
        const format = "YYYY/MM/DD HH:mm:ss Z";

        assert.equal(fn(dt).utc().utcOffset(), 0);
        assert.equal(fn(dt).utc().format(format), "2023/01/01 12:00:00 +00:00");

        assert.equal(fn(dt).utcOffset("+09:00").utcOffset(), 9 * 60);
        assert.equal(fn(dt).utcOffset("+09:00").format(format), "2023/01/01 21:00:00 +09:00");

        assert.equal(fn(dt).utcOffset("-03:00").utcOffset(), -3 * 60);
        assert.equal(fn(dt).utcOffset("-03:00").format(format), "2023/01/01 09:00:00 -03:00");
    }
});
