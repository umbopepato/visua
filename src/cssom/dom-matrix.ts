import {toDeg, toRad} from '../util';

/**
 * An object representing a 2D transform matrix of the form
 * ```
 * | a c 0 e |
 * | b d 0 f |
 * | 0 0 1 0 |
 * | 0 0 0 1 |
 * ```
 * @link https://drafts.csswg.org/css-transforms-1/#MatrixDefined
 */
export interface DOMMatrix2DInit {
    a?: number;
    b?: number;
    c?: number;
    d?: number;
    e?: number;
    f?: number;
    m11?: number;
    m12?: number;
    m21?: number;
    m22?: number;
    m41?: number;
    m42?: number;
}

/**
 * An object representing a 3D transform matrix of the form
 * ```
 * | m11 m21 m31 m41 |
 * | m12 m22 m32 m42 |
 * | m13 m23 m33 m43 |
 * | m14 m24 m34 m44 |
 * ```
 * @link https://drafts.csswg.org/css-transforms-1/#mathematical-description
 */
export interface DOMMatrixInit extends DOMMatrix2DInit {
    m13?: number;
    m14?: number;
    m23?: number;
    m24?: number;
    m31?: number;
    m32?: number;
    m33?: number;
    m34?: number;
    m43?: number;
    m44?: number;
    is2D?: boolean;
}

/**
 * Represents a read-only 4x4 matrix, suitable for 2D and 3D
 * operations.
 */
export class DOMMatrixReadOnly implements DOMMatrixInit {

    readonly m11: number;
    readonly m12: number;
    readonly m13: number;
    readonly m14: number;
    readonly m21: number;
    readonly m22: number;
    readonly m23: number;
    readonly m24: number;
    readonly m31: number;
    readonly m32: number;
    readonly m33: number;
    readonly m34: number;
    readonly m41: number;
    readonly m42: number;
    readonly m43: number;
    readonly m44: number;

    /**
     * Alias for `m11`
     */
    get a(): number {
        return this.m11;
    }

    /**
     * Alias for `m12`
     */
    get b(): number {
        return this.m12;
    }

    /**
     * Alias for `m21`
     */
    get c(): number {
        return this.m21;
    }

    /**
     * Alias for `m22`
     */
    get d(): number {
        return this.m22;
    }

    /**
     * Alias for `m41`
     */
    get e(): number {
        return this.m41;
    }

    /**
     * Alias for `m42`
     */
    get f(): number {
        return this.m42;
    }

    /**
     * Returns `true` if this matrix
     * represents a 2D transform
     */
    get is2D(): boolean {
        return this.m13 === 0 &&
            this.m14 === 0 &&
            this.m23 === 0 &&
            this.m24 === 0 &&
            this.m31 === 0 &&
            this.m32 === 0 &&
            this.m33 === 1 &&
            this.m34 === 0 &&
            this.m43 === 0 &&
            this.m44 === 1;
    }

    /**
     * Returns true if this matrix is the identity matrix
     * ```
     * | 1 0 0 0 |
     * | 0 1 0 0 |
     * | 0 0 1 0 |
     * | 0 0 0 1 |
     * ```
     */
    get isIdentity(): boolean {
        for (let c = 1; c < 5; c++) {
            for (let r = 1; r < 5; r++) {
                const i = this[`m${c}${r}`];
                if ((c === r && i !== 1) || (c !== r && i !== 0)) return false;
            }
        }
        return true;
    }

