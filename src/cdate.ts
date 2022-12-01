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

abstract class Base {
    /**
     * DateRW for manipulation
     */
    protected d: cDateNS.DateRW;

    /**
     * options container
     */
    protected x: Options;

    /**
     * returns DateRW for duplication
     */
    protected abstract rw(): cDateNS.DateRW;

    /**
     * returns DateRO for displaying
     */
    protected abstract ro(): cDateNS.DateRO;

    /**
     * the constructor
     */
    constructor(d: cDateNS.DateRW, x: Options) {
        this.d = d;
        this.x = x;
    }

    /**
     * duplicates itself for farther manipulation
     */
    protected copy(): this {
        return new (this.constructor as any)(this.rw(), this.x);
    }

    /**
     * updates strftime option with the give locale
     */
    locale(locale: cDateNS.Locale): this {
        const out = this.copy();
        const x = out.x = copyOptions(out.x);
        x.strftime = getStrftime(x).locale(locale);
        return out;
    }
}

abstract class Common extends Base implements cDateNS.CDate {
    /**
     * returns UTC version of CDate
     */
    utc(): cDateNS.CDate {
        const x = copyOptions(this.x);
        x.offset = 0;
        const dt = dateUTC(+this);
        return new CDateUTC(dt, x);
    }

    /**
     * returns timezone version of CDate
     */
    timezone(offset: number | string): cDateNS.CDate {
        const x = copyOptions(this.x);
        offset = x.offset = tzMinutes(offset);
        const dt = dateUTC(+this + offset * d.MINUTE);
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
        const out = this.copy();
        startOf(out.d, unit);
        return out;
    }

    /**
     * returns a new CDate object manipulated
     */
    endOf(unit: cDateNS.Unit): this {
        const out = this.copy();
        const {d} = out;
        startOf(d, unit);
        add(d, 1, unit);
        add(d, -1, "millisecond");
        return out;
    }

    /**
     * returns a new CDate object manipulated
     */
    add(diff: number, unit: cDateNS.Unit): this {
        const out = this.copy();
        add(out.d, diff, unit);
        return out;
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

class CDate extends Common {
    /**
     * returns DateRO for displaying
     */
    protected ro(): cDateNS.DateRO {
        return this.d;
    }

    /**
     * returns DateRW for duplication
     */
    protected rw(): cDateNS.DateRW {
        return new Date(+this.d);
    }
}

class CDateUTC extends CDate {
    /**
     * returns DateRW for duplication
     */
    protected rw(): cDateNS.DateRW {
        return dateUTC(+this.d);
    }
}

class CDateTZ extends CDateUTC {
    /**
     * returns DateRO for displaying
     */
    protected ro(): cDateNS.DateRO {
        return dateTZ(+this.d, this.x.offset);
    }
}

const copyOptions = (x: Options): Options => x ? Object.create(x) : {};

const getStrftime = (x: Options): typeof strftime => (x && x.strftime || strftime);
