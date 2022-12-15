import type {cdate} from "../../index.js";
import {getTZF, TZF} from "./tzf.js";
import {DateUTC} from "./dateutc.js";
import {cached} from "../cache.js";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

class DateTZ extends DateUTC {
    // dt: Date; // UTC
    private t: number; // local time
    private tzf: TZF;
    private tzo: number;

    constructor(dt: Date, tzf: TZF) {
        const t = +dt;
        const tzo = tzf(t);
        super(new Date(t + tzo * d.MINUTE));
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
        utc() {
            const out = this.inherit();
            out.x.rw = (dt) => new DateUTC(new Date(+dt));
            return out;
        }

        /**
         * "+0900", "+09:00", "GMT+09:00", "Z", "UTC",...
         */
        utcOffset(offset: string) {
            const out = this.inherit();
            out.x.rw = (dt) => new DateTZ(new Date(+dt), parseTZ(offset));
            return out;
        }

        /**
         * "Asia/Tokyo", "America/New_York",...
         */
        tz(timezone: string) {
            const out = this.inherit();
            out.x.rw = (dt) => new DateTZ(new Date(+dt), getTZF(timezone));
            return out;
        }
    }
};

const parseTZ = cached((tz: string): TZF => {
    const matched = tz.match(/(?:^|GMT)?(?:([+-])([01]?\d):?(\d[05])|$)|(UTC|Z)$/);
    if (!matched) return;
    let offset = ((+matched[2]) * 60 + (+matched[3])) | 0;
    if (matched[1] === "-") offset = -offset;

    return (_) => offset;
});
