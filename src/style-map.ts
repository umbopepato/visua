import {CSSStyleValue} from './css-style-value';

export class StyleMap {

    private map = {};

    get(property: string): CSSStyleValue {
        if (!this.map.hasOwnProperty(property)) return;
        return this.map[property];
    }

    getSimilar(property: RegExp) {
        let foundKeys = Object.keys(this.map).filter(k => k.match(property) != null);
        return foundKeys.map(k => {
            return {
                name: k,
                value: this.map[k],
            }
        });
    }

    set(property: string, value: CSSStyleValue) {
        if (this.map.hasOwnProperty(property)) {
            console.warn(`Warn: variable ${property} has been defined more times.`);
        }
        this.map[property] = value;
    }

    forEach(callbackFn: (name: string, value: CSSStyleValue) => void) {
        Object.keys(this.map).forEach(key => {
            callbackFn(key, this.map[key]);
        });
    }

    toString() {
        return `${this.map}`;
    }

}