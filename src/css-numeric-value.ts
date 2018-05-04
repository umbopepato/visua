import {CSS} from './css';
import {CSSMathSum} from './css-math-sum';
import {CSSUnitValue} from './css-unit-value';
import {CSSMathNegate} from './css-math-negate';
import {CSSMathValue} from './css-math-value';
import {CSSMathProduct} from './css-math-product';
import {CSSMathInvert} from './css-math-invert';

export type CSSNumberish = CSSMathValue | CSSNumericValue | number;
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

export class CSSNumericValue {

    type: CSSNumericType = {};

    add(...values: CSSNumberish[]) {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        rectifiedValues.unshift(this);
        if (rectifiedValues.every(item => item instanceof CSSUnitValue)) {
            if (rectifiedValues.every((val, i, arr) => val === arr[0])) {
                return new CSSUnitValue(
                    rectifiedValues.map(item => item.value)
                        .reduce((acc, val) => acc + val),
                    this.unit,
                );
            }
        }
        this.addTypes(rectifiedValues.map(item => item.type));
        return new CSSMathSum(rectifiedValues);
    }

    sub(...values: CSSNumberish[]) {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        return this.add(this, ...rectifiedValues.map(this.negate));
    }

    mul(...values: CSSNumberish[]) {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        if (rectifiedValues.every(item => item instanceof CSSUnitValue)) {
            let numberValues = rectifiedValues.filter(val => val.unit === 'number');
            let nonNumberValues = rectifiedValues.filter(val => val.unit !== 'number');
            if (numberValues.length === rectifiedValues.length) {
                return new CSSUnitValue(
                    rectifiedValues.map(item => item.value)
                        .reduce((acc, val) => acc * val),
                    'number',
                );
            } else if (numberValues.length === rectifiedValues.length - 1 &&
                nonNumberValues.length === 1) {
                return new CSSUnitValue(
                    rectifiedValues.map(item => item.value)
                        .reduce((acc, val) => acc * val),
                    nonNumberValues[0].unit,
                );
            }
        }
        this.multiplyTypes(rectifiedValues.map(item => item.type));
        return new CSSMathProduct(rectifiedValues);
    }

    div(...values: CSSNumberish[]) {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        return this.mul(this, ...rectifiedValues.map(this.invert));
    }

    equals(...values: CSSNumberish[]) {
        let rectifiedValues = values.map(this.rectifyNumberishValue);
        return values.every(value => {
            if (value instanceof CSSUnitValue &&
                this instanceof CSSUnitValue) {
                return value.value === this.value &&
                    value.unit === this.unit;
            }
            return false;
        });
    }

    to(unit: string) {
        if (this instanceof CSSUnitValue) {
            if (this.unit === unit) return this;
            this.createType(unit);
            if (CSS.areCompatible(this.unit, unit)) {
                let currentUnitData = CSS.getUnitData(this.unit);
                let unitData = CSS.getUnitData(unit);
                return new CSSUnitValue((this.value * currentUnitData.toCanonical) / unitData.toCanonical, unit);
            }
        }

    }

    private rectifyNumberishValue(num: CSSNumberish): CSSMathValue | CSSUnitValue | CSSNumericValue {
        if (num instanceof CSSMathValue || num instanceof CSSNumericValue) {
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
        types.reduce((type1, type2) => {
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
        types.reduce((type1, type2) => {
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

    private negate(value: CSSUnitValue | CSSMathValue | CSSNumericValue) {
        if (value instanceof CSSUnitValue) {
            return new CSSUnitValue(-value.value, value.unit);
        } else if (value instanceof CSSMathNegate) {
            return value.value;
        } else {
            return new CSSMathNegate(value);
        }
    }

    private invert(value: CSSUnitValue | CSSMathValue | CSSNumericValue) {
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

    private createType(unit: string): CSSNumericType {
        let result = {};
        Object.keys(CSS.units).forEach(baseType => {
            if (Object.keys(baseType).includes(unit) ||
                Object.values(baseType).includes(unit)) {
                if (baseType === 'number') return result;
                result[baseType] = 1;
                return result;
            }
        });
        throw new TypeError(`Failed to create type: Invalid unit ${unit}`);
    }
}