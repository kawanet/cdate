const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const addMonth = (dt: Date, months: number): Date => {
    dt = new Date(+dt);
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const date = dt.getDate();
    dt.setDate(1);
    let newMonth = year * 12 + month + months;
    dt.setFullYear(Math.trunc(newMonth / 12));
    newMonth %= 12;
    dt.setMonth(newMonth);
    dt.setDate(date);
    if (newMonth !== dt.getMonth() && date > dt.getDate()) {
        dt.setDate(0); // the very last day of the previous month
    }
    return dt;
};

const addDay = (dt: Date, days: number, tz: number): Date => {
    [tz]; // TODO

    const tz1 = dt.getTimezoneOffset();
    dt = new Date(+dt + days * d.DAY);
    const tz2 = dt.getTimezoneOffset();

    // adjustment for Daylight Saving Time (DST)
    if (tz1 !== tz2) {
        dt = new Date(+dt + (tz2 - tz1) * d.MINUTE);
    }

    return dt;
}

const addMS = (dt: Date, msec: number): Date => {
    return new Date(+dt + msec);
};

export const add = (dt: Date, diff: number, unit: string, tz: number): Date => {
    switch (unit) {
        case "year":
            return addMonth(dt, diff * 12);

        case "month":
            return addMonth(dt, diff);

        case "week":
            return addDay(dt, diff * 7, tz);

        case "day":
            return addDay(dt, diff, tz);

        case "hour":
            return addMS(dt, diff * d.HOUR);

        case "minute":
            return addMS(dt, diff * d.MINUTE);

        case "second":
            return addMS(dt, diff * d.SECOND);

        case "millisecond":
            return addMS(dt, diff);
    }

    return dt;
}