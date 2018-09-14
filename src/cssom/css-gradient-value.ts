import {CSSStyleValue} from './css-style-value';
import {CSSKeywordsValue} from './css-keyword-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSColorValue} from './css-color-value';
import {CSS, CSSBaseType, CSSUnit} from './css';

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