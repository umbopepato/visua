import {CSSTransformComponent} from './css-transform-component';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSSkew implements CSSTransformComponent {

    is2D: boolean = true;

    toMatrix(): DOMMatrix {
        return undefined;
    }

    constructor(public ax: CSSNumericValue, public ay: CSSNumericValue) {}
}