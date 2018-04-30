/*
import Color from 'color';

export default class CSSColorValue {

    static fromHsla(...args) {
        if (args.length < 4) {
            throw new TypeError(`Failed to construct 'CSSColorValue': 4 arguments required by fromRgba, but only ${args.length} present.`);
        }
        if (!args.every(e => typeof e === 'number' && e <= 255 && e >= 0)) {
            throw new TypeError(`Failed to construct 'CSSColorValue': invalid argument.`);
        }
        return new CSSColorValue(new Color({h: args[0], s: args[1], l: args[2], a: args[3]}));
    }

    static fromHsl(...args) {
        return CSSColorValue.fromHsla(args.push(1));
    }

    static rgbaToHex(r, g, b, a) {
        return
    }
}*/
