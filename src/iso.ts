import type {cdateNS} from "../types/cdate";
import {strftime} from "./strftime";

export const toISO = (dt: cdateNS.DateRO) => strftime("%Y-%m-%dT%H:%M:%S.%L%:z", dt);
