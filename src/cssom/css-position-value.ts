import {CSSNumericValue} from './css-numeric-value';
import {CSSStyleValue} from './css-style-value';
import {CSS, CSSUnit} from './css';
import {CSSKeywordValue} from './css-keyword-value';
import {CSSUnitValue} from './css-unit-value';

enum Bias {
    AUTO,
    HORIZONTAL,
    VERTICAL,
}

export class CSSPositionValue extends CSSStyleValue {

    public x: CSSNumericValue = CSS.percent(50);
    public y: CSSNumericValue = CSS.percent(50);
    private bias: Bias = Bias.AUTO;

    constructor(...parts: CSSStyleValue[]) {
        super();
        if (parts.length === 1) {
            this.setXorYFromSingleValue(parts[0]);
        } else if (parts.length === 2) {
            this.setXorYFromSingleValue(parts[0]);
            this.toggleBias();
            this.setXorYFromSingleValue(parts[1]);
        } else {
            if (parts[0] instanceof CSSKeywordValue &&
                parts[1] instanceof CSSNumericValue &&
                ((parts[1] as CSSNumericValue).type.has('length') ||
                    (parts[1] as CSSNumericValue).type.has('percentage'))) {
                this.setXorYFromKeywordAndLength(parts[0] as CSSKeywordValue, parts[1] as CSSNumericValue);
            } else {
                this.setXorYFromSingleValue(parts[0]);
            }
            this.toggleBias();
            if (parts.length === 3) {
                this.setXorYFromSingleValue(parts[3]);
            } else {
                if (parts[2] instanceof CSSKeywordValue &&
                    parts[3] instanceof CSSNumericValue &&
                    ((parts[3] as CSSNumericValue).type.has('length') ||
                        (parts[3] as CSSNumericValue).type.has('percentage'))) {
                    this.setXorYFromKeywordAndLength(parts[2] as CSSKeywordValue, parts[3] as CSSNumericValue);
                } else {
                    throw new TypeError(`Invalid position structure`);
                }
            }
        }
    }

    private toggleBias() {
        if (this.bias.valueOf() === Bias.HORIZONTAL) {
            this.bias = Bias.VERTICAL;
        } else {
            this.bias = Bias.HORIZONTAL;
        }
    }

    private setXorYFromKeywordAndLength(keyword: CSSKeywordValue, length: CSSNumericValue) {
        this.setXorYFromSingleValue(keyword);
        let adjustment = length;
        if (keyword.value === 'right' || keyword.value === 'bottom') {
            adjustment = CSS.px(0).sub(length);
        }
        if (this.bias.valueOf() === Bias.HORIZONTAL) {
            this.x.add(adjustment);
        } else if (this.bias.valueOf() === Bias.VERTICAL) {
            this.y.add(adjustment);
        }
    }

    private setXorYFromSingleValue(value: CSSStyleValue) {
        if (value instanceof CSSKeywordValue) {
            if (value.value === 'left' && this.bias.valueOf() !== Bias.VERTICAL) {
                this.x = CSS.percent(0);
                this.bias = Bias.HORIZONTAL;
                return;
            } else if (value.value === 'right' && this.bias.valueOf() !== Bias.VERTICAL) {
                this.x = CSS.percent(100);
                this.bias = Bias.HORIZONTAL;
                return;
            } else if (value.value === 'top' && this.bias.valueOf() !== Bias.HORIZONTAL) {
                this.y = CSS.percent(0);
                this.bias = Bias.VERTICAL;
                return;
            } else if (value.value === 'bottom' && this.bias.valueOf() !== Bias.HORIZONTAL) {
                this.y = CSS.percent(100);
                this.bias = Bias.VERTICAL;
                return;
            } else {
                if (value.value !== 'center') throw new TypeError(`Unexpected keyword ${value.value}`);
            }
        } else if (value instanceof CSSNumericValue) {
            if (!value.type.has('length') && !value.type.has('percentage')) {
                throw new TypeError(`Unexpected type ${value.type}`);
            }
            if (this.bias.valueOf() === Bias.VERTICAL) {
                this.y = value;
            } else {
                this.x = value;
                this.bias = Bias.HORIZONTAL;
                return;
            }
        } else {
            throw new TypeError(`Unexpected value ${value}`);
        }
    }

    private static serializeX(percent: CSSNumericValue): string | CSSNumericValue {
        if (percent instanceof CSSUnitValue && percent.unit.name === CSSUnit.percent) {
            switch (percent.value) {
                case 0: return 'left';
                case 50: return 'center';
                case 100: return 'right';
            }
        }
        return percent;
    }

    private static serializeY(percent: CSSNumericValue): string | CSSNumericValue {
        if (percent instanceof CSSUnitValue && percent.unit.name === CSSUnit.percent) {
            switch (percent.value) {
                case 0: return 'top';
                case 50: return 'center';
                case 100: return 'bottom';
            }
        }
        return percent;
    }

    public get isCenter(): boolean {
        let center = CSS.percent(50);
        return this.x.equals(center) && this.y.equals(center);
    }

    toString() {
        if (this.isCenter) return 'center';
        let components = [
            CSSPositionValue.serializeX(this.x),
            CSSPositionValue.serializeY(this.y),
        ];
        return `${components.join(' ')}`;
    }

}
