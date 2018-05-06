import {CSS} from './css';
import {CSSUnitValue} from './css-unit-value';
import {CSSStyleValue} from './css-style-value';

// Because of TypeScript issue #4130 the spread operator
// in function parameters is considered an error
export abstract class CSSColorValue extends CSSStyleValue {

    abstract to(notation: string): CSSColorValue;

    protected static rgbToHslNumeric(r: number, g: number, b: number): number[] {
        r /= 255;
        g /= 255;
        b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    private static hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    protected static hslToRgbNumeric(h: number, s: number, l: number): number[] {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = CSSColorValue.hueToRgb(p, q, h + 1 / 3);
            g = CSSColorValue.hueToRgb(p, q, h);
            b = CSSColorValue.hueToRgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    protected static resolveNumericAlpha(alpha?: number | CSSUnitValue): number {
        if (alpha == null) return 1;
        if (alpha instanceof CSSUnitValue) {
            return restrict(alpha.value / 100, 0, 1);
        }
        return restrict(alpha, 0, 1);
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
            throw new TypeError(`Failed to construct 'CSSHexColor': Arguments don't have the same length`);
        }
        [r, g, b, a].forEach((c, i) => {
            if ((i < 3 || c != null) && !c.match(/^[a-f0-9]{1,2}$/i)) {
                throw new TypeError(`Failed to construct 'CSSHexColor': Argument ${c} is invalid`);
            }
        });
        this.r = CSSHexColor.resolveHexComponent(r);
        this.g = CSSHexColor.resolveHexComponent(g);
        this.b = CSSHexColor.resolveHexComponent(b);
        this.a = CSSHexColor.resolveAlpha(a);
    }

    private static resolveHexComponent(comp: string): string {
        return (comp.length < 2 ? comp.concat(comp) : comp).toUpperCase();
    }

    private static resolveAlpha(alpha: string): string {
        if (alpha == null) return 'FF';
        return CSSHexColor.resolveHexComponent(alpha);
    }

    static fromString(hex: string): CSSHexColor {
        let hexTrim = hex.trim();
        let hexVal = hexTrim.startsWith('#') ? hexTrim.substr(1) : hexTrim;
        if (hexVal.length < 5) {
            return new CSSHexColor(...hexVal.split(''));
        } else {
            return new CSSHexColor(...hexVal.match(/.{2}/g));
        }
    }

    format(pattern: string): string {
        // TODO return formatted string
    }

    to(notation: string): CSSColorValue {
        switch (notation) {
            case 'rgb':
            case 'rgba':
                return new CSSRgbaColor(
                    ...[this.r, this.g, this.b, this.a].map(c => Number(`0x${c}`)),
                );
            case 'hsl':
            case 'hsla':
                const r = Number(`0x${this.r}`);
                const g = Number(`0x${this.g}`);
                const b = Number(`0x${this.b}`);
                const a = Number(`0x${this.a}`);
                const hslNumeric = CSSColorValue.rgbToHslNumeric(r, g, b);
                return new CSSHslaColor(
                    hslNumeric[0] * 360,
                    new CSSUnitValue(hslNumeric[1] * 100, 'percent'),
                    new CSSUnitValue(hslNumeric[2] * 100, 'percent'),
                    a,
                );
        }
    }

}

export class CSSRgbaColor extends CSSColorValue {

    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;

    constructor(r: number | CSSUnitValue, g: number | CSSUnitValue, b: number | CSSUnitValue, a?: number | CSSUnitValue) {
        super();
        [r, g, b, a].forEach(c => {
            if (c instanceof CSSUnitValue) {
                if (CSS.getUnitData(c.unit).baseType !== 'percent') {
                    throw new TypeError(`Failed to construct 'CSSRgbaColor': Arguments r, g, b and a must be numbers or percentages`);
                }
            }
        });
        this.r = CSSRgbaColor.resolveRgbComponent(r);
        this.g = CSSRgbaColor.resolveRgbComponent(g);
        this.b = CSSRgbaColor.resolveRgbComponent(b);
        this.a = CSSColorValue.resolveNumericAlpha(a);
    }

    private static resolveRgbComponent(comp: number | CSSUnitValue): number {
        if (comp instanceof CSSUnitValue) {
            return map(restrict(Math.round(comp.value), 0, 100), 0, 100, 0, 255);
        }
        return restrict(Math.round(comp), 0, 255);
    }

    to(notation: string): CSSColorValue {
        switch (notation) {
            case 'hex':
                return new CSSHexColor(
                    ...[this.r, this.g, this.b, this.a * 255].map(c => c.toString(16)),
                );
            case 'hsl':
            case 'hsla':
                const hslNumeric = CSSColorValue.rgbToHslNumeric(this.r, this.g, this.b);
                return new CSSHslaColor(
                    hslNumeric[0] * 360,
                    new CSSUnitValue(hslNumeric[1] * 100, 'percent'),
                    new CSSUnitValue(hslNumeric[2] * 100, 'percent'),
                    this.a,
                );
        }
    }
}

export class CSSHslaColor extends CSSColorValue {

    h: CSSUnitValue;
    s: CSSUnitValue;
    l: CSSUnitValue;
    a: number;

    constructor(h: number | CSSUnitValue, s: CSSUnitValue, l: CSSUnitValue, a?: number | CSSUnitValue) {
        super();
        if (h instanceof CSSUnitValue) {
            if (CSS.getUnitData(h.unit).baseType !== 'angle') {
                throw new TypeError(`Failed to construct 'CSSHslaColor': Argument h must be a number or an angle`);
            }
        }
        [s, l].forEach(c => {
            if (c.unit !== 'percent') {
                throw new TypeError(`Failed to construct 'CSSHslaColor': Argument ${c} is not a percentage`);
            }
        });
        this.h = CSSHslaColor.resolveHue(h);
        this.s = CSSHslaColor.resolveSlComponent(s);
        this.l = CSSHslaColor.resolveSlComponent(l);
        this.a = CSSColorValue.resolveNumericAlpha(a);
    }

    private static resolveHue(hue: number | CSSUnitValue): CSSUnitValue {
        if (hue instanceof CSSUnitValue) {
            let hueDeg = hue.unit === 'deg' ? hue : hue.to('deg');
            hueDeg.value = mod(Math.round(hueDeg.value), 360);
            return hueDeg;
        }
        return new CSSUnitValue(mod(Math.round(hue), 360), 'deg');
    }

    private static resolveSlComponent(comp: CSSUnitValue): CSSUnitValue {
        comp.value = restrict(Math.round(comp.value), 0, 100);
        return comp;
    }

    to(notation: string): CSSColorValue {
        const [r, g, b] = CSSHslaColor.hslToRgbNumeric(
            this.h.value,
            this.s.value,
            this.l.value,
        );
        switch (notation) {
            case 'hex':
                return new CSSHexColor(
                    ...[r, g, b, this.a * 255].map(c => c.toString(16)),
                );
            case 'rgb':
            case 'rgba':
                return new CSSRgbaColor(r, g, b, this.a);
        }
    }

}

function restrict(num: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, num));
}

function map(num: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function mod(num: number, mod: number) {
    return ((num % mod) + mod) % mod;
}