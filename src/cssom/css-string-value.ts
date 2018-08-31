import {CSSStyleValue} from './css-style-value';
import {removeQuotes} from '../util';

export class CSSStringValue extends CSSStyleValue {

    public value: string;

    constructor(value: string) {
        super();
        this.value = removeQuotes(value);
    }

    toString() {
        return this.value;
    }

}