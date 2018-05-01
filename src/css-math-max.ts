export default class CSSMathMax {

    private readonly _values;

    get values() {
        return this._values;
    }

    constructor(...values) {
        this._values = values;
    }

}