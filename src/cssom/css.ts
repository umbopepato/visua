import {CSSUnitValue} from './css-unit-value';

export enum CSSUnit {
    number = 'number',
    percent = 'percent',
    px = 'px',
    cm = 'cm',
    mm = 'mm',
    Q = 'Q',
    in = 'in',
    pc = 'pc',
    pt = 'pt',
    em = 'em',
    ex = 'ex',
    ch = 'ch',
    ic = 'ic',
    rem = 'rem',
    lh = 'lh',
    rlh = 'rlh',
    vw = 'vw',
    vh = 'vh',
    vi = 'vi',
    vb = 'vb',
    vmin = 'vmin',
    vmax = 'vmax',
    rad = 'rad',
    deg = 'deg',
    grad = 'grad',
    turn = 'turn',
    s = 's',
    ms = 'ms',
    Hz = 'Hz',
    kHz = 'kHz',
    dppx = 'dppx',
    dpi = 'dpi',
    dpcm = 'dpcm',
    fr = 'fr',
}

export enum CSSBaseType {
    number = 'number',
    percent = 'percent',
    length = 'length',
    angle = 'angle',
    time = 'time',
    frequency = 'frequency',
    resolution = 'resolution',
    flex = 'flex',
}

export type CSSUnitData = {
    name: CSSUnit,
    symbol: string,
    toCanonical: number,
    compatSet: number,
    baseType: CSSBaseType,
};

export class CSS {

    private static units = {

        // <dimensionless>
        [CSSUnit.number]: {
            name: CSSUnit.number,
            symbol: '',
            toCanonical: 0,
            compatSet: 0,
            baseType: CSSBaseType.number,
        },
        [CSSUnit.percent]: {
            name: CSSUnit.percent,
            symbol: '%',
            toCanonical: 0,
            compatSet: 1,
            baseType: CSSBaseType.percent,
        },

        // <length>
        [CSSUnit.px]: {
            name: CSSUnit.px,
            symbol: 'px',
            toCanonical: 1,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.cm]: {
            name: CSSUnit.cm,
            symbol: 'cm',
            toCanonical: 96 / 2.54,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.mm]: {
            name: CSSUnit.mm,
            symbol: 'mm',
            toCanonical: 96 / 25.4,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.Q]: {
            name: CSSUnit.Q,
            symbol: 'Q',
            toCanonical: 96 / 101.6,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.in]: {
            name: CSSUnit.in,
            symbol: 'in',
            toCanonical: 96,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.pc]: {
            name: CSSUnit.pc,
            symbol: 'pc',
            toCanonical: 96 / 6,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.pt]: {
            name: CSSUnit.pt,
            symbol: 'pt',
            toCanonical: 96 / 72,
            compatSet: 2,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.em]: {
            name: CSSUnit.em,
            symbol: 'em',
            toCanonical: 0,
            compatSet: 3,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.ex]: {
            name: CSSUnit.ex,
            symbol: 'ex',
            toCanonical: 0,
            compatSet: 4,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.ch]: {
            name: CSSUnit.ch,
            symbol: 'ch',
            toCanonical: 0,
            compatSet: 5,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.ic]: {
            name: CSSUnit.ic,
            symbol: 'ic',
            toCanonical: 0,
            compatSet: 6,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.rem]: {
            name: CSSUnit.rem,
            symbol: 'rem',
            toCanonical: 0,
            compatSet: 7,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.lh]: {
            name: CSSUnit.lh,
            symbol: 'lh',
            toCanonical: 0,
            compatSet: 8,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.rlh]: {
            name: CSSUnit.rlh,
            symbol: 'rlh',
            toCanonical: 0,
            compatSet: 9,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.vw]: {
            name: CSSUnit.vw,
            symbol: 'vw',
            toCanonical: 0,
            compatSet: 10,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.vh]: {
            name: CSSUnit.vh,
            symbol: 'vh',
            toCanonical: 0,
            compatSet: 11,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.vi]: {
            name: CSSUnit.vi,
            symbol: 'vi',
            toCanonical: 0,
            compatSet: 12,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.vb]: {
            name: CSSUnit.vb,
            symbol: 'vb',
            toCanonical: 0,
            compatSet: 13,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.vmin]: {
            name: CSSUnit.vmin,
            symbol: 'vmin',
            toCanonical: 0,
            compatSet: 14,
            baseType: CSSBaseType.length,
        },
        [CSSUnit.vmax]: {
            name: CSSUnit.vmax,
            symbol: 'vmax',
            toCanonical: 0,
            compatSet: 15,
            baseType: CSSBaseType.length,
        },

        // <angle>
        [CSSUnit.rad]: {
            name: CSSUnit.rad,
            symbol: 'rad',
            toCanonical: 1,
            compatSet: 16,
            baseType: CSSBaseType.angle,
        },
        [CSSUnit.deg]: {
            name: CSSUnit.deg,
            symbol: 'deg',
            toCanonical: Math.PI / 180,
            compatSet: 16,
            baseType: CSSBaseType.angle,
        },
        [CSSUnit.grad]: {
            name: CSSUnit.grad,
            symbol: 'grad',
            toCanonical: 200 / Math.PI,
            compatSet: 16,
            baseType: CSSBaseType.angle,
        },
        [CSSUnit.turn]: {
            name: CSSUnit.turn,
            symbol: 'turn',
            toCanonical: 1 / (2 * Math.PI),
            compatSet: 16,
            baseType: CSSBaseType.angle,
        },

        // <time>
        [CSSUnit.s]: {
            name: CSSUnit.s,
            symbol: 's',
            toCanonical: 1,
            compatSet: 17,
            baseType: CSSBaseType.time,
        },
        [CSSUnit.ms]: {
            name: CSSUnit.ms,
            symbol: 'ms',
            toCanonical: 1e-3,
            compatSet: 17,
            baseType: CSSBaseType.time,
        },

        // <frequency>
        [CSSUnit.Hz]: {
            name: CSSUnit.Hz,
            symbol: 'Hz',
            toCanonical: 1,
            compatSet: 18,
            baseType: CSSBaseType.frequency,
        },
        [CSSUnit.kHz]: {
            name: CSSUnit.kHz,
            symbol: 'kHz',
            toCanonical: 1e3,
            compatSet: 18,
            baseType: CSSBaseType.frequency,
        },

        // <resolution>
        [CSSUnit.dppx]: {
            name: CSSUnit.dppx,
            symbol: 'dppx',
            toCanonical: 1,
            compatSet: 19,
            baseType: CSSBaseType.resolution,
        },
        [CSSUnit.dpi]: {
            name: CSSUnit.dpi,
            symbol: 'dpi',
            toCanonical: 96,
            compatSet: 19,
            baseType: CSSBaseType.resolution,
        },
        [CSSUnit.dpcm]: {
            name: CSSUnit.dpcm,
            symbol: 'dpcm',
            toCanonical: 96 / 2.54,
            compatSet: 19,
            baseType: CSSBaseType.resolution,
        },

        // <flex>
        [CSSUnit.fr]: {
            name: CSSUnit.fr,
            symbol: 'fr',
            toCanonical: 1,
            compatSet: 20,
            baseType: CSSBaseType.flex,
        },
    };

