import {CSS} from './css';
import {CSSUnitValue} from './css-unit-value';
import {CSSNumberish} from './css-numeric-value';

// @ts-ignore TS2556
export class CSSColorValue {

    to(colorSpace: string): CSSColorValue {
        if (this instanceof CSSHexColor) {
            switch (colorSpace) {
                case 'rgb':
                case 'rgba':
                    // Ref TypeScript issue #4130
                    return new CSSRgbaColor(
                        ...[this.r, this.g, this.b, this.a].map(c => Number(`0x${c}`)),
                    );
                case 'hsl':
                case 'hsla':
                    let r = Number(`0x${this.r}`) / 255;
                    let g = Number(`0x${this.g}`) / 255;
                    let b = Number(`0x${this.b}`) / 255;
                    let max = Math.max(r, g, b), min = Math.min(r, g, b);
                    let h, s, l = (max + min) / 2;
                    if (max == min){
                        h = s = 0; // achromatic
                    } else {
                        let d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch(max){
                            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                            case g: h = (b - r) / d + 2; break;
                            case b: h = (r - g) / d + 4; break;
                        }
                        h /= 6;
                    }
                    return new CSSHslaColor(

                    );
            }
        }
        if (this instanceof CSSRgbaColor) {

        }
        if (this instanceof CSSHslaColor) {

        }
    }

}

export class CSSHexColor extends CSSColorValue {

    r: string;
    g: string;
    b: string;
    a: string;

    constructor(r: string, g: string, b: string, a?: string) {
        super();
        if (![r, g, b].every((c, i, arr) => c.length === arr[0].length)) {
            throw new TypeError(`Failed to construct 'CSSHexColor': All parameters must have the same length`);
        }
        [r, g, b, a].forEach((c, i) => {
            if ((i < 3 || c != null) && !c.match(/^[a-z0-9]{1,2}$/i)) {
                throw new TypeError(`Failed to construct 'CSSHexColor': Parameter ${c} is invalid`);
            }
        });
        if (r.length < 2) {
            r += r;
            g += g;
            b += b;
            a = a == null ? a : a + a;
        }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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

    constructor(public r: number, public g: number, public b: number, public a?: number) {
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
            if (c.unit !== 'percent') {
                throw new TypeError(`Failed to construct 'CSSHslaColor': Argument ${c} must be a percentage`);
            }
        });
        if (a == null) this.a = 1;
    }

}