    /**
     * Constructs a `DOMMatrixReadonly` from a sequence of either 6 (`a`-`f` 2D) or 16 numbers (`m11`-`m44` 3D)
     * @param sequence A sequence of either 6 or 16 numbers representing respectively the 2D matrix elements
     *     `a` to `f` or the 3D elements `m11` to `m44`
     */
    constructor(sequence: number[] = [1, 0, 0, 1, 0, 0]) {
        if (sequence.length != 6 && sequence.length != 16) {
            throw new RangeError('Failed to construct DOMMatrix: Expecting 6 or 16 entries in sequence');
        }
        for (let i = 0; i < sequence.length; i++) {
            if (typeof sequence[i] != 'number') {
                throw new TypeError(`Failed to construct DOMMatrix: Argument at index ${i} is not of type 'number'`);
            }
        }
        if (sequence.length == 6) {
            this.m11 = sequence[0];
            this.m12 = sequence[1];
            this.m13 = 0;
            this.m14 = 0;
            this.m21 = sequence[2];
            this.m22 = sequence[3];
            this.m23 = 0;
            this.m24 = 0;
            this.m31 = 0;
            this.m32 = 0;
            this.m33 = 1;
            this.m34 = 0;
            this.m41 = sequence[4];
            this.m42 = sequence[5];
            this.m43 = 0;
            this.m44 = 1;
        } else {
            this.m11 = sequence[0];
            this.m12 = sequence[1];
            this.m13 = sequence[2];
            this.m14 = sequence[3];
            this.m21 = sequence[4];
            this.m22 = sequence[5];
            this.m23 = sequence[6];
            this.m24 = sequence[7];
            this.m31 = sequence[8];
            this.m32 = sequence[9];
            this.m33 = sequence[10];
            this.m34 = sequence[11];
            this.m41 = sequence[12];
            this.m42 = sequence[13];
            this.m43 = sequence[14];
            this.m44 = sequence[15];
        }
    }

    /**
     * Creates a `DOMMatrixReadonly` from a `DOMMatrixInit` object
     * @param other A `DOMMatrixInit` object
     */
    static fromMatrix(other: DOMMatrixInit): DOMMatrixReadOnly {
        const els2D = [['a', 'm11'], ['b', 'm12'], ['c', 'm21'], ['d', 'm22'], ['e', 'm41'], ['f', 'm42']];
        const els3D = ['m13', 'm14', 'm23', 'm24', 'm31', 'm32', 'm33', 'm34', 'm43', 'm44'];
        if (els2D.some(([a, m]) => a in other && m in other && other[a] !== other[m] &&
            !(isNaN(other[a]) && isNaN(other[m])))) {
            throw new TypeError('Failed to execute \'fromMatrix\' on \'DOMMatrixReadOnly\': Property mismatch on matrix initialization.');
        }
        els2D.forEach(([a, m]) => {
            if (!(m in other)) other[m] = other[a] != null ? other[a] : Number(isOnDiagonal(m));
        });
        if (other.is2D != null && other.is2D && els3D.some(e => e in other && other[e] !== Number(isOnDiagonal(e)))) {
            throw new TypeError('Failed to execute \'fromMatrix\' on \'DOMMatrixReadOnly\': The is2D member is set to true but the input matrix is a 3d matrix.');
        }
        return new DOMMatrixReadOnly([
            other.m11,
            other.m12,
            other.m13,
            other.m14,
            other.m21,
            other.m22,
            other.m23,
            other.m24,
            other.m31,
            other.m32,
            other.m33,
            other.m34,
            other.m41,
            other.m42,
            other.m43,
            other.m44,
        ]);
    }

    /**
     * Returns a new `DOMMatrix` result of the translation of the current matrix by the vector (tx, ty, tz)
     * @param tx The x coordinate of the translation vector
     * @param ty The y coordinate of the translation vector
     * @param tz The z coordinate of the translation vector
     */
    translate(tx: number = 0, ty: number = 0, tz: number = 0): DOMMatrix {
        return new DOMMatrix(this).translateSelf(tx, ty, tz);
    }

    /**
     * Returns a new `DOMMatrix` result of the scaling of the current matrix by `scaleX`, `scaleY` and `scaleZ`
     * on each axis, centered on the given origin
     * @param scaleX The scaling factor on the x axis
     * @param scaleY The scaling factor on the y axis
     * @param scaleZ The scaling factor on the z axis
     * @param originX The x coordinate of the transform origin
     * @param originY The y coordinate of the transform origin
     * @param originZ The z coordinate of the transform origin
     */
    scale(scaleX: number = 1, scaleY?: number, scaleZ: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        return new DOMMatrix(this).scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
    }

