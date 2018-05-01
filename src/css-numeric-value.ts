import CSSUnitValue from './css-unit-value';
import CSSMathSum from "./css-math-sum";

type CSSNumberish = CSSNumericValue | number;
type CSSNumericType = { [key: string]: number };
enum CSSNumericBaseType {
    length = 'length',
    angle = 'angle',
    time = 'time',
    frequency = 'frequency',
    resolution = 'resolution',
    flex = 'flex',
    percent = 'percent',
}

export default class CSSNumericValue {

    type: CSSNumericType;

    private static rectifyNumberishValue(num: CSSNumberish): CSSNumericValue | CSSUnitValue {
        if (num instanceof CSSNumericValue) {
            return num;
        }
        if (typeof num === 'number') {
            return new CSSUnitValue(num, 'number');
        }
    }

    private static addTypes(...types: CSSNumericType[]) {
        types.reduce((type1, type2) => {
            if (type1.percentHint != null) {
                
            }
        });
    }

    add(...values: CSSNumberish[]) {
        let items = values.map(CSSNumericValue.rectifyNumberishValue);
        if (this instanceof CSSMathSum) {
            this.values.unshift(items);
        } else {
            items.unshift(this);
        }
        if (items.every(item => item instanceof CSSUnitValue)) {
            if (items.every((val, i, arr) => val === arr[0])) {
                return new CSSUnitValue(
                    items.map(item => item.value)
                        .reduce((acc, val) => acc + val),
                    this.unit
                );
            }
        }
        let type = addTypes()
    }

}