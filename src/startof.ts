import {add} from "./add";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const startOfMonth = (dt: Date, tz: number): Date => {
    dt = startOfDay(dt, tz);
    return add(dt, 1 - dt.getDate(), "day", tz);
};

const startOfDay = (dt: Date, tz0: number): Date => {
    [tz0]; // TODO

    const tz1 = dt.getTimezoneOffset();
    const tz = tz1 * d.MINUTE;
    dt = new Date(Math.trunc((+dt - tz) / d.DAY) * d.DAY + tz);
    const tz2 = dt.getTimezoneOffset();

    // adjustment for Daylight Saving Time (DST)
    if (tz1 !== tz2) {
        dt = new Date(+dt + (tz2 - tz1) * d.MINUTE);
    }

    return dt;
};

const truncate = (dt: Date, unit: number): Date => {
    const tz = dt.getTimezoneOffset() * d.MINUTE;
    dt = new Date(Math.trunc((+dt - tz) / unit) * unit + tz);
    return dt;
};

export const startOf = (dt: Date, unit: string, tz: number): Date => {
    switch (unit) {
        case "year":
            dt = startOfMonth(dt, tz);
            return add(dt, -dt.getMonth(), "month", tz);

        case "month":
            return startOfMonth(dt, tz);

        case "week":
            dt = startOfDay(dt, tz);
            return add(dt, -dt.getDay(), "day", tz);

        case "date":
        case "day":
            return startOfDay(dt, tz);

        case "hour":
            return truncate(dt, d.HOUR);

        case "minute":
            return truncate(dt, d.MINUTE);

        case "second":
            return truncate(dt, d.SECOND);
    }

    return dt;
};
