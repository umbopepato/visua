import * as cssTree from 'css-tree';
import AstCssomConverter from './cssom/ast-cssom-converter';
import * as fsPath from 'path';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';

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

