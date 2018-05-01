import CSSNumericValue from "./css-numeric-value";

enum CSSMathOperator {
    sum = 'sum',
    product = 'product',
    negate = 'negate',
    invert = 'invert',
    min = 'min',
    max = 'max',
}

export default class CSSMathValue extends CSSNumericValue {

    readonly operator: CSSMathOperator;

}