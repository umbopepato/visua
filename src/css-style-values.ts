import {CSSStyleValue} from './css-style-value';
import {CSSUnitValue} from './css-unit-value';
import {CSSUrlValue} from './css-url-value';
import {CSSHexColor, CSSHslaColor, CSSRgbaColor} from './css-color-value';

export class CSSStyleValues {

    static fromAstValue(astNode): CSSStyleValue {
        if (astNode.children.length > 1) {

        } else {
            let valueNode = astNode.children[0];
            switch (valueNode.type) {
                case 'Dimension':
                    return CSSStyleValues.fromDimension(valueNode);
                case 'Function':
                    return CSSStyleValues.fromFunction(valueNode);
                case 'Url':
                    return CSSStyleValues.fromUrl(valueNode);
                case 'HexColor':
                    return CSSStyleValues.fromHex(valueNode);

            }
        }
    }

    static fromDimension(node) {
        return new CSSUnitValue(node.value, node.unit);
    }

    static fromFunction(node) {
        switch (node.name) {
            case 'calc':
                return new CSSStyleValue();
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
                                    return CSSStyleValues.fromDimension(c);
                                case 'Percentage':
                                    return CSSStyleValues.fromPercentage(c);
                            }
                        })
                );

        }
    }

    static fromUrl(node) {
        return new CSSUrlValue(node.value.value);
    }

    static fromHex(node) {
        return CSSHexColor.fromString(node.value);
    }

    static fromPercentage(node) {
        return new CSSUnitValue(node.value, 'percent');
    }

}