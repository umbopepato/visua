import {CSSMathValue} from './css-math-value';

export class CSSMathMin extends CSSMathValue {

    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }

}