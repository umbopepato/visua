import * as fs from 'fs';
import * as cssTree from 'css-tree';
import {StyleMap} from './style-map';
import {CSSColorValue, CSSHexColor, CSSHslaColor, CSSRgbaColor} from './css-color-value';
import {
    CSSMathInvert,
    CSSMathMax,
    CSSMathMin,
    CSSMathNegate,
    CSSMathProduct,
    CSSMathSum,
    CSSMathValue, CSSNumericValue,
} from './css-numeric-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSUrlValue} from './css-url-value';
import {CSSTransformValue} from './css-transform-value';
import {DOMMatrix} from './dom-matrix';
import {CSSTranslate} from './css-translate';
import {CSS} from './css';
import {CSSScale} from './css-scale';
import {CSSRotate} from './css-rotate';
import {CSSSkew} from './css-skew';
import {CSSPerspective} from './css-perspective';
import {CSSKeywordValue} from './css-keyword-value';
import {CSSPositionValue} from './css-position-value';

export default class AstCssomConverter {

    private variables: {};
    private transformNames: string[] = [
        'matrix',
        'translate',
        'translateX',
        'translateY',
        'scale',
        'scaleX',
        'scaleY',
        'rotate',
        'skew',
        'skewX',
        'skewY',
        'matrix3d',
        'translate3d',
        'translateZ',
        'scale3d',
        'scaleZ',
        'rotate3d',
        'rotateX',
        'rotateY',
        'rotateZ',
        'perspective',
    ];
    private positionKeywords: string[] = [
        'top',
        'bottom',
        'left',
        'right',
        'center',
    ];
    private cssOm: StyleMap = new StyleMap();
    private secondaryStyleMaps: StyleMap[] = [];

    constructor(private ast) { };

