import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSScale} from '../src/cssom/css-scale';

describe('CSSScale', () => {

    describe('constructor', () => {

        it('should throw an error if `x`, `y` or `z` are not of type <number>', function () {
            expect(() => new CSSScale(CSS.px(2), CSS.cm(3))).to.throw();
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSScale to its associated matrix', () => {
            expect(new CSSScale(15, 20, 30)
                .toMatrix()
                .toArray()).to.be.deep.equal([15, 0, 0, 0, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1]);
        });

    });

    describe('#is2D()', () => {

        it('should return true if the CSSScale is 2d, otherwise false', () => {
            expect(new CSSScale(15, 20, 30).is2D).to.be.equal(false);
        });

    });

});