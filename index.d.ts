/**
 * @see https://github.com/kawanet/cdate
 */

export const cdate: cdate.cdate;
export const strftime: cdate.strftime;

export declare namespace cdate {
    type cdate = (dt?: string | number | Date) => CDate;
    type strftime = (fmt: string, dt?: Date) => string;

    /**
     * Unit
     */
    type UnitLong = "second" | "minute" | "hour" | "day" | "month" | "year";
    type UnitLongS = "seconds" | "minutes" | "hours" | "days" | "months" | "years";
    type UnitShort = "s" | "m" | "h" | "d" | "M" | "y";
    type UnitForNext = UnitLong | UnitShort | "week" | "w" | "millisecond" | "ms";
    type UnitForAdd = UnitForNext | UnitLongS | "weeks" | "milliseconds";
    type UnitForStart = UnitLong | UnitShort | "week" | "w" | "date" | "D";
    type UnitForGet = UnitLong | UnitShort | "date" | "D" | "millisecond" | "ms";

    /**
     * Public Interface for consumers
     */
    type CDate = CDateCore & CDateFormat & CDateCalc & CDateTZ;

    interface CDateCore {
        /**
         * returns a bare Date object
         */
        toDate(): Date;

        /**
         * returns a JSON representation of Date
         */
        toJSON(): string;

        /**
         * returns an instance including the plugin
         */
        plugin<T>(fn: Plugin<T>): this & T;

        /**
         * cdate function factory
         */
        cdateFn(): cdate;
    }

    interface CDateFormat {
        /**
         * format("YYYY/MM/DD HH:mm:ss.SSSZ")
         */
        format(format?: string): string;

        /**
         * text("%Y-%m-%dT%H:%M:%S.%LZ")
         */
        text(format?: string): string;

        handler(handlers: Handlers): this;

        locale(lang: string): this;
    }

    interface CDateCalc {
        /**
         * get("date"), get("hour"),...
         */
        get(unit: UnitForGet): number;

        /**
         * set("date", 31), set("day", 0),...
         */
        set(unit: UnitForGet, value: number): this;

        /**
         * add(1, "day"), add(2, "hours"),...
         */
        add(diff: number, unit?: UnitForAdd): this;

        /**
         * startOf("day"), startOf("month"),...
         */
        startOf(unit: UnitForStart): this;

        /**
         * endOf("day") == startOf("day").next("day").add(-1, "ms")
         */
        endOf(unit: UnitForStart): this;

        /**
         * next("day") == add(1, "day")
         */
        next(unit: UnitForNext): this;

        /**
         * prev("day") == add(-1, "day")
         */
        prev(unit: UnitForNext): this;
    }

    interface CDateTZ {
        /**
         * UTC
         */
        utc(keepLocalTime?: boolean): this;

        /**
         * "+0900", "+09:00", "GMT+09:00", 540,...
         */
        utcOffset(offset: string | number, keepLocalTime?: boolean): this;

        /**
         * returns 540 for "GMT+09:00"
         */
        utcOffset(): number;

        /**
         * "Asia/Tokyo", "America/New_York",...
         */
        tz(timeZoneName: string, keepLocalTime?: boolean): this;
    }

    type Handler = (dt: DateLike) => (string | number);

    type Handlers = { [specifier: string]: string | Handler };

    /**
     * Internal interface for plugin developers
     */
    interface Internal<T = {}, X = {}> extends CDate {
        readonly t: number | DateLike;
        readonly x: Options & X;

        create(dt: number | DateLike): this;

        inherit(): this & T;

        rw(): DateLike;

        ro(): DateLike;
    }

    interface Class<T = {}, X = {}> {
        new(t: number | DateLike, x: X): Internal<T, X>;
    }

    interface Options {
        rw?: (t: number) => DateLike;
    }

    interface Plugin<T = {}, X = {}, P = {}> {
        (Parent: Class<P, X>): Class<T, X>;
    }

    interface DateLike {
        getMilliseconds: typeof Date.prototype.getMilliseconds,
        getSeconds: typeof Date.prototype.getSeconds,
        getMinutes: typeof Date.prototype.getMinutes,
        getHours: typeof Date.prototype.getHours,
        getDay: typeof Date.prototype.getDay,
        getDate: typeof Date.prototype.getDate,
        getMonth: typeof Date.prototype.getMonth,
        getFullYear: typeof Date.prototype.getFullYear,
        getTimezoneOffset: typeof Date.prototype.getTimezoneOffset,
        getTime: typeof Date.prototype.getTime,
        setTime: typeof Date.prototype.setTime,
    }
}
