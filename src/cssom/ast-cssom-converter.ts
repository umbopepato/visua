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
import {CSS, CSSUnit} from './css';
import {CSSScale} from './css-scale';
import {CSSRotate} from './css-rotate';
import {CSSSkew} from './css-skew';
import {CSSPerspective} from './css-perspective';
import {CSSKeywordValue} from './css-keyword-value';
import {CSSPositionValue} from './css-position-value';
import * as fsPath from 'path';
import {removeLeadingDashes, removeQuotes, warnAt} from '../util';
import {CSSStringValue} from './css-string-value';
import {logger} from '../logger';
import {
    CSSCubicBezierTimingFunction, CSSFramesTimingFunction,
    CSSStepsTimingFunction,
    CSSTimingFunctionValue,
} from './css-timing-function-value';
import {visua} from '../visua';

enum NodeType {
    AnPlusB = 'AnPlusB',
    Atrule = 'Atrule',
    AtrulePrelude = 'AtrulePrelude',
    AttributeSelector = 'AttributeSelector',
    Block = 'Block',
    Brackets = 'Brackets',
    CDC = 'CDC',
    CDO = 'CDO',
    ClassSelector = 'ClassSelector',
    Combinator = 'Combinator',
    Comment = 'Comment',
    Declaration = 'Declaration',
    DeclarationList = 'DeclarationList',
    Dimension = 'Dimension',
    Function = 'Function',
    HexColor = 'HexColor',
    IdSelector = 'IdSelector',
    Identifier = 'Identifier',
    MediaFeature = 'MediaFeature',
    MediaQuery = 'MediaQuery',
    MediaQueryList = 'MediaQueryList',
    Nth = 'Nth',
    Number = 'Number',
    Operator = 'Operator',
    Parentheses = 'Parentheses',
    Percentage = 'Percentage',
    PseudoClassSelector = 'PseudoClassSelector',
    PseudoElementSelector = 'PseudoElementSelector',
    Ratio = 'Ratio',
    Raw = 'Raw',
    Rule = 'Rule',
    Selector = 'Selector',
    SelectorList = 'SelectorList',
    String = 'String',
    StyleSheet = 'StyleSheet',
    TypeSelector = 'TypeSelector',
    UnicodeRange = 'UnicodeRange',
    Url = 'Url',
    Value = 'Value',
    WhiteSpace = 'WhiteSpace',

}

export default class AstCssomConverter {

