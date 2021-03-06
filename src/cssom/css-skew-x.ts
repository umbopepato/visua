import {CSSTransformComponent} from './css-transform-value';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSSkewX implements CSSTransformComponent {

    readonly is2D: boolean = true;

    toMatrix(): DOMMatrix {
        const ax = this.ax.to('deg').value;
        return new DOMMatrix().skewXSelf(ax);
    }

    constructor(public ax: CSSNumericValue) {
        if (!ax.type.has('angle')) {
            throw new TypeError(`Failed to construct CSSSkew: ax must be an angle`);
        }
    }

    toString(): string {
        return `skewX(${this.ax})`;
    }

}