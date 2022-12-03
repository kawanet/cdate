import type {cdateNS} from "../types/cdate";
import {add} from "./add";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const startOfMonth = (dt: cdateNS.DateRW): void => {
    startOfDay(dt);
    add(dt, 1 - dt.getDate(), "day");
};

const startOfDay = (dt: cdateNS.DateRW): void => {
    const tz1 = dt.getTimezoneOffset();
    truncate(dt, d.DAY);
    const tz2 = dt.getTimezoneOffset();

    // adjustment for Daylight Saving Time (DST)
    if (tz1 !== tz2) {
        dt.setTime(+dt + (tz1 - tz2) * d.MINUTE);
    }
};

const truncate = (dt: cdateNS.DateRW, unit: number): void => {
    const tz = dt.getTimezoneOffset() * d.MINUTE;
    dt.setTime(Math.trunc((+dt - tz) / unit) * unit + tz);
};

export const startOf = (dt: cdateNS.DateRW, unit: string): void => {
    switch (unit) {
        case "year":
            startOfMonth(dt);
            return add(dt, -dt.getMonth(), "month");

        case "month":
            return startOfMonth(dt);

        case "week":
            startOfDay(dt);
            return add(dt, -dt.getDay(), "day");

        case "date":
        case "day":
            return startOfDay(dt);

        case "hour":
            truncate(dt, d.HOUR);
            break;

        case "minute":
            truncate(dt, d.MINUTE);
            break;

        case "second":
            truncate(dt, d.SECOND);
            break;
    }
};
