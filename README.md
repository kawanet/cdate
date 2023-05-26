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
  API as well as UTC offset like `GMT-05:00`
- I18N: `.locale("fr").text("%c")` results `dim. 2 janv. 2022, 03:04:05` also managed by Intl API
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

## TYPESCRIPT

See TypeScript declaration [index.d.ts](https://github.com/kawanet/cdate/blob/main/index.d.ts) for detail. API may
change.

## BENCHMARK

The result shows that cdate is 37% faster than moment!

| Library | Version | Minified Size | Local Time Bench | Time Zone Bench | Note             |
|---------|---------|--------------:|-----------------:|----------------:|------------------|
| cdate   | 0.0.5   |          9 KB |    7,868 ops/sec |   6,471 ops/sec | fastest! 🍺      |
| moment  | 2.29.4  |       100 KB+ |    5,744 ops/sec |   3,622 ops/sec | big tz database  |
| dayjs   | 1.11.7  |         13 KB |    3,875 ops/sec |      89 ops/sec | DST related bugs |
| luxon   | 3.3.0   |         74 KB |      930 ops/sec |     158 ops/sec | different API    |

Tested on node v18.14.2, Apple Silicon M1, MacBook Pro.
"Minified Size" for dayjs includes its utc and time zone plugins.
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

## LOCALES

It supports English names: December, Sunday, etc., per default.
There are ways to change it.
The most simple way is to call `.locale()` method which enables I18N via
[Intl](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
API on demand:

```js
// English per default
cdate().format("ddd D MMM");
// => 'Sun 18 Dec'

cdate().locale("de").format("ddd D MMM");
// => 'So 18 Dez'
```

If you still need to support old environments which does not have Intl API, try
[cdate-locale](https://www.npmjs.com/package/cdate-locale)
which has a series of locale settings prebuilt via Intl API.

```js
const {locale_de} = require("cdate-locale/locale/de.js");
cdate().handler(locale_de).format("ddd D MMM");
// => 'So 18 Dez'
```

The last way is for you to code it.
Call `.handler()` method to customize handlers for `.format()` specifiers:

```js
const weekday = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const month = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const cdateDE = cdate().handler({
    ddd: (dt) => weekday[dt.getDay()],
    MMM: (dt) => month[dt.getMonth()],
}).cdateFn();

cdateDE().format("ddd D MMM");
// => 'So 18 Dez'
```

If you prefer `strftime`-style, the same `.handler()` method also works for `.text()` specifiers:

```js
const cdateDE = cdate().handler({
    "%a": (dt) => weekday[dt.getDay()],
    "%b": (dt) => month[dt.getMonth()],
}).cdateFn();

cdateDE().text("%a %-d %b");
// => 'So 18 Dez'
```

## TIMEZONES

It supports both UTC offset and timezone names
without any external modules and plugins.
If you use Japan Standard Time (JST) `GMT+09:00` for instance:

```js
const dt = new Date("2023-01-01T00:00:00+09:00");

cdate(dt).utcOffset(+9).text(); // +9 hours

cdate(dt).utcOffset(+540).text(); // +540 minutes

cdate(dt).utcOffset("+09:00").text();

cdate(dt).utcOffset("GMT+09:00").text();

cdate(dt).tz("Asia/Tokyo").text();
// => '2023-01-01T00:00:00.000+09:00'
```

If your app is designed to use a constant UTC offset value, call like `.utcOffset(+9).cdateFn()` to preset the offset. It runs faster.

```js
const cdateJST = cdate().utcOffset(+9).cdateFn();

cdateJST(dt).text(); // fast
```

## LINKS

- https://github.com/kawanet/cdate
- https://github.com/kawanet/cdate-locale
- https://github.com/kawanet/cdate-moment
- https://www.npmjs.com/package/cdate
