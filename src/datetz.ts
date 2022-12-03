import type {cdateNS} from "../types/cdate";
import type {getTZ} from "./tz";
import {toISO} from "./iso";

type TZ = ReturnType<typeof getTZ>;

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

abstract class DateUTCBase {
    constructor(protected dt: Date) {
        //
    }

    abstract getTimezoneOffset(): number;

    valueOf(): number {
        return +this.dt + this.getTimezoneOffset() * d.MINUTE;
    }

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

class DateUTC extends DateUTCBase implements cdateNS.DateRW {
    setTime(msec: number) {
        return this.dt.setTime(msec);
    }

    getTimezoneOffset() {
        return 0; // always UTC
    }
}

class DateTZ extends DateUTCBase implements cdateNS.DateRW {
    // dt: Date; // UTC
    local: Date; // local time
    tz: TZ;

    constructor(dt: Date, tz: TZ) {
        super(new Date(+dt + tz.ms(dt)));
        this.local = dt;
        this.tz = tz;
    }

    valueOf(): number {
        return +this.local;
    }

    setTime(msec: number) {
        const time = this.local.setTime(+msec);
        this.dt.setTime(+msec + this.tz.ms(msec));
        return time;
    }

    getTimezoneOffset() {
        return -this.tz.minutes(+this.local);
    }
}

export function dateUTC(dt: number): cdateNS.DateRW {
    return new DateUTC(new Date(+dt));
}

export function dateTZ(dt: number, tz: TZ): cdateNS.DateRW {
    return new DateTZ(new Date(+dt), tz);
}