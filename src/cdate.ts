import type {cdate as cdateNS} from "../index.js";
import {formatPlugin} from "./format/texter.js";
import {calcPlugin} from "./calc/calc.js";
import {adjustDateLike, tzPlugin} from "./timezone/timezone.js";
import {DateUTC} from "./timezone/dateutc.js";

class CDateCore {
    /**
     * millisecond since the UNIX epoch
     */
    readonly t: number | cdateNS.DateLike;

    /**
     * read-only version of DateLike
     */
    private d: cdateNS.DateLike;

    /**
     * options container
     */
    readonly x: cdateNS.Options;

    /**
     * the constructor
     */
    constructor(t: number | cdateNS.DateLike, x: cdateNS.Options) {
        this.t = t;
        if ("number" !== typeof t) {
            this.d = t;
        }
        this.x = x || Object.create({cdate: {}});
    }

    /**
     * cdate function factory
     */
    cdateFn(): cdateNS.cdate {
        return cdateFn(this as unknown as cdateNS.Internal);
    }

    /**
     * returns a read-write version of DateLike for manipulation
     */
    rw(): cdateNS.DateLike {
        const t = +this.t;
        const rw = this.x.rw;
        return rw ? rw(t) : new Date(t);
    }

    /**
     * returns a read-only version of DateLike for displaying
     */
    ro(): cdateNS.DateLike {
        return this.d || (this.d = this.rw());
    }

    /**
     * returns milliseconds since the epoch
     */
    valueOf(): number {
        return +this.ro();
    }

    /**
     * returns a bare Date object
     */
    toDate(): Date {
        return new Date(+this);
    }

    /**
     * returns a JSON representation of Date
     */
    toJSON(): string {
        return this.toDate().toJSON();
    }

    /**
     * returns an instance including the plugin
     */
    plugin<T, X>(fn: cdateNS.Plugin<T, X>) {
        const CDateClass = this.constructor as cdateNS.Class<{}, X>;
        const CDateX = fn(CDateClass) || CDateClass;
        return new CDateX(this.t, this.x as X);
    }

    /**
     * creates another CDate object with the DateLike given
     */
    create(dt: number | cdateNS.DateLike) {
        return new (this.constructor as cdateNS.Class)(dt, this.x);
    }

    /**
     * clones the CDate object
     */
    inherit() {
        const out = this.create(+this);
        // x is readonly
        (out as { x: typeof out.x }).x = Object.create(out.x);
        return out;
    }
}

const cdateFn = (base: cdateNS.Internal): cdateNS.cdate => {
    return (dt) => {
        if (dt == null) {
            dt = new Date(); // now
        } else if ("string" === typeof dt) {
            dt = +parseDate(dt, base.x.rw);
        }

        return base.create(+dt);
    };
};

const parseDate = (dt: string, rwFn: (t: number) => cdateNS.DateLike): cdateNS.DateLike => {
    const matched = dt.match(/^(\d{4})(?:([-/])(\d{2})(?:\2(\d{2})(?:[T\s]((\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?))?)?)?$/);
    if (!matched) {
        return new Date(dt); // native parser
    }

    // ISO 8601 parser
    const year = +matched[1] || 0;
    const month = +matched[3] - 1 || 0;
    const date = +matched[4] || 1;
    const hour = +matched[6] || 0;
    const minute = +matched[7] || 0;
    const second = +matched[8] || 0;
    const ms = (+matched[9]) * 1000 || 0;
    const yoffset = (0 <= year && year < 100) ? 100 : 0;

    if (rwFn) {
        // UTC
        const tmp = new Date(Date.UTC(year + yoffset, month, date, hour, minute, second, ms));
        if (yoffset) tmp.setUTCFullYear(year);
        const dt1 = new DateUTC(+tmp); // DateUTC only
        const dt2 = rwFn(+tmp); // DateUTC or DateTZ
        adjustDateLike(dt1, dt2, true);
        return dt2;
    } else {
        // local time
        const dt = new Date(year + yoffset, month, date, hour, minute, second, ms);
        if (yoffset) dt.setFullYear(year);
        return dt;
    }
}

export const cdate: cdateNS.cdate = new CDateCore(0, null)
    .plugin(formatPlugin)
    .plugin(calcPlugin)
    .plugin(tzPlugin)
    .cdateFn();
