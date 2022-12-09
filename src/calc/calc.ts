import type {cdateNS} from "../../types/cdate";
import {add} from "./add.js";
import {startOf} from "./startof.js";

export const calcPlugin: cdateNS.Plugin = Parent => {
    return class CDateCalc extends Parent {
        /**
         * returns a new CDate object manipulated
         */
        startOf(unit: cdateNS.UnitForStart): this {
            const dt = this.rw();
            startOf(dt, unit);
            return this.cdate(dt) as this;
        }

        /**
         * returns a new CDate object manipulated
         */
        endOf(unit: cdateNS.UnitForStart): this {
            const dt = this.rw();
            startOf(dt, unit);
            add(dt, 1, unit);
            add(dt, -1);
            return this.cdate(dt) as this;
        }

        /**
         * returns a new CDate object manipulated
         */
        add(diff: number, unit: cdateNS.UnitForAdd): this {
            const dt = this.rw();
            add(dt, diff, unit);
            return this.cdate(dt) as this;
        }

        /**
         * returns a new CDate object manipulated
         */
        next(unit: cdateNS.UnitForNext): this {
            return this.add(1, unit);
        }

        /**
         * returns a new CDate object manipulated
         */
        prev(unit: cdateNS.UnitForNext): this {
            return this.add(-1, unit);
        }
    }
};
