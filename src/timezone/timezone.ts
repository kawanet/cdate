import type {cdate} from "../../index.js";
import {getTZF, TZF} from "./tzf.js";
import {DateUTC} from "./dateutc.js";
import {cached} from "../cache.js";
import {getUnit, Unit} from "../calc/unit.js";
import {add} from "../calc/add.js";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

class DateTZ extends DateUTC {
    private t: number; // local time
    private tzf: TZF;
    private tzo: number;

    constructor(t: number, tzf: TZF) {
        const tzo = tzf(t);
        super(t + tzo * d.MINUTE);
        this.t = t;
        this.tzf = tzf;
        this.tzo = tzo;
    }

    valueOf(): number {
        return this.t;
    }

    setTime(msec: number) {
        const tzo = this.tzo = this.tzf(msec);
        this.dt.setTime(+msec + tzo * d.MINUTE);
        return this.t = msec;
    }

    getTimezoneOffset() {
        return -this.tzo;
    }
}

export const tzPlugin: cdate.Plugin<cdate.CDateTZ> = (Parent) => {
    return class CDateTZ extends Parent implements cdate.CDateTZ {
        utc(keepLocalTime?: boolean): this {
            const out = this.inherit();
            out.x.rw = (dt) => new DateUTC(+dt);
            if (keepLocalTime) return adjustTimeZoneOffset(this, out) as this;
            return out;
        }

        /**
         * "+0900", "+09:00", "GMT+09:00", "Z", "UTC",...
         */
        utcOffset(offset?: string | number, keepLocalTime?: boolean): number | any {
            if (offset == null) {
                return 0 - getTimezoneOffset(this.ro());
            }

            const out = this.inherit();
            out.x.rw = (dt) => new DateTZ(+dt, parseTZ(offset));
            if (keepLocalTime) return adjustTimeZoneOffset(this, out) as this;
            return out;
        }

        /**
         * "Asia/Tokyo", "America/New_York",...
         */
        tz(timeZoneName: string, keepLocalTime?: boolean): this {
            const out = this.inherit();
            out.x.rw = (dt) => new DateTZ(+dt, getTZF(timeZoneName));
            if (keepLocalTime) return adjustTimeZoneOffset(this, out, true) as this;
            return out;
        }
    }
};

const adjustTimeZoneOffset = (before: cdate.Internal, after: cdate.Internal, hasDST?: boolean) => {
    const dt1 = before.ro();
    const dt2 = after.rw();
    adjustDateLike(dt1, dt2, hasDST);
    return after.create(dt2);
};

export const adjustDateLike = (before: cdate.DateLike, after: cdate.DateLike, hasDST: boolean): void => {
    const tz1 = getTimezoneOffset(before);
    const tz2 = getTimezoneOffset(after);
    if (tz1 === tz2) return;

    add(after, tz2 - tz1, Unit.minute);
    if (!hasDST) return;

    const tz3 = getTimezoneOffset(after);
    if (tz2 === tz3) return;

    // adjustment for Daylight Saving Time (DST)
    add(after, tz3 - tz2, Unit.minute);
};

const getTimezoneOffset = getUnit.TZO;

const parseTZ = cached((offset: string | number): TZF => {
    if ("number" === typeof offset) {
        if (-16 < offset && offset < 16) {
            offset *= 60;
        }
    } else {
        const matched = String(offset).match(/(?:^|GMT)?(?:([+-])([01]?\d):?(\d[05])|$)|(UTC|Z)$/);
        if (!matched) return;
        offset = ((+matched[2]) * 60 + (+matched[3])) | 0;
        if (matched[1] === "-") offset = 0 - offset;
    }

    return (_) => offset as number;
});
