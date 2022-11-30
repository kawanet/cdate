/**
 * strftime
 */

import type {cDateNS} from "../types/cdate";
import {en_US} from "../locale/en_US";
import {common} from "./common";
import {tzMinutes} from "./u";

type PickSpec = (spec: string) => (string | ((dt: cDateNS.RODate) => (string | number)));

const merge = (a: PickSpec, b?: PickSpec): PickSpec => b ? (spec => (a(spec) || b(spec))) : a;

const picker = (locale: cDateNS.Locale): PickSpec => spec => locale[spec];

const cacheable = <T>(fn: ((arg: number) => T)): ((arg: number) => T) => {
    const cached: { [key: string]: T } = {};
    return arg => cached[arg] || (cached[arg] = fn(arg));
};

/**
 * %z     The +hhmm or -hhmm numeric timezone (that is, the hour and minute offset from UTC). (SU)
 */
const displayZ = (offset: number, delim: string) => {
    const isMinus = (offset < 0);
    if (isMinus) offset = -offset;
    const hour = Math.floor(offset / 60);
    const min = offset % 60;
    return (isMinus ? "-" : "+") + (hour < 10 ? "0" + hour : hour) + delim + (min < 10 ? "0" + min : min);
};

const getTZpick = cacheable((offset: number) => {
    if (offset != null) {
        // constant offset for the time zone offset specified
        const delimZ = displayZ(offset, ":");
        const normalZ = displayZ(offset, "");
        return picker({
            "%:z": () => delimZ,
            "%z": () => normalZ,
        });
    } else {
        // dynamic offset for the Date given
        return picker({
            "%:z": dt => displayZ(-dt.getTimezoneOffset(), ":"),
            "%z": dt => displayZ(-dt.getTimezoneOffset(), ""),
        });
    }
});

const factory = (pick: PickSpec, offset?: number | string) => {
    const tz = tzMinutes(offset);

    const strftime: cDateNS.strftime = (fmt, dt) => {
        return fmt.replace(/%(?:-?[a-zA-Z%]|:z)/g, spec => {
            const fn = pick(spec) || getTZpick(tz)(spec);

            if ("function" === typeof fn) {
                return fn(dt) as string;
            } else if (fn == null) {
                return spec; // Unsupported specifiers
            } else {
                return strftime(String(fn), dt) as string; // recursive call
            }
        });
    };

    strftime.extend = locale => factory(merge(picker(locale), pick), tz);

    strftime.timezone = offset => factory(pick, offset);

    return strftime;
};

export const strftime = factory(picker(common)).extend(en_US);
