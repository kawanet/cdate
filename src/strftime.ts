/**
 * strftime
 */

import type {cdateNS} from "../types/cdate";
import {en_US} from "../locale/en_US";
import {common} from "./common";
import {formatMap} from "./format";

type Picker = (specifier: string) => (string | ((dt: cdateNS.DateLike) => (string | number)));

const merge = (a: Picker, b?: Picker): Picker => (b ? (specifier => (a(specifier) || b(specifier))) : a);

const mapPicker = (map: cdateNS.Locale): Picker => specifier => map[specifier];

const strftimeRE = /%(?:-?[a-zA-Z%]|:z)/g;

const formatRE = new RegExp(["\\[(.*?)\\]"].concat(Object.keys(formatMap).sort().reverse()).join("|"), "g");

const factory = (picker: Picker) => {
    const one = (specifier: string, dt: cdateNS.DateLike): string => {
        let fn = picker(specifier);

        if ("string" === typeof fn) {
            fn = picker(fn) || fn;
        }

        if ("function" === typeof fn) {
            return fn(dt) as string;
        } else if (fn == null) {
            return specifier; // Unsupported specifiers
        } else {
            return strftime(fn, dt) as string; // recursive call
        }
    };

    const strftime: cdateNS.strftime = (fmt, dt) => {
        return fmt.replace(strftimeRE, (specifier) => one(specifier, dt));
    };

    strftime.format = (fmt, dt) => {
        return fmt.replace(formatRE, (specifier, raw) => (raw || one(specifier, dt)));
    };

    strftime.locale = locale => factory(merge(mapPicker(locale), picker));

    return strftime;
};

export const strftime = factory(merge(mapPicker(common), mapPicker(formatMap))).locale(en_US);
