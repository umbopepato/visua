import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSHexColor} from '../src/cssom/css-color-value';
import {CSSBoxShadowValue, CSSShadow} from '../src/cssom/css-box-shadow-value';

describe('CSSShadow', () => {

    describe('constructor', () => {

        it('should throw an error when a negative blurRadius is provided', () => {
            expect(() => new CSSShadow({
                blurRadius: CSS.px(-2),
                offsetX: CSS.px(2),
                offsetY: CSS.px(2),
                color: new CSSHexColor('00', '00', '00'),
            }));
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSShadow({
                color: new CSSHexColor('00', '00', '00'),
                offsetX: CSS.px(2),
                offsetY: CSS.px(2),
            }).toString()).to.be.equal('2px 2px #000000');

        });

    });

});

describe('CSSBoxShadowValue', () => {

    describe('constructor', () => {

        it('should throw an error if no layers are provided', () => {
            expect(() => new CSSBoxShadowValue([])).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSBoxShadowValue([
                new CSSShadow({
                    color: new CSSHexColor('00', '00', '00'),
                    offsetX: CSS.px(2),
                    offsetY: CSS.px(2),
                }),
            ]).toString()).to.be.equal('2px 2px #000000');

        });

    });

});
