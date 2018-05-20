import {CSSTransformComponent} from './css-transform-component';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSSkew implements CSSTransformComponent {

    readonly is2D: boolean = true;

    toMatrix(): DOMMatrix {
        const ax = this.ax.to('deg').value;
        const ay = this.ay.to('deg').value;
        return new DOMMatrix().skewXSelf(ax).skewYSelf(ay);
    }

    constructor(public ax: CSSNumericValue, public ay: CSSNumericValue) {
        if (!ax.type.has('angle') || !ay.type.has('angle')) {
            throw new TypeError(`Failed to construct CSSSkew: ax and ay must be angles`);
        }
    }
}