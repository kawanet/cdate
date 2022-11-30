import type {cDate as cDateFn, cDateNS} from "../types/cdate";
import {strftime} from "./strftime";
import {add} from "./add";
import {startOf} from "./startof";
import {toISO, tzMinutes} from "./u";
import {dateTZ, dateUTC} from "./datetz";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

interface Options {
    offset: number;
    strftime: typeof strftime;
}

export const cDate: typeof cDateFn = (dt) => {
    if (dt == null) dt = new Date();
    if (!(dt instanceof Date)) dt = new Date(dt.valueOf ? dt.valueOf() : dt);
    return new CDate(dt, null);
};

class CDate implements cDateNS.CDate {
    protected dt: cDateNS.DateRW;
    protected x: Options;

    constructor(dt: cDateNS.DateRW, x: Options) {
        this.dt = dt;
        if (x) this.x = x;
    }

    protected copy(): CDate {
        const dt = new Date(+this.dt);
        return new (this.constructor as any)(dt, this.x);
    }

    protected getDateRO(): cDateNS.DateRO {
        return this.dt;
    }

    locale(locale: cDateNS.Locale): CDate {
        const out = this.copy();
        const x = out.x = copyOptions(out.x);
        x.strftime = getStrftime(x).locale(locale);
        return out;
    }

    utc(): CDate {
        const x = copyOptions(this.x);
        x.offset = 0;
        const dt = dateUTC(+this);
        return new CDateUTC(dt, x);
    }

    timezone(offset: number | string): CDate {
        const x = copyOptions(this.x);
        offset = x.offset = tzMinutes(offset);
        const dt = dateUTC(+this + offset * d.MINUTE);
        return new CDateTZ(dt, x);
    }

    valueOf(): number {
        return +this.getDateRO();
    }

    date(): Date {
        return new Date(+this);
    }

    toJSON(): string {
        return this.date().toJSON();
    }

    toString(): string {
        return toISO(this.getDateRO());
    }

    text(fmt: string): string {
        return getStrftime(this.x)(fmt, this.getDateRO());
    }

    startOf(unit: cDateNS.UnitForAdd): CDate {
        const out = this.copy();
        startOf(out.dt, unit);
        return out;
    }

    endOf(unit: cDateNS.Unit): CDate {
        const out = this.copy();
        const {dt} = out;
        startOf(dt, unit);
        add(dt, 1, unit);
        add(dt, -1, "millisecond");
        return out;
    }

    add(diff: number, unit: cDateNS.Unit): CDate {
        const out = this.copy();
        add(out.dt, diff, unit);
        return out;
    }

    next(unit: cDateNS.Unit): CDate {
        return this.add(1, unit);
    }

    prev(unit: cDateNS.Unit): CDate {
        return this.add(-1, unit);
    }
}

class CDateUTC extends CDate {
    protected copy(): CDate {
        const dt = dateUTC(+this.dt);
        return new (this.constructor as any)(dt, this.x);
    }
}

class CDateTZ extends CDateUTC {
    protected getDateRO(): cDateNS.DateRO {
        return dateTZ(+this.dt, this.x.offset);
    }
}

const copyOptions = (x: Options): Options => x ? Object.create(x) : {};

const getStrftime = (x: Options): typeof strftime => (x && x.strftime || strftime);
