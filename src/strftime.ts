/**
 * strftime
 */

import type {cdateNS} from "../types/cdate";
import {en_US} from "../locale/en_US";
import {common} from "./common";
import {formatMap} from "./format";

type PickSpec = (spec: string) => (string | ((dt: cdateNS.DateLike) => (string | number)));

const merge = (a: PickSpec, b?: PickSpec): PickSpec => b ? (spec => (a(spec) || b(spec))) : a;

const picker = (locale: cdateNS.Locale): PickSpec => spec => locale[spec];

const formatRE = new RegExp(["\\[(.*?)\\]"].concat(Object.keys(formatMap).sort().reverse()).join("|"), "g");

const factory = (pick: PickSpec) => {
    const strftime: cdateNS.strftime = (fmt, dt) => {
        return fmt.replace(/%(?:-?[a-zA-Z%]|:z)/g, spec => {
            const fn = pick(spec);

            if ("function" === typeof fn) {
                return fn(dt) as string;
            } else if (fn == null) {
                return spec; // Unsupported specifiers
            } else {
                return strftime(String(fn), dt) as string; // recursive call
            }
        });
    };

    strftime.format = (fmt, dt) => {
        return fmt.replace(formatRE, ($$, $1) => strftime(formatMap[$$] || $1.replace(/%/g, "%%"), dt));
    };

    strftime.locale = locale => factory(merge(picker(locale), pick));

    return strftime;
};

export const strftime = factory(picker(common)).locale(en_US);
