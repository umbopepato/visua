import {Atrule, AtrulePrelude, CssNode, CssNodeCommon, parse, SyntaxParseError, toPlainObject, walk} from 'css-tree';
import {CssNodeType, ParseError, parseIdentityFiles} from './cssom/ast-cssom-converter';
import * as fsPath from 'path';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';
import {logger} from './logger';
import {removeQuotes, warnAt} from './util';

export * from './plugin';
export * from './cssom/style-map';
export * from './cssom/css';
export * from './cssom/css-border-value';
export * from './cssom/css-box-shadow-value';
export * from './cssom/css-color-value';
export * from './cssom/css-filter-value';
export * from './cssom/css-font-family-value';
export * from './cssom/css-font-value';
export * from './cssom/css-gradient-value';
export * from './cssom/css-keyword-value';
export * from './cssom/css-numeric-value';
export * from './cssom/css-perspective';
export * from './cssom/css-position-value';
export * from './cssom/css-rotate';
export * from './cssom/css-scale';
export * from './cssom/css-skew';
export * from './cssom/css-skew-x';
export * from './cssom/css-skew-y';
export * from './cssom/css-style-value';
export * from './cssom/css-string-value';
export * from './cssom/css-timing-function-value';
export * from './cssom/css-transform-value';
export * from './cssom/css-translate';
export * from './cssom/css-unit-value';
export * from './cssom/css-url-value';
export * from './cssom/dom-matrix';

const DEFAULT_IDENTITY_FILE_NAME = 'identity.css';
const DEFAULT_IDENTITY_FILE_PATH = fsPath.join(process.cwd(), DEFAULT_IDENTITY_FILE_NAME);

export interface VisuaOptions {
    /**
     * The path to the main identity file or to the directory containing it
     */
    path?: string;

    /**
     * If true exits on parse errors
     */
    strict?: boolean;
}

/**
 * Builds a StyleMap from the provided identity stylesheets.
 *
 * If called without options, the `visua` method searches for a file named exactly
 * identity.css in the current working directory:
 *
 * ```typescript
 * const styleMap = await visua();
 * ```
 *
 * The path option can be used to specify a relative path to a directory containing
 * the file identity.css or to a specific file.
 *
 * The following example searches for a file named identity.css in cwd/subdir:
 * ```typescript
 * const styleMap = await visua({
 *     path: 'subdir',
 * });
 * ```
 *
 * The following example loads a file named main.css in subdir subdirectory:
 * ```typescript
 * const styleMap = await visua({
 *     path: 'subdir/main.css',
 * });
 * ```
 *
 * The strict option can be used to terminate the process on parse errors,
 * otherwise Visua will try to recover from soft errors in the css:
 * ```typescript
 * const styleMap = await visua({
 *     path: 'subdir/main.css',
 *     strict: true,
 * });
 * ```
 *
 * @param options Visua options
 * @returns A Promise that resolves with the generated StyleMap
 */
export const visua = async (options?: VisuaOptions): Promise<StyleMap> => {
    let path = DEFAULT_IDENTITY_FILE_PATH;
    let strict = false;
    if (options) {
        if (options.path != null) {
            if (fs.lstatSync(options.path).isDirectory()) {
                path = fsPath.join(options.path, DEFAULT_IDENTITY_FILE_NAME);
            } else {
                path = options.path;
            }
        }
        if (options.strict != null) {
            strict = options.strict;
        }
    }

    await parseIdentityFiles(path, strict);
    return null;
    /*return await new AstCssomConverter(ast, {
        identityDir: fsPath.dirname(path),
        strict: options.strict,
    }).getStyleMap();*/
};
