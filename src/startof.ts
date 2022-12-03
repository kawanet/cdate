import type {cdateNS} from "../types/cdate";
import {add} from "./add";
import {getUnit, Unit} from "./unit";

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

export const startOf = (dt: cdateNS.DateRW, unit: cdateNS.UnitForAdd): void => {
    switch (getUnit(unit)) {
        case Unit.year:
            startOfMonth(dt);
            return add(dt, -dt.getMonth(), Unit.month);

        case Unit.month:
            return startOfMonth(dt);

        case Unit.week:
            startOfDay(dt);
            return add(dt, -dt.getDay(), Unit.day);

        case Unit.day:
            return startOfDay(dt);

        case Unit.hour:
            truncate(dt, d.HOUR);
            break;

        case Unit.minute:
            truncate(dt, d.MINUTE);
            break;

        case Unit.second:
            truncate(dt, d.SECOND);
            break;
    }
};
