import * as cssTree from 'css-tree';
import AstCssomConverter from './cssom/ast-cssom-converter';
import * as fsPath from 'path';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';

export * from './cssom/style-map.js';
export * from './cssom/css.js';
export * from './cssom/css-color-value.js';
export * from './cssom/css-keyword-value.js';
export * from './cssom/css-numeric-value.js';
export * from './cssom/css-perspective.js';
export * from './cssom/css-position-value.js';
export * from './cssom/css-rotate.js';
export * from './cssom/css-scale.js';
export * from './cssom/css-skew.js';
export * from './cssom/css-skew-x.js';
export * from './cssom/css-skew-y.js';
export * from './cssom/css-style-value.js';
export * from './cssom/css-transform-value.js';
export * from './cssom/css-translate.js';
export * from './cssom/css-unit-value.js';
export * from './cssom/css-url-value.js';
export * from './cssom/dom-matrix.js';
export type Task = (styleMap: StyleMap, args: {[key: string]: string}) => any;

/**
 * Builds a StyleMap given the path of the main identity stylesheet
 *
 * @param path Path to the main identity stylesheet
 * @returns The StyleMap relative to the stylesheet
 */
export const visua = (path: string): Promise<StyleMap> => {
    return new Promise<StyleMap>((resolve, reject) => {
        try {
            const ast = cssTree.parse(fs.readFileSync(path, {encoding: 'UTF-8'}), {
                parseCustomProperty: true,
            });
            resolve(new AstCssomConverter(ast, fsPath.dirname(path)).getStyleMap());
        } catch (e) {
            reject(e);
        }
    });
};

