import {CSSTransformComponent} from './css-transform-value';
import {CSSNumberish, CSSNumericValue} from './css-numeric-value';
import {DOMMatrix} from './dom-matrix';
import {CSS, CSSBaseType} from './css';
import {CSSUnitValue} from './css-unit-value';

export class CSSScale implements CSSTransformComponent {

    private x: CSSNumericValue;
    private y: CSSNumericValue;
    private z: CSSNumericValue;

    get is2D(): boolean {
        return (this.z as CSSUnitValue).value === 1;
    }

    toMatrix(): DOMMatrix {
        const x = (this.x as CSSUnitValue).value;
        const y = (this.y as CSSUnitValue).value;
        const z = (this.z as CSSUnitValue).value;
        return new DOMMatrix().scaleNonUniformSelf(x, y, z);
    }

    constructor(x: CSSNumberish, y: CSSNumberish, z?: CSSNumberish) {
        this.x = CSSNumericValue.rectifyNumberishValue(x);
        this.y = CSSNumericValue.rectifyNumberishValue(y);
        if (z) this.z = CSSNumericValue.rectifyNumberishValue(z);
        else this.z = CSS.number(1);
        if (![this.x, this.y, this.z].every(v => (v as CSSUnitValue).unit.baseType === CSSBaseType.number)) {
            throw new TypeError(`Failed to construct CSSRotate: x, y, z must be of type <number>`);
        }
    }

    toString(): string {
        let components = [this.x, this.y];
        if (!this.z.equals(CSS.number(1))) components.push(this.z);
        return `scale(${components.join(', ')})`;
    }

}