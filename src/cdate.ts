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

const cacheable = <T>(fn: ((arg: number) => T)): ((arg: number) => T) => {
    const cached: { [key: string]: T } = {};
    return arg => cached[arg] || (cached[arg] = fn(arg));
};

const getStrftime = cacheable((tz: number) => (tz ? strftime.timezone(tz) : strftime));

class CDate implements cDateNS.CDate {
    dt: Date;

    constructor(dt: Date, protected tz: number) {
        this.dt = dt;
    }

    create(dt: Date): CDate {
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
    create(dt: Date): CDate {
        return new CDateUTC(dt, this.tz);
    }

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

const lazy = <T>(fn: () => T): (() => T) => {
    let v: T;
    return () => (v || (v = fn()));
};

class CDateTZ extends CDate implements cDateNS.RODate {
    create(dt: Date): CDate {
        return new CDateTZ(dt, this.tz);
    }

    text(fmt: string): string {
        const strftime = getStrftime(this.tz);
        return strftime(fmt, this);
    }

    _dt = lazy(() => new Date(+this.dt + this.tz * d.MINUTE))

    getMilliseconds() {
        return this._dt().getUTCMilliseconds();
    }

    getSeconds() {
        return this._dt().getUTCSeconds();
    }

    getMinutes() {
        return this._dt().getUTCMinutes();
    }

    getHours() {
        return this._dt().getUTCHours();
    }

    getDay() {
        return this._dt().getUTCDay();
    }

    getDate() {
        return this._dt().getUTCDate();
    };

    getMonth() {
        return this._dt().getUTCMonth();
    }

    getFullYear() {
        return this._dt().getUTCFullYear();
    }

    getTimezoneOffset() {
        return this.tz;
    }
}