import * as cssTree from 'css-tree';
import {StyleMap} from './style-map';
import {CSSStyleValue} from './css-style-value';
import {CSSHexColor, CSSHslaColor, CSSRgbaColor} from './css-color-value';
import {
    CSSMathInvert,
    CSSMathMax,
    CSSMathMin,
    CSSMathNegate,
    CSSMathProduct,
    CSSMathSum,
    CSSMathValue,
} from './css-numeric-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSUrlValue} from './css-url-value';
import * as util from 'util';

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
            cssOm.set(declaration.property.substr(2), this.parseAstValue(declaration.value));
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

    private parseAstValue(node): CSSStyleValue {
        switch (node.type) {
            case 'Value':
                return this.parseDeclaration(node);
            case 'Dimension':
                return this.parseDimension(node);
            case 'Number':
                return this.parseNumber(node);
            case 'Function':
                return this.parseFunction(node);
            case 'Url':
                return this.parseUrl(node);
            case 'HexColor':
                return this.parseHex(node);
            case 'Parentheses':
                return this.parseCalc(node.children);
        }
    }

    private parseDeclaration(node) {
        if (node.children.length === 1) {
            return this.parseAstValue(node.children[0]);
        } else {
            // TODO handle multiple children declarations
        }
    }

    private parseDimension(node) {
        return new CSSUnitValue(node.value, node.unit);
    }

    private parseNumber(node) {
        return new CSSUnitValue(node.value, 'number');
    }

    private parseFunction(node) {
        switch (node.name) {
            case 'calc':
                return this.parseCalc(node.children);
            case 'min':
                return this.parseMin(node);
            case 'max':
                return this.parseMax(node);
            case 'rgba':
            case 'rgb':
                return new CSSRgbaColor(
                    ...node.children
                        .filter(c => c.type === 'Number')
                        .map(c => Number(c.value)),
                );
            case 'hsla':
            case 'hsl':
                return new CSSHslaColor(
                    ...node.children
                        .filter(c => c.type === 'Number' || c.type === 'Percentage' || c.type === 'Dimension')
                        .map(c => {
                            switch (c.type) {
                                case 'Number':
                                    return c.value;
                                case 'Dimension':
                                    return this.parseDimension(c);
                                case 'Percentage':
                                    return this.parsePercentage(c);
                            }
                        }),
                );

        }
    }

    private parseUrl(node) {
        return new CSSUrlValue(node.value.value);
    }

    private parseHex(node) {
        return CSSHexColor.fromString(node.value);
    }

    private parsePercentage(node) {
        return new CSSUnitValue(node.value, 'percent');
    }

    private parseCalc(components) {
        const children = components.filter(c => c.type !== 'WhiteSpace');
        if (children.length < 3) throw new TypeError(`Failed to convert ${components} to CSSMathValue: Too few arguments`);
        let top = children.length - 2;
        for (let i = top; i > 0; i -=2 ) {
            if (children[i].value === '+' || children[i].value === '-') {
                top = i;
                break;
            }
        }
        return this.parseCalcBinaryExpression(children.slice(0, top), children[top].value, children.slice(top + 1));
    }

    private parseCalcBinaryExpression(left, operator, right) {
        let mathValue, result: CSSMathValue;
        let leftValue = left.length === 1 ? this.parseAstValue(left[0]) : this.parseCalc(left);
        let rightValue = right.length === 1 ? this.parseAstValue(right[0]) : this.parseCalc(right);
        if (operator === '-') rightValue = new CSSMathNegate(rightValue);
        if (operator === '/') rightValue = new CSSMathInvert(rightValue);
        switch (operator) {
            case '+':
            case '-':
                mathValue = new CSSMathSum([leftValue, rightValue]);
                break;
            case '*':
            case '/':
                mathValue = new CSSMathProduct([leftValue, rightValue]);
                break;
        }
        return mathValue.solve();
    }

    private parseBinaryExpression(expr, index) {

    }

    private parseMin(node) {
        return new CSSMathMin(...node.children.filter(c => c.type !== 'Whitespace').map(this.parseAstValue));
    }

    private parseMax(node) {
        return new CSSMathMax(...node.children.filter(c => c.type !== 'Whitespace').map(this.fromAstValue));
    }
}