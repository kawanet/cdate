import type {cDateNS} from "../types/cdate";
import {strftime} from "./strftime";

export const tzMinutes = (offset: number | string): number => {
    if ("string" === typeof offset) {
        offset = +offset;
        return Math.trunc(offset / 100) * 60 + (offset % 100);
    }

    if (!isNaN(offset)) return offset;
}

export const toISO = (dt: cDateNS.DateRO) => strftime("%Y-%m-%dT%H:%M:%S.%L%:z", dt);
