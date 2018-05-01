import {CSSUnitValue} from './css-unit-value';

export default class CSS {
    static units = {
        number: '',
        percent: '%',

        // <length>
        em: 'em',
        ex: 'ex',
        ch: 'ch',
        rem: 'rem',
        vw: 'vw',
        vh: 'vh',
        vmin: 'vmin',
        vmax: 'vmax',
        cm: 'cm',
        mm: 'mm',
        Q: 'Q',
        in: 'in',
        pt: 'pt',
        pc: 'pc',
        px: 'px',

        // <angle>
        deg: 'deg',
        grad: 'grad',
        rad: 'rad',
        turn: 'turn',

        // <time>
        s: 's',
        ms: 'ms',

        // <frequency>
        Hz: 'Hz',
        kHz: 'kHz',

        // <resolution>
        dpi: 'dpi',
        dpcm: 'dpcm',
        dppx: 'dppx',

        // <flex>
        fr: 'fr'
    };

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

}