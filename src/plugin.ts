import {StyleMap} from './cssom/style-map';

/**
 * A function that takes a textual option value and deserializes it
 */
export type ValueInitializer = (value: string) => any;

/**
 * An `Object` whose keys are strings corresponding to your options names without the leading “--” and whose values
 * are either type constructors such as `String` or `Boolean` or `ValueInitializers`
 */
export type OptionsMap = { [key: string]: Function | ValueInitializer };

/**
 * A base class to create Visua CLI plugins
 */
export abstract class Plugin {

    /**
     * Plugin command line options map
     *
     * If your plugin uses some options you should override this property to return a non-empty `OptionsMap`.
     * For example if your plugin accepts two options:
     *
     * - `optOne`, a boolean flag
     * - `optTwo`, a comma-separated list of strings
     *
     * The corresponding implementation of options would be:
     * ```typescript
     * static options: OptionsMap = {
     *     optOne: Boolean,
     *     optTwo: (value: string) => value.split(','),
     * };
     * ```
     */
    static options: OptionsMap = {};

    /**
     * The entry point of the plugin called by the CLI after the options have been initialized
     *
     * @param styleMap The StyleMap Visua generated from the loaded identity css files
     * @param options The initialized plugin options
     */
    abstract run(styleMap: StyleMap, options: { [key: string]: any });

}

/**
 * An Error class for plugin exceptions
 */
export class PluginError extends Error {

    /**
     * Creates a new PluginError
     *
     * @param message The error's message
     */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

}

/**
 * A utility template literal tag for writing string templates that corrects indentation
 * and removes lines where at least one interpolation expression is `null` or `undefined`.
 *
 * @param strings
 * @param values
 */
export function templatel(strings: TemplateStringsArray, ...values: any[]) {
    const raw = typeof strings === 'string' ? [strings] : strings.raw;
    const lines: Array<Array<any>> = [[]];
    let mindent: number = null;
    let result: string;
    for (let i = 0; i < raw.length; i++) {
        const chunkLines = raw[i]
            .replace(/\\n[ \t]*!/g, '')
            .replace(/\\`/g, '`')
            .split('\n');
        lines[lines.length - 1].push(chunkLines.shift());
        lines.push(...chunkLines.map(l => [l]));
        if (i < values.length) {
            lines[lines.length - 1].push(values[i]);
        }
    }
    const lineStrings: string[] = lines.filter(line => line.every(item => item != null))
        .map(line => line.join(''));
    lineStrings.forEach(line => {
        const m = line.match(/^(\s+)\S+/);
        if (m) {
            let indent = m[1].length;
            if (!mindent) {
                mindent = indent;
            } else {
                mindent = Math.min(mindent, indent);
            }
        }
    });
    if (mindent !== null) {
        const m = mindent;
        result = lineStrings.map(l => l[0] === ' ' ? l.slice(m) : l).join('\n');
    } else {
        result = lineStrings.join('\n');
    }
    return result.trim()
        .replace(/\\n/g, '\n');
}

/**
 * A utility template literal tag for writing templates that corrects indentation
 * and prevents `null` and `undefined` values from showing.
 *
 * Unlike `templatel` this doesn't remove entire lines that contain null or undefined expressions.
 *
 * @param strings
 * @param values
 */
export function template(strings: TemplateStringsArray, ...values: Array<string>) {
    const raw = typeof strings === 'string' ? [strings] : strings.raw;
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        result += raw[i]
            .replace(/\\\n[ \t]*/g, '')
            .replace(/\\`/g, '`');
        if (i < values.length && values[i] != null) {
            result += values[i];
        }
    }
    const lines = result.split('\n');
    let mindent: number | null = null;
    lines.forEach(l => {
        let m = l.match(/^(\s+)\S+/);
        if (m) {
            let indent = m[1].length;
            if (!mindent) {
                mindent = indent;
            } else {
                mindent = Math.min(mindent, indent);
            }
        }
    });

    if (mindent !== null) {
        const m = mindent;
        result = lines.map(l => l[0] === ' ' ? l.slice(m) : l).join('\n');
    }

    return result
        .trim()
        .replace(/\\n/g, '\n');
}
