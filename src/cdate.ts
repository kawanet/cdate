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
    /**
     * DateRW for manipulating
     */
    protected dt: cDateNS.DateRW;

    /**
     * options container
     */
    protected x: Options;

    /**
     * the constructor
     */
    constructor(dt: cDateNS.DateRW, x: Options) {
        this.dt = dt;
        if (x) this.x = x;
    }

    /**
     * duplicates itself for father manipulation
     */
    protected copy(): CDate {
        const dt = new Date(+this.dt);
        return new (this.constructor as any)(dt, this.x);
    }

    /**
     * returns DateRO for displaying
     */
    protected getDate(): cDateNS.DateRO {
        return this.dt;
    }

    /**
     * updates strftime option with the give locale
     */
    locale(locale: cDateNS.Locale): CDate {
        const out = this.copy();
        const x = out.x = copyOptions(out.x);
        x.strftime = getStrftime(x).locale(locale);
        return out;
    }

    /**
     * returns UTC version of CDate
     */
    utc(): CDate {
        const x = copyOptions(this.x);
        x.offset = 0;
        const dt = dateUTC(+this);
        return new CDateUTC(dt, x);
    }

    /**
     * returns timezone version of CDate
     */
    timezone(offset: number | string): CDate {
        const x = copyOptions(this.x);
        offset = x.offset = tzMinutes(offset);
        const dt = dateUTC(+this + offset * d.MINUTE);
        return new CDateTZ(dt, x);
    }

    /**
     * returns milliseconds since the epoch
     */
    valueOf(): number {
        return +this.getDate();
    }

    /**
     * returns a raw Date object
     */
    toDate(): Date {
        return new Date(+this);
    }

    /**
     * returns a JSON string
     */
    toJSON(): string {
        return this.toDate().toJSON();
    }

    /**
     * returns an ISO string
     */
    toString(): string {
        return toISO(this.getDate());
    }

    /**
     * returns a text formatted
     */
    text(fmt: string): string {
        return getStrftime(this.x)(fmt, this.getDate());
    }

    /**
     * returns a new CDate object manipulated
     */
    startOf(unit: cDateNS.UnitForAdd): CDate {
        const out = this.copy();
        startOf(out.dt, unit);
        return out;
    }

    /**
     * returns a new CDate object manipulated
     */
    endOf(unit: cDateNS.Unit): CDate {
        const out = this.copy();
        const {dt} = out;
        startOf(dt, unit);
        add(dt, 1, unit);
        add(dt, -1, "millisecond");
        return out;
    }

    /**
     * returns a new CDate object manipulated
     */
    add(diff: number, unit: cDateNS.Unit): CDate {
        const out = this.copy();
        add(out.dt, diff, unit);
        return out;
    }

    /**
     * returns a new CDate object manipulated
     */
    next(unit: cDateNS.Unit): CDate {
        return this.add(1, unit);
    }

    /**
     * returns a new CDate object manipulated
     */
    prev(unit: cDateNS.Unit): CDate {
        return this.add(-1, unit);
    }
}

class CDateUTC extends CDate {
    /**
     * duplicates itself for father manipulation
     */
    protected copy(): CDate {
        const dt = dateUTC(+this.dt);
        return new (this.constructor as any)(dt, this.x);
    }
}

class CDateTZ extends CDateUTC {
    /**
     * returns DateRO for displaying
     */
    protected getDate(): cDateNS.DateRO {
        return dateTZ(+this.dt, this.x.offset);
    }
}

const copyOptions = (x: Options): Options => x ? Object.create(x) : {};

const getStrftime = (x: Options): typeof strftime => (x && x.strftime || strftime);
