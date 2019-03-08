import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSSkewX} from '../src/cssom/css-skew-x';

describe('CSSSkewX', () => {

    describe('constructor', () => {

        it('should throw an error if `ax` is not of type <angle>', () => {
            expect(() => new CSSSkewX(CSS.px(16))).to.throw();
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSSkew to its associated matrix', () => {
            expect(new CSSSkewX(CSS.rad(1))
                .toMatrix()
                .toArray()).to.be.deep.equal([
                1,
                0,
                0,
                0,
                1.5574077246549023,
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
