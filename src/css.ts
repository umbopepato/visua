import {CSSUnitValue} from './css-unit-value';

export class CSS {
    static units = [
        // <dimensionless>
        {
            name: 'number',
            symbol: '',
            toCanonical: 0,
            compatSet: 0,
            baseType: 'dimensionless',
        },
        {
            name: 'percent',
            symbol: '%',
            toCanonical: 0,
            compatSet: 1,
            baseType: 'dimensionless',
        },

        // <length>
        {
            name: 'px',
            symbol: 'px',
            toCanonical: 1,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'cm',
            symbol: 'cm',
            toCanonical: 96 / 2.54,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'mm',
            symbol: 'mm',
            toCanonical: 96 / 25.4,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'Q',
            symbol: 'Q',
            toCanonical: 96 / 101.6,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'in',
            symbol: 'in',
            toCanonical: 96,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'pc',
            symbol: 'pc',
            toCanonical: 96 / 6,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'pt',
            symbol: 'pt',
            toCanonical: 96 / 72,
            compatSet: 2,
            baseType: 'length',
        },
        {
            name: 'em',
            symbol: 'em',
            toCanonical: 0,
            compatSet: 3,
            baseType: 'length',
        },
        {
            name: 'ex',
            symbol: 'ex',
            toCanonical: 0,
            compatSet: 4,
            baseType: 'length',
        },
        {
            name: 'ch',
            symbol: 'ch',
            toCanonical: 0,
            compatSet: 5,
            baseType: 'length',
        },
        {
            name: 'ic',
            symbol: 'ic',
            toCanonical: 0,
            compatSet: 6,
            baseType: 'length',
        },
        {
            name: 'rem',
            symbol: 'rem',
            toCanonical: 0,
            compatSet: 7,
            baseType: 'length',
        },
        {
            name: 'lh',
            symbol: 'lh',
            toCanonical: 0,
            compatSet: 8,
            baseType: 'length',
        },
        {
            name: 'rlh',
            symbol: 'rlh',
            toCanonical: 0,
            compatSet: 9,
            baseType: 'length',
        },
        {
            name: 'vw',
            symbol: 'vw',
            toCanonical: 0,
            compatSet: 10,
            baseType: 'length',
        },
        {
            name: 'vh',
            symbol: 'vh',
            toCanonical: 0,
            compatSet: 11,
            baseType: 'length',
        },
        {
            name: 'vi',
            symbol: 'vi',
            toCanonical: 0,
            compatSet: 12,
            baseType: 'length',
        },
        {
            name: 'vb',
            symbol: 'vb',
            toCanonical: 0,
            compatSet: 13,
            baseType: 'length',
        },
        {
            name: 'vmin',
            symbol: 'vmin',
            toCanonical: 0,
            compatSet: 14,
            baseType: 'length',
        },
        {
            name: 'vmax',
            symbol: 'vmax',
            toCanonical: 0,
            compatSet: 15,
            baseType: 'length',
        },

        // <angle>
        {
            name: 'rad',
            symbol: 'rad',
            toCanonical: 1,
            compatSet: 16,
            baseType: 'angle',
        },
        {
            name: 'deg',
            symbol: 'deg',
            toCanonical: 180 / Math.PI,
            compatSet: 16,
            baseType: 'angle',
        },
        {
            name: 'grad',
            symbol: 'grad',
            toCanonical: 200 / Math.PI,
            compatSet: 16,
            baseType: 'angle',
        },
        {
            name: 'turn',
            symbol: 'turn',
            toCanonical: 1 / (2 * Math.PI),
            compatSet: 16,
            baseType: 'angle',
        },

        // <time>
        {
            name: 's',
            symbol: 's',
            toCanonical: 1,
            compatSet: 17,
            baseType: 'time',
        },
        {
            name: 'ms',
            symbol: 'ms',
            toCanonical: 1e-3,
            compatSet: 17,
            baseType: 'time',
        },

        // <frequency>
        {
            name: 'Hz',
            symbol: 'Hz',
            toCanonical: 1,
            compatSet: 18,
            baseType: 'frequency',
        },
        {
            name: 'kHz',
            symbol: 'kHz',
            toCanonical: 1e3,
            compatSet: 18,
            baseType: 'frequency',
        },

        // <resolution>
        {
            name: 'dppx',
            symbol: 'dppx',
            toCanonical: 1,
            compatSet: 19,
            baseType: 'resolution',
        },
        {
            name: 'dpi',
            symbol: 'dpi',
            toCanonical: 96,
            compatSet: 19,
            baseType: 'resolution',
        },
        {
            name: 'dpcm',
            symbol: 'dpcm',
            toCanonical: 96 / 2.54,
            compatSet: 19,
            baseType: 'resolution',
        },

        // <flex>
        {
            name: 'fr',
            symbol: 'fr',
            toCanonical: 1,
            compatSet: 20,
            baseType: 'flex',
        },
    ];

    static number(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'number');
    }

    static percent(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'percent');
    }

    static em(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'em');
    }

    static ex(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'ex');
    }

    static ch(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'ch');
    }

    static rem(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'rem');
    }

    static vw(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'vw');
    }

    static vh(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'vh');
    }

    static vmin(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'vmin');
    }

    static vmax(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'vmax');
    }

    static cm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'cm');
    }

    static mm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'mm');
    }

    static Q(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'Q');
    }

    static in(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'in');
    }

    static pt(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'pt');
    }

    static pc(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'pc');
    }

    static px(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'px');
    }

    static deg(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'deg');
    }

    static grad(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'grad');
    }

    static rad(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'rad');
    }

    static turn(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'turn');
    }

    static s(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 's');
    }

    static ms(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'ms');
    }

    static Hz(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'Hz');
    }

    static kHz(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'kHz');
    }

    static dpi(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'dpi');
    }

    static dpcm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'dpcm');
    }

    static dppx(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'dppx');
    }

    static fr(value: number): CSSUnitValue {
        return new CSSUnitValue(value, 'fr');
    }

    static areCompatible(unit1, unit2) {
        let u1Data = CSS.units.find(u => u.name === unit1 || u.symbol === unit1);
        if (u1Data == null) throw new TypeError(`Failed to convert ${unit1} to ${unit2}: Invalid unit ${unit1}`);
        let u2Data = CSS.units.find(u => u.name === unit2 || u.symbol === unit2);
        if (u2Data == null) throw new TypeError(`Failed to convert ${unit1} to ${unit2}: Invalid unit ${unit2}`);
        return u1Data.compatSet === u2Data.compatSet;
    }

    static getUnitData(unit) {
        return CSS.units.find(u => u.name === unit || u.symbol === unit);
    }

    static resolveUnit(unit: string): string {
        let unitData = CSS.units.find(u => u.name === unit || u.symbol === unit);
        if (!unitData) {
            throw new TypeError(`Failed to construct 'CSSUnitValue': Invalid unit ${unit}`);
        }
        return unitData.name;
    }

    static getCanonicalUnit(unit): string {
        if (unit.toCanonical === 0) {
            return unit.name;
        }
        return this.units.find(u => u.compatSet === unit.compatSet && u.toCanonical === 1).name;
    }
}