    /**
     * Returns a new `DOMMatrix` result of the scaling of the current matrix `scaleX`, `scaleY` on the
     * respective axes
     * @param scaleX The scaling factor on the x axis
     * @param scaleY The scaling factor on the y axis
     */
    scaleNonUniform(scaleX: number = 1, scaleY: number = 1): DOMMatrix {
        return new DOMMatrix(this).scaleSelf(scaleX, scaleY, 1, 0, 0, 0);
    }

    /**
     * Returns a new `DOMMatrix` result of the scaling of the current matrix by `scale` on all the axes
     * centered in the given origin
     * @param scale The scaling factor
     * @param originX The x coordinate of the transform origin
     * @param originY The y coordinate of the transform origin
     * @param originZ The z coordinate of the transform origin
     */
    scale3d(scale: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        return new DOMMatrix(this).scale3dSelf(scale, originX, originY, originZ);
    }

    /**
     * Returns a new `DOMMatrix` result of the rotation of the current matrix by `rotX`, `rotY` and `rotZ`
     * around each of its axes
     * @param rotX The rotation angle on the x axis
     * @param rotY The rotation angle on the y axis
     * @param rotZ The rotation angle on the z axis
     */
    rotate(rotX: number = 0, rotY?: number, rotZ?: number): DOMMatrix {
        return new DOMMatrix(this).rotateSelf(rotX, rotY, rotZ);
    }

    /**
     * Returns a new `DOMMatrix` result of the rotation of the current matrix by the angle between the
     * specified vector and (1, 0)
     * @param x The x coordinate of the vector
     * @param y The y coordinate of the vector
     */
    rotateFromVector(x: number = 0, y: number = 0): DOMMatrix {
        return new DOMMatrix(this).rotateFromVectorSelf(x, y);
    }

    /**
     * Returns a new `DOMMatrix` result of the rotation of the current matrix by `angle` around the
     * given vector
     * @param x The x coordinate of the vector
     * @param y The y coordinate of the vector
     * @param z The z coordinate of the vector
     * @param angle The angle of rotation
     */
    rotateAxisAngle(x: number = 0, y: number = 0, z: number = 0, angle: number = 0): DOMMatrix {
        return new DOMMatrix(this).rotateAxisAngleSelf(x, y, z, angle);
    }

    /**
     * Returns a new `DOMMatrix` result of the skew of the current matrix on the x axis by the amount `sx`
     * @param sx
     */
    skewX(sx: number = 0): DOMMatrix {
        return new DOMMatrix(this).skewXSelf(sx);
    }

    /**
     * Returns a new `DOMMatrix` result of the skew of the current matrix on the y axis by the amount `sy`
     * @param sy
     */
    skewY(sy: number = 0): DOMMatrix {
        return new DOMMatrix(this).skewYSelf(sy);
    }

    /**
     * Returns a new `DOMMatrix` result of the dot product between the current matrix and `other`
     * @param other The matrix to be post-multiplied
     */
    multiply(other: DOMMatrix): DOMMatrix {
        return new DOMMatrix(this).multiplySelf(other);
    }

    /**
     * Returns a new `DOMMatrix` result of the flip of the current matrix on the x axis
     */
    flipX(): DOMMatrix {
        return new DOMMatrix(this).multiplySelf(new DOMMatrix([-1, 0, 0, 1, 0, 0]));
    }

    /**
     * Returns a new `DOMMatrix` result of the flip of the current matrix on the y axis
     */
    flipY(): DOMMatrix {
        return new DOMMatrix(this).multiplySelf(new DOMMatrix([1, 0, 0, -1, 0, 0]));
    }

