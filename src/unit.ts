import type {cdateNS} from "../types/cdate";

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
    day: Unit.day,
    hour: Unit.hour,
    minute: Unit.minute,
    second: Unit.second,
    millisecond: Unit.millisecond,
} as { [key in cdateNS.UnitForAdd]: Unit };

Object.keys(unitMap).forEach((key: cdateNS.Unit) => {
    const s = (key + "s") as cdateNS.UnitWithS;
    const v = unitMap[key] as Unit;
    unitMap[s] = unitMap[v] = unitMap[key];
});

export const getUnit = (key: string): Unit => {
    return unitMap[key as cdateNS.UnitForAdd] || unitMap[String(key).toLowerCase() as cdateNS.UnitForAdd];
};