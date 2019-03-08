import {CSSTransformComponent} from './css-transform-value';
import {CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';

export class CSSPerspective implements CSSTransformComponent {

    readonly is2D: boolean = false;

    toMatrix(): DOMMatrix {
        const matrix = new DOMMatrix();
        matrix.m34 = - 1 / this.length.to('px').value;
        return matrix;
    }

    constructor(public length: CSSNumericValue) {
        if (!length.type.has('length')) {
            throw new TypeError(`Failed to construct CSSSkew: ax and ay must be angles`);
        }
    }

    toString(): string {
        return `perspective(${this.length})`;
    }

}