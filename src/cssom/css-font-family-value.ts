import {CSSStyleValue} from './css-style-value';
import {CSSKeywordValue} from './css-keyword-value';
import {CSSStringValue} from './css-string-value';

export class CSSFontFamilyValue extends CSSStyleValue {

    public static fallbackFonts = [
        'serif',
        'sans-serif',
        'cursive',
        'fantasy',
        'monospace',
        'system-ui',
        'emoji',
        'math',
        'fangsong',
    ];

    constructor(public fonts: Array<CSSKeywordValue | CSSStringValue>) {
        super();
        if (!fonts || fonts.length === 0) {
            throw new TypeError('Failed to construct CSSFontFamilyValue: At least one font family name is required');
        }
    }

    toString(): string {
        return this.fonts.join(', ');
    }

}
