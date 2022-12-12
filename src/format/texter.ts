import type {cdate} from "../../index.js";
import {en_US} from "./en_US.js";
import {strftimeHandlers} from "./strftime.js";
import {formatHandlers} from "./format.js";

type Router = (specifier: string) => (string | ((dt: cdate.DateLike) => (string | number)));

const mergeRouter = (a: Router, b?: Router): Router => ((a && b) ? (specifier => (a(specifier) || b(specifier))) : (a || b));

const makeRouter = (handlers: cdate.Handlers): Router => (handlers && (specifier => handlers[specifier]));

// @see https://docs.ruby-lang.org/en/3.1/DateTime.html#method-i-strftime
const strftimeRE = /%(?:[EO]\w|[0_#^-]?[1-9]?\w|::?z|[%+])/g;

// /\[(.*?)\]|A+|a+|B+|b+|C+|c+|...|Z+|z+/g
const makeFormatRE = () => {
    let re: string[] = ["\\[(.*?)\\]"];
    const c = (code: number) => String.fromCharCode(code + 65) + "+";
    for (let i = 0; i < 26; i++) {
        re.push(c(i), c(i + 32));
    }
    return new RegExp(re.join("|"), "g");
};

const formatRE = makeFormatRE();

const ISO: cdate.Handlers = {ISO: "%Y-%m-%dT%H:%M:%S.%L%:z"};

interface Texter {
    strftime(fmt: string, dt: cdate.DateLike): string;

    format(fmt: string, dt: cdate.DateLike): string;

    handler(handlers: cdate.Handlers): Texter;
}

const makeTexter = (router?: Router): Texter => {
    const one = (specifier: string, dt: cdate.DateLike): string => {
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
        if (fmt == null) return one("ISO", dt);
        return fmt.replace(strftimeRE, (specifier) => one(specifier, dt));
    };

    out.format = (fmt, dt) => {
        if (fmt == null) return one("ISO", dt);
        return fmt.replace(formatRE, (specifier, raw) => (raw || one(specifier, dt)));
    };

    out.handler = specifiers => makeTexter(mergeRouter(makeRouter(specifiers), router));

    return out;
};

export const texter = makeTexter().handler(ISO).handler(en_US).handler(formatHandlers).handler(strftimeHandlers());

const _strftime = texter.strftime;
export const strftime: cdate.strftime = (fmt, dt) => _strftime(fmt, dt || new Date());

const getTexter = (x: { tx: typeof texter }): typeof texter => (x && x.tx || texter);

interface Options {
    tx: Texter;
}

export const formatPlugin: cdate.cPlugin<cdate.cFormatPlugin, Options> = (Parent) => {
    return class CDateFormat extends Parent implements cdate.cFormatPlugin {
        /**
         * updates strftime option with the given locale
         */
        handler(handlers: cdate.Handlers) {
            const out = this.inherit();
            const {x} = out;
            x.tx = getTexter(x).handler(handlers);
            return out;
        }

        /**
         * returns a text with "YYYY-MM-DD" formatting style
         */
        format(fmt: string): string {
            return getTexter(this.x).format(fmt, this.ro());
        }

        /**
         * returns a text with "%y/%m/%d formatting style
         */
        text(fmt: string): string {
            return getTexter(this.x).strftime(fmt, this.ro());
        }
    }
};
