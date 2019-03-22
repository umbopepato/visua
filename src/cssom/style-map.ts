import {CSSStyleValue} from './css-style-value';
import {removeLeadingDashes, toCamelCase} from '../util';
import {table, getBorderCharacters} from 'table';
import {logger} from '../logger';
import chalk from 'chalk';

export interface StyleMapEntry {
    name: string;
    value: CSSStyleValue;
}

/**
 * The style map containing all the css variables defined in the parsed identity css files
 */
export class StyleMap {

    private map = new Map();

    /**
     * Gets the CSSStyleValue given the corresponding property name
     *
     * @param property The name of the property (prepending `--` is not necessary but allowed)
     * @returns The corresponding style value
     */
    get(property: string): CSSStyleValue {
        let resolvedProperty = removeLeadingDashes(property);
        if (!this.map.has(resolvedProperty)) return;
        return this.map.get(resolvedProperty);
    }

    /**
     * Gets the CSSStyleValues corresponding to the given array of property names
     *
     * @param properties The array of property names
     * @returns The Object of found properties (the names are converted from hyphen-case to camel-case to allow for destructuring declarations)
     */
    getAll(properties: string[]): { [key: string]: CSSStyleValue } {
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
     * @param property A regular expression to ls against property names
     * @returns An array of StyleMapEntries
     */
    getSimilar(property: RegExp): StyleMapEntry[] {
        return Array.from(this.map.entries())
            .filter(entry => entry[0].match(property) != null)
            .map(entry => <StyleMapEntry>{
                name: entry[0],
                value: entry[1],
            });
    }

    /**
     * Sets (or overwrites) a property in the style map
     *
     * @param property The name of the property
     * @param value The value of the property
     */
    set(property: string, value: CSSStyleValue) {
        this.map.set(property, value);
    }

    /**
     * Runs a callbackFn on each of the properties contained in the style map
     *
     * @param callbackFn The callback to run against each property
     */
    forEach(callbackFn: (property: string, value: CSSStyleValue) => void) {
        this.map.forEach((value, key) => callbackFn(key, value));
    }

    /**
     * Prints the StyleMap in a table
     */
    print() {
        const header = [chalk.bold('Variable'), chalk.bold('CSSStyleValue instance'), chalk.bold('Value')];
        logger.info(`StyleMap:\n${table([
            header,
            ...Array.from(this.map.entries())
                .map(e => [`--${e[0]}`, e[1].constructor.name, e[1]] as string[]),
        ], {
            border: getBorderCharacters('norc'),
        })}`);
    }

}
