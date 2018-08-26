export class DOMMatrixReadOnly {

    readonly b: number;
    readonly a: number;
    readonly c: number;
    readonly d: number;
    readonly e: number;
    readonly f: number;
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

    is2D: boolean;

    get isIdentity(): boolean {
        return !(this.m12 ||
            this.m13 ||
            this.m14 ||
            this.m21 ||
            this.m23 ||
            this.m24 ||
            this.m31 ||
            this.m32 ||
            this.m34 ||
            this.m41 ||
            this.m42 ||
            this.m43) && !!(
            this.m11 &&
            this.m22 &&
            this.m33 &&
            this.m44
        );
    }

    constructor(sequence: number[]) {
        if (sequence.length != 6 && sequence.length != 16) {
            throw new TypeError('Failed to construct \'DOMMatrix\': Expecting 6 or 16 entries in sequence');
        }
        for (let i = 0; i < sequence.length; i++) {
            if (typeof sequence[i] != 'number') {
                throw new TypeError(`Failed to construct \'DOMMatrix\': Argument at index ${i} is not of type 'number'`);
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
        this.a = this.m11;
        this.b = this.m12;
        this.c = this.m21;
        this.d = this.m22;
        this.e = this.m41;
        this.f = this.m42;

        this.is2D = sequence.length == 6;
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
        result.scaleNonUniformSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
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

    b: number;
    a: number;
    c: number;
    d: number;
    e: number;
    f: number;
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
    
    constructor(arg?: number[] | DOMMatrixReadOnly) {
        if (!arg) {
            super([1, 0, 0, 1, 0, 0]);
        } else if (arg instanceof DOMMatrixReadOnly) {
            super(arg.toArray());
        } else {
            super(arg);
        }
    }

    multiplySelf(other: DOMMatrix): DOMMatrix {
        let origThis = new DOMMatrix(this);
        let origOther = new DOMMatrix(other);
        for (let c = 1; c < 5; c++) {
            for (let r = 1; r < 5; r++) {
                this[`m${c}${r}`] = [1, 2, 3, 4]
                    .map(i => origThis[`m${i}${r}`] * origOther[`m${c}${i}`])
                    .reduce((a, v) => a + v);
            }
        }
        this.a = this.m11;
        this.b = this.m12;
        this.c = this.m21;
        this.d = this.m22;
        this.e = this.m41;
        this.f = this.m42;
        return this;
    }

    preMultiplySelf(other: DOMMatrix): DOMMatrix {
        return other.multiply(this);
    }

    translateSelf(tx: number, ty: number, tz: number = 0): DOMMatrix { // tz = 0
        this.multiplySelf(new DOMMatrix([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1
        ]));
        return this;
    }

    scaleSelf(scale: number, originX: number = 0, originY: number = 0): DOMMatrix { // last 2 = 0
        this.translateSelf(originX, originY);
        this.multiplySelf(new DOMMatrix([
            scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY);
        return this;
    }

    scale3dSelf(scale: number, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix { // last 3 = 0
        this.translateSelf(originX, originY, originZ);
        this.multiplySelf(new DOMMatrix([
            scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY, -originZ);
        return this;
    }

    scaleNonUniformSelf(scaleX: number, scaleY: number = 1, scaleZ: number = 1, originX: number = 0, originY: number = 0, originZ: number = 0): DOMMatrix { // 1 1 0 0 last
        this.translateSelf(originX, originY, originZ);
        this.multiplySelf(new DOMMatrix([
            scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, scaleZ, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY, -originZ);
        return this;
    }

    rotateSelf(angle: number, originX: number = 0, originY: number = 0): DOMMatrix { // last 2 = 0
        this.translateSelf(originX, originY);
        angle = toRad(angle);
        const sin = Math.sin(angle / 2);
        const sc = sin * Math.cos(angle / 2);
        const sq = sin * sin;
        this.multiplySelf(new DOMMatrix([
            1 - 2 * sq, 2 * sc, 0, 0, -2 * sc, 1 - 2 * sq, 0, 0, 0, 0, 1 - 2 * sq, 0, 0, 0, 0, 1
        ]));
        this.translateSelf(-originX, -originY);
        return this;
    }

    rotateFromVectorSelf(x: number, y: number): DOMMatrix {
        const PI2 = Math.PI * 2;
        let angle = Math.atan2(y, x);
        angle = (PI2 + angle) % PI2;
        const sin = Math.sin(angle / 2);
        const sc = sin * Math.cos(angle / 2);
        const sq = sin * sin;
        this.multiplySelf(new DOMMatrix([
            1 - 2 * sq, 2 * sc, 0, 0, -2 * sc, 1 - 2 * sq, 0, 0, 0, 0, 1 - 2 * sq, 0, 0, 0, 0, 1
        ]));
        return this;
    }

    rotateAxisAngleSelf(x: number, y: number, z: number, angle: number): DOMMatrix {
        angle = toRad(angle);
        const sin = Math.sin(angle / 2);
        const sc = sin * Math.cos(angle / 2);
        const sq = sin * sin;
        this.multiplySelf(new DOMMatrix([
            1 - 2 * (y * y + z * z) * sq,
            2 * (x * y * sq + z * sc),
            2 * (x * z * sq - y * sc),
            0,
            2 * (x * y * sq - z * sc),
            1 - 2 * (x * x + z * z) * sq,
            2 * (y * z * sq + x * sc),
            0,
            2 * (x * z * sq + y * sc),
            2 * (y * x * sq - x * sc),
            1 - 2 * (x * x + y * y) * sq,
            0, 0, 0, 0, 1
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

const toRad = (angle: number): number => angle * Math.PI / 180;