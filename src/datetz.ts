import type {cdateNS} from "../types/cdate";
import type {getTZ} from "./tz";
import {toISO} from "./iso";

type TZ = ReturnType<typeof getTZ>;

abstract class DateLikeBase implements cdateNS.DateLike {
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
    lo: Date; // local time
    tz: TZ;

    constructor(dt: Date, tz: TZ) {
        super(new Date(+dt + tz.ms(dt)));
        this.lo = dt;
        this.tz = tz;
    }

    valueOf(): number {
        return +this.lo;
    }

    setTime(msec: number) {
        const time = this.lo.setTime(+msec);
        this.dt.setTime(+msec + this.tz.ms(msec));
        return time;
    }

    getTimezoneOffset() {
        return -this.tz.minutes(+this.lo);
    }
}

export function dateUTC(dt: number): cdateNS.DateLike {
    return new DateUTC(new Date(+dt));
}

export function dateTZ(dt: number, tz: TZ): cdateNS.DateLike {
    return new DateTZ(new Date(+dt), tz);
}