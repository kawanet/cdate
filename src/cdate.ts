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

interface Options {
    offset: number;
}

export const cDate: typeof cDateFn = (dt) => {
    if (dt == null) dt = new Date();
    if (!(dt instanceof Date)) dt = new Date(dt.valueOf ? dt.valueOf() : dt);
    return new CDate(dt, null);
};

class CDate implements cDateNS.CDate {
    constructor(protected dt: Date, protected x: Options) {
        //
    }

    protected create(dt: Date): CDate {
        return new (this.constructor as any)(dt, this.x);
    }

    utc(): CDate {
        const x: Options = Object.create(this.x);
        x.offset = 0;
        return new CDateUTC(this.dt, x);
    }

    timezone(offset: number | string): CDate {
        const x: Options = Object.create(this.x);
        x.offset = tzMinutes(offset);
        return new CDateTZ(this.dt, x);
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
        const {x} = this;
        return this.create(startOf(this.dt, unit, (x && x.offset)));
    }

    endOf(unit: cDateNS.Unit): CDate {
        const {x} = this;
        let dt = startOf(this.dt, unit, (x && x.offset));
        dt = add(dt, 1, unit, (x && x.offset));
        dt = new Date(+dt - 1);
        return this.create(dt);
    }

    add(diff: number, unit: cDateNS.Unit): CDate {
        diff -= 0;
        if (!diff) return this;
        const {x} = this;
        return this.create(add(this.dt, diff, unit, (x && x.offset)));
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
    constructor(dt: Date, x: Options) {
        dt = new Date(+dt + (x && x.offset || 0) * d.MINUTE)
        super(dt, x);
    }

    text(fmt: string): string {
        return strftime(fmt, this);
    }

    getTimezoneOffset() {
        const {x} = this;
        return (x && x.offset || 0);
    }
}