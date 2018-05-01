import {CSSMathValue} from './css-math-value';

export class CSSMathMax extends CSSMathValue {

    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }

}