import {CSSTransformComponent} from './css-transform-component';
import {CSSNumberish, CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSRotate implements CSSTransformComponent {

    get is2D(): boolean {
        return !this.z;
    }

    toMatrix(): DOMMatrix {
        return undefined;
    }

    constructor(public x: CSSNumberish, public y: CSSNumberish, public z: CSSNumberish, public angle: CSSNumericValue) {}

}