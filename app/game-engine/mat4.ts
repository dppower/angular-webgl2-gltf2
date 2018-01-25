import { Vec3 } from "./vec3";
import { Quaternion } from "./quaternion";

export class Mat4 {

    get array() { return this.matrix_; };

    get mat3() {
        return [
            this.matrix_[0],
            this.matrix_[1],
            this.matrix_[2],
            this.matrix_[4],
            this.matrix_[5],
            this.matrix_[6],
            this.matrix_[8],
            this.matrix_[9],
            this.matrix_[10]
        ]
    };

    get length() { return this.matrix_.length; };

    private matrix_ = new Float32Array(16);

    constructor() { };

    identity() {
        this.matrix_[0] = 1.0;
        this.matrix_[1] = 0;
        this.matrix_[2] = 0;
        this.matrix_[3] = 0;
        this.matrix_[4] = 0;
        this.matrix_[5] = 1.0;
        this.matrix_[6] = 0;
        this.matrix_[7] = 0;
        this.matrix_[8] = 0;
        this.matrix_[9] = 0;
        this.matrix_[10] = 1.0;
        this.matrix_[11] = 0;
        this.matrix_[12] = 0;
        this.matrix_[13] = 0;
        this.matrix_[14] = 0;
        this.matrix_[15] = 1.0;
    };

    setArray(value: ArrayLike<number>) {
        this.matrix_.set(value);
    };

    static multiply(a: Mat4, b: Mat4, out: Mat4) {
        
        let a11 = a.array[0], a21 = a.array[1], a31 = a.array[2], a41 = a.array[3],
            a12 = a.array[4], a22 = a.array[5], a32 = a.array[6], a42 = a.array[7],
            a13 = a.array[8], a23 = a.array[9], a33 = a.array[10], a43 = a.array[11],
            a14 = a.array[12], a24 = a.array[13], a34 = a.array[14], a44 = a.array[15];

        for (let i = 0; i < 16; i += 4) {
            let b1 = b.array[i], b2 = b.array[i + 1], b3 = b.array[i + 2], b4 = b.array[i + 3];
            out.array[i] = b1 * a11 + b2 * a12 + b3 * a13 + b4 * a14;
            out.array[i + 1] = b1 * a21 + b2 * a22 + b3 * a23 + b4 * a24;
            out.array[i + 2] = b1 * a31 + b2 * a32 + b3 * a33 + b4 * a34;
            out.array[i + 3] = b1 * a41 + b2 * a42 + b3 * a43 + b4 * a44;
        }
    };

    /**
     * Creates Rotation matrix from identity Mat4
     * @param q
     * @param out
     */
    static fromQuaternion(q: Quaternion, out: Mat4) {
        q.normalise();
        const n = 2;
        let wx = n * q.w * q.x;
        let wy = n * q.w * q.y;
        let wz = n * q.w * q.z;
        let xx = n * q.x * q.x;
        let yy = n * q.y * q.y;
        let zz = n * q.z * q.z;
        let xy = n * q.x * q.y;
        let xz = n * q.x * q.z;
        let yz = n * q.y * q.z;

        out.array[0] = 1.0 - (yy + zz);
        out.array[1] = xy + wz;
        out.array[2] = xz - wy;
        
        out.array[4] = xy - wz;
        out.array[5] = 1.0 - (xx + zz);
        out.array[6] = yz + wx;

        out.array[8] = xz + wy;
        out.array[9] = yz - wx;
        out.array[10] = 1.0 - (xx + yy);

        out.array[3] = 0;
        out.array[7] = 0;
        out.array[11] = 0;
        out.array[15] = 1;
    };

    /**
     * Creates translation matrix from identity Mat4
     * @param translation
     * @param out
     */
    static fromTranslation(translation: Vec3, out: Mat4) {
        out.array[12] = translation.x;
        out.array[13] = translation.y;
        out.array[14] = translation.z;
    };

    /**
     * Creates scale matrix from zero-filled Mat4
     * @param scale
     * @param out
     */
    static fromScale(scale: Vec3, out: Mat4) {
        out.array[0] = scale.x;
        out.array[5] = scale.y;
        out.array[10] = scale.z;
        out.array[15] = 1;
    };

