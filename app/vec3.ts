
export class Vec3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.vector_ = new Float32Array([x, y, z]);
    };

    get x() { return this.vector_[0]; };

    get y() { return this.vector_[1]; };

    get z() { return this.vector_[2]; };

    set x(value: number) { this.vector_[0] = value; };

    set y(value: number) { this.vector_[1] = value; };

    set z(value: number) { this.vector_[2] = value; };

    //get array() { return this.vector_; };

    get length() {
        return Math.sqrt(this.squaredLength);
    };

    get squaredLength() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
    };

    get orthogonal() {
        return Math.abs(this.x) > Math.abs(this.z) ?
            new Vec3(-this.y, this.x, 0.0) :
            new Vec3(0.0, -this.z, this.y);
    };

    dot(a: Vec3) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    };

    cross(a: Vec3, out?: Vec3) {
        if (out == undefined) {
            out = new Vec3();
        }
        out.x = (this.y * a.z) - (this.z * a.y);
        out.y = (this.z * a.x) - (this.x * a.z);
        out.z = (this.x * a.y) - (this.y * a.x);

        return out;
    };

    normalise() {
        let length = this.length;
        let n = new Vec3();
        if (length > 0) {
            let factor = 1.0 / length;
            n = this.scale(factor);
        }
        return n;   
    };

    add(a: Vec3) {
        let b = new Vec3();
        b.x = this.x + a.x;
        b.y = this.y + a.y;
        b.z = this.z + a.z;

        return b;
    };

    subtract(a: Vec3) {
        let b = new Vec3();
        b.x = this.x - a.x;
        b.y = this.y - a.y;
        b.z = this.z - a.z;

        return b;
    };

    scale(scalar: number) {
        let v = new Vec3();
        v.x = this.x * scalar;
        v.y = this.y * scalar;
        v.z = this.z * scalar;

        return v;
    };

    toString() {
        return "x: " + this.x + ", y: " + this.y + ", z: " + this.z;
    };

    copy(a: Vec3) {
        this.vector_[0] = a.x;
        this.vector_[1] = a.y;
        this.vector_[2] = a.z;
    };

    private vector_: Float32Array;
};

export const VEC3_UP = new Vec3(0.0, 1.0, 0.0);
export const VEC3_RIGHT = new Vec3(1.0, 0.0, 0.0);
export const VEC3_FORWARD = new Vec3(0.0, 0.0, -1.0);