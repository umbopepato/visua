import {CSSStyleValue} from './css-style-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSBoxShadowValue} from './css-box-shadow-value';
import {CSSBaseType, CSSUnit} from './css';

export class CSSFilter {}

export class CSSBlurFilter extends CSSFilter {

    constructor(public radius: CSSUnitValue) {
        super();
        if (radius.unit.baseType !== CSSBaseType.length) {
            throw new TypeError('Failed to construct CSSBlurFilter: Argument radius must be of type <length>');
        }
    }

    toString(): string {
        return `blur(${this.radius})`;
    }

}

export class CSSBrightnessFilter extends CSSFilter {

    constructor(public value: CSSUnitValue) {
        super();
        if (value.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSBrightnessFilter: Argument value must be of type <percentage>');
        }
    }

    toString(): string {
        return `brightness(${this.value})`;
    }

}

export class CSSContrastFilter extends CSSFilter {

    constructor(public value: CSSUnitValue) {
        super();
        if (value.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSContrastFilter: Argument value must be of type <percentage>');
        }
    }

    toString(): string {
        return `contrast(${this.value})`;
    }

}

export class CSSDropShadowFilter extends CSSFilter {

    constructor(public value: CSSBoxShadowValue) {
        super();
        if (!(value instanceof CSSBoxShadowValue)) {
            throw new TypeError('Failed to construct CSSDropShadowFilter: value is not a CSSBoxShadowValue');
        }
    }

    toString(): string {
        return `drop-shadow(${this.value})`;
    }

}

export class CSSGrayscaleFilter extends CSSFilter {

    constructor(public amount: CSSUnitValue) {
        super();
        if (amount.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSGrayscaleFilter: Argument amount must be of type <percentage>');
        }
    }

    toString(): string {
        return `grayscale(${this.amount})`;
    }

}

export class CSSHueRotateFilter extends CSSFilter {

    constructor(public angle: CSSUnitValue) {
        super();
        if (angle.unit.baseType !== CSSBaseType.angle) {
            throw new TypeError('Failed to construct CSSHueRotateFilter: Argument angle must be of type <angle>');
        }
    }

    toString(): string {
        return `hue-rotate(${this.angle})`;
    }

}

export class CSSInvertFilter extends CSSFilter {

    constructor(public amount: CSSUnitValue) {
        super();
        if (amount.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSInvertFilter: Argument amount must be of type <percentage>');
        }
    }

    toString(): string {
        return `invert(${this.amount})`;
    }

}

export class CSSOpacityFilter extends CSSFilter {

    constructor(public amount: CSSUnitValue) {
        super();
        if (amount.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSOpacityFilter: Argument amount must be of type <percentage>');
        }
    }

    toString(): string {
        return `opacity(${this.amount})`;
    }

}

export class CSSSaturateFilter extends CSSFilter {

    constructor(public amount: CSSUnitValue) {
        super();
        if (amount.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSSaturateFilter: Argument amount must be of type <percentage>');
        }
    }

    toString(): string {
        return `saturate(${this.amount})`;
    }

}

export class CSSSepiaFilter extends CSSFilter {

    constructor(public amount: CSSUnitValue) {
        super();
        if (amount.unit.name !== CSSUnit.percent) {
            throw new TypeError('Failed to construct CSSSepiaFilter: Argument amount must be of type <percentage>');
        }
    }

    toString(): string {
        return `sepia(${this.amount})`;
    }

}

export class CSSFilterValue extends CSSStyleValue {

    constructor(public filters: CSSFilter[]) {
        super();
        if (!filters || filters.length === 0) {
            throw new TypeError('Failed to construct CSSFilterValue: At least one filter is required')
        }
    }

    toString(): string {
        return this.filters.join(' ');
    }

}
