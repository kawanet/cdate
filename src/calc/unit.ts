import type {cdate} from "../../index.js";

type UnitFlex = cdate.UnitForNext | cdate.UnitForAdd | Unit;

export const enum Unit {
    year = "y",
    month = "M",
    week = "w",
    date = "D",
    day = "d",
    hour = "h",
    minute = "m",
    second = "s",
    millisecond = "ms",
    timeZoneOffset = "TZO",
    time = "T",
}

const unitMap = {
    year: Unit.year,
    month: Unit.month,
    week: Unit.week,
    date: Unit.date,
    day: Unit.day,
    hour: Unit.hour,
    minute: Unit.minute,
    second: Unit.second,
    millisecond: Unit.millisecond,
} as { [key in UnitFlex]?: Unit };

Object.keys(unitMap).forEach((key: UnitFlex) => {
    const s = (key + "s") as cdate.UnitLongS;
    const v = unitMap[key] as Unit;
    if (v) unitMap[s] = unitMap[v] = v;
});

export const getShortUnit = (unit: string): Unit => {
    return unitMap[(unit || Unit.millisecond) as cdate.UnitForAdd] ||
        unitMap[String(unit).toLowerCase() as cdate.UnitForAdd];
};

const enum d {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
}

export const unitMS: { [unit in Unit]?: number } = {
    h: d.HOUR,
    m: d.MINUTE,
    s: d.SECOND,
    ms: 1,
};

export const getUnit: { [unit in Unit]?: (dt: cdate.DateLike) => number } = {
    y: dt => dt.getFullYear(),
    M: dt => dt.getMonth(),
    D: dt => dt.getDate(),
    d: dt => dt.getDay(),
    h: dt => dt.getHours(),
    m: dt => dt.getMinutes(),
    s: dt => dt.getSeconds(),
    ms: dt => dt.getMilliseconds(),
    TZO: dt => dt.getTimezoneOffset(),
    T: dt => dt.getTime(),
};
