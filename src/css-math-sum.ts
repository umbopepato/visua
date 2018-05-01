import CSSMathValue from "./css-math-value";

export default class CSSMathSum extends CSSMathValue {

    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }

}