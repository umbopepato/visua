import * as cssTree from 'css-tree';
import AstCssomConverter from './cssom/ast-cssom-converter';
import * as fsPath from 'path';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';
import {logger} from './logger';

export * from './plugin';
export * from './cssom/style-map';
export * from './cssom/css';
export * from './cssom/css-color-value';
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
export * from './cssom/css-transform-value';
export * from './cssom/css-translate';
export * from './cssom/css-unit-value';
export * from './cssom/css-url-value';
export * from './cssom/dom-matrix';

export const DEFAULT_IDENTITY_FILE_PATH = fsPath.join(process.cwd(), 'identity.css');

export interface VisuaOptions {
    path?: string;
    strict?: boolean;
}

/**
 * Builds a StyleMap from the provided identity stylesheets
 *
 * @param options Visua options
 * @returns The generated StyleMap
 */
export const visua = async (options: VisuaOptions): Promise<StyleMap> => {
        const path = options.path || DEFAULT_IDENTITY_FILE_PATH;
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

