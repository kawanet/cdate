# cdate - a compact calendar date

[![Node.js CI](https://github.com/kawanet/cdate/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/cdate/actions/)
[![npm version](https://img.shields.io/npm/v/cdate)](https://www.npmjs.com/package/cdate)
[![gzip size](https://img.badgesize.io/https://unpkg.com/cdate/dist/cdate.min.js?compression=gzip)](https://unpkg.com/cdate/dist/cdate.min.js)

- Fast: the benchmark result shows that [cdate](https://github.com/kawanet/cdate) is 37% faster than 
  [Moment.js](https://www.npmjs.com/package/moment), 
  [Day.js](https://www.npmjs.com/package/dayjs) and
  [Luxon](https://www.npmjs.com/package/luxon)
- Display: Moment.js-style `.format("YYYY-MM-DD HH:mm:ss")`
- Developer friendly display: [strftime](https://man.openbsd.org/strftime.3)-style `.text("%Y-%m-%d %H:%M:%S")`
- Manipulation: `.add(1, "month").startOf("week").endOf("day")` like Moment.js does but immutable
- Time zones: names like `America/New_York` supported by
  [Intl.DateTimeFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
  as well as UTC offset like `GMT-05:00`
- I18N: `.locale("fr").text("%c")` results `dim. 2 janv. 2022, 03:04:05` also managed by Intl.DateTimeFormat
- Small: [9KB minified](https://cdn.jsdelivr.net/npm/cdate/dist/cdate.min.js) and less than 4KB gzip including time zones supported per default
- Fully immutable: even plugins never effect the cdate's core.
  None of ["dual package hazard"](https://nodejs.org/api/packages.html#dual-package-hazard)
- Pure ESM, CommonJS - Node.js, Browsers, TypeScript

## SYNOPSIS

```js
// ESM
import {cdate} from "cdate";

// CommonJS
const {cdate} = require("cdate"); 
```

Display:

```js
const now = cdate();

console.log(now.format("YYYY-MM-DD HH:mm:ss.SSSZ"));

console.log(now.text("%Y-%m-%d %H:%M:%S.%L%:z"));
```

Get + Set:

```js
const isLeapYear = (year) => {
    return cdate().set("year", year).set("month", 1).endOf("month").get("date") === 29;
}

isLeapYear(2020); // => true
isLeapYear(2021); // => false
isLeapYear(2022); // => false
isLeapYear(2023); // => false
isLeapYear(2024); // => true
```

Manipulation:

```js
const today = cdate("2023-01-01");
console.log(today.format("   MMMM YYYY"));

const start = today.startOf("month").startOf("week");
const end = today.endOf("month").endOf("week");

for (let day = start; +day < +end;) {
    const week = [];
    for (let i = 0; i < 7; i++) {
        week.push(day.format("DD"))
        day = day.next("day");
    }
    console.log(week.join(" "));
}
```

Result:

```txt
   January 2023
01 02 03 04 05 06 07
08 09 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30 31 01 02 03 04
```

Locale and time zone:

```js
const tokyo = cdate("2023-01-01T00:00:00Z").tz("Asia/Tokyo");

console.log(tokyo.text());
// => 2023-01-01T09:00:00.000+09:00

console.log(tokyo.locale("ja").text("%c"));
// => 2023年1月1日(日) 09:00:00
```

## TYPESCRIPT

See TypeScript declaration [index.d.ts](https://github.com/kawanet/cdate/blob/main/index.d.ts) for detail. API may
change.

## BENCHMARK

The result shows that cdate is 37% faster than moment!

| Library | Version | Minified Size | Local Time Bench | Time Zone Bench | Note             | 
|---------|---------|--------------:|-----------------:|----------------:|------------------|
| cdate   | 0.0.3   |          9 KB |    7,907 ops/sec |   5,494 ops/sec | fastest! 🍺      |
| moment  | 2.29.4  |       100 KB+ |    6,098 ops/sec |   3,660 ops/sec | big tz database  |
| dayjs   | 1.11.7  |         11 KB |    3,823 ops/sec |      90 ops/sec | DST related bugs |
| luxon   | 3.1.1   |         74 KB |      955 ops/sec |     158 ops/sec | different API    |

Tested on node v18.12.1, Apple Silicon M1, MacBook Pro.
"Minified Size" above includes the time zone plugin.
Each `1 op` above includes:

- 192 ops of `.add()` manipulations
- 60 ops of `.startOf()` and `.endOf()`
- 30 ops of `.format()` displaying

Try the benchmark on your environment:

```sh
git clone --depth=1 https://github.com/kawanet/cdate.git
cd cdate
npm install
npm run build 
node cli/benchmark.js
```

## PLUGIN SYSTEM

To be minimal, the cdate itself has many missing features compared to Moment.js's gorgeous APIs.
If you need `subtract()` method, for example, you can add it with your own plugin:

```js
const cdateS = cdate().plugin(P => class extends P {
    subtract(diff, unit) {
        return this.add(-diff, unit);
    }
}).cdateFn();

cdateS("2023-01-01").subtract(1, "day").format("YYYY-MM-DD");
// => '2022-12-31'
```

Or just call `add()` method simply with a negative value:

```js
cdate("2023-01-01").add(-1, "day").format("YYYY-MM-DD");
// => '2022-12-31'
```

Note that the `subtract()` method implemented above is available only for instances created by `cdateS()` function,
as the cdate's plugin system is immutable as well.

## LINKS

- https://github.com/kawanet/cdate
- https://github.com/kawanet/cdate-locale
- https://github.com/kawanet/cdate-moment
- https://www.npmjs.com/package/cdate
