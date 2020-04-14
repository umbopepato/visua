import {expect} from 'chai';
import {CSSKeywordsValue, CSSKeywordValue} from '../src/cssom/css-keyword-value';

describe('CSSKeywordValue', () => {

    describe('constructor', () => {

        it('should create a CSSKeywordValue from a string', () => {
            expect(new CSSKeywordValue('test').value).to.be.equal('test');
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSKeywordValue('test').toString()).to.be.equal('test');

        });

    });

});

describe('CSSKeywordsValue', () => {

    describe('constructor', () => {

        it('should create a CSSKeywordsValue from an array of keywords', () => {
            expect(new CSSKeywordsValue([
                new CSSKeywordValue('test'),
                new CSSKeywordValue('keywords'),
            ]));
        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSKeywordsValue([
                new CSSKeywordValue('test'),
                new CSSKeywordValue('keywords'),
            ]).toString()).to.be.equal('test keywords');

        });

    });

});
