import {expect} from 'chai';
import {CSSUrlValue} from '../src/cssom/css-url-value';

describe('CSSUrlValue', () => {

    describe('constructor', () => {

        it('should create a CSSUrlValue string url', () => {

            expect(new CSSUrlValue('./path/to/file.ext'));

        });

    });

    describe('#isRemote()', () => {

        it('should return true if the url is remote', () => {

            expect(new CSSUrlValue('http://example.com/file.ext').isRemote)
                .to.be.equal(true);

        });

    });

    describe('#toString()', () => {

        it('should seriaize to CSS', () => {

            expect(new CSSUrlValue('./path/to/file.ext').toString())
                .to.be.equal(`url(./path/to/file.ext)`);

        });

    });

});
