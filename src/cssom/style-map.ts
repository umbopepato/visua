import {CSSStyleValue} from './css-style-value';

export class StyleMapEntry {
    constructor(public name: string, public value: CSSStyleValue) {}
}

export class StyleMap {

    private map = {};

    get(property: string): CSSStyleValue {
        if (!this.map.hasOwnProperty(property)) return;
        return this.map[property];
    }

    getAll(properties: string[]): StyleMapEntry[] {
        return Object.keys(this.map)
            .filter(k => properties.includes(k))
            .map(k => new StyleMapEntry(k, this.map[k]));
    }

    getSimilar(property: RegExp): StyleMapEntry[] {
        let foundKeys = Object.keys(this.map).filter(k => k.match(property) != null);
        return foundKeys.map(k => new StyleMapEntry(k, this.map[k]));
    }

    set(property: string, value: CSSStyleValue) {
        if (this.map.hasOwnProperty(property)) {
            console.warn(`Warn: variable ${property} has been defined more times.`);
        }
        this.map[property] = value;
    }

    forEach(callbackFn: (property: string, value: CSSStyleValue) => void) {
        Object.keys(this.map).forEach(key => {
            callbackFn(key, this.map[key]);
        });
    }

    toString() {
        return `${this.map}`;
    }

}