import type {cdateNS} from "../types/cdate";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const addMonth = (dt: cdateNS.DateRW, months: number): void => {
    // move to the first day of the month
    const date = dt.getDate();
    addDay(dt, 1 - date);

    // calculate days between the months
    const before = +dt;
    const tmp = new Date(before);
    const year = tmp.getFullYear();
    const month = tmp.getMonth();
    let newMonth = year * 12 + month + months;
    tmp.setFullYear(Math.trunc(newMonth / 12));
    newMonth %= 12;
    tmp.setMonth(newMonth);
    const days = Math.trunc((+tmp - before) / d.DAY);

    // move days
    addDay(dt, days + date - 1);

    // check the month carried
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

    switch (unit) {
        case "year":
            return addMonth(dt, diff * 12);

        case "month":
            return addMonth(dt, diff);

        case "week":
            return addDay(dt, diff * 7);

        case "day":
            return addDay(dt, diff);

        case "hour":
            diff *= d.HOUR;
            break;

        case "minute":
            diff *= d.MINUTE;
            break;

        case "second":
            diff *= d.SECOND;
            break;

        case "millisecond":
            break;

        default:
            return;
    }

    if (diff) dt.setTime(+dt + diff);
}