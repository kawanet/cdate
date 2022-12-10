import type {cdateNS} from "../../types/cdate";
import {getTZF} from "./tzf.js";
import {DateUTC} from "./dateutc.js";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

class DateTZ extends DateUTC {
    // dt: Date; // UTC
    private t: number; // local time
    private tzf: ReturnType<typeof getTZF>;
    private tzo: number;

    constructor(dt: Date, timezone: string) {
        const t = +dt;
        const tzf = getTZF(timezone);
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

export const tzPlugin: cdateNS.cPlugin<cdateNS.cTimezonePlugin> = (Parent) => {
    return class CDateTZ extends Parent implements cdateNS.cTimezonePlugin {
        tz(timezone: string) {
            const out = this.inherit();
            out.x.rw = (dt) => new DateTZ(new Date(+dt), timezone);
            return out;
        }
    }
};
