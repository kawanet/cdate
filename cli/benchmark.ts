#!/usr/bin/env node

import Benchmark from "benchmark";
import {cdate} from "../index.js";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import "moment-timezone"; // side effects only
import {DateTime} from "luxon";

/**
 * @example
 * env ONLY=cdate node cli/benchmark
 * env EACH=1 node cli/benchmark
 */

dayjs.extend(utc)
dayjs.extend(timezone)

type Unit = "second" | "minute" | "hour" | "day" | "month" | "year";

// compatible interface for cdate, moment and dayjs
interface CompatIF {
    add(diff: number, unit: Unit): CompatIF;

    startOf(unit: Unit): CompatIF;

    endOf(unit: Unit): CompatIF;

    format(fmt: string): string;
}

// compatible displaying format for cdate, moment and dayjs
const COMPAT_FORMAT = "YYYY-MM-DD[T]hh:mm:ss.SSSZ";

// displaying format only for Luxon
const LUXON_FORMAT = "yyyy-MM-dd'T'hh:mm:ss.SSSZZ";

const {ONLY} = process.env;

const runBenchmark = (tests: { [key: string]: () => string }) => new Promise(resolve => {
    const suite = new Benchmark.Suite();

    Object.keys(tests).forEach(name => {
        if (ONLY && ONLY.indexOf(name) < 0) return; // skip
        const test = tests[name];
        console.warn(`## ${name}:\t${test()}`);
        suite.add(name, test);
    });

    suite.on("complete", function (this: Benchmark.Suite) {
        const name = this.filter("fastest").map("name");
        console.warn(`## Fastest is ${name}`);
        console.warn(``);
        resolve(null);
    });

    suite.on("cycle", (event: Event) => console.log(String(event.target)));

    suite.run({async: true});
});

const testAdd = (instance: CompatIF): string => {
    for (let i = 0; i < 60; i++) {
        instance = instance.add(1, "second");
    }
    for (let i = 0; i < 59; i++) {
        instance = instance.add(1, "minute");
    }
    for (let i = 0; i < 23; i++) {
        instance = instance.add(1, "hour");
    }
    for (let i = 0; i < 30; i++) {
        instance = instance.add(1, "day");
    }
    for (let i = 0; i < 11; i++) {
        instance = instance.add(-1, "month");
    }
    for (let i = 0; i < 9; i++) {
        instance = instance.add(-1, "year");
    }

    return instance.format(COMPAT_FORMAT);
};

const luxonAdd = (instance: DateTime): string => {
    for (let i = 0; i < 60; i++) {
        instance = instance.plus({second: 1});
    }
    for (let i = 0; i < 59; i++) {
        instance = instance.plus({minute: 1});
    }
    for (let i = 0; i < 23; i++) {
        instance = instance.plus({hour: 1});
    }
    for (let i = 0; i < 30; i++) {
        instance = instance.plus({day: 1});
    }
    for (let i = 0; i < 11; i++) {
        instance = instance.plus({month: -1});
    }
    for (let i = 0; i < 9; i++) {
        instance = instance.plus({year: -1});
    }

    return instance.toFormat(LUXON_FORMAT);
};

const testStartEnd = (instance: CompatIF): string => {
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("second");
        instance = instance.endOf("second");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("minute");
        instance = instance.startOf("minute");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("hour");
        instance = instance.endOf("hour");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("day");
        instance = instance.endOf("day");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("month");
        instance = instance.endOf("month");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("year");
        instance = instance.endOf("year");
    }

    return instance.format(COMPAT_FORMAT);
};

const luxonStartEnd = (instance: DateTime): string => {
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("second");
        instance = instance.endOf("second");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("minute");
        instance = instance.startOf("minute");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("hour");
        instance = instance.endOf("hour");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("day");
        instance = instance.endOf("day");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("month");
        instance = instance.endOf("month");
    }
    for (let i = 0; i < 10; i++) {
        instance = instance.startOf("year");
        instance = instance.endOf("year");
    }

    return instance.toFormat(LUXON_FORMAT);
};

const testFormat = (instance: CompatIF): string => {
    for (let i = 0; i < 10; i++) {
        instance.format("YYYY-MM-DD");
        instance.format("YYYY-MM-DD[T]hh:mm:ss");
        instance.format(COMPAT_FORMAT);
    }

    return instance.format(COMPAT_FORMAT);
};

