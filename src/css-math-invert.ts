import {CSSMathValue} from './css-math-value';

export class CSSMathInvert extends CSSMathValue {

    readonly value;

    constructor(value) {
        super();
        this.value = value;
    }

}