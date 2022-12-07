import {texter} from "./texter";
import type {DateLike} from "./datelike";

export const toISO = (dt: DateLike) => texter.strftime("%Y-%m-%dT%H:%M:%S.%L%:z", dt);
