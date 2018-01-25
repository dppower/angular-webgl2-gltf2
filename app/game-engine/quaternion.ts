import { Vec3 } from "./vec3";

export class Quaternion {

    get array() {
        return [this.x, this.y, this.z, this.w];
    };

    get w() { return this.w_; };
    get x() { return this.v_.x; };
    get y() { return this.v_.y; };
    get z() { return this.v_.z; };
    
    get v() { return this.v_; };

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2));
    };

    set w(value: number) { this.w_ = value; };

    set v(v: Vec3) {
        this.v_.copy(v);
    };

    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.v_ = new Vec3(x, y, z);
        this.w_ = w;
    };

    /**
     * Create a new Quaternion from an angle in degrees and axis of rotation.
     * @param axis Vec3
     * @param angle number, angle in radians
     */
    static fromAxisAngle(axis = new Vec3(), angle = 0.0) {
        let q = new Quaternion();
        let phi = angle / 2/** Math.PI / 360.0*/;
        q.v = axis.scale(Math.sin(phi));
        q.w = Math.cos(phi);
        return q;
    };

    /**
     * Create a new quaternion from an array, [x, y, z, w]
     * @param array
     */
    static fromArray(array: number[]) {
        let q = new Quaternion();       
        q.v.x = array[0] || 0.0;
        q.v.y = array[1] || 0.0;
        q.v.z = array[2] || 0.0;
        q.w = array[3] || 1.0;
        return q;
    };

    static fromAngleBetweenVectors(u: Vec3, v: Vec3, normalized = false) {
        let norm_u_norm_v = normalized ? 1.0 : Math.sqrt(u.squared_length * v.squared_length);
        let w = norm_u_norm_v + u.dot(v);
        let p: Vec3;

        if (w < 1e-6 * norm_u_norm_v) {
            // Checking if u and v are exactly opposite
            w = 0;
            p = u.orthogonal;
        }
        else {
            p = u.cross(v);
        }
        let q = new Quaternion(p.x, p.y, p.z, w);
        q.normalise();
        return q;
    };

    conjugate() {
        let c = new Quaternion();
        c.v = this.v_.scale(-1.0);
        c.w = this.w_;
        return c;
    };

    rotate(v: Vec3) {
        let p = new Quaternion();
        p.w = 0.0;
        p.v = v.normalise();
        
        let q = this.multiply(p).multiply(this.conjugate());
        q.normalise();
        return q.v;
    };

    normalise() {
        let factor = 1.0 / this.length;

        this.v_.copy(this.v_.scale(factor));
        this.w_ *= factor;
    }

    multiply(q: Quaternion) {
        this.normalise();
        q.normalise();
        let r = new Quaternion();
        r.w = this.w_ * q.w - this.v_.dot(q.v);
        r.v = this.v_.scale(q.w).add(q.v.scale(this.w_)).add(this.v_.cross(q.v));

        // Above is equivalent to this calculation:
        //r.w = this.w * q.w - (this.x * q.x + this.y * q.y + this.z * q.z);
        //r.x = (this.x * q.w) + (this.w * q.x) + (this.y * q.z) - (this.z * q.y);
        //r.y = (this.y * q.w) + (this.w * q.y) + (this.z * q.x) - (this.x * q.z);
        //r.z = (this.z * q.w) + (this.w * q.z) + (this.x * q.y) - (this.y * q.x);
        
        return r;

    };

    copy(q: Quaternion) {
        this.v_.copy(q.v);
        this.w_ = q.w;
    };

    toString() {
        return `w: ${this.w}, x: ${this.x}, y: ${this.y}, z: ${this.z}`;
    };

    private w_: number;
    private v_: Vec3;
}