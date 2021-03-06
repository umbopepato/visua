import {CSSStyleValue} from './css-style-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSKeywordValue} from './css-keyword-value';
import {CSSColorValue} from './css-color-value';

/**
 * The components of the border value
 */
export interface CSSBorderComponents {

    // Some components are required to recognize the value
    // and because in Visua there is no currentColor context
    lineWidth?: CSSUnitValue | CSSKeywordValue;
    lineStyle: CSSKeywordValue;
    color: CSSColorValue;

}

/**
 * Represents a CSS border value like the one used in `border` properties.
 *
 * **Syntax**
 * ```
 * [<length>] <identifier> <color>
 * ```
 *
 * **Examples**
 * ```
 * --border: 1px solid black;
 * --border: 4px dotted #CCC;
 * ```
 */
export class CSSBorderValue extends CSSStyleValue {

    public lineWidth: CSSUnitValue | CSSKeywordValue;
    public static lineWidthKeywords = [ 'thin', 'medium', 'thick' ];
    public lineStyle: CSSKeywordValue;
    public static lineStyleKeywords = [
        'none',
        'hidden',
        'dotted',
        'dashed',
        'solid',
        'double',
        'groove',
        'ridge',
        'inset',
        'outset',
    ];
    public color: CSSColorValue;

    constructor(components: CSSBorderComponents) {
        super();
        if (components.lineWidth instanceof CSSUnitValue && components.lineWidth.value < 0) {
            throw new TypeError('Failed to construct CSSBorderValue: Component lineWidth cannot be a negative <length>');
        }
        if (components.lineStyle == null || components.color == null) {
            throw new TypeError('Failed to construct CSSBorderValue: Components lineStyle and color are required');
        }
        this.lineWidth = components.lineWidth || new CSSKeywordValue('medium');
        this.lineStyle = components.lineStyle;
        this.color = components.color;
    }

    /**
     * Serializes the `CSSBorderValue` to standard CSS
     */
    toString(): string {
        return `${this.lineWidth} ${this.lineStyle} ${this.color}`;
    }

}