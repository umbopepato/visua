import {CSSStyleValue} from './css-style-value';

export class CSSKeywordsValue extends CSSStyleValue {

    constructor(public keywords: CSSKeywordValue[]) {
        super();
    }

    toString() {
        return this.keywords.join(' ');
    }

}

export class CSSKeywordValue extends CSSStyleValue {

    constructor(public value: string) {
        super();
    }

    toString() {
        return this.value;
    }

}
