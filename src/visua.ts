import * as cssTree from 'css-tree';
import AstCssomConverter from './cssom/ast-cssom-converter';
import * as fsPath from 'path';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';
import {logger} from './logger';

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
 * Builds a StyleMap from the provided identity stylesheets
 *
 * @param options Visua options
 * @returns The generated StyleMap
 */
export const visua = async (options: VisuaOptions): Promise<StyleMap> => {
    let path = DEFAULT_IDENTITY_FILE_PATH;
    if (options && options.path != null) {
        if (fs.lstatSync(options.path).isDirectory()) {
            path = fsPath.join(options.path, DEFAULT_IDENTITY_FILE_NAME);
        } else {
            path = options.path;
        }
    }
    let file;
    try {
        file = fs.readFileSync(path, {encoding: 'UTF-8'});
    } catch (e) {
        throw new TypeError(`Failed to load identity file ${path}`);
    }
    const ast = cssTree.parse(file, {
        parseCustomProperty: true,
        onParseError: error => {
            if (options.strict) {
                throw error;
            } else {
                logger.warn(error.formattedMessage || error);
            }
        },
        positions: true,
        filename: path,
    });
    return await new AstCssomConverter(ast, {
        identityDir: fsPath.dirname(path),
        strict: options.strict,
    }).getStyleMap();
};

