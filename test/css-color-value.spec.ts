import {expect} from 'chai';
import {CSSHexColor, CSSHslaColor, CSSRgbaColor} from '../src/css-color-value';
import {CSS} from '../src/css';

describe('CSSHexColor', () => {

    describe('constructor', () => {

        it('should throw an error when arguments don\'t have the same length', () => {
            expect(() => new CSSHexColor('A', 'AB', 'AB')).to.throw();
        });

        it('should throw an error when one or more arguments are not valid hex numbers', () => {
            expect(() => new CSSHexColor('AZ', 'AB', 'AB')).to.throw();
        });

        it('should resolve an undefined alpha to FF', () => {
            expect(new CSSHexColor('AF', 'AF', 'AF')).to.have.property('a', 'FF');
        });

        it('should resolve single digit components to their hex correspondent', () => {
            const color = new CSSHexColor('A', 'B', 'C');
            expect(color).to.have.property('r', 'AA');
            expect(color).to.have.property('g', 'BB');
            expect(color).to.have.property('b', 'CC');
            expect(color).to.have.property('a', 'FF');
        });

    });

    describe('#to()', () => {

        const color = new CSSHexColor('ad', 'e3', '7c');

        it('should convert to CSSRgbaColor', () => {
            expect(color.to('rgb'))
                .to.deep.equal(new CSSRgbaColor(173, 227, 124));
        });

        it('should convert to CSSHslaColor', () => {
            expect(color.to('hsl')).to.deep.equal(new CSSHslaColor(
                91,
                CSS.percent(65),
                CSS.percent(69),
            ));
        });

    });

    describe('#fromString()', () => {

        it('should construct from different hex types', () => {
            expect(CSSHexColor.fromString('#FF0000')).to.deep.equal(new CSSHexColor('FF', '00', '00'));
            expect(CSSHexColor.fromString('#f00')).to.deep.equal(new CSSHexColor('FF', '00', '00'));
            expect(CSSHexColor.fromString('#F00F')).to.deep.equal(new CSSHexColor('FF', '00', '00'));
            expect(CSSHexColor.fromString('#aBAbAB33')).to.deep.equal(new CSSHexColor('AB', 'AB', 'AB', '33'));
        });

    });

});

describe('CSSRgbaColor', () => {

    describe('constructor', () => {

        it('should throw an error when one or more arguments aren\'t neither numbers nor percentages', () => {
            expect(() => new CSSRgbaColor(200, CSS.px(40), 200)).to.throw();
        });

        it('should resolve an undefined alpha to 1', () => {
            expect(new CSSRgbaColor(38, 90, 51)).to.have.property('a', 1);
        });

    });

    describe('#to()', () => {

        const color = new CSSRgbaColor(255, 238, 240);

        it('should convert to CSSHexColor', () => {
            expect(color.to('hex'))
                .to.deep.equal(CSSHexColor.fromString('#ffeef0'));
        });

        it('should convert to CSSHslaColor', () => {
            expect(color.to('hsl')).to.deep.equal(new CSSHslaColor(
                353,
                CSS.percent(100),
                CSS.percent(97),
            ));
        });

    });

});

describe('CSSHslaColor', () => {

    describe('constructor', () => {

        it('should throw an error when argument h is not an angle', () => {
            expect(() => new CSSHslaColor(CSS.px(30), CSS.percent(3), CSS.percent(50))).to.throw();
        });

        it('should throw an error when arguments s and/or l is not a percentage', () => {
            expect(() => new CSSHslaColor(CSS.deg(3), CSS.px(30), CSS.percent(50))).to.throw();
        });

        it('should resolve an undefined alpha to 1', () => {
            expect(new CSSHslaColor(CSS.deg(3), CSS.percent(30), CSS.percent(50))).to.have.property('a', 1);
        });

    });

    describe('#to()', () => {

        const color = new CSSHslaColor(354, CSS.percent(66), CSS.percent(54));

        it('should convert to CSSHexColor', () => {
            expect(color.to('hex'))
                .to.deep.equal(CSSHexColor.fromString('#D73C4C'));
        });

        it('should convert to CSSRgbaColor', () => {
            expect(color.to('rgb')).to.deep.equal(new CSSRgbaColor(215, 60, 76));
        });

    });

});