    private variables: {};
    private transformKeywords: string[] = [
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
    private timingFunctionKeywords: string[] = [
        'ease',
        'ease-in',
        'ease-out',
        'ease-in-out',
        'linear',
        'step-start',
        'step-end',
    ];
    private styleMap: StyleMap = new StyleMap();

    constructor(private ast, private identityDir = '') {
    };

    async getStyleMap() {
        this.validateAndExpandVariables();
        if (this.ast.type !== NodeType.StyleSheet) {
            throw new CssomConvertionError(`Couldn't recognize identity css file structure`);
        }
        await this.processStyleSheet(this.ast);
        return this.styleMap;
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
                if (node.children[i].type === NodeType.Function && node.children[i].name === 'var') {
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
            if (node.type === NodeType.Declaration) {
                if (node.property != null && node.property.startsWith('--')) {
                    let value = cssTree.toPlainObject(node.value).children[0];
                    if (!value) throw new CssomConvertionError(`Variable ${node.property} is empty`, value.loc);
                    variables[node.property] = {
                        value: value,
                        internalReferences: [],
                    };
                    cssTree.walk(node, innerNode => {
                        if (innerNode.type === NodeType.Identifier && innerNode.name.startsWith('--')) {
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
                throw new CssomConvertionError(`Variable ${variableKey} references itself`);
            }
            this.variables[variableKey].internalReferences.forEach(variable => {
                if (!this.variables.hasOwnProperty(variable)) {
                    throw new CssomConvertionError(`Undefined variable ${variable}`);
                }
                if (this.variables[variable].internalReferences.includes(variableKey)) {
                    throw new CssomConvertionError(`Circular variable reference involving ${variableKey} and ${variable}`);
                }
            });
        }
    }

    private async processStyleSheet(node) {
        if (!node.children || !node.children.length) {
            logger.warn('Empty stylesheet found');
            return;
        }
        await Promise.all(node.children.map(c => {
            switch (c.type) {
                case NodeType.Atrule:
                    return this.processAtRule(c);
                case NodeType.Rule:
                    this.processRule(c);
                    break;
                default:
                    throw new CssomConvertionError(`Unexpected node ${c.type}`);
            }
        }));
    }

    private async processAtRule(node) {
        if (node.name !== 'import') {
            warnAt(`Unexpected at-rule of type @${node.name}. Visua currently only supports @import at-rules`, node.loc);
            return;
        }
        if (node.prelude == null || node.prelude.children == null || !node.prelude.children.length) {
            throw new CssomConvertionError(`Invalid import`, node.loc);
        }
        let url = node.prelude.children[0].value;
        if (typeof url !== 'string') {
            throw new CssomConvertionError(`Invalid import`, node.prelude.children[0].loc);
        }
        url = removeQuotes(url);
        let path = fsPath.normalize(`${this.identityDir}/${url}`);
        let styleMap = await visua(path);
        this.importSecondaryStyleMap(styleMap);
    }

    private processRule(node) {
        if (node.prelude == null ||
            node.prelude.type !== NodeType.SelectorList ||
            node.prelude.children == null ||
            !node.prelude.children.length ||
            node.prelude.children[0].children == null ||
            !node.prelude.children[0].children.length) {
            throw new CssomConvertionError(`Couldn't recognize main selector structure. See https://visua.io/guide/structuring-identity-files for guidance on structuring your css files.`,
                node.loc);
        }
        let mainSelector = node.prelude.children[0].children[0];
        if (mainSelector.type !== NodeType.PseudoClassSelector || mainSelector.name !== 'root') {
            throw new CssomConvertionError(`Unexpected selector ${mainSelector.name}. Main selector should be :root`, mainSelector.loc);
        }
        if (node.block == null || node.block.children == null || !node.block.children.length) {
            logger.warn(`Empty identity file`);
        }
        node.block.children.forEach(declaration => {
            if (declaration.type !== NodeType.Declaration) {
                throw new CssomConvertionError(`Unexpected node ${node.type}`, node.loc);
            }
            let value = this.convertAstValue(declaration.value);
            if (value != null) {
                this.styleMap.set(removeLeadingDashes(declaration.property), value);
            }
        });
    }

    private importSecondaryStyleMap(styleMap: StyleMap) {
        styleMap.forEach((property, value) => {
            this.styleMap.set(property, value);
        });
    }

    private convertAstValue(node) {
        switch (node.type) {
            case NodeType.Value:
                return this.convertDeclaration(node);
            case NodeType.Dimension:
                return this.convertDimension(node);
            case NodeType.String:
                return this.convertString(node);
            case NodeType.Number:
                return this.convertNumber(node);
            case NodeType.Function:
                return this.convertFunction(node);
            case NodeType.Url:
                return this.convertUrl(node);
            case NodeType.HexColor:
                return this.convertHex(node);
            case NodeType.Parentheses:
                return this.convertCalc(node.children);
            case NodeType.Identifier:
                return this.convertIdentifier(node);
        }
    }

    private convertDeclaration(node) {
        if (node.children.length === 1) {
            return this.convertAstValue(node.children[0]);
        } else {
            if (this.transformKeywords.includes(node.children[0].name)) {
                return this.convertTransform(node);
            }
            if (node.children.some(c => this.positionKeywords.includes(c.name)) ||
                node.children.every(c => c.type === NodeType.Percentage || c.type === NodeType.Dimension)) {
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
            .filter(removeWhiteSpaces())
            .map(this.convertAstValue));
    }

    private convertDimension(node) {
        return new CSSUnitValue(node.value, node.unit);
    }

    private convertNumber(node) {
        return new CSSUnitValue(node.value, CSSUnit.number);
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
                        .filter(keepTypes(NodeType.Number))
                        .map(c => Number(c.value)),
                );
            case 'hsla':
            case 'hsl':
                // @ts-ignore
                return new CSSHslaColor(
                    ...node.children
                        .filter(keepTypes(NodeType.Number, NodeType.Percentage, NodeType.Dimension))
                        .map(c => {
                            switch (c.type) {
                                case NodeType.Number:
                                    return c.value;
                                case NodeType.Dimension:
                                    return this.convertDimension(c);
                                case NodeType.Percentage:
                                    return this.convertPercentage(c);
                            }
                        }),
                );

            case 'matrix':
            case 'matrix3d':
                return new DOMMatrix(
                    node.children
                        .filter(keepTypes(NodeType.Number))
                        .map(c => c.value),
                );
            case 'translate':
            case 'translate3d':
                // @ts-ignore
                return new CSSTranslate(
                    ...node.children
                        .filter(keepTypes(NodeType.Dimension))
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
                        .filter(keepTypes(NodeType.Number))
                        .map(this.convertAstValue),
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
            case 'rotate3d': { // Needed because of ts issue #12220
                const params = node.children
                    .filter(keepTypes(NodeType.Number, NodeType.Dimension))
                    .map(this.convertAstValue);
                return new CSSRotate(params[3], params[0], params[1], params[2]);
            }
            case 'skew':
                if (node.children.length < 3) {
                    return new CSSSkew(this.convertAstValue(node.children[0]), CSS.px(0));
                }
                // @ts-ignore
                return new CSSSkew(
                    ...node.children
                        .filter(keepTypes(NodeType.Dimension, NodeType.Number))
                        .map(this.convertAstValue),
                );
            case 'skewX':
                return new CSSSkew(this.convertAstValue(node.children[0]), CSS.px(0));
            case 'skewY':
                return new CSSSkew(CSS.px(0), this.convertAstValue(node.children[0]));
            case 'perspective':
                return new CSSPerspective(this.convertAstValue(node.children[0]));
            case 'cubic-bezier':
                // @ts-ignore
                return new CSSCubicBezierTimingFunction(
                    ...node.children
                        .filter(keepTypes(NodeType.Number))
                        .map(c => c.value),
                );
            case 'steps': {
                const params = node.children.filter(keepTypes(NodeType.Number, NodeType.Identifier));
                params[0] = Number(params[0].value);
                if (params.length === 2) params[1] = params[1].name;
                // @ts-ignore
                return new CSSStepsTimingFunction(...params);
            }
            case 'frames':
                return new CSSFramesTimingFunction(Number(node.children[0].value));
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
        const children = components.filter(removeWhiteSpaces());
        if (children.length < 3) throw new CssomConvertionError(`Failed to convert ${components} to CSSMathValue: Too few arguments`,
            components[0].loc);
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
        let mathValue: CSSMathValue;
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
        return new CSSMathMin(...node.children.filter(removeWhiteSpaces())
            .map(this.convertAstValue));
    }

    private convertMax(node) {
        return new CSSMathMax(...node.children.filter(removeWhiteSpaces())
            .map(this.convertAstValue));
    }

    private convertIdentifier(node) {
        if (node.name === 'transparent') {
            return new CSSRgbaColor(0, 0, 0, 0);
        }
        if (this.timingFunctionKeywords.includes(node.name)) {
            return new CSSTimingFunctionValue(node.name);
        }
        if (CSSColorValue.x11ColorsMap.hasOwnProperty(node.name)) {
            return CSSHexColor.fromString(CSSColorValue.x11ColorsMap[node.name]);
        }
        return new CSSKeywordValue(node.name);
    }

    private convertString(node) {
        return new CSSStringValue(node.value);
    }

    /*private convertTimingFunction(node) {
        return new CSSTimingFunctionValue(node.value);
    }*/
}

class CssomConvertionError extends Error {

    constructor(message: string, location?: { source: string, start: { line: number, column: string } }) {
        super(`${message}${location ? `\n    at ${location.source}:${location.start.line}:${location.start.column}` : ``}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

}

const removeWhiteSpaces = () => {
    return node => {
        return node.type !== NodeType.WhiteSpace;
    };
};

const keepTypes = (...types: NodeType[]) => {
    return node => {
        return types.some(t => node.type === t);
    };
};