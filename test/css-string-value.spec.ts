import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSStringValue} from '../src/cssom/css-string-value';

describe('CSSStringValue', () => {

    describe('constructor', () => {

        it('should create a CSSStringValue from a string', () => {

            expect(new CSSStringValue('test').value).to.be.equal('test');

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSStringValue('test').toString()).to.be.equal('\'test\'');

        });

    });

});
