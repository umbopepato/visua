import {CSSTransformComponent} from './css-transform-value';
import {CSSNumberish, CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';
import {CSS} from './css';
import {CSSUnitValue} from './css-unit-value';

export class CSSRotate implements CSSTransformComponent {

    angle: CSSNumericValue;
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
        return (this.z as CSSUnitValue).value === 1;
    }

    toMatrix(): DOMMatrix {
        const x = (this.x as CSSUnitValue).value;
        const y = (this.y as CSSUnitValue).value;
        const z = (this.z as CSSUnitValue).value;
        const angle = this.angle.to('deg').value;
        return new DOMMatrix().rotateAxisAngleSelf(x, y, z, angle);
    }

    constructor(angle: CSSNumericValue, x?: CSSNumberish, y?: CSSNumberish, z?: CSSNumberish) {
        if (angle.type.size !== 1 || !angle.type.has('angle')) {
            throw new TypeError(`Failed to construct CSSRotate: ${JSON.stringify(angle)} is not an angle`);
        }
        this.angle = angle;
        if (!x && !y && !z) {
            this.x = CSS.number(0);
            this.y = CSS.number(0);
            this.z = CSS.number(1);
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
            if (![this.x, this.y, this.z].every(v => v instanceof CSSUnitValue && v.unit.baseType === 'number')) {
                throw new TypeError(`Failed to construct CSSRotate: Failed to rectify numberish value`);
            }
        }
    }

    toString(): string {
        return `rotate(${this.angle})`;
    }

}