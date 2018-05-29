import {CSSTransformComponent} from './css-transform-component';
import {CSSNumberish, CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';
import {CSS} from './css';

export class CSSScale implements CSSTransformComponent {

    private _x: CSSNumericValue;
    private _y: CSSNumericValue;
    private _z: CSSNumericValue;

    get x() {
        return this._x;
    }

    set x(val: CSSNumberish) {
        this._x = CSSNumericValue.rectifyNumberishValue(val);
    }

    get y() {
        return this._y;
    }

    set y(val: CSSNumberish) {
        this._y = CSSNumericValue.rectifyNumberishValue(val);
    }

    get z() {
        return this._z;
    }

    set z(val: CSSNumberish) {
        this._z = CSSNumericValue.rectifyNumberishValue(val);
    }

    get is2D(): boolean {
        return this.z.value !== 1;
    }

    toMatrix(): DOMMatrix {
        const x = this.x.to('px').value;
        const y = this.y.to('px').value;
        const z = this.z.to('px').value;
        return new DOMMatrix().scaleNonUniformSelf(x, y, z);
    }

    constructor(x: CSSNumberish, y: CSSNumberish, z?: CSSNumberish) {
        this.x = x;
        this.y = y;
        if (z) this.z = z;
        else this.z = CSS.number(1);
        if (![this.x, this.y, this.z].every(v => CSS.getUnitData(v.unit).baseType !== 'number')) {
            throw new TypeError(`Failed to construct CSSRotate: Failed to rectify numberish value`);
        }
    }
}