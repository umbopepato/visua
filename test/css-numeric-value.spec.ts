import {expect} from 'chai';
import {CSS} from '../src/css';
import {CSSNumericValue} from '../src/css-numeric-value';

describe('CSSNumericValue', () => {

    describe('#add()', () => {

        it('should add CSSUnitValue\'s with the same unit', () => {
            expect(CSS.px(12).add(CSS.px(12))).to.be.deep.equal(CSS.px(24));
            expect(CSS.cm(5).add(CSS.cm(5)).add(CSS.cm(5))).to.be.deep.equal(CSS.cm(15));
        });

    });

    describe('#sub()', () => {

        it('should subtract CSSUnitValue\'s with the same unit', () => {
            expect(CSS.px(12).sub(CSS.px(12))).to.be.deep.equal(CSS.px(0));
            expect(CSS.cm(15).sub(CSS.cm(5), CSS.cm(3.5)).sub(CSS.cm(1.5))).to.be.deep.equal(CSS.cm(5));
        });

    });

    describe('#mul()', () => {

        it('should throw an error when trying to simplify a product with power > 1', () => {
            expect(() => CSS.px(12).mul(CSS.px(12)).to('px')).to.throw();
        });

        it('should create a CSSUnitValue from a product between unit and number', () => {
            expect(CSS.px(12).mul(2)).to.be.deep.equal(CSS.px(24));
        });

    });

    describe('#div()', () => {

        it('should create a CSSUnitValue from the division between unit and number', () => {
            expect(CSS.mm(30).div(2).to('mm')).to.be.deep.equal(CSS.mm(15));
        });

    });

    describe('#min()', () => {

        it('should create a CSSUnitValue from the minimum value provided', () => {
            expect(CSS.mm(30).min(CSS.mm(15), CSS.mm(2))).to.be.deep.equal(CSS.mm(2));
        });

    });

    describe('#max()', () => {

        it('should create a CSSUnitValue from the maximum value provided', () => {
            expect(CSS.mm(30).max(CSS.mm(15), CSS.mm(2))).to.be.deep.equal(CSS.mm(30));
        });

    });

    describe('#to()', () => {

        it('should convert CSSUnitValue\'s with compatible units', () => {
            expect(CSS.px(10).to('cm').value).to.be.approximately(0.264583333, 0.000001);
        });

    });

    describe('#equals()', () => {

        it('should return true if the CSSUnitValue\'s are equal', () => {
            expect(CSS.ch(15).equals(CSS.ch(15.0))).to.be.equal(true);
        });

    });

    describe('#solve()', () => {

        it('should solve a CSSMathValue when possible', () => {
            expect(CSS.px(15).add(CSS.em(5)).solve()).to.be.deep.equal(CSS.px(20));
        });

    });

    describe('#rectifyNumberishValue()', () => {

        it('should rectify a numberish value', () => {
            expect(CSSNumericValue.rectifyNumberishValue(2)).to.be.deep.equal(CSS.number(2));
        });

    });

});