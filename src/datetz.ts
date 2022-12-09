import {getTZ} from "./tz.js";
import type {cdateNS} from "../types/cdate";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

abstract class DateLikeBase implements cdateNS.DateLike {
    constructor(protected dt: Date) {
        //
    }

    abstract valueOf(): number;

    abstract setTime(msec: number): number;

    abstract getTimezoneOffset(): number;

    getMilliseconds() {
        return this.dt.getUTCMilliseconds();
    }

    getSeconds() {
        return this.dt.getUTCSeconds();
    }

    getMinutes() {
        return this.dt.getUTCMinutes();
    }

    getHours() {
        return this.dt.getUTCHours();
    }

    getDay() {
        return this.dt.getUTCDay();
    }

    getDate() {
        return this.dt.getUTCDate();
    };

    getMonth() {
        return this.dt.getUTCMonth();
    }

    getFullYear() {
        return this.dt.getUTCFullYear();
    }

    getTime() {
        return +this;
    }
}

class DateUTC extends DateLikeBase {
    valueOf(): number {
        return +this.dt;
    }

    setTime(msec: number) {
        return this.dt.setTime(msec);
    }

    getTimezoneOffset() {
        return 0; // always UTC
    }
}

class DateTZ extends DateLikeBase {
    // dt: Date; // UTC
    private t: number; // local time
    private tzf: ReturnType<typeof getTZ>;
    private tzo: number;

    constructor(dt: Date, timezone: string) {
        const t = +dt;
        const tzf = getTZ(timezone);
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

export function dateUTC(dt: number): cdateNS.DateLike {
    return new DateUTC(new Date(+dt));
}

export function dateTZ(dt: number, timezone: string): cdateNS.DateLike {
    return new DateTZ(new Date(+dt), timezone);
}