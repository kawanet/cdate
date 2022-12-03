import type {cdateNS} from "../types/cdate";
import {getUnitShort, Unit, unitMS} from "./unit";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const addMonth = (dt: cdateNS.DateRW, months: number): void => {
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const date = dt.getDate();

    // calculate days between the months
    const tmp = new Date(year, month, 1);
    const before = +tmp;
    const diff = year * 12 + month + months;
    tmp.setFullYear(Math.floor(diff / 12));
    const newMonth = diff % 12;
    tmp.setMonth(newMonth);
    const days = Math.round((+tmp - before) / d.DAY);

    // move days
    addDay(dt, days);

    // check an overflow
    const newDate = dt.getDate();
    if (newMonth !== dt.getMonth() && date > newDate) {
        // the very last day of the previous month
        addDay(dt, -newDate);
    }
};

const addDay = (dt: cdateNS.DateRW, days: number): void => {
    const tz1 = dt.getTimezoneOffset();
    dt.setTime(+dt + days * d.DAY);
    const tz2 = dt.getTimezoneOffset();

    // adjustment for Daylight Saving Time (DST)
    if (tz1 !== tz2) {
        dt.setTime(+dt + (tz2 - tz1) * d.MINUTE);
    }
}

export const add = (dt: cdateNS.DateRW, diff: number, unit: string): void => {
    if (!diff) return;

    const u = getUnitShort(unit);
    const msec = unitMS[u];
    if (msec) {
        dt.setTime(+dt + diff * msec);
        return;
    }

    switch (u) {
        case Unit.year:
            return addMonth(dt, diff * 12);

        case Unit.month:
            return addMonth(dt, diff);

        case Unit.week:
            return addDay(dt, diff * 7);

        case Unit.day:
            return addDay(dt, diff);
    }
}