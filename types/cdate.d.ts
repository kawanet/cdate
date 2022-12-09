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
    interface CDate {
        cdate(dt: number | Date): CDate;

        format(format?: string): string;

        text(format?: string): string;

        toDate(): Date;

        toJSON(): string;

        add(diff: number, unit?: UnitForAdd): CDate;

        startOf(unit: UnitForStart): CDate;

        endOf(unit: UnitForStart): CDate;

        next(unit: UnitForNext): CDate;

        prev(unit: UnitForNext): CDate;

        utc(): CDate;

        tz(timezone: string): CDate;

        extend(handlers: Handlers): CDate;

        locale(lang: string): CDate;

        plugin(fn: Plugin): CDate;
    }

    /**
     * Internal interface for plugin developers
     */
    interface CDateI<T> extends CDate {
        t: number | DateLike;
        x: Options & T;

        cdate(dt: number | DateLike): CDate;

        rw(): cdateNS.DateLike;

        ro(): cdateNS.DateLike;

        inherit(): CDateI<T>;
    }

    interface CDateClass<T = {}> {
        new(t: number | cdateNS.DateLike, x: T): CDateI<T>;

        prototype: CDateI<T>;
    }

    interface Options {
        rw?: (t: number) => cdateNS.DateLike;
    }

    type Plugin<T = {}> = (Cdate: CDateClass<T>) => CDateClass<T>;

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

    type Handler = (dt: DateLike) => (string | number);

    type Handlers = { [specifier: string]: string | Handler };
}

export const cdate: (dt?: string | number | Date) => cdateNS.CDate;

export const strftime: (fmt: string, dt?: Date) => string;
