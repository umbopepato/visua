import {expect} from 'chai';
import {CSSRotate} from '../src/cssom/css-rotate';
import {CSS} from '../src/cssom/css';

describe('CSSRotate', () => {

    describe('constructor', () => {

        it('should throw an error if `angle` is not an angle', () => {
            expect(() => new CSSRotate(CSS.px(20))).to.throw();
        });

        it('should throw an error if `x`, `y` or `z` are not numbers', () => {
            expect(() => new CSSRotate(CSS.deg(20), CSS.px(2), CSS.px(2), CSS.px(2))).to.throw();
        });

    });

    describe('#is2D()', () => {

        it('should return true if the rotation is 2D, otherwise false', () => {
            expect(new CSSRotate(CSS.deg(35)).is2D).to.be.equal(true);
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSRotate to its associated matrix', () => {
            expect(new CSSRotate(CSS.deg(24))
                .toMatrix()
                .toArray()).to.be.deep.equal([
                    0.9135454576426009,
                    0.4067366430758002,
                    0,
                    0,
                    -0.4067366430758002,
                    0.9135454576426009,
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