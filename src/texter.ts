import type {cdateNS, strftime as strftimeFn} from "../types/cdate";
import {en_US} from "../locale/en_US";
import {strftimeMap} from "./strftime";
import {formatMap} from "./format";

type Picker = (specifier: string) => (string | ((dt: DateLike) => (string | number)));

const merge = (a: Picker, b?: Picker): Picker => ((a && b) ? (specifier => (a(specifier) || b(specifier))) : (a || b));

const mapPicker = (map: cdateNS.Specifiers): Picker => (map && (specifier => map[specifier]));

const strftimeRE = /%(?:-?[a-zA-Z%]|:z)/g;

const formatRE = new RegExp(["\\[(.*?)\\]"].concat(Object.keys(formatMap).sort().reverse()).join("|"), "g");

interface Texter {
    strftime(fmt: string, dt: DateLike): string;

    format(fmt: string, dt: DateLike): string;

    extend(specifiers: cdateNS.Specifiers): Texter;
}

const factory = (picker?: Picker): Texter => {
    const one = (specifier: string, dt: DateLike): string => {
        let fn = picker(specifier);

        if ("string" === typeof fn) {
            fn = picker(fn) || fn;
        }

        if ("function" === typeof fn) {
            return fn(dt) as string;
        } else if (fn == null) {
            return specifier; // Unsupported specifiers
        } else {
            return out.strftime(fn, dt) as string; // recursive call
        }
    };

    const out = {} as Texter;

    out.strftime = (fmt, dt) => {
        return fmt.replace(strftimeRE, (specifier) => one(specifier, dt));
    };

    out.format = (fmt, dt) => {
        return fmt.replace(formatRE, (specifier, raw) => (raw || one(specifier, dt)));
    };

    out.extend = specifiers => factory(merge(mapPicker(specifiers), picker));

    return out;
};

let _texter: Texter;
export const texter = _texter = factory().extend(strftimeMap()).extend(formatMap).extend(en_US);
const _strftime = _texter.strftime;
export const strftime: typeof strftimeFn = (fmt, dt) => _strftime(fmt, dt || new Date());
