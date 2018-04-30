import * as cssTree from 'css-tree';
import StyleMap from './style-map';
import CSSStyleValue from './css-style-value';
import CSSStyleValues from './css-style-values';

export default function astDefListToCssOm(ast) {
    let astObj = cssTree.toPlainObject(ast);
    let cssOm = new StyleMap();

    if (astObj.type !== 'DeclarationList') {
        throw new TypeError('identt config must be a list of variables');
    }
    if (!astObj.children || !astObj.children.length) {
        throw new TypeError('config seems empty');
    }
    for (let declaration of astObj.children) {
        if (declaration.type !== 'Declaration') {
            throw new TypeError(`identt config must be a list of variables. ${declaration.type} is not`);
        }
        cssOm.set(declaration.property.substr(2), astValueToCssOm(declaration.value));
    }
    return cssOm;
}

function astValueToCssOm(astNode): CSSStyleValue {
    if (!astNode.children || !astNode.children.length) {
        console.warn('Warn: empty property found in config.');
        return new CSSStyleValue();
    }
    return CSSStyleValues.fromAstValue(astNode);
}