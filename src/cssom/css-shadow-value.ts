import {CSSStyleValue} from './css-style-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSColorValue} from './css-color-value';
import {CSS} from './css';

export interface CSSShadowComponents {

    inset?: boolean;
    offsetX?: CSSUnitValue;
    offsetY?: CSSUnitValue;
    blurRadius?: CSSUnitValue;
    spreadDistance?: CSSUnitValue;
    color: CSSColorValue;

}

export class CSSShadow {

    public inset: boolean;
    public offsetX: CSSUnitValue;
    public offsetY: CSSUnitValue;
    public blurRadius: CSSUnitValue;
    public spreadDistance: CSSUnitValue;
    public color: CSSColorValue;
    private deafultLength = CSS.number(0);
    
    constructor(components: CSSShadowComponents) {
        if (components.blurRadius != null && components.blurRadius.value < 0) {
            throw new TypeError('Failed to construct CSSShadow: Component blurRadius must be positive');
        }
        this.inset = components.inset || false;
        this.offsetX = components.offsetX || this.deafultLength;
        this.offsetY = components.offsetY || this.deafultLength;
        this.blurRadius = components.blurRadius || this.deafultLength;
        this.spreadDistance = components.spreadDistance || this.deafultLength;
        this.color = components.color;
    }

    toString(): string {
        let lengths = [this.offsetX, this.offsetY, this.blurRadius, this.spreadDistance]
            .filter(l => !l.equals(this.deafultLength));
        return `${this.inset ? 'inset ' : ''}${lengths.join(' ')} ${this.color}`;
    }

}

export class CSSShadowValue extends CSSStyleValue {

    constructor(public layers: CSSShadow[]) {
        super();
    }

    toString(): string {
        return this.layers.join(', ');
    }

}