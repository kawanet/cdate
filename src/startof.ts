import type {cdateNS} from "../";
import {add} from "./add";
import {getUnitShort, Unit, unitMS} from "./unit";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

const startOfMonth = (dt: DateLike): void => {
    startOfDay(dt);
    add(dt, 1 - dt.getDate(), "day");
};

const startOfDay = (dt: DateLike): void => {
    const tz1 = dt.getTimezoneOffset();
    truncate(dt, d.DAY);
    const tz2 = dt.getTimezoneOffset();

    // adjustment for Daylight Saving Time (DST)
    if (tz1 !== tz2) {
        dt.setTime(+dt + (tz2 - tz1) * d.MINUTE);
    }
};

const truncate = (dt: DateLike, unit: number): void => {
    const tz = dt.getTimezoneOffset() * d.MINUTE;
    dt.setTime(Math.trunc((+dt - tz) / unit) * unit + tz);
};

export const startOf = (dt: DateLike, unit: cdateNS.UnitForStart): void => {
    const u = getUnitShort(unit);
    const msec = unitMS[u];
    if (msec) return truncate(dt, msec);

    switch (getUnitShort(unit)) {
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
    }
};
