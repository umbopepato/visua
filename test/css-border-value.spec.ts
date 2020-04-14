import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSBorderValue} from '../src/cssom/css-border-value';
import {CSSKeywordValue} from '../src/cssom/css-keyword-value';
import {CSSHexColor} from '../src/cssom/css-color-value';

describe('CSSBorderValue', () => {

    describe('constructor', () => {

        it('should throw an error when a negative lineWidth is provided', () => {
            expect(() => new CSSBorderValue({
                lineWidth: CSS.px(-2),
                lineStyle: new CSSKeywordValue('solid'),
                color: new CSSHexColor('FF', 'FF', 'FF'),
            })).to.throw();
        });

        it('should throw an error when `lineStyle` or `color` are not provided', () => {
            // @ts-ignore
            expect(() => new CSSBorderValue({
                lineWidth: CSS.px(-2),
                color: new CSSHexColor('FF', 'FF', 'FF'),
            }));
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSBorderValue({
                lineWidth: CSS.px(1),
                lineStyle: new CSSKeywordValue('solid'),
                color: new CSSHexColor('FF', 'FF', 'FF'),
            }).toString()).to.be.equal('1px solid #FFFFFF');

        });

    });

});
