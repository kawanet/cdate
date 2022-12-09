#!/usr/bin/env node

import Benchmark from "benchmark";
import {cdate} from "../index.js";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import "moment-timezone"; // side effects only

dayjs.extend(utc)
dayjs.extend(timezone)

type Unit = "second" | "minute" | "hour" | "day" | "month" | "year";

interface CommonIF {
    add(diff: number, unit: Unit): CommonIF;

    startOf(unit: Unit): CommonIF;

    endOf(unit: Unit): CommonIF;

    format(fmt: string): string;
}

const runBenchmark = (maxTime: number, tests: { [key: string]: () => string }) => new Promise(resolve => {
    const suite = new Benchmark.Suite();

    Object.keys(tests).forEach(name => {
        const test = tests[name];
        console.warn(`## ${name}:\t${test()}`);
        suite.add(name, test);
    });

    if (!maxTime) return resolve(null);

    suite.on("complete", function (this: Benchmark.Suite) {
        const name = this.filter("fastest").map("name");
        console.log(`## Fastest is ${name}`);
        resolve(null);
    });

    suite.on("cycle", (event: Event) => console.log(String(event.target)));

    suite.run({async: true, maxTime});
});

const testAdd = (instance: CommonIF): string => {
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

    return instance.format("YYYY-MM-DD hh:mm:ss");
};

const testStartEnd = (instance: CommonIF): string => {
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

    return instance.format("YYYY-MM-DD hh:mm:ss");
};

const testFormat = (instance: CommonIF): string => {
    for (let i = 0; i < 10; i++) {
        instance.format("YYYY-MM-DD");
        instance.format("YYYY-MM-DD[T]hh:mm:ss");
        instance.format("YYYY-MM-DD[T]hh:mm:ss.SSSZ");
    }

    return instance.format("YYYY-MM-DD[T]hh:mm:ss.SSSZ");
};

const testMixed = (instance: CommonIF): string => {
    testAdd(instance);
    testStartEnd(instance);
    return testFormat(instance);
};

const main = async () => {
    const dt = new Date("2022-01-01 00:00:00");

    console.warn(`## add()`);
    await runBenchmark(0, {
        cdate: () => testAdd(cdate(dt)),
        moment: () => testAdd(moment(dt)),
        // dayjs: () => testAdd(dayjs(dt)),
    });

    console.warn(`## startOf().endOf()`);
    await runBenchmark(0, {
        cdate: () => testStartEnd(cdate(dt)),
        moment: () => testStartEnd(moment(dt)),
        dayjs: () => testStartEnd(dayjs(dt)),
    });

    console.warn(`## format()`);
    await runBenchmark(0, {
        cdate: () => testFormat(cdate(dt)),
        moment: () => testFormat(moment(dt)),
        dayjs: () => testFormat(dayjs(dt)),
    });

    console.warn(`## add().startOf().endOf().format()`);
    await runBenchmark(1, {
        cdate: () => testMixed(cdate(dt)),
        moment: () => testMixed(moment(dt)),
        dayjs: () => testMixed(dayjs(dt)),
    });

    console.warn(``);

    console.warn(`## tz().add()`);
    await runBenchmark(0, {
        cdate: () => testAdd(cdate(dt).tz("America/New_York")),
        moment: () => testAdd(moment(dt).tz("America/New_York")),
        dayjs: () => testAdd(dayjs(dt).tz("America/New_York")),
    });

    console.warn(`## tz().startOf().endOf()`);
    await runBenchmark(0, {
        cdate: () => testStartEnd(cdate(dt).tz("America/New_York")),
        moment: () => testStartEnd(moment(dt).tz("America/New_York")),
        dayjs: () => testStartEnd(dayjs(dt).tz("America/New_York")),
    });

    console.warn(`## tz().format()`);
    await runBenchmark(0, {
        cdate: () => testFormat(cdate(dt).tz("America/New_York")),
        moment: () => testFormat(moment(dt).tz("America/New_York")),
        dayjs: () => testFormat(dayjs(dt).tz("America/New_York")),
    });

    console.warn(`## tz().add().startOf().endOf().format()`);
    await runBenchmark(1, {
        cdate: () => testMixed(cdate(dt).tz("America/New_York")),
        moment: () => testMixed(moment(dt).tz("America/New_York")),
        dayjs: () => testMixed(dayjs(dt).tz("America/New_York")),
    });
};

main().catch(console.error);

