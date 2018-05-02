import CSSStyleValue from './css-style-value';
import {CSSUnitValue} from './css-unit-value';

export default class CSSStyleValues {

    static fromAstValue(astNode): CSSStyleValue {
        if (astNode.children.length > 1) {

        } else {
            let valueNode = astNode.children[0];
            switch (valueNode.type) {
                case 'Dimension':
                    return CSSStyleValues.fromDimension(valueNode);
                case 'Function':
                    return CSSStyleValues.fromFunction(valueNode);
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
        }
    }

}