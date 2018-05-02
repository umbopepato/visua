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

    constructor(public x: CSSNumericValue, public y: CSSNumericValue, public z: CSSNumericValue) {}
}