    static number(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.number);
    }

    static percent(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.percent);
    }

    static em(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.em);
    }

    static ex(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.ex);
    }

    static ch(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.ch);
    }

    static rem(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.rem);
    }

    static vw(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vw);
    }

    static vh(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vh);
    }

    static vmin(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vmin);
    }

    static vmax(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vmax);
    }

    static cm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.cm);
    }

    static mm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.mm);
    }

    static Q(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.Q);
    }

    static in(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.in);
    }

    static pt(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.pt);
    }

    static pc(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.pc);
    }

    static px(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.px);
    }

    static deg(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.deg);
    }

    static grad(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.grad);
    }

    static rad(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.rad);
    }

    static turn(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.turn);
    }

    static s(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.s);
    }

    static ms(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.ms);
    }

    static Hz(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.Hz);
    }

    static kHz(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.kHz);
    }

    static dpi(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.dpi);
    }

    static dpcm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.dpcm);
    }

    static dppx(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.dppx);
    }

    static fr(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.fr);
    }

    static areCompatible(...units: string[]) {
        return units.map(v => CSS.getUnitData(v).compatSet)
            .every((v, i, a) => v === a[0]);
    }

    static getUnitData(unit: string | CSSUnit) {
        if (this.units.hasOwnProperty(unit)) return this.units[unit];
        return Object.values(CSS.units).find(u => u.symbol === unit);
    }

    static resolveUnit(unit: string): CSSUnitData {
        let unitData = CSS.getUnitData(unit.trim());
        if (!unitData) {
            throw new TypeError(`Invalid unit ${unit}`);
        }
        return unitData;
    }

    static getCanonicalUnit(unit: CSSUnit): CSSUnitData {
        let unitData = CSS.getUnitData(unit);
        if (unitData.toCanonical === 1) {
            return unitData;
        }
        return Object.values(this.units)
            .find(u => u.compatSet === unitData.compatSet && u.toCanonical === 1);
    }
}