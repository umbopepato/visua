import CSS from './css';
import {CSSNumericValue} from './css-numeric-value';

export class CSSUnitValue extends CSSNumericValue {

    private value: number;
    private unit: string;

    constructor(value: number, unit: string) {
        super();
        this.value = CSSUnitValue.resolveValue(value);
        this.unit = CSSUnitValue.resolveUnit(unit.trim());
    }

    static resolveValue(value): number {
        if (isNaN(value) || Math.abs(value) === Infinity) {
            throw new TypeError(`Failed to set the 'value' property on 'CSSUnitValue': Invalid value ${value}`);
        }
        return Number(value);
    }

    static resolveUnit(unit): string {
        for (let unitKey in CSS.units) {
            if (unit === unitKey || unit === CSS.units[unitKey]) {
                return unitKey;
            }
        }
        throw new TypeError(`Failed to construct 'CSSUnitValue': Invalid unit ${unit}`);
    }

}