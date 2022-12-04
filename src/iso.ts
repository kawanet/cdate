import type {cdateNS} from "../types/cdate";
import {texter} from "./texter";

export const toISO = (dt: cdateNS.DateLike) => texter.strftime("%Y-%m-%dT%H:%M:%S.%L%:z", dt);
