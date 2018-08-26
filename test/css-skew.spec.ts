import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSSkew} from '../src/cssom/css-skew';

describe('CSSSkew', () => {

    describe('constructor', () => {

        it('should throw an error if `ax` or `ay` are not of type <angle>', () => {
            expect(() => new CSSSkew(CSS.px(15), CSS.deg(20))).to.throw();
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSSkew to its associated matrix', () => {
            expect(new CSSSkew(CSS.deg(15), CSS.rad(1))
                .toMatrix()
                .toArray()).to.be.deep.equal([
                1,
                1.5574077246549023,
                0,
                0,
                0.2679491924311227,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
            ]);
        });

    });

});

