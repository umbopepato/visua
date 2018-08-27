import {CSS} from './css';
import {CSSNumericValue, CSSUnitMap} from './css-numeric-value';

export class CSSUnitValue extends CSSNumericValue {

    value: number;
    readonly unit: string;

    constructor(value: number, unit: string) {
        super();
        this.value = this.resolveValue(value);
        this.unit = CSS.resolveUnit(unit.trim());
        this.type = this.createType(unit);
    }

    private resolveValue(value): number {
        if (Number.isNaN(value) || Math.abs(value) === Infinity) {
            throw new TypeError(`Failed to set the 'value' property on 'CSSUnitValue': Invalid value ${value}`);
        }
        return Number(value);
    }

    static fromSumValue(sum: Array<Array<number | CSSUnitMap>>): CSSUnitValue {
        let unitMap = sum[0][1] as CSSUnitMap;
        if (unitMap.size > 1) {
            throw new TypeError(`Failed to construct CSSUnitValue from sum value ${sum}: Too many entries in unit map`);
        }
        if (!unitMap.size) {
            return new CSSUnitValue(sum[0][1] as number, 'number');
        }
        let unit = Array.from(unitMap.entries())[0];
        if (unit[1] !== 1) {
            throw new TypeError(`Failed to construct CSSUnitValue from sum value ${sum}: Power is not 1`);
        }
        return new CSSUnitValue(sum[0][0] as number, unit[0]);
    }

    toUnit(unit: string): CSSUnitValue {
        if (this.unit === unit) return this;
        if (!CSS.areCompatible(this.unit, unit)) {
            throw new TypeError(`Failed to convert ${this.unit} to ${unit}: Incompatible units`);
        }
        let oldUnitData = CSS.getUnitData(this.unit);
        let newUnitData = CSS.getUnitData(unit);
        return new CSSUnitValue(
            this.value * oldUnitData.toCanonical / newUnitData.toCanonical,
            unit,
        );
    }

}