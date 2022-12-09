import type {cdateNS} from "../../types/cdate";

export class DateUTC implements cdateNS.DateLike {
    constructor(protected dt: Date) {
        //
    }

    valueOf(): number {
        return +this.dt;
    }

    setTime(msec: number) {
        return this.dt.setTime(msec);
    }

    getTimezoneOffset() {
        return 0; // always UTC
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

export const utcPlugin: cdateNS.Plugin = Parent => {
    return class CDateUTC extends Parent {
        utc() {
            const out = this.inherit();
            out.x.rw = (dt) => new DateUTC(new Date(+dt));
            return out;
        }
    }
};
