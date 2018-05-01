import {CSSMathValue} from './css-math-value';

export class CSSMathNegate extends CSSMathValue {

    readonly value;

    constructor(value) {
        super();
        this.value = value;
    }
}