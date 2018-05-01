import CSSUnitValue from './css-unit-value';
import CSSMathSum from "./css-math-sum";

type CSSNumberish = CSSNumericValue | number;
type CSSNumericType = { [key: string]: number | CSSNumericBaseType };

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

    private static typesHaveSameNonZeroValues(t1, t2) {
        return Object.keys(t1)
                .filter(key => t1[key] !== 0)
                .every(key => t2.hasOwnProperty(key) && t1[key] === t2[key]) &&
            Object.keys(t2)
                .filter(key => t2[key] !== 0)
                .every(key => t1.hasOwnProperty(key) && t1[key] === t2[key]);
    }

    private static copyDistinctTypeValues(t1, t2, fT) {
        Object.keys(t1).forEach(key => {
            if (fT[key] === undefined) {
                fT[key] = t1[key];
            }
        });
        Object.keys(t2).forEach(key => {
            if (fT[key] === undefined) {
                fT[key] = t2[key];
            }
        });
    }

    private static applyPercentHintToType(type, hint) {
        if (!type.hasOwnProperty(hint)) {
            type[hint] = 0;
        }
        if (type.hasOwnProperty(CSSNumericBaseType.percent)) {
            type[hint] += type[CSSNumericBaseType.percent];
            type[CSSNumericBaseType.percent] = 0;
        }
        type.percentHint = hint;
    }

    private static addTypes(types: CSSNumericType[]): CSSNumericType {
        types.reduce((type1, type2) => {
            let finalType: CSSNumericType = {};

            if (type1.percentHint != null) {
                if (type2.percentHint == null) {
                    type2.percentHint = type1.percentHint;
                } else {
                    if (type1.percentHint !== type2.percentHint) {
                        throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                    }
                }
            } else {
                if (type2.percentHint != null) {
                    type1.percentHint = type2.percentHint;
                }
            }
            if (CSSNumericValue.typesHaveSameNonZeroValues(type1, type2)) {
                CSSNumericValue.copyDistinctTypeValues(type1, type2, finalType);
                finalType.percentHint = type1.percentHint;
                return finalType;
            }
            if ((type1[CSSNumericBaseType.percent] != null &&
                type1[CSSNumericBaseType.percent] !== 0) ||
                (type2[CSSNumericBaseType.percent] != null &&
                    type2[CSSNumericBaseType.percent] !== 0)) {
                if (type1.length < 2 && type2.length < 2) {
                    throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                }
                if (Object.keys(type1).some(key => key !== CSSNumericBaseType.percent && type1[key] !== 0) ||
                    Object.keys(type2).some(key => key !== CSSNumericBaseType.percent && type2[key] !== 0)) {
                    const origType1 = {...type1};
                    const origType2 = {...type2};
                    new Set(Object.keys(type1).concat(Object.keys(type2))).forEach((key: CSSNumericBaseType) => {
                        CSSNumericValue.applyPercentHintToType(type1, key);
                        CSSNumericValue.applyPercentHintToType(type2, key);
                        if (CSSNumericValue.typesHaveSameNonZeroValues(type1, type2)) {
                            CSSNumericValue.copyDistinctTypeValues(type1, type2, finalType);
                            finalType.percentHint = key;
                            return finalType;
                        }
                        type1 = origType1;
                        type2 = origType2;
                    });
                }
                throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
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
        let type = CSSNumericValue.addTypes(items.map(item => item.type));
        return new CSSMathSum(values);
    }

}