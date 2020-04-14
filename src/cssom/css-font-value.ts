import {CSSStyleValue} from './css-style-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSKeywordValue} from './css-keyword-value';
import {CSSFontFamilyValue} from './css-font-family-value';

export interface CSSFontComponents {

    size: CSSUnitValue | CSSKeywordValue;
    family: CSSFontFamilyValue;
    style?: CSSUnitValue | CSSKeywordValue;
    variant?: CSSKeywordValue;
    weight?: CSSUnitValue | CSSKeywordValue;
    stretch?: CSSKeywordValue;
    lineHeight?: CSSUnitValue | CSSKeywordValue;

}

export class CSSFontValue extends CSSStyleValue {

    public style: CSSUnitValue | CSSKeywordValue;
    public static styleKeywords = ['italic'];
    public variant: CSSKeywordValue;
    public static variantKeywords = ['small-caps'];
    public weight: CSSUnitValue | CSSKeywordValue;
    public static weightKeywords = ['bold', 'bolder', 'lighter'];
    public stretch: CSSKeywordValue;
    public static stretchKeywords = [
        'ultra-condensed',
        'extra-condensed',
        'condensed',
        'semi-condensed',
        'semi-expanded',
        'expanded',
        'extra-expanded',
        'ultra-expanded'
    ];
    public size: CSSUnitValue | CSSKeywordValue;
    public sizeKeywords = [
        'xx-small',
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'xx-large',
    ];
    public lineHeight: CSSUnitValue | CSSKeywordValue;
    public family: CSSFontFamilyValue;

    constructor(components: CSSFontComponents) {
        super();
        let normalKeyword = new CSSKeywordValue('normal');
        this.style = components.style || normalKeyword;
        this.variant = components.variant || normalKeyword;
        this.weight = components.weight || normalKeyword;
        this.stretch = components.stretch || normalKeyword;
        this.size = components.size || new CSSKeywordValue('medium');
        this.lineHeight = components.lineHeight || normalKeyword;
        this.family = components.family;
    }

    toString(): string {
        return `${this.style} ${this.variant} ${this.weight} ${this.stretch} ${this.size}/${this.lineHeight} ${this.family}`;
    }

}

export class CSSSystemFontValue extends CSSStyleValue {

    public static systemFonts = [
        'caption',
        'icon',
        'menu',
        'message-box',
        'small-caption',
        'status-bar',
    ];

    constructor(public font: string) {
        super();
        if (!font) {
            throw new TypeError('Failed to construct CSSSystemFontValue: A system font keyword is required');
        }
    }

    toString(): string {
        return this.font;
    }

}
