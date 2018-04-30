import units from './units';
import CSSStyleValue from './css-style-value';

export default class CssUnitValue extends CSSStyleValue {

    private value: number;
    private unit: string;

    constructor(value: number, unit: string) {
        super();
        this.value = CssUnitValue.getFiniteNumber(value);
        this.unit = CssUnitValue.getUnit(unit);
        this.isEmpty = false;
    }

    static getFiniteNumber(value) {
        if (isNaN(value) || Math.abs(value) === Infinity) {
            throw new TypeError(`Failed to set the 'value' property on 'CSSUnitValue': The provided double value is non-finite.`);
        }
        return Number(value);
    }

    static getUnit(unit) {
        if (!Object.keys(units).includes(unit)) {
            throw new TypeError(`Failed to construct 'CSSUnitValue': Invalid unit: ${unit}`);
        }
        return unit
    }

}