import {CSSTransformComponent} from './css-transform-component';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSTranslate implements CSSTransformComponent {

    get is2D(): boolean {
        return !this.z;
    }

    toMatrix(): DOMMatrix {
        return undefined;
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
    }
}