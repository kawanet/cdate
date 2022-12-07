import type {getTZ} from "./tz.js";
import type {DateLike} from "./datelike.js";
import {toISO} from "./iso.js";

type TZ = ReturnType<typeof getTZ>;

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
        return toISO(this);
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
    protected tz: TZ;
    private tzo: number;

    constructor(dt: Date, tz: TZ) {
        const t = +dt;
        const tzo = tz(t);
        super(new Date(t + tzo * d.MINUTE));
        this.t = t;
        this.tz = tz;
        this.tzo = tzo;
    }

    valueOf(): number {
        return this.t;
    }

    setTime(msec: number) {
        const tzo = this.tzo = this.tz(msec);
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

export function dateTZ(dt: number, tz: TZ): DateLike {
    return new DateTZ(new Date(+dt), tz);
}