import {expect} from 'chai';
import {CSS} from '../src/cssom/css';
import {CSSTranslate} from '../src/cssom/css-translate';

describe('CSSTranslate', () => {

    describe('constructor', () => {

        it('should throw an error if `x`, `y` or `z` are not of type <length-percentage>', () => {
            expect(() => new CSSTranslate(CSS.px(5), CSS.Hz(3))).to.throw();
        });

    });

    describe('#toMatrix()', () => {

        it('should convert the CSSSkew to its associated matrix', () => {
            expect(new CSSTranslate(CSS.px(34), CSS.px(22))
                .toMatrix()
                .toArray()).to.be.deep.equal([
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
                0,
                34,
                22,
                0,
                1,
            ]);
        });

    });

});
