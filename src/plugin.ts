import {StyleMap} from './cssom/style-map';

/**
 * A function that takes a textual option value and deserializes it
 */
export type ValueInitializer = (value: string) => any;

/**
 * An `Object` whose keys are strings corresponding to your options names without the leading “--” and whose values
 * are either type constructors such as `String` or `Boolean` or `ValueInitializers`
 */
export type OptionsMap = {[key: string]: Function | ValueInitializer};

/**
 * A base class to create Visua CLI plugins
 */
export abstract class Plugin {

    /**
     * Plugin command line options map
     *
     * If your plugin uses some options you should override this accessor to return a non-empty `OptionsMap`.
     * For example if your plugin accepts two options:
     *
     * - `optOne`, a boolean flag
     * - `optTwo`, a comma-separated list of strings
     *
     * The corresponding implementation of options would be:
     * ```typescript
     * static get options(): OptionsMap {
     *     return {
     *         optOne: Boolean,
     *         optTwo: (value: string) => value.split(','),
     *     };
     * }
     * ```
     */
    static get options(): OptionsMap {
        return {};
    };

    /**
     * The entry point of the plugin called by the CLI after the options have been initialized
     *
     * @param styleMap The StyleMap Visua generated from the loaded identity css files
     * @param options The initialized plugin options
     */
    abstract run(styleMap: StyleMap, options: OptionsMap);

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
