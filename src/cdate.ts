import type {cDate as cDateFn, cDateNS} from "../types/cdate";
import {strftime} from "./strftime";
import {add} from "./add";
import {startOf} from "./startof";
import {tzMinutes} from "./u";

export const cDate: typeof cDateFn = (dt) => {
    if (dt == null) dt = new Date();
    if (!(dt instanceof Date)) dt = new Date(dt.valueOf ? dt.valueOf() : dt);
    return new CDate(dt);
};

const cacheable = <T>(fn: ((arg: number) => T)): ((arg: number) => T) => {
    const cached: { [key: string]: T } = {};
    return arg => cached[arg] || (cached[arg] = fn(arg));
};

const getStrftime = cacheable((tz: number) => (tz ? strftime.timezone(tz) : strftime));

class CDate implements cDateNS.CDate {
    dt: Date;
    tz: number;

    constructor(dt: Date, tz?: number) {
        this.dt = dt;
        this.tz = tz;
        // this.tz = -dt.getTimezoneOffset();
    }

    timezone(offset: number | string) {
        return new CDate(this.dt, tzMinutes(offset));
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
        const strftime = getStrftime(this.tz);
        return strftime(fmt, this.dt);
    }

    startOf(unit: cDateNS.UnitForAdd): CDate {
        return new CDate(startOf(this.dt, unit), this.tz);
    }

    endOf(unit: cDateNS.Unit): CDate {
        let dt = startOf(this.dt, unit);
        dt = add(dt, 1, unit);
        dt = new Date(+dt - 1);
        return new CDate(dt, this.tz);
    }

    add(diff: number, unit: cDateNS.Unit): CDate {
        diff -= 0;
        if (!diff) return this;
        return new CDate(add(this.dt, diff, unit), this.tz);
    }

    next(unit: cDateNS.Unit): CDate {
        return this.add(1, unit);
    }

    prev(unit: cDateNS.Unit): CDate {
        return this.add(-1, unit);
    }
}
