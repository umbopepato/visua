import {CSSTransformComponent} from './css-transform-component';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';
import {CSS} from './css';
import {CSSUnitValue} from './css-unit-value';

export class CSSTranslate implements CSSTransformComponent {

    get is2D(): boolean {
        return (this.z as CSSUnitValue).value === 0;
    }

    toMatrix(): DOMMatrix {
        const x = this.x.to('px').value;
        const y = this.y.to('px').value;
        const z = this.z.to('px').value;
        return new DOMMatrix().translateSelf(x, y, z);
    }

    constructor(public x: CSSNumericValue, public y: CSSNumericValue, public z?: CSSNumericValue) {
        if (x.type.size !== 1 || !(x.type.has('length') || x.type.has('percent'))) {
            throw new TypeError(`Failed to construct CSSTranslate: ${x} is neither length nor percent`);
        }
        if (y.type.size !== 1 || !(y.type.has('length') || y.type.has('percent'))) {
            throw new TypeError(`Failed to construct CSSTranslate: ${y} is neither length nor percent`);
        }
        if (z && (z.type.size !== 1 || !z.type.has('length'))) {
            throw new TypeError(`Failed to construct CSSTranslate: ${z} is neither length nor percent`);
        }
        if (!z) this.z = CSS.px(0);
    }
}