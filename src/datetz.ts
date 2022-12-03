import type {cdateNS} from "../types/cdate";
import {toISO} from "./u";

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
        return +this.dt - this.getTimezoneOffset() * d.MINUTE;
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

class DateTZ extends DateUTCBase implements cdateNS.DateRO {
    tz: number;

    constructor(dt: Date, tz: number) {
        super(dt);
        this.tz = tz | 0;
    }

    getTimezoneOffset() {
        return this.tz;
    }
}

export function dateUTC(dt: number): cdateNS.DateRW {
    return new DateUTC(new Date(+dt));
}

export function dateTZ(dt: number, tz: number): cdateNS.DateRO {
    return new DateTZ(new Date(+dt), tz);
}