const DateTimeFormat = Intl && Intl.DateTimeFormat;

const parseTZ = (tz: string) => {
    const m = +tz.replace(/^GMT|:/g, "");
    return Math.trunc(m / 100) * 60 + (m % 100);
};

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

class TZ {
    // fixed
    private m: number;

    // Asia/Tokyo - IANA time zone name
    private f: Intl.DateTimeFormat;

    constructor(tz: number | string) {
        if ("number" === typeof tz) {
            this.m = tz;
        } else if (/\//.test(tz)) {
            if (DateTimeFormat) {
                this.f = new DateTimeFormat("en-US", {timeZoneName: "longOffset", timeZone: tz});
            } else {
                // fallback to local time zone
            }
        } else if ("string" === typeof tz) {
            this.m = parseTZ(tz);
        }
    }

    /**
     * returns time zone offset in minutes
     */
    minutes(dt: number | Date): number {
        const m = this.m;
        if (m != null) return m;

        const ms = +dt;
        const {f} = this;
        const part = f && f.formatToParts(ms).find(v => v.type === "timeZoneName");
        let value = part && parseTZ(part.value);
        if (value == null) {
            // fallback to local time zone
            value = -new Date(ms).getTimezoneOffset();
        }
        return value;
    }

    /**
     * returns time zone offset in milliseconds
     */
    ms(dt: number | Date): number {
        return this.minutes(dt) * d.MINUTE;
    }
}

const tzCache: { [tz: string]: TZ } = {};

export const getTZ = (tz: number | string) => (tzCache[tz] || (tzCache[tz] = new TZ(tz)));
