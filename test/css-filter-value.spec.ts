import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {
    CSSBlurFilter,
    CSSBrightnessFilter,
    CSSContrastFilter,
    CSSDropShadowFilter, CSSFilterValue,
    CSSGrayscaleFilter,
    CSSHueRotateFilter,
    CSSInvertFilter,
    CSSOpacityFilter,
    CSSSaturateFilter,
    CSSSepiaFilter,
} from '../src/cssom/css-filter-value';
import {CSSBoxShadowValue, CSSShadow} from '../src/cssom/css-box-shadow-value';
import {CSSHexColor} from '../src/cssom/css-color-value';

describe('CSSBlurFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-length radius is provided', () => {
            expect(() => new CSSBlurFilter(CSS.deg(2))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSBlurFilter(CSS.px(2)).toString()).to.be.equal('blur(2px)');

        });

    });

});

describe('CSSBrightnessFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent value is provided', () => {
            expect(() => new CSSBrightnessFilter(CSS.deg(2))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSBrightnessFilter(CSS.percent(2)).toString()).to.be.equal('brightness(2%)');

        });

    });

});

describe('CSSContrastFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent value is provided', () => {
            expect(() => new CSSContrastFilter(CSS.deg(2))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSContrastFilter(CSS.percent(2)).toString()).to.be.equal('contrast(2%)');

        });

    });

});

describe('CSSDropShadowFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-shadow value is provided', () => {
            // @ts-ignore
            expect(() => new CSSDropShadowFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSDropShadowFilter(
                new CSSBoxShadowValue([
                    new CSSShadow({
                        color: new CSSHexColor('00', '00', '00'),
                        offsetX: CSS.px(2),
                        offsetY: CSS.px(2),
                    }),
                ]),
            ).toString()).to.be.equal('drop-shadow(2px 2px #000000)');

        });

    });

});

describe('CSSGrayscaleFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent value is provided', () => {
            expect(() => new CSSGrayscaleFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSGrayscaleFilter(CSS.percent(2)).toString()).to.be.equal('grayscale(2%)');

        });

    });

});

describe('CSSHueRotateFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-angle angle is provided', () => {
            expect(() => new CSSHueRotateFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSHueRotateFilter(CSS.deg(2)).toString()).to.be.equal('hue-rotate(2deg)');

        });

    });

});

describe('CSSInvertFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent amount is provided', () => {
            expect(() => new CSSInvertFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSInvertFilter(CSS.percent(2)).toString()).to.be.equal('invert(2%)');

        });

    });

});

describe('CSSOpacityFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent amount is provided', () => {
            expect(() => new CSSOpacityFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSOpacityFilter(CSS.percent(2)).toString()).to.be.equal('opacity(2%)');

        });

    });

});

describe('CSSSaturateFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent amount is provided', () => {
            expect(() => new CSSSaturateFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSSaturateFilter(CSS.percent(2)).toString()).to.be.equal('saturate(2%)');

        });

    });

});

describe('CSSSepiaFilter', () => {

    describe('constructor', () => {

        it('should throw an error when a non-percent amount is provided', () => {
            expect(() => new CSSSepiaFilter(CSS.dpi(1))).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSSepiaFilter(CSS.percent(2)).toString()).to.be.equal('sepia(2%)');

        });

    });

});

describe('CSSFilterValue', () => {

    describe('constructor', () => {

        it('should throw an error when no filter is provided', () => {
            expect(() => new CSSFilterValue([])).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSFilterValue([
                new CSSSepiaFilter(CSS.percent(2)),
            ]).toString()).to.be.equal('sepia(2%)');

        });

    });

});
