import type {cdate as cdateNS} from "../index.js";
import {formatPlugin} from "./format/texter.js";
import {calcPlugin} from "./calc/calc.js";
import {utcPlugin} from "./timezone/dateutc.js";
import {tzPlugin} from "./timezone/timezone.js";
import {localePlugin} from "./locale/locale.js";

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
        this.x = x || {};
    }

    /**
     * creates another CDate object
     */
    cdate(dt?: number | string | Date) {
        if (dt == null) {
            dt = new Date(); // now
        } else if ("string" === typeof dt) {
            dt = new Date(dt); // parse ISO string
        } else {
            dt = new Date(+dt); // number or DateLike
        }
        return this.create(dt);
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

    plugin<T, X>(fn: cdateNS.cPlugin<T, X>) {
        const CDateClass = this.constructor as cdateNS.cClass<{}, X>;
        const CDateX = fn(CDateClass) || CDateClass;
        return new CDateX(this.t, this.x as X);
    }

    /**
     * creates another CDate object with the DateLike given
     */
    create(dt: number | cdateNS.DateLike) {
        return new (this.constructor as cdateNS.cClass)(dt, this.x);
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

const root = new CDateCore(0, {})
    .plugin(formatPlugin)
    .plugin(calcPlugin)
    .plugin(localePlugin)
    .plugin(utcPlugin)
    .plugin(tzPlugin);

export const cdate: cdateNS.cdate = (dt) => root.cdate(dt) as unknown as cdateNS.CDate;
