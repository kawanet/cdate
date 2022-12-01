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
    offset?: number;
    strftime?: typeof strftime;
}

export const cDate: typeof cDateFn = (dt) => {
    if (dt == null) {
        dt = new Date();
    } else if ("string" === typeof dt) {
        dt = new Date(dt);
    }
    return new CDateLocal(dt, null);
};

abstract class Base {
    /**
     * millisecond since the UNIX epoch
     */
    protected t: number | cDateNS.DateRO;

    /**
     * options container
     */
    protected x: Options;

    /**
     * the constructor
     */
    constructor(t: number | Date, x: Options) {
        this.t = t;
        this.x = x;
    }

    /**
     * creates another CDate object
     */
    cdate(ms: number | cDateNS.DateRO): this {
        return new (this.constructor as any)(ms, this.x);
    }

    /**
     * updates strftime option with the give locale
     */
    locale(locale: cDateNS.Locale): this {
        const out = this.cdate(+this);
        const x = out.x = copyOptions(out.x);
        x.strftime = getStrftime(x).locale(locale);
        return out;
    }
}

abstract class CDate extends Base implements cDateNS.CDate {
    /**
     * returns DateRW for duplication
     */
    protected abstract rw(): cDateNS.DateRW;

    /**
     * returns DateRO for displaying
     */
    protected abstract ro(): cDateNS.DateRO;

    /**
     * returns UTC version of CDate
     */
    utc(): cDateNS.CDate {
        const x = copyOptions(this.x);
        x.offset = 0;
        return new CDateUTC(+this, x);
    }

    /**
     * returns timezone version of CDate
     */
    timezone(offset: number | string): cDateNS.CDate {
        const x = copyOptions(this.x);
        offset = x.offset = tzMinutes(offset);
        const dt = +this + offset * d.MINUTE;
        return new CDateTZ(dt, x);
    }

    /**
     * returns milliseconds since the epoch
     */
    valueOf(): number {
        return +this.ro();
    }

    /**
     * returns a raw Date object
     */
    date(): Date {
        return new Date(+this);
    }

    /**
     * returns a JSON string
     */
    toJSON(): string {
        return this.date().toJSON();
    }

    /**
     * returns an ISO string
     */
    toString(): string {
        return toISO(this.ro());
    }

    /**
     * returns a text formatted
     */
    text(fmt: string): string {
        return getStrftime(this.x)(fmt, this.ro());
    }

    /**
     * returns a new CDate object manipulated
     */
    startOf(unit: cDateNS.UnitForAdd): this {
        const dt = this.rw();
        startOf(dt, unit);
        return this.cdate(dt);
    }

    /**
     * returns a new CDate object manipulated
     */
    endOf(unit: cDateNS.Unit): this {
        const dt = this.rw();
        startOf(dt, unit);
        add(dt, 1, unit);
        add(dt, -1, "millisecond");
        return this.cdate(dt);
    }

    /**
     * returns a new CDate object manipulated
     */
    add(diff: number, unit: cDateNS.Unit): this {
        const dt = this.rw();
        add(dt, diff, unit);
        return this.cdate(dt);
    }

    /**
     * returns a new CDate object manipulated
     */
    next(unit: cDateNS.Unit): this {
        return this.add(1, unit);
    }

    /**
     * returns a new CDate object manipulated
     */
    prev(unit: cDateNS.Unit): this {
        return this.add(-1, unit);
    }
}

class CDateLocal extends CDate {
    /**
     * returns DateRO for displaying
     */
    protected ro(): cDateNS.DateRO {
        if (this.t instanceof Date) return this.t;
        return new Date(+this.t);
    }

    /**
     * returns DateRW for duplication
     */
    protected rw(): cDateNS.DateRW {
        return new Date(+this.t);
    }
}

class CDateUTC extends CDate {
    /**
     * returns DateRO for displaying
     */
    protected ro(): cDateNS.DateRO {
        return dateUTC(+this.t);
    }

    /**
     * returns DateRW for duplication
     */
    protected rw(): cDateNS.DateRW {
        return dateUTC(+this.t);
    }
}

class CDateTZ extends CDateUTC {
    /**
     * returns DateRO for displaying
     */
    protected ro(): cDateNS.DateRO {
        return dateTZ(+this.t, this.x.offset);
    }
}

const copyOptions = (x: Options): Options => x ? Object.create(x) : {};

const getStrftime = (x: Options): typeof strftime => (x && x.strftime || strftime);
