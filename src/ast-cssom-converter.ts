import * as cssTree from 'css-tree';
import {StyleMap} from './style-map';
import {CSSStyleValue} from './css-style-value';
import {CSSStyleValues} from './css-style-values';

export default class AstCssomConverter {

    variables: {};

    constructor(private ast) {};

    getStyleMap() {
        let cssOm = new StyleMap();

        this.validateAndExpandVariables();

        if (this.ast.type !== 'DeclarationList') {
            throw new TypeError('identt config must be a list of variables');
        }
        if (!this.ast.children || !this.ast.children.length) {
            throw new TypeError('config seems empty');
        }
        for (let declaration of this.ast.children) {
            if (declaration.type !== 'Declaration') {
                throw new TypeError(`identt config must be a list of variables. ${declaration.type} is not`);
            }
            cssOm.set(declaration.property.substr(2), AstCssomConverter.astValueToCssOm(declaration.value));
        }
        return cssOm;
    }

    private validateAndExpandVariables() {
        this.variables = this.generateVariablesMap();
        this.validateVariableReferences();
        this.expandVariableReferences();
    }

    private expandVariableReferences() {
        this.ast = cssTree.toPlainObject(this.ast);
        this.expandVariableReferencesR(this.ast);
    }

    private expandVariableReferencesR(node) {
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].type === 'Function' && node.children[i].name === 'var') {
                    node.children[i] = this.variables[node.children[i].children[0].name].value;
                }
                if (node.children[i].children || node.children[i].value) {
                    this.expandVariableReferencesR(node.children[i]);
                }
            }
        }
        if (node.value) {
            this.expandVariableReferencesR(node.value);
        }
    }

    static printAst(ast) {
        cssTree.walk(ast, node => console.log(node.type));
    }

    private static astValueToCssOm(astNode): CSSStyleValue {
        if (!astNode.children || !astNode.children.length) {
            console.warn('Warn: empty property found in config.');
            return new CSSStyleValue();
        }
        return CSSStyleValues.fromAstValue(astNode);
    }

    private generateVariablesMap() {
        let variables = {};
        cssTree.walk(this.ast, node => {
            if (node.type === 'Declaration') {
                if (node.property != null && node.property.startsWith('--')) {
                    let value = cssTree.toPlainObject(node.value).children[0];
                    if (!value) throw new TypeError(`variable ${node.property} is empty`);
                    variables[node.property] = {
                        value: value,
                        internalReferences: [],
                    };
                    cssTree.walk(node, innerNode => {
                        if (innerNode.type === 'Identifier' && innerNode.name.startsWith('--')) {
                            variables[node.property].internalReferences.push(innerNode.name);
                        }
                    });
                }
            }
        });
        return variables;
    }

    private validateVariableReferences() {
        for (let variableKey in this.variables) {
            if (this.variables[variableKey].internalReferences.includes(variableKey)) {
                throw new TypeError(`variable ${variableKey} references itself`);
            }
            this.variables[variableKey].internalReferences.forEach(variable => {
                if (!this.variables.hasOwnProperty(variable)) {
                    throw new TypeError(`undefined variable ${variable}`);
                }
                if (this.variables[variable].internalReferences.includes(variableKey)) {
                    throw new TypeError(`circular variable reference involving ${variableKey} and ${variable}`);
                }
            });
        }
    }

}