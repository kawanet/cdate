import type {cdate} from "../../index.js";

type UnitFlex = cdate.UnitForNext | cdate.UnitForAdd | cdate.UnitForStart;

export const enum Unit {
    year = "y",
    month = "M",
    week = "w",
    day = "d",
    hour = "h",
    minute = "m",
    second = "s",
    millisecond = "ms",
}

const unitMap = {
    year: Unit.year,
    month: Unit.month,
    week: Unit.week,
    date: Unit.day,
    day: Unit.day,
    hour: Unit.hour,
    minute: Unit.minute,
    second: Unit.second,
    millisecond: Unit.millisecond,
} as { [key in UnitFlex]?: Unit };

Object.keys(unitMap).forEach((key: cdate.UnitForNext) => {
    const s = (key + "s") as cdate.UnitLongS;
    const v = unitMap[key] as Unit;
    unitMap[s] = unitMap[v] = unitMap[key];
});

export const getUnitShort = (unit: string): Unit => {
    const u = unitMap[(unit || Unit.millisecond) as cdate.UnitForAdd] ||
        unitMap[String(unit).toLowerCase() as cdate.UnitForAdd];
    if (!u) throw new RangeError("Invalid unit: " + unit);
    return u;
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
    d: dt => dt.getDate(),
    h: dt => dt.getHours(),
    m: dt => dt.getMinutes(),
    s: dt => dt.getSeconds(),
    ms: dt => dt.getMilliseconds(),
}
