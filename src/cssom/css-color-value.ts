import {CSSBaseType, CSSUnit} from './css';
import {CSSUnitValue} from './css-unit-value';
import {CSSStyleValue} from './css-style-value';
import {map, mod, restrict} from '../util';

// Because of TypeScript issue #4130 the spread operator
// in function parameters is considered an error
export abstract class CSSColorValue extends CSSStyleValue {

    /**
     * @hidden
     */
    public static x11ColorsMap = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
    };

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

    public abstract isOpaque(): boolean;
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
            // @ts-ignore
            return new CSSHexColor(...hexVal.split(''));
        } else {
            // @ts-ignore
            return new CSSHexColor(...hexVal.match(/.{2}/g));
        }
    }

    to(notation: string): CSSColorValue {
        switch (notation) {
            case 'rgb':
            case 'rgba':
                // @ts-ignore
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

    toString(): string {
        return `#${this.r}${this.g}${this.b}${this.isOpaque() ? '' : this.a}`;
    }

    isOpaque(): boolean {
        return this.a.toLowerCase() === 'ff';
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
                if (c.unit.baseType !== CSSBaseType.percent) {
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
                // @ts-ignore
                return new CSSHexColor(
                    ...[this.r, this.g, this.b, this.a * 255].map(c => c.toString(16)),
                );
            case 'hsl':
            case 'hsla':
                const hslNumeric = CSSColorValue.rgbToHslNumeric(this.r, this.g, this.b);
                return new CSSHslaColor(
                    hslNumeric[0] * 360,
                    new CSSUnitValue(hslNumeric[1] * 100, CSSUnit.percent),
                    new CSSUnitValue(hslNumeric[2] * 100, CSSUnit.percent),
                    this.a,
                );
        }
    }

    toString(): string {
        if (this.isOpaque()) {
            return `rgb(${this.r}, ${this.g}, ${this.b})`;
        }
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    isOpaque(): boolean {
        return this.a === 1;
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
            if (h.unit.baseType !== CSSBaseType.angle) {
                throw new TypeError(`Failed to construct 'CSSHslaColor': Argument h must be a number or an angle`);
            }
        }
        [s, l].forEach(c => {
            if (c.unit.name !== CSSUnit.percent) {
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
            let hueDeg = hue.unit.name === CSSUnit.deg ? hue : hue.to(CSSUnit.deg);
            hueDeg.value = mod(Math.round(hueDeg.value), 360);
            return hueDeg;
        }
        return new CSSUnitValue(mod(Math.round(hue), 360), CSSUnit.deg);
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
                // @ts-ignore
                return new CSSHexColor(
                    ...[r, g, b, this.a * 255].map(c => c.toString(16)),
                );
            case 'rgb':
            case 'rgba':
                return new CSSRgbaColor(r, g, b, this.a);
        }
    }

    toString() {
        if (this.isOpaque()) {
            return `hsl(${this.h}, ${this.s}, ${this.l})`;
        }
        return `hsla(${this.h}, ${this.s}, ${this.l}, ${this.a})`;
    }

    isOpaque(): boolean {
        return this.a === 1;
    }

}
