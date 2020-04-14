import {expect} from 'chai';
import {CSSFontFamilyValue} from '../src/cssom/css-font-family-value';
import {CSSStringValue} from '../src/cssom/css-string-value';
import {CSSKeywordValue} from '../src/cssom/css-keyword-value';

describe('CSSFontFamilyValue', () => {

    describe('constructor', () => {

        it('should throw an error when no fonts are provided', () => {
            expect(() => new CSSFontFamilyValue([])).to.throw();
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSFontFamilyValue([
                new CSSStringValue('Open Sans'),
                new CSSKeywordValue('sans-serif'),
            ]).toString()).to.be.equal(`'Open Sans', sans-serif`);

        });

    });

});
