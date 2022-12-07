import {strftime} from "./texter.js";
import type {DateLike} from "./datelike.js";

export const toISO = (dt: DateLike) => strftime("%Y-%m-%dT%H:%M:%S.%L%:z", dt as Date);
