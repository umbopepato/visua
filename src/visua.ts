import * as cssTree from 'css-tree';
import AstCssomConverter from './cssom/ast-cssom-converter';
import * as util from 'util';
import * as fs from 'fs';
import {StyleMap} from './cssom/style-map';

export const visua = (path: string): Promise<StyleMap> => {
    return new Promise<StyleMap>((resolve, reject) => {
        try {
            const ast = cssTree.parse(fs.readFileSync(path, {encoding: 'UTF-8'}), {
                parseCustomProperty: true,
            });
            resolve(new AstCssomConverter(ast).getStyleMap());
        } catch (e) {
            reject(e);
        }
    });
};
