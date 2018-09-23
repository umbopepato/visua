import {CSSTransformComponent} from './css-transform-value';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSSkewY implements CSSTransformComponent {

    readonly is2D: boolean = true;

    toMatrix(): DOMMatrix {
        const ay = this.ay.to('deg').value;
        return new DOMMatrix().skewYSelf(ay);
    }

    constructor(public ay: CSSNumericValue) {
        if (!ay.type.has('angle')) {
            throw new TypeError(`Failed to construct CSSSkew: ay must be an angle`);
        }
    }

    toString(): string {
        return `skewY(${this.ay})`;
    }

}