    getStyleMap() {
        this.validateAndExpandVariables();
        if (this.ast.type !== 'StyleSheet') {
            throw new TypeError(`Couldn't recognize identity css file structure`);
        }
        this.processStyleSheet(this.ast);
        return this.cssOm;
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

    private processStyleSheet(node) {
        if (!node.children) {
            console.warn('Empty stylesheet found');
            return;
        }
        node.children.forEach(c => {
            switch(c.type) {
                case 'Atrule':
                    this.processAtrule(c);
                    break;
                case 'Rule':
                    this.processRule(c);
                    break;
                default:
                    throw new TypeError(`Unexpected node ${c.type}`);
            }
        });
    }

    private processAtrule(node) {
        if (node.name !== 'import') {
            throw new TypeError(`Unexpected at-rule of type ${node.name}. Visua currently only supports \`import\` at-rules`);
        }
        if (node.prelude == null || node.prelude.children == null || !node.prelude.children.length) {
            throw new TypeError(`Invalid import`);
        }
        let url = node.prelude.children[0].value;
        if (typeof url !== 'string') {
            throw new TypeError(`Invalid import`);
        }
        url = url.replace(/(?:^['"]|['"]$)/g, '');
        fs.readFile(url, (err, content) => {
            if (err) throw err;
            let ast = cssTree.parse(content, {
                parseCustomProperty: true,
            });
            let cssOm = new AstCssomConverter(ast).getStyleMap();
            this.secondaryStyleMaps.push(cssOm);
        });
    }

    private processRule(node) {
        if (node.prelude == null ||
            node.prelude.type !== 'SelectorList' ||
            node.prelude.children == null ||
            !node.prelude.children.length ||
            node.prelude.children[0].children == null ||
            !node.prelude.children[0].children.length) {
            throw new TypeError(`Couldn't recognize main selector structure. See https://visua.io/docs/getting-started#identity-file-structure for guidance on structuring your css files.`);
        }
        let mainSelector = node.prelude.children[0].children[0];
        if (mainSelector.type !== 'PseudoClassSelector' || mainSelector.name !== 'root') {
            console.warn(`Main selector should be :root`);
        }
        if (node.block == null || node.block.children == null || !node.block.children.length) {
            console.warn(`Empty identity file`);
        }
        node.block.children.forEach(declaration => {
            if (declaration.type !== 'Declaration') {
                throw new TypeError(`Unexpected node ${node.type}`);
            }
            this.cssOm.set(declaration.property, this.convertAstValue(declaration.value))
        });
        this.joinStyleMaps();
    }

    private joinStyleMaps() {
        for (let secondaryStyleMap of this.secondaryStyleMaps) {
            secondaryStyleMap.forEach((property, value) => {
                this.cssOm.set(property, value);
            });
        }
    }

    private convertAstValue(node) {
        switch (node.type) {
            case 'Value':
                return this.convertDeclaration(node);
            case 'Dimension':
                return this.convertDimension(node);
            case 'Number':
                return this.convertNumber(node);
            case 'Function':
                return this.convertFunction(node);
            case 'Url':
                return this.convertUrl(node);
            case 'HexColor':
                return this.convertHex(node);
            case 'Parentheses':
                return this.convertCalc(node.children);
            case 'Identifier':
                return this.convertIdentifier(node);
        }
    }

    private convertDeclaration(node) {
        if (node.children.length === 1) {
            return this.convertAstValue(node.children[0]);
        } else {
            if (this.transformNames.includes(node.children[0].name)) {
                return this.convertTransform(node);
            }
            if (node.children.some(c => this.positionKeywords.includes(c.name)) ||
            node.children.every(c => c.type === 'Percentage' || c.type === 'Dimension')) {
                return this.convertPosition(node);
            }
        }
    }

    private convertTransform(node) {
        return new CSSTransformValue(node.children.map(this.convertFunction));
    }

    private convertPosition(node) {
        // @ts-ignore
        return new CSSPositionValue(...node.children
            .filter(c => c.type !== 'WhiteSpace')
            .map(this.convertAstValue));
    }

    private convertDimension(node) {
        return new CSSUnitValue(node.value, node.unit);
    }

    private convertNumber(node) {
        return new CSSUnitValue(node.value, 'number');
    }

    private convertFunction(node) {
        switch (node.name) {
            case 'calc':
                return this.convertCalc(node.children);
            case 'min':
                return this.convertMin(node);
            case 'max':
                return this.convertMax(node);
            case 'rgba':
            case 'rgb':
                // @ts-ignore
                return new CSSRgbaColor(
                    ...node.children
                        .filter(c => c.type === 'Number')
                        .map(c => Number(c.value)),
                );
            case 'hsla':
            case 'hsl':
                // @ts-ignore
                return new CSSHslaColor(
                    ...node.children
                        .filter(c => c.type === 'Number' || c.type === 'Percentage' || c.type === 'Dimension')
                        .map(c => {
                            switch (c.type) {
                                case 'Number':
                                    return c.value;
                                case 'Dimension':
                                    return this.convertDimension(c);
                                case 'Percentage':
                                    return this.convertPercentage(c);
                            }
                        }),
                );

            case 'matrix':
            case 'matrix3d':
                return new DOMMatrix(
                    node.children
                        .filter(c => c.type === 'Number')
                        .map(c => c.value),
                );
            case 'translate':
            case 'translate3d':
                // @ts-ignore
                return new CSSTranslate(
                    ...node.children
                        .filter(c => c.type === 'Dimension')
                        .map(this.convertAstValue),
                );
            case 'translateX':
                return new CSSTranslate(this.convertAstValue(node.children[0]) as CSSNumericValue, CSS.px(0));
            case 'translateY':
                return new CSSTranslate(CSS.px(0), this.convertAstValue(node.children[0]) as CSSNumericValue);
            case 'translateZ':
                return new CSSTranslate(CSS.px(0), CSS.px(0), this.convertAstValue(node.children[0]) as CSSNumericValue);
            case 'scale':
            case 'scale3d':
                if (node.children.length < 3) {
                    return new CSSScale(this.convertAstValue(node.children[0]), CSS.px(1));
                }
                // @ts-ignore
                return new CSSScale(
                    ...node.children
                        .filter(c => c.type === 'Number')
                        .map(this.convertAstValue)
                );
            case 'scaleX':
                return new CSSScale(this.convertAstValue(node.children[0]), CSS.px(0));
            case 'scaleY':
                return new CSSScale(CSS.px(0), this.convertAstValue(node.children[0]));
            case 'scaleZ':
                return new CSSScale(CSS.px(0), CSS.px(0), this.convertAstValue(node.children[0]));
            case 'rotate':
                return new CSSRotate(this.convertAstValue(node.children[0]));
            case 'rotateX':
                return new CSSRotate(this.convertAstValue(node.children[0]), 1, 0, 0);
            case 'rotateY':
                return new CSSRotate(this.convertAstValue(node.children[0]), 0, 1, 0);
            case 'rotateZ':
                return new CSSRotate(this.convertAstValue(node.children[0]), 0, 0, 1);
            case 'rotate3d':
                const params = node.children
                    .filter(c => c.type === 'Number' || c.type === 'Dimension')
                    .map(this.convertAstValue);
                return new CSSRotate(params[3], params[0], params[1], params[2]);
            case 'skew':
                if (node.children.length < 3) {
                    return new CSSSkew(this.convertAstValue(node.children[0]), CSS.px(0));
                }
                // @ts-ignore
                return new CSSSkew(
                    ...node.children
                        .filter(c => c.type === 'Dimension' || c.type === 'Number')
                        .map(this.convertAstValue)
                );
            case 'skewX':
                return new CSSSkew(this.convertAstValue(node.children[0]), CSS.px(0));
            case 'skewY':
                return new CSSSkew(CSS.px(0), this.convertAstValue(node.children[0]));
            case 'perspective':
                return new CSSPerspective(this.convertAstValue(node.children[0]));
        }
    }

    private convertUrl(node) {
        return new CSSUrlValue(node.value.value);
    }

    private convertHex(node) {
        return CSSHexColor.fromString(node.value);
    }

    private convertPercentage(node) {
        return new CSSUnitValue(node.value, 'percent');
    }

    private convertCalc(components) {
        const children = components.filter(c => c.type !== 'WhiteSpace');
        if (children.length < 3) throw new TypeError(`Failed to convert ${components} to CSSMathValue: Too few arguments`);
        let top = children.length - 2;
        for (let i = top; i > 0; i -= 2) {
            if (children[i].value === '+' || children[i].value === '-') {
                top = i;
                break;
            }
        }
        return this.convertCalcBinaryExpression(children.slice(0, top), children[top].value, children.slice(top + 1));
    }

    private convertCalcBinaryExpression(left, operator, right) {
        let mathValue, result: CSSMathValue;
        let leftValue = left.length === 1 ? this.convertAstValue(left[0]) : this.convertCalc(left);
        let rightValue = right.length === 1 ? this.convertAstValue(right[0]) : this.convertCalc(right);
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

    private convertMin(node) {
        return new CSSMathMin(...node.children
            .filter(c => c.type !== 'Whitespace')
            .map(this.convertAstValue));
    }

    private convertMax(node) {
        return new CSSMathMax(...node.children
            .filter(c => c.type !== 'Whitespace')
            .map(this.convertAstValue));
    }

    private convertIdentifier(node) {
        if (node.name === 'transparent') {
            return new CSSRgbaColor(0, 0, 0, 0);
        }
        if (CSSColorValue.x11ColorsMap.hasOwnProperty(node.name)) {
            return CSSHexColor.fromString(CSSColorValue.x11ColorsMap[node.value]);
        }
        return new CSSKeywordValue(node.name);
    }
}