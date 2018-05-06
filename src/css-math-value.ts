import {CSSNumericValue} from './css-numeric-value';

enum CSSMathOperator {
    sum,
    product,
    negate,
    invert,
    min,
    max,
}

export class CSSMathValue extends CSSNumericValue {
    readonly operator: CSSMathOperator;
}