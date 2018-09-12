import {CSSStyleValue} from './css-style-value';
import {removeLeadingDashes, toCamelCase} from '../util';
import * as Table from 'cli-table';
import {logger} from '../logger';

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
     * @param property The name of the property (prepending `--` is not necessary but allowed)
     * @returns The corresponding style value
     */
    get(property: string): CSSStyleValue {
        let resolvedProperty = removeLeadingDashes(property);
        if (!this.map.hasOwnProperty(resolvedProperty)) return;
        return this.map[resolvedProperty];
    }

    /**
     * Gets the CSSStyleValues corresponding to the given array of property names
     *
     * @param properties The array of property names
     * @returns The Object of found properties (the names are converted from hyphen-case to camel-case to allow for destructuring declarations)
     */
    getAll(properties: string[]): {[key: string]: CSSStyleValue} {
        let entries = {};
        properties.forEach(propName => {
            let resolvedProperty = removeLeadingDashes(propName);
            let property = this.get(resolvedProperty);
            if (property) entries[toCamelCase(resolvedProperty)] = property;
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
        if (this.map.hasOwnProperty(property)) {
            logger.warn(`Warn: variable ${property} has been defined more times.`);
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

    print() {
        let table = new Table({
            head: ['Variable', 'CSSStyleValue instance', 'Value'],
        });
        table.push(...Object
            .entries(this.map)
            .map(e => [e[0], e[1].constructor.name, e[1]] as string[]));
        console.log('StyleMap:');
        console.log(table.toString());
    }

}