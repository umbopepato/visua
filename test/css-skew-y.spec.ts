import {expect} from 'chai';
import {CSS} from '../src/css';
import {CSSSkewY} from '../src/css-skew-y';

describe('CSSSkewY', () => {

    describe('constructor', () => {

        it('should throw an error if `ax` is not of type <angle>', () => {
            expect(() => new CSSSkewY(CSS.px(16))).to.throw();
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSSkew to its associated matrix', () => {
            expect(new CSSSkewY(CSS.rad(1))
                .toMatrix()
                .toArray()).to.be.deep.equal([
                1,
                1.5574077246549023,
                0,
                0,
                0,
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
