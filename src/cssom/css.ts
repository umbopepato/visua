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

export interface CSSUnitData {
    name: CSSUnit,
    symbol: string,
    toCanonical: number,
    compatSet: number,
    baseType: CSSBaseType,
}

/**
 * A utility class which exposes various numeric factory functions
 * to easily create `CSSUnitValue`s, similar to
 * [CSS Typed Om's CSS namespace](https://www.w3.org/TR/css-typed-om-1/#numeric-factory).
 *
 * ```typescript
 * const size = CSS.px(14);
 * // Is a shorthand for
 * const size = new CSSUnitValue(14, 'px');
 * ```
 */
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

    /**
     * Creates a `CSSUnitValue` with `value` and number unit
     *
     * @param value The numeric value
     */
    static number(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.number);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and percent unit
     *
     * @param value The numeric value
     */
    static percent(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.percent);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and em unit
     *
     * @param value The numeric value
     */
    static em(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.em);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and ex unit
     *
     * @param value The numeric value
     */
    static ex(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.ex);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and ch unit
     *
     * @param value The numeric value
     */
    static ch(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.ch);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and rem unit
     *
     * @param value The numeric value
     */
    static rem(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.rem);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and vw unit
     *
     * @param value The numeric value
     */
    static vw(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vw);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and vh unit
     *
     * @param value The numeric value
     */
    static vh(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vh);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and vmin unit
     *
     * @param value The numeric value
     */
    static vmin(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vmin);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and vmax unit
     *
     * @param value The numeric value
     */
    static vmax(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.vmax);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and cm unit
     *
     * @param value The numeric value
     */
    static cm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.cm);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and mm unit
     *
     * @param value The numeric value
     */
    static mm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.mm);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and Q unit
     *
     * @param value The numeric value
     */
    static Q(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.Q);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and in unit
     *
     * @param value The numeric value
     */
    static in(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.in);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and pt unit
     *
     * @param value The numeric value
     */
    static pt(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.pt);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and pc unit
     *
     * @param value The numeric value
     */
    static pc(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.pc);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and px unit
     *
     * @param value The numeric value
     */
    static px(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.px);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and deg unit
     *
     * @param value The numeric value
     */
    static deg(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.deg);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and grad unit
     *
     * @param value The numeric value
     */
    static grad(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.grad);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and rad unit
     *
     * @param value The numeric value
     */
    static rad(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.rad);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and turn unit
     *
     * @param value The numeric value
     */
    static turn(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.turn);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and s unit
     *
     * @param value The numeric value
     */
    static s(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.s);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and ms unit
     *
     * @param value The numeric value
     */
    static ms(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.ms);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and Hz unit
     *
     * @param value The numeric value
     */
    static Hz(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.Hz);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and kHz unit
     *
     * @param value The numeric value
     */
    static kHz(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.kHz);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and dpi unit
     *
     * @param value The numeric value
     */
    static dpi(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.dpi);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and dpcm unit
     *
     * @param value The numeric value
     */
    static dpcm(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.dpcm);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and dppx unit
     *
     * @param value The numeric value
     */
    static dppx(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.dppx);
    }

    /**
     * Creates a `CSSUnitValue` with `value` and fr unit
     *
     * @param value The numeric value
     */
    static fr(value: number): CSSUnitValue {
        return new CSSUnitValue(value, CSSUnit.fr);
    }

    /**
     * Returns true if the provided units are compatible (ie cm and mm are compatible, px and Hz are incompatible)
     *
     * @param units
     */
    static areCompatible(...units: string[]) {
        return units.map(v => CSS.getUnitData(v).compatSet)
            .every((v, i, a) => v === a[0]);
    }

    /**
     * Gets some basic data about `unit` such as name, symbol or compatibility set
     *
     * @param unit The name or symbol of the unit
     */
    static getUnitData(unit: string | CSSUnit): CSSUnitData {
        if (this.units.hasOwnProperty(unit)) return this.units[unit];
        return Object.values(CSS.units).find(u => u.symbol === unit);
    }

    /**
     * If `unit` is a valid css unit name or symbol returns its data, otherwise throws an error
     *
     * @param unit  The name or symbol of the unit
     */
    static resolveUnit(unit: string): CSSUnitData {
        let unitData = CSS.getUnitData(unit.trim());
        if (!unitData) {
            throw new TypeError(`Invalid unit ${unit}`);
        }
        return unitData;
    }

    /**
     * Gets the canonical unit of the compatibility set of which `unit` is part of
     *
     * @param unit The name of the unit
     */
    static getCanonicalUnit(unit: CSSUnit): CSSUnitData {
        let unitData = CSS.getUnitData(unit);
        if (unitData.toCanonical === 1) {
            return unitData;
        }
        return Object.values(this.units)
            .find(u => u.compatSet === unitData.compatSet && u.toCanonical === 1);
    }
}