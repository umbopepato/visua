import CSSStyleValue from "./css-style-value";
import CssUnitValue from "./css-unit-value";

export default class CSSStyleValues {

    static fromAstValue(astNode): CSSStyleValue {
        if (astNode.children.length > 1) {

        } else {
            let valueNode = astNode.children[0];
            if (valueNode.type === 'Dimension') {
                return new CssUnitValue(valueNode.value, valueNode.unit);
            }
        }
    }

}