    /**
     * Returns a new `DOMMatrix` result of inversion of the current matrix. If the matrix
     * cannot be inverted all the components are set to `NaN`
     */
    inverse(): DOMMatrix {
        return new DOMMatrix(this).invertSelf();
    }

    /**
     * Returns an array containing all the components of the 4x4 matrix in column-major order
     */
    toArray(): number[] {
        return [
            this.m11,
            this.m12,
            this.m13,
            this.m14,
            this.m21,
            this.m22,
            this.m23,
            this.m24,
            this.m31,
            this.m32,
            this.m33,
            this.m34,
            this.m41,
            this.m42,
            this.m43,
            this.m44,
        ];
    }

    /**
     * Serializes the matrix to CSS
     */
    toString(): string {
        return this.is2D
            ? `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`
            : `matrix3d(${[this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m41, this.m42, this.m43, this.m44].join(', ')})`;
    }

    protected get determinant(): number {
        if (this.is2D) return this.a * this.d - this.b * this.c;
        return determinant(this.matrix);
    }

    protected get matrix(): number[][] {
        return [
            [this.m11, this.m21, this.m31, this.m41],
            [this.m12, this.m22, this.m32, this.m42],
            [this.m13, this.m23, this.m33, this.m43],
            [this.m14, this.m24, this.m34, this.m44],
        ];
    }

    protected set matrix(value: number[][]) {
        if (value.length !== 4 && value[0].length !== 4) return;
        value.forEach((row, ri) => row.forEach((re, ci) => this[`m${ci}${ri}`] = re));
    }
}

export class DOMMatrix extends DOMMatrixReadOnly {

    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m21: number;
    m22: number;
    m23: number;
    m24: number;
    m31: number;
    m32: number;
    m33: number;
    m34: number;
    m41: number;
    m42: number;
    m43: number;
    m44: number;

    set a(value: number) {
        this.m11 = value;
    }

    set b(value: number) {
        this.m12 = value;
    }

    set c(value: number) {
        this.m21 = value;
    }

    set d(value: number) {
        this.m22 = value;
    }

    set e(value: number) {
        this.m41 = value;
    }

    set f(value: number) {
        this.m42 = value;
    }

    /**
     * Constructs a `DOMMatrix` from a sequence of numbers (see {@link DOMMatrixReadOnly.constructor})
     * or from a `DOMMatrixReadonly`
     * @param init A sequence of 6 or 16 numbers or a `DOMMatrixReadonly`
     */
    constructor(init?: number[] | DOMMatrixReadOnly) {
        if (!init) {
            super();
        } else if (init instanceof DOMMatrixReadOnly) {
            super(init.toArray());
        } else {
            super(init);
        }
    }

    /**
     * Creates a `DOMMatrix` from a `DOMMatrixInit` object
     * @param other A `DOMMatrixInit` object
     */
    static fromMatrix(other: DOMMatrixInit) {
        return new DOMMatrix(DOMMatrixReadOnly.fromMatrix(other));
    }

    /**
     * Post-multiplies `other` to the current matrix
     * @param other The matrix to be post-multiplied
     */
    multiplySelf(other: DOMMatrix): DOMMatrix {
        let origThis = new DOMMatrix(this);
        for (let c = 1; c < 5; c++) {
            for (let r = 1; r < 5; r++) {
                this[`m${c}${r}`] = [1, 2, 3, 4]
                    .map(i => origThis[`m${i}${r}`] * other[`m${c}${i}`])
                    .reduce((a, v) => a + v);
            }
        }
        return this;
    }

    /**
     * Pre-multiplies the current matrix by `other`
     * @param other The matrix to be pre-multiplied
     */
    preMultiplySelf(other: DOMMatrix): DOMMatrix {
        return other.multiply(this);
    }