const luxonFormat = (instance: DateTime): string => {
    for (let i = 0; i < 10; i++) {
        instance.toFormat("yyyy-MM-dd");
        instance.toFormat("yyyy-MM-dd'T'hh:mm:ss");
        instance.toFormat(LUXON_FORMAT);
    }

    return instance.toFormat(LUXON_FORMAT);
};

const testMixed = (fn: () => CompatIF): string => {
    testAdd(fn());
    testStartEnd(fn());
    return testFormat(fn());
};

const luxonMixed = (fn: () => DateTime): string => {
    luxonAdd(fn());
    luxonStartEnd(fn());
    return luxonFormat(fn());
};

const dt = new Date("2022-01-01 00:00:00");

const main = async () => {
    const RUN_EACH = !!process.env.EACH;

    if (RUN_EACH) {
        await runEachLocal();
    }
    if (!RUN_EACH) {
        await runMixedLocal();
    }
    if (RUN_EACH) {
        await runEachTZ();
    }
    if (!RUN_EACH) {
        await runMixedTZ();
    }
};

const runEachLocal = async () => {
    console.warn(`#### add()`);
    await runBenchmark({
        cdate: () => testAdd(cdate(dt)),
        moment: () => testAdd(moment(dt)),
        dayjs: () => testAdd(dayjs(dt)),
        luxon: () => luxonAdd(DateTime.fromJSDate(dt)),
    });

    console.warn(`#### startOf().endOf()`);
    await runBenchmark({
        cdate: () => testStartEnd(cdate(dt)),
        moment: () => testStartEnd(moment(dt)),
        dayjs: () => testStartEnd(dayjs(dt)),
        luxon: () => luxonStartEnd(DateTime.fromJSDate(dt)),
    });

    console.warn(`#### format()`);
    await runBenchmark({
        cdate: () => testFormat(cdate(dt)),
        moment: () => testFormat(moment(dt)),
        dayjs: () => testFormat(dayjs(dt)),
        luxon: () => luxonFormat(DateTime.fromJSDate(dt)),
    });
};

const runMixedLocal = async () => {
    console.warn(`#### add().startOf().endOf().format()`);
    await runBenchmark({
        cdate: () => testMixed(() => cdate(dt)),
        moment: () => testMixed(() => moment(dt)),
        dayjs: () => testMixed(() => dayjs(dt)),
        luxon: () => luxonMixed(() => DateTime.fromJSDate(dt)),
    });
};

const runEachTZ = async () => {
    console.warn(`#### tz().add()`);
    await runBenchmark({
        cdate: () => testAdd(cdate(dt).tz("America/New_York")),
        moment: () => testAdd(moment(dt).tz("America/New_York")),
        dayjs: () => testAdd(dayjs(dt).tz("America/New_York")),
        luxon: () => luxonAdd(DateTime.fromJSDate(dt, {zone: "America/New_York"})),
    });

    console.warn(`#### tz().startOf().endOf()`);
    await runBenchmark({
        cdate: () => testStartEnd(cdate(dt).tz("America/New_York")),
        moment: () => testStartEnd(moment(dt).tz("America/New_York")),
        dayjs: () => testStartEnd(dayjs(dt).tz("America/New_York")),
        luxon: () => luxonStartEnd(DateTime.fromJSDate(dt, {zone: "America/New_York"})),
    });

    console.warn(`#### tz().format()`);
    await runBenchmark({
        cdate: () => testFormat(cdate(dt).tz("America/New_York")),
        moment: () => testFormat(moment(dt).tz("America/New_York")),
        dayjs: () => testFormat(dayjs(dt).tz("America/New_York")),
        luxon: () => luxonFormat(DateTime.fromJSDate(dt, {zone: "America/New_York"})),
    });
};

const runMixedTZ = async () => {
    console.warn(`#### tz().add().startOf().endOf().format()`);
    await runBenchmark({
        cdate: () => testMixed(() => cdate(dt).tz("America/New_York")),
        moment: () => testMixed(() => moment(dt).tz("America/New_York")),
        dayjs: () => testMixed(() => dayjs(dt).tz("America/New_York")),
        luxon: () => luxonMixed(() => DateTime.fromJSDate(dt, {zone: "America/New_York"})),
    });
};

main().catch(console.error);
