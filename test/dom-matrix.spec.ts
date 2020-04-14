import {expect} from 'chai';
import {DOMMatrix} from '../src/cssom/dom-matrix';

describe('DOMMatrix', () => {

    describe('constructor', () => {
        it('should throw an error if the provided sequence is not of length 6 or 16', () => {
            expect(() => new DOMMatrix([1, 1, 1])).to.throw();
        });
    });

    describe('#multiplySelf()', () => {
        it('should postmultiply other to the current matrix', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .multiplySelf(new DOMMatrix([1, 0, 0, 1, 0, 0])))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3, 4, 5, 6]));
        });
    });

    describe('#preMultiplySelf()', () => {
        it('should premultiply other to the current matrix', () => {
            expect(new DOMMatrix([1, 0, 0, 1, 0, 0])
                .preMultiplySelf(new DOMMatrix([1, 2, 3, 4, 5, 6])))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3, 4, 5, 6]));
        });
    });

    describe('#translateSelf()', () => {
        it('should translate the current matrix by tx, ty and tz', () => {
            expect(new DOMMatrix([1, 0, 0, 1, 0, 0])
                .preMultiplySelf(new DOMMatrix([1, 2, 3, 4, 5, 6])))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3, 4, 5, 6]));
        });
    });

});
