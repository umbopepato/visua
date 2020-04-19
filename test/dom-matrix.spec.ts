import {expect} from 'chai';
import {DOMMatrix} from '../src/cssom/dom-matrix';

describe('DOMMatrix', () => {

    describe('constructor', () => {
        it('should throw an error if the provided sequence is not of length 6 or 16', () => {
            expect(() => new DOMMatrix([1, 1, 1])).to.throw();
        });
    });

    describe('#fromMatrix', () => {
        it('should create a DOMMatrix from a DOMMatrixInit object', () => {
            expect(DOMMatrix.fromMatrix({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
                .to.be.deep.equal(new DOMMatrix([1, 0, 0, 1, 0, 0]));
        });
    });

    describe('#multiplySelf()', () => {
        it('should postmultiply other to the current matrix', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .multiplySelf(new DOMMatrix([2, 2, 2, 2, 2, 2])))
                .to.be.deep.equal(new DOMMatrix([8, 12, 8, 12, 13, 18]));
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

    describe('#translateSelf()', () => {
        it('should translate the current matrix by tx, ty and tz', () => {
            expect(new DOMMatrix([1, 0, 0, 1, 0, 0])
                .preMultiplySelf(new DOMMatrix([1, 2, 3, 4, 5, 6])))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3, 4, 5, 6]));
        });
    });

    describe('#scaleSelf()', () => {
        it('should scale the current matrix by scaleX, scaleY and scaleZ around the origin', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .scaleSelf(1, 2, 3, 1, 1, 1))
                .to.be.deep.equal(new DOMMatrix([1, 2, 0, 0, 6, 8, 0, 0, 0, 0, 3, 0, 2, 2, -2, 1]));
        });
    });

    describe('#scale3dSelf()', () => {
        it('should scale the current matrix by scale around the origin', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .scale3dSelf(2, 1, 1, 1))
                .to.be.deep.equal(new DOMMatrix([2, 4, 0, 0, 6, 8, 0, 0, 0, 0, 2, 0, 1, 0, -1, 1]));
        });
    });

    describe('#rotateSelf()', () => {
        it('should rotate the current matrix by rotX, rotY and rotZ', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .rotateSelf(30))
                .to.be.deep.equal(new DOMMatrix([2.3660254037844384, 3.732050807568877, 2.098076211353316, 2.464101615137755, 5, 6]));
        });
    });

    describe('#rotateFromVectorSelf()', () => {
        it('should rotate the current matrix by the angle atan(y, x)', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .rotateFromVectorSelf(4, 7))
                .to.be.deep.equal(new DOMMatrix([3.1008683647302115, 4.465250445211504, 0.620173672946042, 0.24806946917841644, 5, 6]));
        });
    });

    describe('#rotateAxisAngleSelf()', () => {
        it('should rotate the current matrix by `angle` around the vector of components x, y, z', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .rotateAxisAngleSelf(1, 1, 1, 30))
                .to.be.deep.equal(new DOMMatrix([1.9106836025229592, 3.1547005383792515, -0.24401693585629242, 0, 2.488033871712585, 3.1547005383792515, 0.3333333333333333, 0, -0.3987174742355439, -0.30940107675850304, 0.9106836025229591, 0, 5, 6, 0, 1]));
        });
    });

    describe('#skewXSelf()', () => {
        it('should skew the current matrix by `sx`', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .skewXSelf(30))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3.5773502691896257, 5.1547005383792515, 5, 6]));
        });
    });

    describe('#skewYSelf()', () => {
        it('should skew the current matrix by `sy`', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .skewYSelf(30))
                .to.be.deep.equal(new DOMMatrix([2.7320508075688767, 4.309401076758503, 3, 4, 5, 6]));
        });
    });

    describe('#invertSelf()', () => {
        it('should invert the current matrix', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .invertSelf())
                .to.be.deep.equal(new DOMMatrix([-2, 1, 1.5, -0.5, 1, -2]));
        });
    });

});

describe('DOMMatrixReadonly', () => {


    describe('#isIdentity', () => {
        it('should return true if the matrix is an identity matrix', () => {
            expect(new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]).isIdentity).to.be.equal(true);
            expect(new DOMMatrix([1, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]).isIdentity).to.be.equal(false);
        });
    });

});
