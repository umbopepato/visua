import {expect} from 'chai';
import {DOMMatrix, DOMMatrixReadOnly} from '../src/cssom/dom-matrix';

describe('DOMMatrix', () => {

    describe('constructor', () => {
        it('should construct a DOMMatrix from a sequence of another matrix', () => {
            expect(new DOMMatrix(new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6])))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3, 4, 5, 6]));
        });
    });

    describe('#fromMatrix', () => {
        it('should create a DOMMatrix from a DOMMatrixInit object', () => {
            expect(DOMMatrix.fromMatrix({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
                .to.be.deep.equal(new DOMMatrix([1, 0, 0, 1, 0, 0]));
        });
    });

});

describe('DOMMatrixReadonly', () => {

    describe('constructor', () => {
        it('should throw an error if the provided sequence is not of length 6 or 16', () => {
            expect(() => new DOMMatrixReadOnly([1, 1, 1])).to.throw();
        });
    });

    describe('#is2D', () => {
        it('should return true if the matrix represents a 2D transform', () => {
            expect(new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6]).is2D).to.be.equal(true);
            expect(new DOMMatrixReadOnly([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).is2D).to.be.equal(false);
        });
    });

    describe('#isIdentity', () => {
        it('should return true if the matrix is an identity matrix', () => {
            expect(new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]).isIdentity).to.be.equal(true);
            expect(new DOMMatrixReadOnly([1, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]).isIdentity).to.be.equal(false);
        });
    });

    describe('#multiply()', () => {
        it('should postmultiply other to the current matrix', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .multiply(new DOMMatrix([2, 2, 2, 2, 2, 2])))
                .to.be.deep.equal(new DOMMatrix([8, 12, 8, 12, 13, 18]));
        });
    });

    describe('#translate()', () => {
        it('should translate the current matrix by tx, ty and tz', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .translate(1, 2))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3, 4, 12, 16]));
        });
    });

    describe('#scale()', () => {
        it('should scale the current matrix by scaleX, scaleY and scaleZ around the origin', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .scale(1, 2, 3, 1, 1, 1))
                .to.be.deep.equal(new DOMMatrix([1, 2, 0, 0, 6, 8, 0, 0, 0, 0, 3, 0, 2, 2, -2, 1]));
        });
    });

    describe('#scaleNonUniform()', () => {
        it('should scale the current matrix by scaleX, scaleY and scaleZ around the origin', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .scaleNonUniform(2, 3))
                .to.be.deep.equal(new DOMMatrix([2, 4, 9, 12, 5, 6]));
        });
    });

    describe('#scale3d()', () => {
        it('should scale the current matrix by scale around the origin', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .scale3d(2, 1, 1, 1))
                .to.be.deep.equal(new DOMMatrix([2, 4, 0, 0, 6, 8, 0, 0, 0, 0, 2, 0, 1, 0, -1, 1]));
        });
    });

    describe('#rotate()', () => {
        it('should rotate the current matrix by rotX, rotY and rotZ', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .rotate(30))
                .to.be.deep.equal(new DOMMatrix([2.3660254037844384, 3.732050807568877, 2.098076211353316, 2.464101615137755, 5, 6]));
        });
    });

    describe('#rotateFromVector()', () => {
        it('should rotate the current matrix by the angle atan(y, x)', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .rotateFromVector(4, 7))
                .to.be.deep.equal(new DOMMatrix([3.1008683647302115, 4.465250445211504, 0.620173672946042, 0.24806946917841644, 5, 6]));
        });
    });

    describe('#rotateAxisAngle()', () => {
        it('should rotate the current matrix by `angle` around the vector of components x, y, z', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .rotateAxisAngle(1, 1, 1, 30))
                .to.be.deep.equal(new DOMMatrix([1.9106836025229592, 3.1547005383792515, -0.24401693585629242, 0, 2.488033871712585, 3.1547005383792515, 0.3333333333333333, 0, -0.3987174742355439, -0.30940107675850304, 0.9106836025229591, 0, 5, 6, 0, 1]));
        });
    });

    describe('#skewX()', () => {
        it('should skew the current matrix by `sx`', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .skewX(30))
                .to.be.deep.equal(new DOMMatrix([1, 2, 3.5773502691896257, 5.1547005383792515, 5, 6]));
        });
    });

    describe('#skewY()', () => {
        it('should skew the current matrix by `sy`', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .skewY(30))
                .to.be.deep.equal(new DOMMatrix([2.732050807568877, 4.309401076758503, 3, 4, 5, 6]));
        });
    });

    describe('#invert()', () => {
        it('should invert the current matrix', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .inverse())
                .to.be.deep.equal(new DOMMatrix([-2, 1, 1.5, -0.5, 1, -2]));
        });
    });

    describe('#toArray()', () => {
        it('should convert the current matrix to an array', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .toArray())
                .to.be.equal([1, 2, 0, 0, 3, 4, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1]);
        });
    });

    describe('#toString()', () => {
        it('should serialize the current matrix to css', () => {
            expect(new DOMMatrix([1, 2, 3, 4, 5, 6])
                .toString())
                .to.be.equal('matrix(1, 2, 3, 4, 5, 6)');
        });
    });

});
