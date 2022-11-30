/**
 * cdate.d.ts
 */

declare namespace cDateNS {
    type Unit = "second" | "minute" | "hour" | "date" | "day" | "week" | "month" | "year";
    type UnitWithS = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    type UnitShort = "s" | "m" | "h" | "d" | "w" | "M" | "y";
    type UnitMS = "millisecond" | "milliseconds" | "ms";
    type UnitForAdd = Unit | UnitWithS | UnitShort | UnitMS;

    interface CDate {
        date(): Date;

        text(format: string): string;

        valueOf(): number;

        toJSON(): string;

        add(diff: number, unit: UnitForAdd): CDate;

        startOf(unit: Unit): CDate;

        endOf(unit: Unit): CDate;

        next(unit: Unit): CDate;

        prev(unit: Unit): CDate;

        timezone(offset: number | string): CDate;

        locale(locale: cDateNS.Locale): CDate;
    }

    interface strftime {
        (fmt: string, dt?: Date): string;

        (fmt: string, dt?: DateRO): string;

        locale: (locale: cDateNS.Locale) => strftime;
    }

    type Locale = { [specifier: string]: string | ((dt: Date) => string | number) };

    interface DateRO {
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
    }

    interface DateRW extends DateRO {
        setTime: typeof Date.prototype.setTime,
    }
}

export const cDate: (dt?: string | number | Date) => cDateNS.CDate;
