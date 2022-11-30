import type {cDateNS} from "../types/cdate";
import {toISO} from "./u";

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

class DateUTC implements cDateNS.DateRW {
    constructor(protected dt: Date) {
        //
    }

    valueOf(): number {
        return +this.dt;
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

    getTimezoneOffset() {
        return 0; // always UTC
    }

    getTime() {
        return this.dt.getTime();
    }

    setTime(msec: number) {
        return this.dt.setTime(msec);
    }
}

class DateTZ extends DateUTC {
    tz: number;

    constructor(dt: Date, tz: number) {
        super(dt);
        this.tz = tz | 0;
    }

    valueOf(): number {
        return +this.dt - this.tz * d.MINUTE;
    }

    getTimezoneOffset() {
        return this.tz;
    }
}

export function dateUTC(dt: number): cDateNS.DateRW {
    return new DateUTC(new Date(+dt));
}

export function dateTZ(dt: number, tz: number): cDateNS.DateRO {
    return new DateTZ(new Date(+dt), tz);
}