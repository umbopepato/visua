import {CSSStyleValue} from './css-style-value';

export class CSSKeywordValue extends CSSStyleValue {

    constructor(public value: string) {
        super();
    }

}