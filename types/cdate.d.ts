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

    interface CDate {
        cdate(dt: Date): CDate;

        format(format: string): string;

        text(format: string): string;

        toDate(): Date;

        toJSON(): string;

        add(diff: number, unit?: UnitForAdd): CDate;

        startOf(unit: UnitForStart): CDate;

        endOf(unit: UnitForStart): CDate;

        next(unit: UnitForNext): CDate;

        prev(unit: UnitForNext): CDate;

        utc(): CDate;

        tz(timezone: number | string): CDate;

        locale(locale: cdateNS.Locale): CDate;
    }

    interface strftime {
        (fmt: string, dt?: Date): string;

        (fmt: string, dt: DateLike): string;

        format(fmt: string, dt?: Date): string;

        format(fmt: string, dt: DateLike): string;

        locale(locale: cdateNS.Locale): strftime;
    }

    type Locale = { [specifier: string]: string | ((dt: Date) => string | number) };

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
