import {expect} from 'chai';
import {CSS} from '../src/css';
import {CSSPerspective} from '../src/css-perspective';

describe('CSSPerspective', () => {

    describe('constructor', () => {

        it('should throw an error if length is not of type <length>', () => {
            expect(() => new CSSPerspective(CSS.deg(2))).to.throw();
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSPerspective to its associated matrix', () => {
            expect(new CSSPerspective(CSS.px(15)).toMatrix().toArray()).to.be.deep.equal([
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
                -0.06666666666666667,
                0,
                0,
                0,
                1,
            ]);
        });

    });

});