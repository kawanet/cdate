import {texter} from "./texter";

export const toISO = (dt: DateLike) => texter.strftime("%Y-%m-%dT%H:%M:%S.%L%:z", dt);
