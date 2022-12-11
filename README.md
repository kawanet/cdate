# cdate - a compact calendar date

[![Node.js CI](https://github.com/kawanet/cdate/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/cdate/actions/)
[![npm version](https://img.shields.io/npm/v/cdate)](https://www.npmjs.com/package/cdate)

- Fast: the benchmark results shows that [cdate](https://github.com/kawanet/cdate) is faster
  than [Moment.js](https://www.npmjs.com/package/moment), [Day.js](https://www.npmjs.com/package/dayjs)
  and [Luxon](https://www.npmjs.com/package/luxon)
- Fully immutable: no need to take care for the *"dual package hazard"* even for the plugins
- Display: `moment`-style `.format("YYYY-MM-DD hh:mm:ss")`
- Developer friendly display: `strftime`-style `.text("%Y-%m-%d %H:%M:%S")`
- Manipulation: `moment`-style `.add(1, "month").startOf("week").endOf("day")`
- Timezone: names like `America/New_York` supported by `Intl.DateTimeFormat` as well as UTC offset like `GMT-05:00`
- I18N: `.locale("fr").text("%c")` results `dim. 2 janv. 2022, 03:04:05` managed by `Intl.DateTimeFormat`
- Lightweight: 8KB minified and 3KB gzip including time zone supports
- Pure ESM, CommonJS - Node.js, Browsers, TypeScript

## SYNOPSIS

Loading: ESM or CommonJS

```js
// ESM
import {cdate} from "cdate";

// CommonJS
const {cdate} = require("cdate"); 
```

Code:

```js
const today = cdate().tz("America/New_York");
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
   December 2022
27 28 29 30 01 02 03
04 05 06 07 08 09 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
```

## TYPESCRIPT

See TypeScript declaration [cdate.d.ts](https://github.com/kawanet/cdate/blob/main/types/cdate.d.ts) for detail. API may
change.

## LINKS

- https://github.com/kawanet/cdate
- https://www.npmjs.com/package/cdate
