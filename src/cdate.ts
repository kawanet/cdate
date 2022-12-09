import type {cdate as cdateFn, cdateNS} from "../types/cdate";
import {formatPlugin} from "./format/texter.js";
import {calcPlugin} from "./calc/calc.js";
import {utcPlugin} from "./timezone/dateutc.js";
import {tzPlugin} from "./timezone/datetz.js";
import {localePlugin} from "./locale/locale.js";

export const cdate: typeof cdateFn = (dt) => {
    if ("string" === typeof dt) {
        dt = new Date(dt);
    }
    return root.cdate(dt);
};

class CDateCore {
    /**
     * millisecond since the UNIX epoch
     */
    protected readonly t: number | cdateNS.DateLike;

    /**
     * read-only version of DateLike
     */
    private d: cdateNS.DateLike;

    /**
     * options container
     */
    protected x: cdateNS.Options;

    /**
     * the constructor
     */
    constructor(t: number | cdateNS.DateLike, x: cdateNS.Options) {
        if (t == null) {
            t = new Date();
        }
        this.t = t;
        if ("number" !== typeof t) {
            this.d = t;
        }
        this.x = x || {};
    }

    /**
     * creates another CDate object
     */
    cdate(ms?: number | cdateNS.DateLike) {
        return new (this.constructor as cdateNS.CDateClass)(ms, this.x);
    }

    /**
     * returns a read-write version of DateLike for manipulation
     */
    rw(): cdateNS.DateLike {
        const {x} = this;
        const {rw} = x;
        const t = +this.t;
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

    plugin(fn: cdateNS.Plugin) {
        const CDateClass = this.constructor as cdateNS.CDateClass;
        const CDateX = fn(CDateClass) || CDateClass;
        return new CDateX(this.t, this.x);
    }

    inherit() {
        const out = this.cdate(+this);
        out.x = Object.create(out.x);
        return out;
    }
}

let root = new CDateCore(0, {}) as unknown as cdateNS.CDate;

root = root.plugin(formatPlugin);
root = root.plugin(calcPlugin);
root = root.plugin(localePlugin);
root = root.plugin(utcPlugin);
root = root.plugin(tzPlugin);
