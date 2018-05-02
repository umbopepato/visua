import {CSSUnitValue} from './css-unit-value';
import {CSSNumberish} from './css-numeric-value';
import CSS from './css';

export class CSSColorValue {

    to(space: string): CSSColorValue {

    }

}

export class CSSHexColor extends CSSColorValue {

    constructor(public r: string, public g: string, public b: string, public a: string) {
        super();
        [r, g, b, a].forEach((c, i) => {
            if ((i < 3 || c != null) && !c.match(/^[a-z0-9]{2}$/i)) {
                throw new TypeError(`Failed to construct 'CSSHexColor': Parameter ${c} is invalid`);
            }
        });
    }

    toString() {
        return `#${this.r}${this.g}${this.b}${this.a || ''}`;
    }

}

export class CSSRgbaColor extends CSSColorValue {

    constructor(public r: number, public g: number, b: number, public a: number = 1) {
        super();
        [r, g, b].forEach(c => {
            if (!Number.isInteger(c) || c < 0 || c > 255) {
                throw new TypeError(`Failed to construct 'CSSRgbaColor': Parameter ${c} is invalid`);
            }
        });
        if (a < 0 || a > 1) {
            throw new TypeError(`Failed to construct 'CSSRgbaColor': Parameter a is invalid`);
        }
    }

}

export class CSSHslaColor extends CSSColorValue {

    constructor(public h: CSSNumberish, public s: CSSUnitValue, public l: CSSUnitValue, public a: CSSNumberish = 1) {
        super();
        if (h instanceof CSSUnitValue) {
            if (CSS.getUnitData(h.unit).baseType !== 'angle') {
                throw new TypeError(`Failed to construct 'CSSHslaColor': Argument h must be a number or an angle`);
            }
        }
        [s, l].forEach(c => {
            if (c.unit !== 'percentage') {
                throw new TypeError(`Failed to construct 'CSSHslaColor': Argument ${c} must be a percentage`);
            }
        });
    }

}