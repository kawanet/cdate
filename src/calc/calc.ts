import type {cdateNS} from "../../types/cdate";
import {add} from "./add.js";
import {startOf} from "./startof.js";

export const calcPlugin: cdateNS.cPlugin<cdateNS.cCalcPlugin> = (Parent) => {
    return class CDateCalc extends Parent implements cdateNS.cCalcPlugin {
        /**
         * returns a new CDate object manipulated
         */
        startOf(unit: cdateNS.UnitForStart) {
            const dt = this.rw();
            startOf(dt, unit);
            return this.cdate(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        endOf(unit: cdateNS.UnitForStart) {
            const dt = this.rw();
            startOf(dt, unit);
            add(dt, 1, unit);
            add(dt, -1);
            return this.cdate(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        add(diff: number, unit: cdateNS.UnitForAdd) {
            const dt = this.rw();
            add(dt, diff, unit);
            return this.cdate(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        next(unit: cdateNS.UnitForNext) {
            return this.add(1, unit);
        }

        /**
         * returns a new CDate object manipulated
         */
        prev(unit: cdateNS.UnitForNext) {
            return this.add(-1, unit);
        }
    }
};
