import {CSSTransformComponent} from './css-transform-component';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSSkew implements CSSTransformComponent {

    readonly is2D: boolean = true;

    toMatrix(): DOMMatrix {
        const ax = this.ax.to('rad').value;
        const ay = this.ay.to('rad').value;
        return new DOMMatrix([1, Math.tan(ay), 0, 0, Math.tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    constructor(public ax: CSSNumericValue, public ay: CSSNumericValue) {
        if (!ax.type.has('angle') || !ay.type.has('angle')) {
            throw new TypeError(`Failed to construct CSSSkew: ax and ay must be angles`);
        }
    }
}