import {CSSTransformComponent} from './css-transform-component';
import {DOMMatrix} from './dom-matrix';

export class CSSMatrixComponent implements CSSTransformComponent {
    is2D: boolean;

    toMatrix(): DOMMatrix {
        return undefined;
    }

    constructor(public matrix: DOMMatrix) {}
}