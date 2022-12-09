import type {strftime as strftimeFn, cdateNS} from "../../types/cdate";
import {en_US} from "../../locale/en_US.js";
import {strftimeHandlers} from "./strftime.js";
import {formatHandlers} from "./format.js";

type Router = (specifier: string) => (string | ((dt: cdateNS.DateLike) => (string | number)));

const mergeRouter = (a: Router, b?: Router): Router => ((a && b) ? (specifier => (a(specifier) || b(specifier))) : (a || b));

const makeRouter = (handlers: cdateNS.Handlers): Router => (handlers && (specifier => handlers[specifier]));

// @see https://docs.ruby-lang.org/en/3.1/DateTime.html#method-i-strftime
const strftimeRE = /%(?:[EO]\w|[0_#^-]?[1-9]?\w|::?z|[%+])/g;

const formatRE = new RegExp(["\\[(.*?)\\]"].concat(Object.keys(formatHandlers).sort().reverse()).join("|"), "g");

const ISO = "%Y-%m-%dT%H:%M:%S.%L%:z";

interface Texter {
    strftime(fmt: string, dt: cdateNS.DateLike): string;

    format(fmt: string, dt: cdateNS.DateLike): string;

    extend(handlers: cdateNS.Handlers): Texter;
}

const makeTexter = (router?: Router): Texter => {
    const one = (specifier: string, dt: cdateNS.DateLike): string => {
        let handler = router(specifier);

        if ("string" === typeof handler) {
            const next = router(handler);
            if (next != null) handler = next; // bypass strftime call
        }

        if ("function" === typeof handler) {
            return handler(dt) as string;
        } else if (handler == null) {
            return specifier; // Unsupported specifiers
        } else {
            return strftime(handler, dt) as string; // recursive call
        }
    };

    const out = {} as Texter;

    const strftime = out.strftime = (fmt, dt) => {
        if (fmt == null) fmt = ISO;
        return fmt.replace(strftimeRE, (specifier) => one(specifier, dt));
    };

    out.format = (fmt, dt) => {
        if (fmt == null) return strftime(fmt, dt);
        return fmt.replace(formatRE, (specifier, raw) => (raw || one(specifier, dt)));
    };

    out.extend = specifiers => makeTexter(mergeRouter(makeRouter(specifiers), router));

    return out;
};

export const texter = makeTexter().extend(en_US).extend(formatHandlers).extend(strftimeHandlers());
const _strftime = texter.strftime;
export const strftime: typeof strftimeFn = (fmt, dt) => _strftime(fmt, dt || new Date());