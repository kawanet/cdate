import {strftime} from "./strftime";
import type {cDate as cDateFn, cDateNS} from "../types/cdate";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

export const cDate: typeof cDateFn = (dt) => {
    if (dt == null) dt = new Date();
    if (!(dt instanceof Date)) dt = new Date(dt.valueOf ? dt.valueOf() : dt);
    return new CDate(dt);
};

class CDate implements cDateNS.CDate {
    dt: Date;

    constructor(dt: Date, offset?: number) {
        if (+offset) dt = new Date(+dt + offset);
        this.dt = dt;
    }

    valueOf(): number {
        return +this.dt;
    }

    date(): Date {
        return new Date(this.dt);
    }

    toJSON(): string {
        return this.dt.toJSON();
    }

    toString(): string {
        return this.text("%Y-%m-%dT%H:%M:%S.%L%:z");
    }

    text(fmt: string): string {
        return strftime(fmt, this.dt);
    }

    startOf(unit: cDateNS.UnitForAdd): CDate {
        let {dt} = this;

        const tz = dt.getTimezoneOffset() * d.MINUTE;
        let div = 0;

        switch (unit) {
            case "week": {
                const m = this.startOf("day");
                dt = m.dt;
                dt = new Date(+dt - dt.getDay() * d.DAY);
                break;
            }

            case "year": {
                const m = this.startOf("day");
                dt = m.dt;
                dt.setMonth(0);
                dt.setDate(1);
                break;
            }

            case "month": {
                const m = this.startOf("day");
                dt = m.dt;
                dt.setDate(1);
                break;
            }

            case "date":
            case "day":
                div = d.DAY;
                break;

            case "hour":
                div = d.HOUR;
                break;

            case "minute":
                div = d.MINUTE;
                break;

            case "second":
                div = d.SECOND;
                break;
        }

        if (div) {
            dt = new Date(Math.trunc((+dt - tz) / div) * div + tz);
        }

        return new CDate(dt);
    }

    endOf(unit: cDateNS.Unit): CDate {
        const date = this.startOf(unit).add(1, unit);
        return new CDate(date.dt, -1);
    }

    add(diff: number, unit: cDateNS.Unit): CDate {
        let {dt} = this;
        diff -= 0;
        if (!diff) return this;

        switch (unit) {
            case "year":
                diff *= 12;
            // go through to the next case

            case "month":
                dt = this.date();
                const year = dt.getFullYear();
                const month = dt.getMonth();
                const date = dt.getDate();
                dt.setDate(1);
                let newMonth = year * 12 + month + diff;
                dt.setFullYear(Math.trunc(newMonth / 12));
                newMonth %= 12;
                dt.setMonth(newMonth);
                dt.setDate(date);
                if (newMonth !== dt.getMonth() && date > dt.getDate()) {
                    dt.setDate(0); // the very last day of the previous month
                }
                break;

            case "week":
                dt = new Date(+dt + diff * d.DAY * 7);
                break;

            case "day":
                dt = new Date(+dt + diff * d.DAY);
                break;

            case "hour":
                dt = new Date(+dt + diff * d.HOUR);
                break;

            case "minute":
                dt = new Date(+dt + diff * d.MINUTE);
                break;

            case "second":
                dt = new Date(+dt + diff * d.SECOND);
                break;
        }

        return new CDate(dt);
    }

    next(unit: cDateNS.Unit): CDate {
        return this.add(1, unit);
    }

    prev(unit: cDateNS.Unit): CDate {
        return this.add(-1, unit);
    }
}
