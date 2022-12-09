import type * as types from "./types/cdate";
import {cdate as cdateFn} from "./src/cdate.js";
import {strftime as strftimeFn} from "./src/format/texter.js";

export const cdate: typeof types.cdate = cdateFn;
export const strftime: typeof types.strftime = strftimeFn;
