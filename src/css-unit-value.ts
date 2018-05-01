import units from './css-units';
import CSSNumericValue from "./css-numeric-value";

export default class CssUnitValue extends CSSNumericValue {

    private value: number;
    private unit: string;

    constructor(value: number, unit: string) {
        super();
        this.value = CssUnitValue.resolveValue(value);
        this.unit = CssUnitValue.resolveUnit(unit.trim());
    }

    static resolveValue(value): number {
        if (isNaN(value) || Math.abs(value) === Infinity) {
            throw new TypeError(`Failed to set the 'value' property on 'CSSUnitValue': Invalid value ${value}`);
        }
        return Number(value);
    }

    static resolveUnit(unit): string {
        for (let unitKey in units) {
            if (unit === unitKey || unit === units[unitKey]) {
                return unitKey;
            }
        }
        throw new TypeError(`Failed to construct 'CSSUnitValue': Invalid unit ${unit}`);
    }

}