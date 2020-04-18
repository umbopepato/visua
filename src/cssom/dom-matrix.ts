import {toDeg, toRad} from '../util';

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

export class DOMMatrixReadOnly {

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

    get a(): number {
        return this.m11;
    }

    get b(): number {
        return this.m12;
    }

    get c(): number {
        return this.m21;
    }

    get d(): number {
        return this.m22;
    }

    get e(): number {
        return this.m41;
    }

    get f(): number {
        return this.m42;
    }

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

    get isIdentity(): boolean {
        for (let c = 1; c < 5; c++) {
            for (let r = 1; r < 5; r++) {
                const i = this[`m${c}${r}`];
                if ((c === r && i !== 1) || (c !== r && i !== 0)) return false;
            }
        }
        return true;
    }

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

    translate(tx: number, ty: number, tz: number = 0): DOMMatrix {
        let result = new DOMMatrix(this);
        result.translateSelf(tx, ty, tz);
        return result;
    }

    scale(scale: number, originX: number = 0, originY: number = 0): DOMMatrix {
        let result = new DOMMatrix(this);
        result.scaleSelf(scale, originX, originY);
        return result;
    }

    scale3d(scale: number, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        let result = new DOMMatrix(this);
        result.scale3dSelf(scale, originX, originY, originZ);
        return result;
    }

    scaleNonUniform(scaleX: number, scaleY: number = 1, scaleZ: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        let result = new DOMMatrix(this);
        result.scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
        return result;
    }

    rotate(angle: number, originX: number = 0, originY: number = 0): DOMMatrix {
        let result = new DOMMatrix(this);
        result.rotateSelf(angle, originX, originY);
        return result;
    }

    rotateFromVector(x: number, y: number): DOMMatrix {
        let result = new DOMMatrix(this);
        result.rotateFromVectorSelf(x, y);
        return result;
    }

    rotateAxisAngle(x: number, y: number, z: number, angle: number): DOMMatrix {
        let result = new DOMMatrix(this);
        result.rotateAxisAngleSelf(x, y, z, angle);
        return result;
    }

    skewX(sx: number): DOMMatrix {
        let result = new DOMMatrix(this);
        result.skewXSelf(sx);
        return result;
    }

    skewY(sy: number): DOMMatrix {
        let result = new DOMMatrix(this);
        result.skewYSelf(sy);
        return result;
    }

    multiply(other: DOMMatrix): DOMMatrix {
        let result = new DOMMatrix(this);
        result.multiplySelf(other);
        return result;
    }

    flipX(): DOMMatrix {
        let result = new DOMMatrix(this);
        result.multiplySelf(new DOMMatrix([-1, 0, 0, 1, 0, 0]));
        return result;
    }

    flipY(): DOMMatrix {
        let result = new DOMMatrix(this);
        result.multiplySelf(new DOMMatrix([1, 0, 0, -1, 0, 0]));
        return result;
    }

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

    get a(): number {
        return this.m11;
    }

    set a(value: number) {
        this.m11 = value;
    }

    get b(): number {
        return this.m12;
    }

    set b(value: number) {
        this.m12 = value;
    }

    get c(): number {
        return this.m21;
    }

    set c(value: number) {
        this.m21 = value;
    }

    get d(): number {
        return this.m22;
    }

    set d(value: number) {
        this.m22 = value;
    }

    get e(): number {
        return this.m41;
    }

    set e(value: number) {
        this.m41 = value;
    }

    get f(): number {
        return this.m42;
    }

    set f(value: number) {
        this.m42 = value;
    }

    constructor(init?: number[] | DOMMatrixReadOnly) {
        if (!init) {
            super();
        } else if (init instanceof DOMMatrixReadOnly) {
            super(init.toArray());
        } else {
            super(init);
        }
    }

    static fromMatrix(other: DOMMatrixInit) {
        return new DOMMatrix(DOMMatrixReadOnly.fromMatrix(other));
    }

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

    preMultiplySelf(other: DOMMatrix): DOMMatrix {
        return other.multiply(this);
    }

    translateSelf(tx: number = 0, ty: number = 0, tz: number = 0): DOMMatrix {
        this.multiplySelf(new DOMMatrix([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1
        ]));
        return this;
    }

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

    scale3dSelf(scale: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix {
        this.translateSelf(originX, originY, originZ);
        this.multiplySelf(new DOMMatrix([
            scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY, -originZ);
        this.rotateSelf(1,2);
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
        const length = Math.sqrt(x**2 + y**2 + z**2);
        if (length === 0) return this;
        angle = toRad(angle);
        x /= length;
        y /= length;
        z /= length;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const ocos = 1 - cos;
        this.multiplySelf(new DOMMatrix([
            cos + x**2 * ocos,
            y * x * ocos + z * sin,
            z * x * ocos - y * sin,
            0,
            x * y * ocos - z * sin,
            cos + y**2 * ocos,
            z * y * ocos + x * sin,
            0,
            x * z * ocos + y * sin,
            y * z * ocos - x * sin,
            cos + z**2 * ocos,
            0,
            0, 0, 0, 1,
        ]));
        return this;
    }

    skewXSelf(sx: number): DOMMatrix {
        this.multiplySelf(new DOMMatrix([
            1, 0, 0, 0, Math.tan(toRad(sx)), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]));
        return this;
    }

    skewYSelf(sy: number): DOMMatrix {
        this.multiplySelf(new DOMMatrix([
            1, Math.tan(toRad(sy)), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]));
        return this;
    }

}

const isOnDiagonal = (matrixElementName: string) => matrixElementName.match(/(\d)\1/) != null;
