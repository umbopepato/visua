import {CSS} from './css';
import {CSSNumericValue} from './css-numeric-value';

export class CSSUnitValue extends CSSNumericValue {

    value: number;
    readonly unit: string;

    constructor(value: number, unit: string) {
        super();
        this.value = CSSUnitValue.resolveValue(value);
        this.unit = CSS.resolveUnit(unit.trim());
        this.type = this.createType(unit);
    }

    static resolveValue(value): number {
        if (Number.isNaN(value) || Math.abs(value) === Infinity) {
            throw new TypeError(`Failed to set the 'value' property on 'CSSUnitValue': Invalid value ${value}`);
        }
        return Number(value);
    }

}