    transpose(out: Mat4) {
        out.array[0] = this.matrix_[0];
        out.array[5] = this.matrix_[5];
        out.array[10] = this.matrix_[10];
        out.array[15] = this.matrix_[15];

        out.array[1] = this.matrix_[4];
        out.array[2] = this.matrix_[8];
        out.array[3] = this.matrix_[12];

        out.array[4] = this.matrix_[1];
        out.array[6] = this.matrix_[9];
        out.array[7] = this.matrix_[13];

        out.array[8] = this.matrix_[2];
        out.array[9] = this.matrix_[6];
        out.array[11] = this.matrix_[14];

        out.array[12] = this.matrix_[3];
        out.array[13] = this.matrix_[7];
        out.array[14] = this.matrix_[11];
    };

    /**
     * This is a shortcut method to find the inverse
     * [(P^-1) (-P^-1 * V)]
     * [    0           1 ]
     * @param out
     */
    inverse(out: Mat4) {
        // Reset bottom row
        out.array[3] = 0.0;
        out.array[7] = 0.0;
        out.array[11] = 0.0;
        out.array[15] = 1.0;

        // Transpose 3 * 3 sub-matrix representing rotation
        out.array[0] = this.matrix_[0];
        out.array[5] = this.matrix_[5];
        out.array[10] = this.matrix_[10];
        out.array[1] = this.matrix_[4];
        out.array[2] = this.matrix_[8];
        out.array[6] = this.matrix_[9];
        out.array[4] = this.matrix_[1];
        out.array[8] = this.matrix_[2];
        out.array[9] = this.matrix_[6];

        // Inverse the translation
        out.array[12] = (-1) * (this.matrix_[0] * this.matrix_[12] + this.matrix_[1] * this.matrix_[13] + this.matrix_[2] * this.matrix_[14]);
        out.array[13] = (-1) * (this.matrix_[4] * this.matrix_[12] + this.matrix_[5] * this.matrix_[13] + this.matrix_[6] * this.matrix_[14]);;
        out.array[14] = (-1) * (this.matrix_[8] * this.matrix_[12] + this.matrix_[9] * this.matrix_[13] + this.matrix_[10] * this.matrix_[14]);;
    };

    toString() {
        return `
            ${this.matrix_[0]}, ${this.matrix_[4]}, ${this.matrix_[8]}, ${this.matrix_[12]},
            ${this.matrix_[1]}, ${this.matrix_[5]}, ${this.matrix_[9]}, ${this.matrix_[13]},
            ${this.matrix_[2]}, ${this.matrix_[6]}, ${this.matrix_[10]}, ${this.matrix_[14]},
            ${this.matrix_[3]}, ${this.matrix_[7]}, ${this.matrix_[11]}, ${this.matrix_[15]}`;
    };

    transformPoint(vec: Vec3) {
        let x = vec.x, y = vec.y, z = vec.z, w = 1.0;

        let r = new Vec3();
        r.x = this.matrix_[0] * x + this.matrix_[4] * y + this.matrix_[8] * z + this.matrix_[12] * w;
        r.y = this.matrix_[1] * x + this.matrix_[5] * y + this.matrix_[9] * z + this.matrix_[13] * w;
        r.z = this.matrix_[2] * x + this.matrix_[6] * y + this.matrix_[10] * z + this.matrix_[14] * w;

        return r;
    };

    transformDirection(vec: Vec3) {
        let x = vec.x, y = vec.y, z = vec.z, w = 0;

        let r = new Vec3();
        r.x = this.matrix_[0] * x + this.matrix_[4] * y + this.matrix_[8] * z + this.matrix_[12] * w;
        r.y = this.matrix_[1] * x + this.matrix_[5] * y + this.matrix_[9] * z + this.matrix_[13] * w;
        r.z = this.matrix_[2] * x + this.matrix_[6] * y + this.matrix_[10] * z + this.matrix_[14] * w;

        return r;
    };
};
