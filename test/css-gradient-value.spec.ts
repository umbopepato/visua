import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {
    CSSGradientStep,
    CSSLinearGradient,
    CSSRadialGradient,
    CSSRepeatingRadialGradient,
} from '../src/cssom/css-gradient-value';
import {CSSHexColor} from '../src/cssom/css-color-value';
import {CSSKeywordValue} from '../src/cssom/css-keyword-value';

describe('CSSGradientStep', () => {

    describe('constructor', () => {

        it('should throw an error if position is not length not percentage', () => {
            expect(() => new CSSGradientStep(
                new CSSHexColor('00', '00', '00'),
                CSS.deg(2),
            )).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSGradientStep(
                new CSSHexColor('00', '00', '00'),
                CSS.percent(50),
            ).toString()).to.be.equal(`#000000 50%`);

        });

    });

});

describe('CSSLinearGradient', () => {

    describe('constructor', () => {

        it('should throw an error if no steps are provided', () => {
            expect(() => new CSSLinearGradient([])).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSLinearGradient([
                new CSSGradientStep(new CSSHexColor('00', '00', '00')),
                new CSSGradientStep(new CSSHexColor('FF', 'FF', 'FF')),
            ]).toString()).to.be.equal(`linear-gradient(#000000, #FFFFFF)`);

        });

    });

});

describe('CSSRadialGradient', () => {

    describe('constructor', () => {

        it('should throw an error if no steps are provided', () => {
            expect(() => new CSSRadialGradient([])).to.throw();
        });

        it('should throw an error if a circle shape is provided along with an array of sizes', () => {
            expect(() => new CSSRadialGradient([
                new CSSGradientStep(new CSSHexColor('00', '00', '00')),
                new CSSGradientStep(new CSSHexColor('FF', 'FF', 'FF')),
            ], {
                shape: new CSSKeywordValue('circle'),
                size: [CSS.px(2), CSS.px(4)],
            })).to.throw();
        });

        it('should throw an error if an ellipse shape is provided along with a single size', () => {
            expect(() => new CSSRadialGradient([
                new CSSGradientStep(new CSSHexColor('00', '00', '00')),
                new CSSGradientStep(new CSSHexColor('FF', 'FF', 'FF')),
            ], {
                shape: new CSSKeywordValue('ellipse'),
                size: CSS.px(4),
            })).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSRadialGradient([
                new CSSGradientStep(new CSSHexColor('00', '00', '00')),
                new CSSGradientStep(new CSSHexColor('FF', 'FF', 'FF')),
            ]).toString()).to.be.equal(`radial-gradient(#000000, #FFFFFF)`);

        });

    });

});

describe('CSSRepeatingRadialGradient', () => {

    describe('constructor', () => {

        it('should create a repeating radial gradient from a radial gradient', () => {
            expect(new CSSRepeatingRadialGradient(
                new CSSRadialGradient([
                    new CSSGradientStep(new CSSHexColor('00', '00', '00')),
                    new CSSGradientStep(new CSSHexColor('FF', 'FF', 'FF')),
                ]),
            ));
        });

    });

});
