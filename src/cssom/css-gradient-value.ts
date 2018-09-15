import {CSSStyleValue} from './css-style-value';
import {CSSKeywordsValue, CSSKeywordValue} from './css-keyword-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSColorValue} from './css-color-value';
import {CSS, CSSBaseType, CSSUnit} from './css';
import {CSSPositionValue} from './css-position-value';

export class CSSGradientStep {

    constructor(public color: CSSColorValue, public position?: CSSUnitValue) {
        if (position && position.unit.baseType !== CSSBaseType.length && position.unit.baseType !== CSSBaseType.percent) {
            throw new TypeError('Failed to construct CSSGradientStep: Argument position must be of type <length> or <percentage>');
        }
    }

    toString() {
        return `${this.color}${this.position ? ` ${this.position}` : ''}`;
    }

}

export class CSSGradientValue extends CSSStyleValue {

}

export class CSSLinearGradient extends CSSGradientValue {

    private static get sidesOrCorners() {
        return {
            top: CSS.deg(0),
            right: CSS.deg(90),
            bottom: CSS.deg(180),
            left: CSS.deg(270),
        };
    }

    constructor(public steps: CSSGradientStep[], public direction: CSSKeywordsValue | CSSUnitValue = new CSSUnitValue(0, CSSUnit.deg)) {
        super();
        if (direction instanceof CSSUnitValue) {
            if (direction.unit.baseType !== CSSBaseType.angle) {
                throw new TypeError('Failed to construct CSSLinearGradient: Argument direction must be of type <angle>');
            }
        } else {
            if (direction.keywords.length < 1 || direction.keywords.length > 2) {
                throw new TypeError('Failed to construct CSSLinearGradient: Direction must be a <side-or-corner>');
            }
            let degs = direction.keywords.map(k => CSSLinearGradient.sidesOrCorners[k.value]);
            if (degs.length === 2) {
                this.direction = degs[0].add(degs[1]).div(2);
            } else {
                this.direction = degs[0];
            }
        }
    }

    toString() {
        return `linear-gradient(${this.direction == null || this.direction === CSS.deg(0) ? '' : `${this.direction}, `}${this.steps.map(s => s.toString()).join(', ')})`;
    }

}

export interface CSSRadialGradientDimensions {
    shape?: CSSKeywordValue,
    size?: CSSUnitValue | CSSKeywordValue | CSSUnitValue[],
    position?: CSSPositionValue,
}

export class CSSRadialGradient extends CSSGradientValue {

    public position: CSSPositionValue;
    public size: CSSUnitValue | CSSKeywordValue | CSSUnitValue[];
    public shape: CSSKeywordValue;

    constructor(public steps: CSSGradientStep[], dimensions: CSSRadialGradientDimensions) {
        super();
        this.position = dimensions.position || new CSSPositionValue([new CSSKeywordValue('center')]);
        this.size = dimensions.size || new CSSKeywordValue('farthest-corner');
        this.shape = dimensions.shape || (this.size instanceof CSSUnitValue || this.size instanceof CSSKeywordValue ? new CSSKeywordValue('circle') : new CSSKeywordValue('ellipse'));
        if (this.shape.value === 'circle' && Array.isArray(this.size)) {
            console.log(dimensions.shape);
            throw new TypeError('Failed to construct CSSRadialGradient: A circle <shape> only accepts <length> or <identifier> as size');
        }
        if (this.shape.value === 'ellipse' && this.size instanceof CSSUnitValue) {
            throw new TypeError('Failed to construct CSSRadialGradient: An ellipse <shape> only accepts [<length> | <percentage>]{2} or <identifier> as size');
        }
    }

    private hasDefaultSize(): boolean {
        return this.size instanceof CSSKeywordValue && this.size.value === 'farthest-corner';
    }

    private hasDefaultShape(): boolean {
        return this.shape.value === 'circle';
    }

    private hasDefaultPosition(): boolean {
        return this.position.isCenter;
    }

    toString() {
        let dimensions = [];
        if (!this.hasDefaultSize()) {
            if (this.size instanceof CSSUnitValue || this.size instanceof CSSKeywordValue) dimensions.push(this.size);
            else dimensions.push(this.size.map(s => s.toString()).join(' '));
        }
        if (!this.hasDefaultShape()) dimensions.push(this.shape);
        if (!this.hasDefaultPosition()) dimensions.push(`at ${this.position}`);
        return `radial-gradient(${dimensions.length > 0 ? `${dimensions.join(' ')}, ` : ''}${this.steps.map(s => s.toString()).join(', ')})`;
    }

}