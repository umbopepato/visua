import {expect} from 'chai';
import {CSSTransformValue} from '../src/cssom/css-transform-value';
import {CSSTranslate} from '../src/cssom/css-translate';
import {CSS} from '../src/cssom/css';
import {CSSRotate} from '../src/cssom/css-rotate';
import {CSSSkew} from '../src/cssom/css-skew';


describe('CSSTransformValue', () => {

    let transformValue: CSSTransformValue;

    before(() => {
        transformValue = new CSSTransformValue([
            new CSSTranslate(CSS.px(10), CSS.px(20)),
            new CSSRotate(CSS.deg(20)),
        ]);
    });

    describe('#get()', () => {

        it('should get a transform component from the components list', () => {
            expect(transformValue.get(1)).to.be.deep.equal(new CSSRotate(CSS.deg(20)));
        });

    });

    describe('#append()', () => {

        it('should append a transform component to the components list', () => {
            let newComponent = new CSSSkew(CSS.deg(2), CSS.deg(3));
            expect(transformValue.append(newComponent)).to.be.equal(3);
        });

    });

    describe('#length()', () => {

        it('should return the length of the components list', () => {
            expect(transformValue.length).to.be.equal(3);
        });

    });

    describe('#is2D()', () => {

        it('should return true if all of the transform components are 2D, otherwise false', () => {
            expect(transformValue.is2D).to.be.equal(true);
        });

    });

    describe('#toMatrix()', () => {

        it('should convert all the components to matrix and multiply them', () => {
            expect(transformValue.toMatrix().toArray()).to.be.deep.equal([
                0.9217681046041427,
                0.3912673467897191,
                0,
                0,
                -0.30920535392210763,
                0.9516362273725186,
                0,
                0,
                0,
                0,
                1,
                0,
                10,
                20,
                0,
                1,
            ]);
        });

    });

});