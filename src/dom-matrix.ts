export class DOMMatrix {

    a: number;
    b: number;
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

    is2D: boolean;
    isIdentity: boolean;

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

    multiplySelf(other: DOMMatrix): DOMMatrix {

    }

    preMultiplySelf(other: DOMMatrix): DOMMatrix {

    }

    translateSelf(tx, ty, tz): DOMMatrix { // tz = 0

    }

    scaleSelf(scale, originX, originY): DOMMatrix { // last 2 = 0

    }

    scale3dSelf(scale, originX, originY, originZ): DOMMatrix { // last 3 = 0

    }

    scaleNonUniformSelf(scaleX, scaleY, scaleZ, originX, originY, originZ): DOMMatrix { // 1 1 0 0 last

    }

    rotateSelf(angle, originX, originY): DOMMatrix { // last 2 = 0

    }

    rotateFromVectorSelf(x, y): DOMMatrix {

    }

    rotateAxisAngleSelf(x, y, z, angle): DOMMatrix {

    }

    skewXSelf(sx): DOMMatrix {

    }

    skewYSelf(sy): DOMMatrix {

    }

    invertSelf(): DOMMatrix {

    }

    setMatrixValue(transformList: DOMMatrix): DOMMatrix {

    }
}