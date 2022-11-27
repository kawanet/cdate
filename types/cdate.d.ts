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
    }

    interface strftime {
        (fmt: string, dt?: Date): string;

        extend: (locale: cDateNS.Locale) => strftime;

        timezone: (offset: number | string) => strftime;
    }

    type Locale = { [spec: string]: string | ((dt: Date) => string | number) };
}

export const cDate: (dt?: string | number | Date) => cDateNS.CDate;
