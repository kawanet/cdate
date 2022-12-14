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
    type UnitLongS = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    type UnitShort = "s" | "m" | "h" | "d" | "M" | "y";
    type UnitForNext = UnitLong | UnitShort | "week" | "w" | "millisecond" | "ms";
    type UnitForAdd = UnitForNext | UnitLongS | "weeks" | "milliseconds";
    type UnitForStart = UnitLong | UnitShort | "week" | "w" | "date" | "D";
    type UnitForGet = UnitLong | UnitShort | "date" | "D" | "millisecond" | "ms";

    /**
     * Public Interface for consumers
     */
    type CDate = CDateCore & CDateFormat & CDateCalc & CDateUTC & CDateTZ & CDateLocale;

    interface CDateCore {
        cdate(dt: number | string | Date): this;

        toDate(): Date;

        toJSON(): string;

        plugin<T>(fn: cPlugin<T>): this & T;
    }

    interface CDateFormat {
        format(format?: string): string;

        text(format?: string): string;

        handler(handlers: Handlers): this;
    }

    interface CDateCalc {
        get(unit: UnitForGet): number;

        add(diff: number, unit?: UnitForAdd): this;

        startOf(unit: UnitForStart): this;

        endOf(unit: UnitForStart): this;

        next(unit: UnitForNext): this;

        prev(unit: UnitForNext): this;
    }

    interface CDateUTC {
        utc(): this;
    }

    interface CDateTZ {
        tz(timezone: string): this;
    }

    interface CDateLocale {
        locale(lang: string): this;
    }

    type Handler = (dt: DateLike) => (string | number);

    type Handlers = { [specifier: string]: string | Handler };

    /**
     * Internal interface for plugin developers
     */
    interface cInternal<T = {}, X = {}> extends CDateCore {
        readonly t: number | DateLike;
        readonly x: Options & X;

        create(dt: DateLike): this;

        inherit(): this;

        rw(): DateLike;

        ro(): DateLike;
    }

    interface cClass<T = {}, X = {}> {
        new(t: number | DateLike, x: X): cInternal<T, X>;
    }

    interface Options {
        rw?: (t: number) => DateLike;
    }

    interface cPlugin<T = {}, X = {}, P = {}> {
        (Parent: cClass<P, X>): cClass<T, X>;
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
