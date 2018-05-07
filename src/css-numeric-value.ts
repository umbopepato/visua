import {CSS} from './css';
import {CSSUnitValue} from './css-unit-value';
import {CSSStyleValue} from './css-style-value';

export type CSSNumberish = CSSNumericValue | number;
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

export class CSSNumericValue extends CSSStyleValue {

    type: CSSNumericType = {};

    add(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        if (this instanceof CSSMathSum) {
            this.values.unshift(rectifiedValues);
        } else {
            rectifiedValues.unshift(this);
        }
        if (rectifiedValues.every(i => i instanceof CSSUnitValue)) {
            if (rectifiedValues.every((val, i, arr) => val.unit === arr[0].unit)) {
                return new CSSUnitValue(
                    rectifiedValues.map(item => item.value)
                        .reduce((acc, val) => acc + val),
                    this.unit,
                );
            }
        }
        this.addTypes(rectifiedValues.map(i => i.type));
        return new CSSMathSum(rectifiedValues);
    }

    sub(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        return this.add(...rectifiedValues.map(this.negate));
    }

    mul(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        if (this instanceof CSSMathProduct) {
            this.values.unshift(rectifiedValues);
        } else {
            rectifiedValues.unshift(this);
        }
        if (rectifiedValues.every(i => i instanceof CSSUnitValue)) {
            let numberValues = rectifiedValues.filter(val => val.unit === 'number');
            let nonNumberValues = rectifiedValues.filter(val => val.unit !== 'number');
            if (numberValues.length === rectifiedValues.length - 1 &&
                nonNumberValues.length === 1) {
                return new CSSUnitValue(
                    rectifiedValues.map(i => i.value)
                        .reduce((acc, val) => acc * val),
                    nonNumberValues[0].unit,
                );
            }
        }
        this.multiplyTypes(rectifiedValues.map(i => i.type));
        return new CSSMathProduct(rectifiedValues);
    }

    div(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        return this.mul(...rectifiedValues.map(this.invert));
    }

    min(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        if (this instanceof CSSMathMin) {
            this.values.unshift(rectifiedValues);
        } else {
            rectifiedValues.unshift(this);
        }
        if (rectifiedValues.every(i => i instanceof CSSUnitValue)) {
            if (rectifiedValues.every((val, i, arr) => val.unit === arr[0].unit)) {
                return new CSSUnitValue(
                    Math.min(...rectifiedValues.map(item => item.value)),
                    this.unit,
                );
            }
        }
        this.addTypes(rectifiedValues.map(i => i.type));
        return new CSSMathMin(rectifiedValues);
    }

    max(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        if (this instanceof CSSMathMax) {
            this.values.unshift(rectifiedValues);
        } else {
            rectifiedValues.unshift(this);
        }
        if (rectifiedValues.every(i => i instanceof CSSUnitValue)) {
            if (rectifiedValues.every((val, i, arr) => val.unit === arr[0].unit)) {
                return new CSSUnitValue(
                    Math.max(...rectifiedValues.map(item => item.value)),
                    this.unit,
                );
            }
        }
        this.addTypes(rectifiedValues.map(i => i.type));
        return new CSSMathMax(rectifiedValues);
    }

    equals(...values: CSSNumberish[]): boolean {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        return values.every(val => {
            if (val instanceof CSSUnitValue &&
                this instanceof CSSUnitValue) {
                return val.value === this.value &&
                    val.unit === this.unit;
            }
            if ((val instanceof CSSMathSum &&
                this instanceof CSSMathSum) ||
                (val instanceof CSSMathProduct &&
                    this instanceof CSSMathProduct) ||
                (val instanceof CSSMathMin &&
                    this instanceof CSSMathMin) ||
                (val instanceof CSSMathMax &&
                    this instanceof CSSMathMax)) {
                if (val.values.length !== this.values.length) return false;
                return !this.values.every((v, i) => v !== val.values[i]);
            }
            if ((val instanceof CSSMathNegate &&
                this instanceof CSSMathNegate) ||
                (val instanceof CSSMathInvert &&
                    this instanceof CSSMathInvert)) {
                return val.value === this.value;
            }
            return false;
        });
    }

    to(unit: string): CSSUnitValue {
        let type = this.createType(unit);
        if (this instanceof CSSUnitValue) {
            if (this.unit === unit) return this;
            if (CSS.areCompatible(this.unit, unit)) {
                let currentUnitData = CSS.getUnitData(this.unit);
                let unitData = CSS.getUnitData(unit);
                return new CSSUnitValue((this.value * currentUnitData.toCanonical) / unitData.toCanonical, unit);
            }
        }

    }

    private rectifyNumberishValue(num: CSSNumberish): CSSUnitValue | CSSNumericValue {
        if (num instanceof CSSNumericValue) {
            return num;
        }
        return new CSSUnitValue(num, 'number');
    }

