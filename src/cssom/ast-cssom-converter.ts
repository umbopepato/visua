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
import {CSSKeywordsValue, CSSKeywordValue} from './css-keyword-value';
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
import {
    CSSGradientStep,
    CSSLinearGradient,
    CSSRadialGradient,
    CSSRepeatingLinearGradient,
    CSSRepeatingRadialGradient,
} from './css-gradient-value';
import {CSSFontFamilyValue} from './css-font-family-value';
import {CSSFontComponents, CSSFontValue, CSSSystemFontValue} from './css-font-value';
import {CSSBorderComponents, CSSBorderValue} from './css-border-value';
import {CSSShadow, CSSShadowComponents, CSSShadowValue} from './css-shadow-value';

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

export type AstCssomConverterOptions = {
    strict: boolean,
    identityDir: string,
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
    private readonly identityDir: string = '';
    private readonly strict: boolean = false;

    constructor(private ast, options: AstCssomConverterOptions) {
        if (options.identityDir) this.identityDir = options.identityDir;
        if (options.strict) this.strict = options.strict;
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
        let styleMap = await visua({
            path: path,
            strict: this.strict,
        });
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
            try {
                let value = this.convertAstValue(declaration.value);
                if (value != null) {
                    this.styleMap.set(removeLeadingDashes(declaration.property), value);
                }
            } catch (e) {
                if (this.strict) throw e;
                else logger.warn(e.formattedMessage || e);
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
            case NodeType.Percentage:
                return this.convertPercentage(node);
        }
    }

    private convertDeclaration(node) {
        if (node.children.length === 1) {
            return this.convertAstValue(node.children[0]);
        } else {
            if (this.transformKeywords.includes(node.children[0].name)) {
                return this.convertTransform(node);
            }
            if (node.children.some(c => c.type === NodeType.Identifier &&
                this.positionKeywords.includes(c.name)) ||
                node.children.every(c => c.type === NodeType.Percentage || c.type === NodeType.Dimension)) {
                return this.convertPosition(node);
            }
            if (node.children.some(c => c.type === NodeType.Identifier &&
                c.name === 'inset')) {
                return this.convertShadow(node);
            }
            let childrenNoWhitespaces = node.children.filter(removeWhiteSpaces());
            if (childrenNoWhitespaces.every(c => c.type === NodeType.Identifier)) {
                return new CSSKeywordsValue(childrenNoWhitespaces.map(c => this.convertAstValue(c)));
            }
            if (childrenNoWhitespaces.every(c => c.type === NodeType.Identifier ||
                c.type === NodeType.HexColor || c.type === NodeType.Function ||
                c.type === NodeType.Dimension || c.type === NodeType.Number)) {
                return this.convertShadow(node);
            }
            if (childrenNoWhitespaces.length < 4 && childrenNoWhitespaces.some(c => c.type === NodeType.Identifier &&
                CSSBorderValue.lineStyleKeywords.includes(c.name))) {
                return this.convertBorder(node);
            }
            let lastChild = childrenNoWhitespaces[childrenNoWhitespaces.length - 1];
            if (lastChild.type === NodeType.Identifier && CSSFontFamilyValue.fallbackFonts.includes(lastChild.name)) {
                if (childrenNoWhitespaces.every(c => c.type === NodeType.Identifier || c.type === NodeType.String)) {
                    return this.convertFontFamily(node);
                } else {
                    return this.convertFont(node);
                }
            }
        }
    }

    private convertTransform(node) {
        return new CSSTransformValue(node.children.map(this.convertFunction));
    }

    private convertPosition(node) {
        return new CSSPositionValue(...node.children
            .filter(removeWhiteSpaces())
            .map(c => this.convertAstValue(c)));
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
            case 'linear-gradient':
                return this.convertLinearGradient(node);
            case 'radial-gradient':
                return this.convertRadialGradient(node);
            case 'repeating-linear-gradient':
                return new CSSRepeatingLinearGradient(this.convertLinearGradient(node));
            case 'repeating-radial-gradient':
                return new CSSRepeatingRadialGradient(this.convertRadialGradient(node));
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
        if (CSSSystemFontValue.systemFonts.includes(node.name)) {
            return new CSSSystemFontValue(node.name);
        }
        return new CSSKeywordValue(node.name);
    }

    private convertString(node) {
        return new CSSStringValue(node.value);
    }

    private convertLinearGradient(node) {
        let groups = split(node.children.filter(removeWhiteSpaces()), NodeType.Operator);
        let direction: CSSUnitValue | CSSKeywordsValue;
        let steps: CSSGradientStep[] = [];
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            if (group.length > 0) {
                if (i == 0 && group[0].type !== NodeType.Function && group[0].type !== NodeType.HexColor) {
                    if (group[0].type === NodeType.Dimension) {
                        direction = this.convertAstValue(group[0]);
                    } else if (group[0].name === 'to') {
                        if (group.length > 1 && group[1].type === NodeType.Identifier) {
                            direction = new CSSKeywordsValue([this.convertAstValue(group[1])]);
                            if (group.length > 2 && group[2].type === NodeType.Identifier) {
                                direction.keywords.push(this.convertAstValue(group[2]));
                                if (group.length > 3 && group[3].type === NodeType.Identifier) {
                                    direction.keywords.push(this.convertAstValue(group[3]));
                                }
                            }
                        }
                    }
                } else {
                    if (group.length === 1) {
                        steps.push(new CSSGradientStep(this.convertAstValue(group[0])));
                    } else {
                        steps.push(new CSSGradientStep(this.convertAstValue(group[0]), this.convertAstValue(group[1])));
                    }
                }
            }
        }
        return new CSSLinearGradient(steps, direction);
    }

    private convertRadialGradient(node) {
        let groups = split(node.children.filter(removeWhiteSpaces()), NodeType.Operator);
        let steps: CSSGradientStep[] = [];
        let size: CSSUnitValue | CSSKeywordValue | CSSUnitValue[];
        let position: CSSPositionValue;
        let shape: CSSKeywordValue;
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            if (group.length > 0) {
                if (i == 0 && group[0].type !== NodeType.Function && group[0].type !== NodeType.HexColor) {
                    let subGroups = splitf(group, n => n.type === NodeType.Identifier && n.name === 'at');
                    for (let j = 0; j < subGroups[0].length; j++) {
                        let dimenNode = subGroups[0][j];
                        if (dimenNode.type === NodeType.Identifier && dimenNode.name === 'circle' || dimenNode.name === 'ellipse') {
                            shape = new CSSKeywordValue(dimenNode.name);
                        } else {
                            if (dimenNode.type === NodeType.Dimension || dimenNode.type === NodeType.Percentage) {
                                if (size instanceof CSSUnitValue) {
                                    size = [size, this.convertAstValue(dimenNode)];
                                } else {
                                    size = this.convertAstValue(dimenNode);
                                }
                            } else {
                                size = new CSSKeywordValue(dimenNode.name);
                            }
                        }
                    }
                    position = new CSSPositionValue(...subGroups[1].map(c => this.convertAstValue(c)));
                } else {
                    if (group.length === 1) {
                        steps.push(new CSSGradientStep(this.convertAstValue(group[0])));
                    } else {
                        steps.push(new CSSGradientStep(this.convertAstValue(group[0]), this.convertAstValue(group[1])));
                    }
                }
            }
        }
        return new CSSRadialGradient(steps, {
            size: size,
            position: position,
            shape: shape,
        });
    }

    private convertFontFamily(node) {
        return new CSSFontFamilyValue(node.children
            .filter(keepTypes(NodeType.Identifier, NodeType.String))
            .map(c => this.convertAstValue(c)));
    }

    private convertFont(node) {
        let i = 0, beforeFamily: boolean = true;
        let children = node.children.filter(removeWhiteSpaces());
        let components: CSSFontComponents = {family: null};
        while (beforeFamily && i < children.length) {
            let child = children[i];
            switch (child.type) {
                case NodeType.Identifier:
                    if (CSSFontValue.styleKeywords.includes(child.name)) {
                        components.style = this.convertAstValue(child);
                    } else if (child.name === 'oblique') {
                        let nextChild = children[i + 1];
                        if (nextChild != null && nextChild.type === NodeType.Dimension) {
                            components.style = this.convertAstValue(nextChild);
                            i++; // Skip next child
                        } else {
                            components.style = CSS.deg(14);
                        }
                    } else if (CSSFontValue.variantKeywords.includes(child.name)) {
                        components.variant = this.convertAstValue(child);
                    } else if (CSSFontValue.weightKeywords.includes(child.name)) {
                        components.weight = this.convertAstValue(child);
                    } else if (CSSFontValue.stretchKeywords.includes(child.name)) {
                        components.stretch = this.convertAstValue(child);
                    }
                    break;
                case NodeType.Number:
                    if (child.value.length === 3) {
                        components.weight = this.convertAstValue(child);
                    }
                    break;
                case NodeType.Operator:
                    if (child.value === '/') {
                        let nextChild = children[i + 1];
                        if (nextChild != null) {
                            components.lineHeight = this.convertAstValue(nextChild);
                            beforeFamily = false;
                        }
                    }
                    break;
                case NodeType.Dimension:
                case NodeType.Percentage:
                    components.size = this.convertAstValue(child);
                    if (!children.some(c => c.type === NodeType.Operator && c.value === '/')) {
                        beforeFamily = false;
                    }
                    break;
            }
            i++;
        }
        components.family = this.convertFontFamily({children: children.slice(i)});
        return new CSSFontValue(components);
    }

    private convertBorder(node) {
        let components: CSSBorderComponents = {lineStyle: null, color: null};
        let children = node.children.filter(keepTypes(NodeType.Identifier, NodeType.Number, NodeType.Function, NodeType.Dimension, NodeType.HexColor));
        for (let child of children) {
            if (child.type === NodeType.Identifier) {
                if (CSSBorderValue.lineStyleKeywords.includes(child.name)) {
                    components.lineStyle = this.convertAstValue(child);
                } else if (CSSBorderValue.lineWidthKeywords.includes(child.name)) {
                    components.lineWidth = this.convertAstValue(child);
                }
            }
            let value = this.convertAstValue(child);
            if (value instanceof CSSColorValue) {
                components.color = value;
            } else if (value instanceof CSSUnitValue) {
                components.lineWidth = value;
            }
        }
        return new CSSBorderValue(components);
    }

    private convertShadow(node) {
        // TODO handle 3 children inset shadow conflicting with border
        let children = node.children.filter(keepTypes(NodeType.Number, NodeType.Dimension, NodeType.Function,
            NodeType.HexColor, NodeType.Identifier, NodeType.Operator));
        let shadows = splitf(children, c => c.type === NodeType.Operator && c.value === '/');
        let layers: CSSShadow[] = [];
        shadows.forEach(s => {
            let components: CSSShadowComponents = {color: null};
            s.forEach(c => {
                let value = this.convertAstValue(c);
                if (value instanceof CSSKeywordValue && value.value === 'inset') {
                    components.inset = true;
                } else if (value instanceof CSSUnitValue) {
                    if (components.offsetX == null) {
                        components.offsetX = value;
                    } else if (components.offsetY == null) {
                        components.offsetY = value;
                    } else if (components.blurRadius == null) {
                        components.blurRadius = value;
                    } else if (components.spreadDistance == null) {
                        components.spreadDistance = value;
                    }
                } else if (value instanceof CSSColorValue) {
                    components.color = value;
                }
            });
            layers.push(new CSSShadow(components));
        });
        return new CSSShadowValue(layers);
    }
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

const split = (nodes, splitter: NodeType) => {
    let result = [[]];
    nodes.forEach(n => {
        if (n.type === splitter) {
            result.push([]);
        } else {
            result[result.length - 1].push(n);
        }
    });
    return result;
};

const splitf = (nodes, splitter: (node: any) => boolean) => {
    let result = [[]];
    nodes.forEach(n => {
        if (splitter(n)) {
            result.push([]);
        } else {
            result[result.length - 1].push(n);
        }
    });
    return result;
};