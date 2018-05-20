import {CSSTransformComponent} from './css-transform-component';
import {DOMMatrix} from './dom-matrix';

export class CSSMatrixComponent implements CSSTransformComponent {

    get is2D(): boolean {
        return this.matrix.is2D;
    }

    constructor(public matrix: DOMMatrix) {}

    toMatrix(): DOMMatrix {
        return this.matrix;
    }
}