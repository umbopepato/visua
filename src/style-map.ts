import CSSStyleValue from './css-style-value';

export default class StyleMap {

    private map = {};

    get(property) {
        if (!this.map.hasOwnProperty(property)) return;
        return this.map[property];
    }

    set(property: string, value: CSSStyleValue) {
        if (this.map.hasOwnProperty(property)) {
            console.warn(`Warn: variable ${property} has been defined more times.`);
        }
        this.map[property] = value;
    }

    toString() {
        return `${this.map}`;
    }

}