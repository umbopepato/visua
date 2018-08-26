import {CSS} from './css';
import {CSSUnitValue} from './css-unit-value';
import {CSSStyleValue} from './css-style-value';

export type CSSNumberish = CSSNumericValue | number;

export enum CSSNumericBaseType {
    length = 'length',
    angle = 'angle',
    time = 'time',
    frequency = 'frequency',
    resolution = 'resolution',
    flex = 'flex',
    percent = 'percent',
}

type CSSNumericType = Map<string | CSSNumericBaseType, number | CSSNumericBaseType>;

export class CSSUnitMap extends Map<string, number> {

    equals(other: CSSUnitMap): boolean {
        if (this.size !== other.size) return false;
        this.forEach((v, k) => {
            if (!other.has(k)) return false;
            if (other[k] !== this[k]) return false;
        });
        return true;
    }
}

export class CSSNumericValue extends CSSStyleValue {

    type: CSSNumericType = new Map();

    add(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
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
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
        return this.add(...rectifiedValues.map(this.negate));
    }

    mul(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
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
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
        return this.mul(...rectifiedValues.map(this.invert));
    }

    min(...values: CSSNumberish[]): CSSNumericValue {
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
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
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
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
        let rectifiedValues = values.map(CSSNumericValue.rectifyNumberishValue);
        return rectifiedValues.every(val => {
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
        this.createType(unit);
        let sum = this.createSumValue();
        if (sum.length > 1) {
            throw new TypeError(`Failed to convert ${typeof this} to ${unit}`);
        }
        let item: CSSUnitValue = CSSUnitValue.fromSumValue(sum);
        return item.toUnit(unit);
    }

    solve(): CSSNumericValue {
        try {
            let sum = this.createSumValue();
            if (sum.length > 1) {
                return this;
            }
            return CSSUnitValue.fromSumValue(sum);
        } catch {
            return this;
        }
    }

    static rectifyNumberishValue(num: CSSNumberish): CSSUnitValue | CSSNumericValue {
        if (num instanceof CSSNumericValue) {
            return num;
        }
        return new CSSUnitValue(num, 'number');
    }

    private typesHaveSameNonZeroValues(t1: CSSNumericType, t2: CSSNumericType): boolean {
        return Array.from(t1.entries())
                .filter(([k, v]) => v !== 0)
                .every(([k, v]) => t2.has(k) && t1.get(k) === t2.get(k)) &&
            Array.from(t2.entries())
                .filter(([k, v]) => v !== 0)
                .every(([k, v]) => t1.has(k) && t1.get(k) === t2.get(k));
    }

    private joinTypes(t1: CSSNumericType, t2: CSSNumericType, fT: CSSNumericType) {
        t1.forEach((v, k) => {
            if (!fT.has(k)) {
                fT.set(k, v);
            }
        });
        t2.forEach((v, k) => {
            if (!fT.has(k)) {
                fT.set(k, v);
            }
        });
    }

    private applyPercentHintToType(type: CSSNumericType, hint: CSSNumericBaseType) {
        if (!type.has(hint)) {
            type.set(hint, 0);
        }
        if (type.has(CSSNumericBaseType.percent)) {
            type.set(hint, (type.get(hint) as number) + (type.get(CSSNumericBaseType.percent) as number));
            type.set(CSSNumericBaseType.percent, 0);
        }
        type.set('percentHint', hint);
    }

    private addTypes(types: CSSNumericType[]): CSSNumericType {
        return types.reduce((type1, type2) => {
            let finalType: CSSNumericType = new Map();

            if (type1.has('percentHint')) {
                if (type2.has('percentHint')) {
                    this.applyPercentHintToType(type2, type1.get('percentHint') as CSSNumericBaseType);
                } else {
                    if (type1.get('percentHint') !== type2.get('percentHint')) {
                        throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                    }
                }
            } else {
                if (type2.has('percentHint')) {
                    this.applyPercentHintToType(type1, type2.get('percentHint') as CSSNumericBaseType);
                }
            }

            if (this.typesHaveSameNonZeroValues(type1, type2)) {
                this.joinTypes(type1, type2, finalType);
                this.applyPercentHintToType(finalType, type1.get('percentHint') as CSSNumericBaseType);
                return finalType;
            }

            if ((type1[CSSNumericBaseType.percent] != null &&
                type1[CSSNumericBaseType.percent] !== 0) ||
                (type2[CSSNumericBaseType.percent] != null &&
                    type2[CSSNumericBaseType.percent] !== 0)) {
                if (type1.size < 2 && type2.size < 2) {
                    throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                }
                if (Array.from(type1.entries())
                        .some(([k, v]) => k !== CSSNumericBaseType.percent && v !== 0) ||
                    Array.from(type1.entries())
                        .some(([k, v]) => k !== CSSNumericBaseType.percent && v !== 0)) {
                    const origType1 = new Map(type1);
                    const origType2 = new Map(type2);
                    new Map([...type1, ...type2])
                        .forEach((v, k) => {
                            this.applyPercentHintToType(type1, k as CSSNumericBaseType);
                            this.applyPercentHintToType(type2, k as CSSNumericBaseType);
                            if (this.typesHaveSameNonZeroValues(type1, type2)) {
                                this.joinTypes(type1, type2, finalType);
                                this.applyPercentHintToType(finalType, k as CSSNumericBaseType);
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

            if (type1.has('percentHint')) {
                if (type2.has('percentHint')) {
                    this.applyPercentHintToType(type2, type1.get('percentHint') as CSSNumericBaseType);
                } else {
                    if (type1.get('percentHint') !== type2.get('percentHint')) {
                        throw new TypeError('Failed to construct \'CSSMathSum\': Incompatible types');
                    }
                }
            } else {
                if (type2.has('percentHint')) {
                    this.applyPercentHintToType(type1, type2.get('percentHint') as CSSNumericBaseType);
                }
            }

            let finalType = new Map(type1);
            type2.forEach((v, k) => {
                if (k !== 'percentHint') {
                    if (!finalType.has(k)) {
                        finalType.set(k, (finalType.get(k) as number) + (v as number));
                    } else {
                        finalType.set(k, v);
                    }
                }
            });
            this.applyPercentHintToType(finalType, type1.get('percentHint') as CSSNumericBaseType);
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
        let result = new Map();
        const unitData = CSS.getUnitData(unit);
        if (unitData != null) {
            if (unitData.name === 'number') return result;
            result.set(unitData.baseType, 1);
            return result;
        }
        throw new TypeError(`Failed to create type: Invalid unit ${unit}`);
    }

    private createTypeFromUnitMap(map: CSSUnitMap): CSSNumericType {
        let types = [];
        map.forEach((p, u) => {
            let type = this.createType(u);
            type.set(u, p);
            types.push(type);
        });
        return this.multiplyTypes(types);
    }

    private createSumValue() {
        if (this instanceof CSSUnitValue) {
            let value = this.value;
            let unit = this.unit;
            let unitData = CSS.getUnitData(unit);
            if (unitData.toCanonical !== 0) {
                value *= unitData.toCanonical;
                unit = CSS.getCanonicalUnit(unitData);
            }
            if (unit === 'number') {
                return [[value, new CSSUnitMap()]];
            }
            let unitMap = new CSSUnitMap();
            unitMap.set(unit, 1);
            return [[value, unitMap]];
        }
        if (this instanceof CSSMathSum) {
            let values = [];
            this.values.forEach(i => {
                let value = i.createSumValue();
                value.forEach(v => {
                    let inValue = values.findIndex(val => val[1].equals(v[1]));
                    if (inValue !== -1) {
                        values[inValue][0] += v[0];
                    } else {
                        values.push(v);
                    }
                });
            });
            let types = values.map(v => this.createTypeFromUnitMap(v[1]));
            this.addTypes(types);
            return values;
        }
        if (this instanceof CSSMathNegate) {
            let values = this.value.createSumValue();
            values.forEach(v => v[0] = -v[0]);
            return values;
        }
        if (this instanceof CSSMathProduct) {
            let values = [[1, new CSSUnitMap()]];
            this.values.forEach(v => {
                let newVals = v.createSumValue();
                let temp = [];
                values.forEach(v1 => {
                    newVals.forEach(v2 => {
                        let item = [
                            v1[0] as number * v2[0],
                            this.multiplyUnitMaps(v1[1] as CSSUnitMap, v2[1]),
                        ];
                        temp.push(item);
                    });
                });
                values = temp;
            });
            return values;
        }
        if (this instanceof CSSMathInvert) {
            let sumVal = this.value.createSumValue();
            if (sumVal.length > 1) {
                throw new TypeError('Failed to create sum value from \'CSSMathInvert\'');
            }
            sumVal[0][0] = 1 / sumVal[0][0];
            sumVal[0][1].forEach((v, k) => sumVal[0][1][k] = -v);
            return sumVal;
        }
        if (this instanceof CSSMathMin) {
            let args = this.values.map(v => v.createSumValue());
            if (args.some(v => v.length > 1)) {
                throw new TypeError('Failed to create sum value from \'CSSMathMin\'');
            }
            if (args.some((v, i, a) => v[0][1].equlas(a[0][0][1]))) {
                throw new TypeError('Failed to create sum value from \'CSSMathMin\'');
            }
            return args.reduce((acc, val) => acc[0][0] < val[0][0] ? acc : val);
        }
        if (this instanceof CSSMathMax) {
            let args = this.values.map(v => v.createSumValue());
            if (args.some(v => v.length > 1)) {
                throw new TypeError('Failed to create sum value from \'CSSMathMin\'');
            }
            if (args.some((v, i, a) => v[0][1].equlas(a[0][0][1]))) {
                throw new TypeError('Failed to create sum value from \'CSSMathMin\'');
            }
            return args.reduce((acc, val) => acc[0][0] < val[0][0] ? acc : val);
        }
    }

    protected multiplyUnitMaps(u1: CSSUnitMap, u2: CSSUnitMap): CSSUnitMap {
        let u1NonZero: CSSUnitMap = new CSSUnitMap(),
            u2NonZero: CSSUnitMap = new CSSUnitMap();
        u1.forEach((v, k) => {
            if (v !== 0) u1NonZero.set(k, v);
        });
        u2.forEach((v, k) => {
            if (v !== 0) u2NonZero.set(k, v);
        });
        let result = new CSSUnitMap(u1NonZero);
        u2NonZero.forEach((p, u) => {
            if (result.has(u)) {
                result.set(u, result.get(u) + p);
            } else {
                result.set(u, p);
            }
        });
        return result;
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

export class CSSMathValue extends CSSNumericValue {
    readonly operator: CSSMathOperator;
}

export class CSSMathInvert extends CSSMathValue {
    constructor(readonly value) {
        super();
    }
}

export class CSSMathMax extends CSSMathValue {
    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }
}

export class CSSMathMin extends CSSMathValue {
    readonly values;

    constructor(...values) {
        super();
        this.values = values;
    }
}

export class CSSMathNegate extends CSSMathValue {
    constructor(readonly value) {
        super();
    }
}

export class CSSMathProduct extends CSSMathValue {
    constructor(readonly values) {
        super();
    }
}

export class CSSMathSum extends CSSMathValue {
    constructor(readonly values) {
        super();
    }
}