enum CSSMathOperator {
    sum,
    product,
    negate,
    invert,
    min,
    max,
}

export class CSSMathValue {

    readonly operator: CSSMathOperator;

}