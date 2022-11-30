import type {cDate as cDateFn, cDateNS} from "../types/cdate";
import {strftime} from "./strftime";
import {add} from "./add";
import {startOf} from "./startof";
import {tzMinutes} from "./u";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
}

export const cDate: typeof cDateFn = (dt) => {
    if (dt == null) dt = new Date();
    if (!(dt instanceof Date)) dt = new Date(dt.valueOf ? dt.valueOf() : dt);
    return new CDate(dt, null);
};

class CDate implements cDateNS.CDate {
    dt: Date;

    constructor(dt: Date, protected tz: number) {
        this.dt = dt;
    }

    protected create(dt: Date): CDate {
        return new (this.constructor as any)(dt, this.tz);
    }

    utc(): CDate {
        return new CDateUTC(this.dt, 0);
    }

    timezone(offset: number | string): CDate {
        offset = tzMinutes(offset);
        return new CDateTZ(this.dt, offset);
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
        const {tz} = this;
        return this.create(startOf(this.dt, unit, tz));
    }

    endOf(unit: cDateNS.Unit): CDate {
        const {tz} = this;
        let dt = startOf(this.dt, unit, tz);
        dt = add(dt, 1, unit, tz);
        dt = new Date(+dt - 1);
        return this.create(dt);
    }

    add(diff: number, unit: cDateNS.Unit): CDate {
        diff -= 0;
        if (!diff) return this;
        const {tz} = this;
        return this.create(add(this.dt, diff, unit, tz));
    }

    next(unit: cDateNS.Unit): CDate {
        return this.add(1, unit);
    }

    prev(unit: cDateNS.Unit): CDate {
        return this.add(-1, unit);
    }
}

class CDateUTC extends CDate implements cDateNS.RODate {
    text(fmt: string): string {
        return strftime(fmt, this);
    }

    getMilliseconds() {
        return this.dt.getUTCMilliseconds();
    }

    getSeconds() {
        return this.dt.getUTCSeconds();
    }

    getMinutes() {
        return this.dt.getUTCMinutes();
    }

    getHours() {
        return this.dt.getUTCHours();
    }

    getDay() {
        return this.dt.getUTCDay();
    }

    getDate() {
        return this.dt.getUTCDate();
    };

    getMonth() {
        return this.dt.getUTCMonth();
    }

    getFullYear() {
        return this.dt.getUTCFullYear();
    }

    getTimezoneOffset() {
        return 0;
    }
}

class CDateTZ extends CDateUTC {
    constructor(dt: Date, tz: number) {
        dt = new Date(+dt + tz * d.MINUTE)
        super(dt, tz);
    }

    text(fmt: string): string {
        return strftime(fmt, this);
    }

    getTimezoneOffset() {
        return this.tz;
    }
}