import {
    Atrule,
    AtrulePlain,
    AtrulePrelude,
    CssLocation,
    CssNode,
    CssNodeCommon,
    CssNodePlain,
    Declaration,
    DeclarationPlain,
    FunctionNode,
    Identifier,
    List,
    ListItem,
    parse,
    PseudoClassSelectorPlain,
    RulePlain,
    SelectorListPlain,
    SelectorPlain,
    StringNode,
    StyleSheet,
    StyleSheetPlain,
    SyntaxParseError,
    toPlainObject,
    Url,
    Value,
    ValuePlain,
    walk,
} from 'css-tree';
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
import {CSSShadow, CSSShadowComponents, CSSBoxShadowValue} from './css-box-shadow-value';
import {
    CSSBlurFilter,
    CSSBrightnessFilter,
    CSSContrastFilter,
    CSSDropShadowFilter,
    CSSFilterValue,
    CSSGrayscaleFilter,
    CSSHueRotateFilter,
    CSSInvertFilter,
    CSSOpacityFilter,
    CSSSaturateFilter,
    CSSSepiaFilter,
} from './css-filter-value';
import * as fs from 'fs';

const TRANSFORM_FUNCTIONS: string[] = [
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
const FILTER_FUNCTIONS: string[] = [
    'blur',
    'brightness',
    'contrast',
    'drop-shadow',
    'grayscale',
    'hue-rotate',
    'invert',
    'opacity',
    'sepia',
    'saturate',
];
const POSITION_KEYWORDS: string[] = [
    'top',
    'bottom',
    'left',
    'right',
    'center',
];
const TIMING_FUNCTION_KEYWORDS: string[] = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear',
    'step-start',
    'step-end',
];