    /**
     * Translates the current matrix by the vector (tx, ty, tz)
     * @param tx The x coordinate of the translation vector
     * @param ty The y coordinate of the translation vector
     * @param tz The z coordinate of the translation vector
     */
    translateSelf(tx: number = 0, ty: number = 0, tz: number = 0): DOMMatrix {
        this.multiplySelf(new DOMMatrix([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1
        ]));
        return this;
    }

    /**
     * Scales the current matrix by `scaleX`, `scaleY` and `scaleZ` on the respective axes respect to the
     * given origin
     * @param scaleX The scaling factor on the x axis
     * @param scaleY The scaling factor on the y axis
     * @param scaleZ The scaling factor on the z axis
     * @param originX The x coordinate of the transform origin
     * @param originY The y coordinate of the transform origin
     * @param originZ The z coordinate of the transform origin
     */
    scaleSelf(scaleX: number = 1, scaleY?: number, scaleZ: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        if (scaleY == null) { // noinspection JSSuspiciousNameCombination
            scaleY = scaleX;
        }
        this.multiplySelf(new DOMMatrix([
            scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, scaleZ, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY, -originZ);
        return this;
    }

    /**
     * Scales the current matrix along all its axes by the factor `scale`
     * @param scale The scaling factor
     * @param originX The x coordinate of the transform origin
     * @param originY The y coordinate of the transform origin
     * @param originZ The z coordinate of the transform origin
     */
    scale3dSelf(scale: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        this.translateSelf(originX, originY, originZ);
        this.multiplySelf(new DOMMatrix([
            scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY, -originZ);
        this.rotateSelf(1, 2);
        return this;
    }

    /**
     * Rotates the current matrix by `angle` around the z axis
     * @param angle The angle of rotation, in degrees
     */
    rotateSelf(angle: number): DOMMatrix;

    /**
     * Rotates the current matrix around the x and y axes
     * respectively by `rotX` and `rotY`
     * @param rotX The angle of rotation on the x axis, in degrees
     * @param rotY The angle of rotation on the y axis, in degrees
     */
    rotateSelf(rotX: number, rotY: number): DOMMatrix;

    /**
     * Rotates the current matrix around the x, y and z axes
     * respectively by `rotX`, `rotY` and `rotZ`
     * @param rotX The angle of rotation on the x axis, in degrees
     * @param rotY The angle of rotation on the y axis, in degrees
     * @param rotZ The angle of rotation on the z axis, in degrees
     */
    rotateSelf(rotX: number, rotY: number, rotZ: number): DOMMatrix;
    rotateSelf(rotX: number = 0, rotY?: number, rotZ?: number): DOMMatrix {
        if (rotY == null && rotZ == null) {
            rotZ = rotX;
            rotX = rotY = 0;
        }
        if (rotY == null) rotY = 0;
        if (rotZ == null) rotZ = 0;
        if (rotZ) this.rotateAxisAngleSelf(0, 0, 1, rotZ);
        if (rotY) this.rotateAxisAngleSelf(0, 1, 0, rotY);
        if (rotX) this.rotateAxisAngleSelf(1, 0, 0, rotX);
        return this;
    }

    /**
     * Rotates the current matrix by the angle of the direction
     * of the vector (x, y)
     * @param x The x coordinate of the vector
     * @param y The y coordinate of the vector
     */
    rotateFromVectorSelf(x: number = 0, y: number = 0): DOMMatrix {
        this.rotateAxisAngleSelf(0, 0, 1, toDeg(Math.atan2(y, x)));
        return this;
    }

    /**
     * Rotates the current matrix by `angle` around the vector
     * of components `x`, `y` and `z`
     * @link https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
     * @param x The x component of the axis
     * @param y The y component of the axis
     * @param z The z component of the axis
     * @param angle The angle of rotation in degrees
     */
    rotateAxisAngleSelf(x: number = 0, y: number = 0, z: number = 0, angle: number = 0): DOMMatrix {
        if (angle === 0) return this;
        const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        if (length === 0) return this;
        angle = toRad(angle);
        x /= length;
        y /= length;
        z /= length;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const ocos = 1 - cos;
        this.multiplySelf(new DOMMatrix([
            cos + x ** 2 * ocos,
            y * x * ocos + z * sin,
            z * x * ocos - y * sin,
            0,
            x * y * ocos - z * sin,
            cos + y ** 2 * ocos,
            z * y * ocos + x * sin,
            0,
            x * z * ocos + y * sin,
            y * z * ocos - x * sin,
            cos + z ** 2 * ocos,
            0,
            0, 0, 0, 1,
        ]));
        return this;
    }

    /**
     * Skews the current matrix by `sx` on the x axis
     * @param sx
     */
    skewXSelf(sx: number = 0): DOMMatrix {
        if (sx === 0) return this;
        this.multiplySelf(new DOMMatrix([
            1, 0, 0, 0, Math.tan(toRad(sx)), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]));
        return this;
    }

    /**
     * Skews the current matrix by `sy` on the y axis
     * @param sy
     */
    skewYSelf(sy: number = 0): DOMMatrix {
        if (sy === 0) return this;
        this.multiplySelf(new DOMMatrix([
            1, Math.tan(toRad(sy)), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]));
        return this;
    }

    /**
     * Inverts the current matrix. If the matrix is not invertible all the components
     * are set to `NaN`
     */
    invertSelf(): DOMMatrix {
        const det = this.determinant;
        if (det === 0) {
            for (let c = 1; c < 5; c++) for (let r = 1; r < 5; r++) {
                this[`m${c}${r}`] = NaN;
            }
            return this;
        }
        const a = this.a, b = this.b, c = this.c, d = this.d, e = this.e, f = this.f;
        if (this.is2D) {
            this.a = d / det;
            this.b = -b / det;
            this.c = -c / det;
            this.d = a / det;
            this.e = (c * f - d * e) / det;
            this.f = (b * e - a * f) / det;
            return this;
        } else {
            this.matrix = inverse(this.matrix);
        }
    }

}

const isOnDiagonal = (matrixElementName: string) => matrixElementName.match(/(\d)\1/) != null;

const determinant = (m: number[][]) =>
    m.length == 1 ?
        m[0][0] :
        m.length == 2 ?
            m[0][0] * m[1][1] - m[0][1] * m[1][0] :
            m[0].reduce((r, e, i) =>
                r + (-1) ** (i + 2) * e * determinant(m.slice(1).map(c =>
                    c.filter((_, j) => i != j))), 0);

const inverse = (m: number[][]) => {
    const dim = m.length;
    if (dim !== m[0].length) return;
    let i = 0, ii = 0, j = 0, e = 0, t = 0;
    const ident = identity(m.length), orig = clone(m);
    for (i = 0; i < dim; i += 1) {
        e = orig[i][i];
        if (e == 0) {
            for (ii = i + 1; ii < dim; ii += 1) {
                if (orig[ii][i] != 0) {
                    for (j = 0; j < dim; j++) {
                        e = orig[i][j];
                        orig[i][j] = orig[ii][j];
                        orig[ii][j] = e;
                        e = ident[i][j];
                        ident[i][j] = ident[ii][j];
                        ident[ii][j] = e;
                    }
                    break;
                }
            }
            e = orig[i][i];
        }
        for (j = 0; j < dim; j++) {
            orig[i][j] = orig[i][j] / e;
            ident[i][j] = ident[i][j] / e;
        }
        for (ii = 0; ii < dim; ii++) {
            if (ii == i) continue;
            e = orig[ii][i];
            for (j = 0; j < dim; j++) {
                orig[ii][j] -= e * orig[i][j];
                ident[ii][j] -= e * ident[i][j];
            }
        }
    }
    return ident;
};

const identity = (l: number) =>
    // @ts-ignore
    Array(l).fill().map((_, r) => Array(l).fill().map((_, c) => Number(r === c)));

const clone = (m: number[][]) => [...m].map(r => [...r]);
