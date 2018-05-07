import {expect} from 'chai';
import {CSS} from '../src/css';

describe('CSSColorValue', () => {

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

        it('should multiply CSSUnitValue\'s with the same unit', () => {
            expect(CSS.px(12).mul(CSS.px(12)).to('px')).to.be.deep.equal(CSS.px(144));
            expect(CSS.cm(2).mul(CSS.cm(3), CSS.cm(2)).mul(CSS.cm(3)).to('cm')).to.be.deep.equal(CSS.cm(36));
        });

    });

    describe('#to()', () => {

        it('should convert CSSUnitValue\'s with compatible units', function () {
            expect(CSS.px(10).to('cm').value).to.be.approximately(0.264583333, 0.000001);
        });

    });

});