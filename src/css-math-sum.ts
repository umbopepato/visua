export default class CssMathSum {

    private _values;

    get values() {
        return this._values;
    }

    constructor(...values) {
        this._values = values;
    }

}