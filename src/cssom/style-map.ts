import {CSSStyleValue} from './css-style-value';

export class StyleMapEntry {
    constructor(public name: string, public value: CSSStyleValue) {}
}

/**
 * The style map containing all the css variables defined in the parsed identity css files
 */
export class StyleMap {

    private map = {};

    /**
     * Gets the CSSStyleValue given the corresponding property name
     *
     * @param property The name of the property (prepending `--` to the name of the property is recommended but not mandatory)
     * @returns The corresponding style value
     */
    get(property: string): CSSStyleValue {
        if (!property.startsWith('--')) property = `--${property}`;
        if (!this.map.hasOwnProperty(property)) return;
        return this.map[property];
    }

    /**
     * Gets the CSSStyleValues corresponding to the given array of property names
     *
     * @param properties The array of property names
     * @returns The Object containing the properties which have been found
     */
    getAll(properties: string[]): Object {
        let entries = {};
        properties.forEach(propName => {
            let property = this.get(propName);
            if (property) entries[propName] = property;
        });
        return entries;
    }

    /**
     * Gets the CSSStyleValues of the properties matching the given regex
     *
     * @param property A regular expression to test against property names
     * @returns An array of StyleMapEntries
     */
    getSimilar(property: RegExp): StyleMapEntry[] {
        let foundKeys = Object.keys(this.map).filter(k => k.match(property) != null);
        return foundKeys.map(k => new StyleMapEntry(k, this.map[k]));
    }

    /**
     * Sets (or overwrites) a property in the style map
     *
     * @param property The name of the property
     * @param value The value of the property
     */
    set(property: string, value: CSSStyleValue) {
        if (!property.startsWith('--')) property = `--${property}`;
        if (this.map.hasOwnProperty(property)) {
            console.warn(`Warn: variable ${property} has been defined more times.`);
        }
        this.map[property] = value;
    }

    /**
     * Runs a callbackFn on each of the properties contained in the style map
     *
     * @param callbackFn The callback to run against each property
     */
    forEach(callbackFn: (property: string, value: CSSStyleValue) => void) {
        Object.keys(this.map).forEach(key => {
            callbackFn(key, this.map[key]);
        });
    }

    toString() {
        return `${this.map}`;
    }

}