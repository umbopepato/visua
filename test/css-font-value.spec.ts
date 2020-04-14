import {expect} from 'chai';
import {CSSFontFamilyValue} from '../src/cssom/css-font-family-value';
import {CSSStringValue} from '../src/cssom/css-string-value';
import {CSSKeywordValue} from '../src/cssom/css-keyword-value';
import {CSSFontValue, CSSSystemFontValue} from '../src/cssom/css-font-value';
import {CSS} from '../src/cssom/css';

describe('CSSFontValue', () => {

    describe('constructor', () => {

        it('should create a CSSFontValue from its components', () => {
            expect(() => new CSSFontValue({
                family: new CSSFontFamilyValue([
                    new CSSStringValue('Open Sans'),
                    new CSSKeywordValue('sans-serif'),
                ]),
                size: CSS.em(1),
            }));
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSFontValue({
                family: new CSSFontFamilyValue([
                    new CSSStringValue('Open Sans'),
                    new CSSKeywordValue('sans-serif'),
                ]),
                size: CSS.em(1),
            }).toString()).to.be.equal(`normal normal normal normal 1em/normal 'Open Sans', sans-serif`);

        });

    });

});

describe('CSSSystemFontValue', () => {

    describe('constructor', () => {

        it('should throw an error if no font keyword is provided', () => {
            expect(() => new CSSSystemFontValue(null)).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSSystemFontValue('small-caption').toString())
                .to.be.equal('small-caption');

        });

    });

});
