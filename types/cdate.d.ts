/**
 * cdate.d.ts
 */

declare namespace cdateNS {
    type UnitLong = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
    type UnitLongS = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    type UnitShort = "s" | "m" | "h" | "d" | "w" | "M" | "y";
    type UnitForNext = UnitLong | UnitShort | "millisecond" | "ms";
    type UnitForAdd = UnitForNext | UnitLongS | "milliseconds";
    type UnitForStart = UnitLong | UnitShort | "date";

    /**
     * Public Interface for consumers
     */
    type CDate = cCore & cFormatPlugin & cCalcPlugin & cUTCPlugin & cTimezonePlugin & cLocalePlugin;

    interface cCore {
        cdate(dt: number | string | Date): this;

        toDate(): Date;

        toJSON(): string;

        plugin<T>(fn: cPlugin<T>): this & T;
    }

    interface cFormatPlugin {
        format(format?: string): string;

        text(format?: string): string;

        handler(handlers: Handlers): this;
    }

    interface cCalcPlugin {
        add(diff: number, unit?: UnitForAdd): this;

        startOf(unit: UnitForStart): this;

        endOf(unit: UnitForStart): this;

        next(unit: UnitForNext): this;

        prev(unit: UnitForNext): this;
    }

    interface cUTCPlugin {
        utc(): this;
    }

    interface cTimezonePlugin {
        tz(timezone: string): this;
    }

    interface cLocalePlugin {
        locale(lang: string): this;
    }

    type Handler = (dt: DateLike) => (string | number);

    type Handlers = { [specifier: string]: string | Handler };

    /**
     * Internal interface for plugin developers
     */
    interface cInternal<T = {}, X = {}> extends cCore {
        readonly t: number | DateLike;
        readonly x: Options & X;

        cdate(dt: number | string | DateLike): this;

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

export const cdate: (dt?: string | number | Date) => cdateNS.CDate;

export const strftime: (fmt: string, dt?: Date) => string;