    private typesHaveSameNonZeroValues(t1, t2) {
        return Object.keys(t1)
                .filter(key => t1[key] !== 0)
                .every(key => t2.hasOwnProperty(key) && t1[key] === t2[key]) &&
            Object.keys(t2)
                .filter(key => t2[key] !== 0)
                .every(key => t1.hasOwnProperty(key) && t1[key] === t2[key]);
    }

    private joinTypes(t1, t2, fT) {
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

    private applyPercentHintToType(type, hint) {
        if (!type.hasOwnProperty(hint)) {
            type[hint] = 0;
        }
        if (type.hasOwnProperty(CSSNumericBaseType.percent)) {
            type[hint] += type[CSSNumericBaseType.percent];
            type[CSSNumericBaseType.percent] = 0;
        }
        type.percentHint = hint;
    }

    private addTypes(types: CSSNumericType[]): CSSNumericType {
        return types.reduce((type1, type2) => {
            let finalType: CSSNumericType = {};

            if (type1.percentHint != null) {
                if (type2.percentHint == null) {
                    this.applyPercentHintToType(type2, type1.percentHint);
                } else {
                    if (type1.percentHint !== type2.percentHint) {
                        throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                    }
                }
            } else {
                if (type2.percentHint != null) {
                    this.applyPercentHintToType(type1, type2.percentHint);
                }
            }

            if (this.typesHaveSameNonZeroValues(type1, type2)) {
                this.joinTypes(type1, type2, finalType);
                this.applyPercentHintToType(finalType, type1.percentHint);
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
                        this.applyPercentHintToType(type1, key);
                        this.applyPercentHintToType(type2, key);
                        if (this.typesHaveSameNonZeroValues(type1, type2)) {
                            this.joinTypes(type1, type2, finalType);
                            this.applyPercentHintToType(finalType, key);
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

    private multiplyTypes(types: CSSNumericType[]): CSSNumericType {
        return types.reduce((type1, type2) => {
            let finalType: CSSNumericType = {};

            if (type1.percentHint != null) {
                if (type2.percentHint == null) {
                    this.applyPercentHintToType(type2, type1.percentHint);
                } else {
                    if (type1.percentHint !== type2.percentHint) {
                        throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                    }
                }
            } else {
                if (type2.percentHint != null) {
                    this.applyPercentHintToType(type1, type2.percentHint);
                }
            }

            finalType = {...type1};
            Object.keys(type2).forEach(key => {
                if (key !== 'percentHint') {
                    if (finalType[key] != null) {
                        finalType[key] += type2[key];
                    } else {
                        finalType[key] = type2[key];
                    }
                }
            });
            this.applyPercentHintToType(finalType, type1.percentHint);
            return finalType;
        });
    }

    private negate(value: CSSNumericValue): CSSNumberish {
        if (value instanceof CSSUnitValue) {
            return new CSSUnitValue(-value.value, value.unit);
        } else if (value instanceof CSSMathNegate) {
            return value.value;
        } else {
            return new CSSMathNegate(value);
        }
    }

    private invert(value: CSSNumericValue): CSSNumberish {
        if (value instanceof CSSUnitValue) {
            if (value.unit === 'number') {
                if (value.value == 0) {
                    throw new RangeError('Failed to construct \'CSSMathInvert\': Division by zero');
                } else {
                    return new CSSUnitValue(1 / value.value, 'number');
                }
            }
        } else if (value instanceof CSSMathInvert) {
            return value.value;
        } else {
            return new CSSMathInvert(value);
        }
    }

    protected createType(unit: string): CSSNumericType {
        let result = {};
        const unitData = CSS.getUnitData(unit);
        if (unitData != null) {
            if (unitData.name === 'number') return result;
            result[unitData.baseType] = 1;
            return result;
        }
        throw new TypeError(`Failed to create type: Invalid unit ${unit}`);
    }
}

enum CSSMathOperator {
    sum,
    product,
    negate,
    invert,
    min,
    max,
}

class CSSMathValue extends CSSNumericValue {
    readonly operator: CSSMathOperator;
}

class CSSMathInvert extends CSSMathValue {

    readonly value;

    constructor(value) {
        super();
        this.value = value;
    }

}

class CSSMathMax extends CSSMathValue {

    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }

}

class CSSMathMin extends CSSMathValue {

    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }

}

class CSSMathNegate extends CSSMathValue {

    readonly value;

    constructor(value) {
        super();
        this.value = value;
    }
}

class CSSMathProduct extends CSSMathValue {

    private readonly _values;

    get values() {
        return this._values;
    }

    constructor(...values) {
        super();
        this._values = values;
    }

}

class CSSMathSum extends CSSMathValue {

    readonly values;

    constructor(values) {
        super();
        this.values = values;
    }

}