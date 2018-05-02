import {CSSUnitValue} from './css-unit-value';
import {CSSNumberish} from './css-numeric-value';
import CSS from './css';

export class CSSColorValue {

    to(colorSpace: string): CSSColorValue {
        
    }

}

export class CSSHexColor extends CSSColorValue {

    constructor(public r: string, public g: string, public b: string, public a?: string) {
        super();
        if (![r, g, b].every((c, i, arr) => c.length === arr[0].length)) {
            throw new TypeError(`Failed to construct 'CSSHexColor': All parameters must have the same length`);
        }
        [r, g, b, a].forEach((c, i) => {
            if ((i < 3 || c != null) && !c.match(/^[a-z0-9]{1,2}$/i)) {
                throw new TypeError(`Failed to construct 'CSSHexColor': Parameter ${c} is invalid`);
            }
        });
    }

    static fromString(hex: string): CSSHexColor {
        let hexTrim = hex.trim();
        let num = hexTrim.startsWith('#') ? hexTrim.substr(1) : hexTrim;
        if (num.length === 3) {
            return new CSSHexColor(num.charAt(0), num.charAt(1), num.charAt(2));
        }
    }

    toString() {
        return `#${this.r}${this.g}${this.b}${this.a || ''}`;
    }

}

export class CSSRgbaColor extends CSSColorValue {

    constructor(public r: number, public g: number, b: number, public a?: number) {
        super();
        [r, g, b].forEach(c => {
            if (!Number.isInteger(c) || c < 0 || c > 255) {
                throw new TypeError(`Failed to construct 'CSSRgbaColor': Parameter ${c} is invalid`);
            }
        });
        if (a == null) this.a = 1;
        if (a != null && a < 0 || a > 1) {
            throw new TypeError(`Failed to construct 'CSSRgbaColor': Parameter a is invalid`);
        }
    }

}

export class CSSHslaColor extends CSSColorValue {

    constructor(public h: CSSNumberish, public s: CSSUnitValue, public l: CSSUnitValue, public a?: CSSNumberish) {
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
        if (a == null) this.a = 1;
    }

}