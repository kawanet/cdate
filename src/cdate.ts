import type {cDate as cDateFn, cDateNS} from "../types/cdate";
import {strftime} from "./strftime";
import {add} from "./add";
import {startOf} from "./startof";

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
        return new CDate(startOf(this.dt, unit));
    }

    endOf(unit: cDateNS.Unit): CDate {
        const date = this.startOf(unit).add(1, unit);
        return new CDate(date.dt, -1);
    }

    add(diff: number, unit: cDateNS.Unit): CDate {
        diff -= 0;
        if (!diff) return this;
        return new CDate(add(this.dt, diff, unit));
    }

    next(unit: cDateNS.Unit): CDate {
        return this.add(1, unit);
    }

    prev(unit: cDateNS.Unit): CDate {
        return this.add(-1, unit);
    }
}
