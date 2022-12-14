import type {cdate} from "../../index.js";
import {add} from "./add.js";
import {startOf} from "./startof.js";
import {getUnit, getShortUnit} from "./unit.js";

export const calcPlugin: cdate.Plugin<cdate.CDateCalc> = (Parent) => {
    return class CDateCalc extends Parent implements cdate.CDateCalc {
        /**
         * getter
         */
        get(unit: cdate.UnitForGet): number {
            const fn = getUnit[getShortUnit(unit)];
            if (fn) return fn(this.ro());
        }

        /**
         * setter
         */
        set(unit: cdate.UnitForGet, value?: number) {
            unit = getShortUnit(unit as cdate.UnitForGet) as cdate.UnitShort;
            const fn = getUnit[unit];
            if (!fn) return this;

            const dt = this.rw();
            add(dt, (value - fn(dt)), unit);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        startOf(unit: cdate.UnitForStart) {
            unit = getShortUnit(unit) as cdate.UnitShort;
            if (!unit) return this;

            const dt = this.rw();
            startOf(dt, unit);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        endOf(unit: cdate.UnitForStart) {
            unit = getShortUnit(unit) as cdate.UnitShort;
            if (!unit) return this;

            const dt = this.rw();
            startOf(dt, unit);
            add(dt, 1, unit);
            add(dt, -1);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        add(diff: number, unit: cdate.UnitForAdd) {
            unit = getShortUnit(unit) as cdate.UnitShort;
            if (!unit) return this;

            const dt = this.rw();
            add(dt, diff, unit);
            return this.create(dt);
        }

        /**
         * returns a new CDate object manipulated
         */
        next(unit: cdate.UnitForNext) {
            return this.add(1, unit);
        }

        /**
         * returns a new CDate object manipulated
         */
        prev(unit: cdate.UnitForNext) {
            return this.add(-1, unit);
        }
    }
};
