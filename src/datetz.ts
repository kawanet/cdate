import {getTZ} from "./tz.js";
import type {DateLike} from "./datelike.js";
import {strftime} from "./texter.js";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

abstract class DateLikeBase implements DateLike {
    constructor(protected dt: Date) {
        //
    }

    abstract valueOf(): number;

    abstract setTime(msec: number): number;

    abstract getTimezoneOffset(): number;

    toString(): string {
        // Fake `this` as a Date which is a DateLike actually, however.
        return strftime(null, this as unknown as Date);
    }

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

export function dateUTC(dt: number): DateLike {
    return new DateUTC(new Date(+dt));
}

export function dateTZ(dt: number, timezone: string): DateLike {
    return new DateTZ(new Date(+dt), timezone);
}