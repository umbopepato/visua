import * as cssTree from 'css-tree';
import AstCssomConverter from './cssom/ast-cssom-converter';
import * as fsPath from 'path';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';

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

/**
 * Builds a StyleMap given the path of the main identity stylesheet
 *
 * @param path Path to the main identity stylesheet
 * @returns The generated StyleMap
 */
export const visua = (path: string): Promise<StyleMap> => {
    return new Promise<StyleMap>((resolve, reject) => {
        try {
            const ast = cssTree.parse(fs.readFileSync(path, {encoding: 'UTF-8'}), {
                parseCustomProperty: true,
                onParseError: reject,
                positions: true,
                filename: path,
            });
            //console.log(JSON.stringify(cssTree.toPlainObject(ast), null, 4));
            resolve(new AstCssomConverter(ast, fsPath.dirname(path)).getStyleMap());
        } catch (e) {
            reject(e);
        }
    });
};

