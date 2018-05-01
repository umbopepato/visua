import {CSSMathValue} from './css-math-value';

export class CSSMathSum extends CSSMathValue {

    readonly values;

    constructor(values) {
        super();
        this.values = values;
    }

}