export enum CssNodeType {
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

interface VariableReferencesMap {
    [key: string]: {
        value: any,
        internalReferences: string[],
    };
}

export class ParseError extends Error {
    constructor(message: string, location?: CssLocation) {
        super(`${message}${location ? `\n    at ${location.source}:${location.start.line}:${location.start.column}` : ``}`);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class Parser {

    private plainAst: CssNodePlain;
    private styleMap: StyleMap = new StyleMap();

    constructor(private entrypoint: string,
                private strict: boolean = false) {
    }

    parse(): StyleMap {
        const entryAst: CssNode = parseFile(this.entrypoint, this.strict);
        const parsedFiles: string[] = [this.entrypoint];
        const resolveImports = (path: string, ast: CssNode): CssNode => {
            walk(ast, {
                visit: 'Atrule',
                enter: (node: Atrule, item: ListItem<CssNode>, list: List<CssNode>) => {
                    if (node.name !== 'import') {
                        warnAt(`Unexpected at-rule of type @${node.name}. Visua currently only supports @import at-rules`, node.loc);
                        return;
                    }
                    if (nodeIs<AtrulePrelude>(node.prelude, CssNodeType.AtrulePrelude)) {
                        if (node.prelude == null || node.prelude.children == null || !node.prelude.children.getSize()) {
                            throw new ParseError(`Invalid import`, node.loc);
                        }
                        let urlNode: CssNode = node.prelude.children.first();
                        let url;
                        if (nodeIs<StringNode>(urlNode, CssNodeType.String)) {
                            url = urlNode.value;
                        } else if (nodeIs<Url>(urlNode, CssNodeType.Url)) {
                            url = urlNode.value.value;
                        }
                        if (typeof url !== 'string') {
                            throw new ParseError(`Invalid import`, urlNode.loc);
                        }
                        url = removeQuotes(url);
                        let importPath = fsPath.resolve(fsPath.normalize(`${fsPath.dirname(path)}/${url}`));
                        if (!parsedFiles.includes(importPath)) {
                            const importAst: CssNode = parseFile(importPath, this.strict);
                            parsedFiles.push(importPath);
                            const importStyleSheet: any = resolveImports(importPath, importAst);
                            list.replace(item, importStyleSheet.children);
                        }
                    } else {
                        throw new ParseError(`Invalid import`, node.loc);
                    }
                },
            });
            return ast;
        };
        const ast: CssNode = resolveImports(this.entrypoint, entryAst);
        this.analyzeAstAndResolveVariables(ast);
        this.processStyleSheet();
        return this.styleMap;
    }

    private analyzeAstAndResolveVariables(ast: CssNode) {
        const variablesMap: VariableReferencesMap = this.generateVariablesMap(ast);
        this.validateVariableReferences(variablesMap);
        this.resolveVariables(ast, variablesMap);
    };

    private generateVariablesMap(ast: CssNode): VariableReferencesMap {
        const variables: VariableReferencesMap = {};
        walk(ast, {
            visit: CssNodeType.Declaration,
            enter: (node: Declaration) => {
                if (node.property != null && node.property.startsWith('--')) {
                    let value = nodeIs<Value>(node.value, CssNodeType.Value) ? node.value.children.first() : node.value.value;
                    if (!value) throw new ParseError(`Variable ${node.property} is empty`);
                    variables[node.property] = {
                        value: value,
                        internalReferences: [],
                    };
                    walk(node, {
                        visit: CssNodeType.Identifier,
                        enter: (innerNode: Identifier) => {
                            if (innerNode.name.startsWith('--')) {
                                variables[node.property].internalReferences.push(innerNode.name);
                            }
                        },
                    });
                }
            },
        });
        return variables;
    };

    private validateVariableReferences(variablesMap: VariableReferencesMap) {
        for (let variableKey in variablesMap) {
            if (variablesMap[variableKey].internalReferences.includes(variableKey)) {
                throw new ParseError(`Variable ${variableKey} references itself`);
            }
            variablesMap[variableKey].internalReferences.forEach(variable => {
                if (variable in variablesMap && variablesMap[variable].internalReferences.includes(variableKey)) {
                    throw new ParseError(`Circular variable reference involving ${variableKey} and ${variable}`);
                }
            });
        }
    };

    private resolveVariables(ast: CssNode, variablesMap: VariableReferencesMap) {
        walk(ast, {
            visit: CssNodeType.Function,
            enter: (node: FunctionNode, item: ListItem<FunctionNode>, list: List<CssNode>) => {
                if (node.name === 'var') {
                    const variableName: string = (node.children.first() as Identifier).name;
                    const fallbackValueNode: Value = node.children.filter(param => nodeIs<Value>(param, CssNodeType.Value)).first() as Value;
                    const fallbackValue = fallbackValueNode.children.first();
                    if (variableName in variablesMap) {
                        list.replace(item, list.createItem(variablesMap[variableName].value));
                    } else if (fallbackValue != null) {
                        list.replace(item, list.createItem(fallbackValue));
                    } else {
                        throw new ParseError(`Undefined variable ${variableName}`, node.loc);
                    }
                }
            },
        });
        this.plainAst = toPlainObject(ast);
    };

    private processStyleSheet() {
        if (!nodeIs<StyleSheetPlain>(this.plainAst, CssNodeType.StyleSheet)) {
            throw new ParseError('No stylesheet found');
        }
        const node: StyleSheetPlain = this.plainAst as StyleSheetPlain;
        if (!node.children || !node.children.length) {
            logger.warn('Empty stylesheet found');
            return;
        }
        return node.children.map(c => {
            switch (c.type) {
                case CssNodeType.Atrule:
                    this.processAtRule(c);
                    break;
                case CssNodeType.Rule:
                    this.processRule(c);
                    break;
                default:
                    warnAt(`Unexpected node ${c.type}`, c.loc);
            }
        });
    };

    private processAtRule(node: AtrulePlain) {
        if (node.name !== 'import') {
            warnAt(`Unexpected at-rule of type @${node.name}. Visua currently only supports @import at-rules`, node.loc);
        }
    };

    private processRule(node: RulePlain) {
        if (node.prelude == null ||
            node.prelude.type !== CssNodeType.SelectorList ||
            node.prelude.children == null ||
            !node.prelude.children.length) {
            throw new ParseError(`Couldn't recognize main selector structure. See https://visua.io/guide/structuring-identity-files for guidance on structuring your css files.`,
                node.loc);
        }
        let mainSelector: CssNodePlain = (<SelectorPlain>node.prelude.children[0]).children[0];
        if (!nodeIs<PseudoClassSelectorPlain>(mainSelector, CssNodeType.PseudoClassSelector) || mainSelector.name !== 'root') {
            // @ts-ignore
            warnAt(`Unexpected selector ${mainSelector.name || ''}. Main selector should be :root`, mainSelector.loc);
            return;
        }
        if (node.block == null || node.block.children == null || !node.block.children.length) {
            logger.warn(`Empty identity file`);
        }
        node.block.children.forEach(declaration => {
            if (declaration.type !== CssNodeType.Declaration) {
                throw new ParseError(`Unexpected node ${node.type}`, node.loc);
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

    private convertAstValue(node) {
        switch (node.type) {
            case CssNodeType.Value:
                return this.convertDeclaration(node);
            case CssNodeType.Dimension:
                return this.convertDimension(node);
            case CssNodeType.String:
                return this.convertString(node);
            case CssNodeType.Number:
                return this.convertNumber(node);
            case CssNodeType.Function:
                return this.convertFunction(node);
            case CssNodeType.Url:
                return this.convertUrl(node);
            case CssNodeType.HexColor:
                return this.convertHex(node);
            case CssNodeType.Parentheses:
                return this.convertCalc(node.children);
            case CssNodeType.Identifier:
                return this.convertIdentifier(node);
            case CssNodeType.Percentage:
                return this.convertPercentage(node);
        }
    }

    private convertDeclaration(node) {
        let normalizedChildren = node.children.filter(removeWhiteSpaces());
        if (normalizedChildren.length > 1) {
            if (node.children.some(c => c.type === CssNodeType.Identifier &&
                POSITION_KEYWORDS.includes(c.name)) ||
                node.children.every(c => c.type === CssNodeType.Percentage || c.type === CssNodeType.Dimension)) {
                return this.convertPosition(node);
            }
            if (node.children.some(c => c.type === CssNodeType.Identifier &&
                c.name === 'inset')) {
                return this.convertBoxShadow(node);
            }
        }
        if (TRANSFORM_FUNCTIONS.includes(normalizedChildren[0].name)) {
            return this.convertTransform(node);
        }
        if (FILTER_FUNCTIONS.includes(normalizedChildren[0].name)) {
            return this.convertFilter(node);
        }
        if (normalizedChildren.every(c => c.type === CssNodeType.Identifier)) {
            return new CSSKeywordsValue(normalizedChildren.map(c => this.convertAstValue(c)));
        }
        if (normalizedChildren.length < 4 && normalizedChildren.some(c => c.type === CssNodeType.Identifier &&
            CSSBorderValue.lineStyleKeywords.includes(c.name))) {
            return this.convertBorder(node);
        }
        let lastChild = normalizedChildren[normalizedChildren.length - 1];
        if (lastChild.type === CssNodeType.Identifier && CSSFontFamilyValue.fallbackFonts.includes(lastChild.name)) {
            if (normalizedChildren.every(c => c.type === CssNodeType.Identifier || c.type === CssNodeType.String)) {
                return this.convertFontFamily(node);
            } else {
                return this.convertFont(node);
            }
        }
        if (node.children.length === 1) {
            return this.convertAstValue(node.children[0]);
        }
        if (normalizedChildren.every(c => c.type === CssNodeType.Identifier ||
            c.type === CssNodeType.HexColor || c.type === CssNodeType.Function ||
            c.type === CssNodeType.Dimension || c.type === CssNodeType.Number)) {
            return this.convertBoxShadow(node);
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
                        .filter(keepTypes(CssNodeType.Number))
                        .map(c => Number(c.value)),
                );
            case 'hsla':
            case 'hsl':
                // @ts-ignore
                return new CSSHslaColor(
                    ...node.children
                        .filter(keepTypes(CssNodeType.Number, CssNodeType.Percentage, CssNodeType.Dimension))
                        .map(c => {
                            switch (c.type) {
                                case CssNodeType.Number:
                                    return c.value;
                                case CssNodeType.Dimension:
                                    return this.convertDimension(c);
                                case CssNodeType.Percentage:
                                    return this.convertPercentage(c);
                            }
                        }),
                );

            case 'matrix':
            case 'matrix3d':
                return new DOMMatrix(
                    node.children
                        .filter(keepTypes(CssNodeType.Number))
                        .map(c => c.value),
                );
            case 'translate':
            case 'translate3d':
                // @ts-ignore
                return new CSSTranslate(
                    ...node.children
                        .filter(keepTypes(CssNodeType.Dimension))
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
                        .filter(keepTypes(CssNodeType.Number))
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
                    .filter(keepTypes(CssNodeType.Number, CssNodeType.Dimension))
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
                        .filter(keepTypes(CssNodeType.Dimension, CssNodeType.Number))
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
                        .filter(keepTypes(CssNodeType.Number))
                        .map(c => c.value),
                );
            case 'steps': {
                const params = node.children.filter(keepTypes(CssNodeType.Number, CssNodeType.Identifier));
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
            case 'blur':
                return new CSSBlurFilter(this.convertAstValue(node.children[0]));
            case 'brightness':
                return new CSSBrightnessFilter(this.convertAstValue(node.children[0]));
            case 'contrast':
                return new CSSContrastFilter(this.convertAstValue(node.children[0]));
            case 'drop-shadow':
                return new CSSDropShadowFilter(this.convertBoxShadow(node));
            case 'grayscale':
                return new CSSGrayscaleFilter(this.convertAstValue(node.children[0]));
            case 'hue-rotate':
                return new CSSHueRotateFilter(this.convertAstValue(node.children[0]));
            case 'invert':
                return new CSSInvertFilter(this.convertAstValue(node.children[0]));
            case 'opacity':
                return new CSSOpacityFilter(this.convertAstValue(node.children[0]));
            case 'saturate':
                return new CSSSaturateFilter(this.convertAstValue(node.children[0]));
            case 'sepia':
                return new CSSSepiaFilter(this.convertAstValue(node.children[0]));

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
        if (children.length < 3) throw new ParseError(`Failed to convert ${components} to CSSMathValue: Too few arguments`,
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
        if (TIMING_FUNCTION_KEYWORDS.includes(node.name)) {
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
        let groups = split(node.children.filter(removeWhiteSpaces()), CssNodeType.Operator);
        let direction: CSSUnitValue | CSSKeywordsValue;
        let steps: CSSGradientStep[] = [];
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            if (group.length > 0) {
                if (i == 0 && group[0].type !== CssNodeType.Function && group[0].type !== CssNodeType.HexColor) {
                    if (group[0].type === CssNodeType.Dimension) {
                        direction = this.convertAstValue(group[0]);
                    } else if (group[0].name === 'to') {
                        if (group.length > 1 && group[1].type === CssNodeType.Identifier) {
                            direction = new CSSKeywordsValue([this.convertAstValue(group[1])]);
                            if (group.length > 2 && group[2].type === CssNodeType.Identifier) {
                                direction.keywords.push(this.convertAstValue(group[2]));
                                if (group.length > 3 && group[3].type === CssNodeType.Identifier) {
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
        let groups = split(node.children.filter(removeWhiteSpaces()), CssNodeType.Operator);
        let steps: CSSGradientStep[] = [];
        let size: CSSUnitValue | CSSKeywordValue | CSSUnitValue[];
        let position: CSSPositionValue;
        let shape: CSSKeywordValue;
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            if (group.length > 0) {
                if (i == 0 && group[0].type !== CssNodeType.Function && group[0].type !== CssNodeType.HexColor) {
                    let subGroups = splitf(group, n => n.type === CssNodeType.Identifier && n.name === 'at');
                    for (let j = 0; j < subGroups[0].length; j++) {
                        let dimenNode = subGroups[0][j];
                        if (dimenNode.type === CssNodeType.Identifier && dimenNode.name === 'circle' || dimenNode.name === 'ellipse') {
                            shape = new CSSKeywordValue(dimenNode.name);
                        } else {
                            if (dimenNode.type === CssNodeType.Dimension || dimenNode.type === CssNodeType.Percentage) {
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
            .filter(keepTypes(CssNodeType.Identifier, CssNodeType.String))
            .map(c => this.convertAstValue(c)));
    }

    private convertFont(node) {
        let i = 0, beforeFamily: boolean = true;
        let children = node.children.filter(removeWhiteSpaces());
        let components: CSSFontComponents = {family: null};
        while (beforeFamily && i < children.length) {
            let child = children[i];
            switch (child.type) {
                case CssNodeType.Identifier:
                    if (CSSFontValue.styleKeywords.includes(child.name)) {
                        components.style = this.convertAstValue(child);
                    } else if (child.name === 'oblique') {
                        let nextChild = children[i + 1];
                        if (nextChild != null && nextChild.type === CssNodeType.Dimension) {
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
                case CssNodeType.Number:
                    if (child.value.length === 3) {
                        components.weight = this.convertAstValue(child);
                    }
                    break;
                case CssNodeType.Operator:
                    if (child.value === '/') {
                        let nextChild = children[i + 1];
                        if (nextChild != null) {
                            components.lineHeight = this.convertAstValue(nextChild);
                            beforeFamily = false;
                        }
                    }
                    break;
                case CssNodeType.Dimension:
                case CssNodeType.Percentage:
                    components.size = this.convertAstValue(child);
                    if (!children.some(c => c.type === CssNodeType.Operator && c.value === '/')) {
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
        let children = node.children.filter(keepTypes(CssNodeType.Identifier, CssNodeType.Number, CssNodeType.Function, CssNodeType.Dimension, CssNodeType.HexColor));
        for (let child of children) {
            if (child.type === CssNodeType.Identifier) {
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

    private convertBoxShadow(node) {
        // TODO handle 3 children inset shadow conflicting with border
        let children = node.children.filter(keepTypes(CssNodeType.Number, CssNodeType.Dimension, CssNodeType.Function,
            CssNodeType.HexColor, CssNodeType.Identifier, CssNodeType.Operator));
        let shadows = splitf(children, c => c.type === CssNodeType.Operator && c.value === '/');
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
        return new CSSBoxShadowValue(layers);
    }

    private convertFilter(node) {
        let children = node.children.filter(keepTypes(CssNodeType.Function));
        return new CSSFilterValue(children.map(c => this.convertFunction(c)));
    }
}

const parseFile = (path: string, strict: boolean = false): CssNode => {
    let fileContent;
    try {
        fileContent = fs.readFileSync(path, {encoding: 'UTF-8'});
    } catch (e) {
        throw new TypeError(`Failed to load identity file ${path}`);
    }
    return parse(fileContent, {
        parseCustomProperty: true,
        onParseError: (error: SyntaxParseError) => {
            if (strict) {
                throw error;
            } else {
                logger.warn(error);
            }
        },
        positions: true,
        filename: path,
    });
};

const nodeIs = <T extends CssNodeCommon>(node: CssNodeCommon, type: CssNodeType): node is T => {
    return node.type === type;
};

const removeWhiteSpaces = () => {
    return node => {
        return node.type !== CssNodeType.WhiteSpace;
    };
};

const keepTypes = (...types: CssNodeType[]) => {
    return node => {
        return types.some(t => node.type === t);
    };
};

const split = (nodes, splitter: CssNodeType) => {
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
