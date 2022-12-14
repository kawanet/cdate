# cdate - a compact calendar date

[![Node.js CI](https://github.com/kawanet/cdate/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/cdate/actions/)
[![npm version](https://img.shields.io/npm/v/cdate)](https://www.npmjs.com/package/cdate)
[![gzip size](https://img.badgesize.io/https://unpkg.com/cdate/dist/cdate.min.js?compression=gzip)](https://unpkg.com/cdate/dist/cdate.min.js)

- Fast: the benchmark results shows that [cdate](https://github.com/kawanet/cdate) is faster
  than [Moment.js](https://www.npmjs.com/package/moment), [Day.js](https://www.npmjs.com/package/dayjs)
  and [Luxon](https://www.npmjs.com/package/luxon)
- Display: `moment`-style `.format("YYYY-MM-DD HH:mm:ss")`
- Developer friendly display: `strftime`-style `.text("%Y-%m-%d %H:%M:%S")`
- Manipulation: `.add(1, "month").startOf("week").endOf("day")` like `moment` does but immutable
- Timezone: names like `America/New_York` supported by `Intl.DateTimeFormat` as well as UTC offset like `GMT-05:00`
- I18N: `.locale("fr").text("%c")` results `dim. 2 janv. 2022, 03:04:05` managed by `Intl.DateTimeFormat`
- Small: [8KB minified](https://cdn.jsdelivr.net/npm/cdate/dist/cdate.min.js) and 3KB gzip including time zone supports
- Fully immutable: no need to take care for the *"dual package hazard"* even for the plugins
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
    return cdate().set("year", year).set("month", 1).set("date", 29).get("date") === 29;
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

Results:

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

## LINKS

- https://github.com/kawanet/cdate
- https://github.com/kawanet/cdate-locale
- https://www.npmjs.com/package/cdate
