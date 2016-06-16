import {Vec3, VEC3_FORWARD, VEC3_UP} from "./vec3";
import {Quaternion} from "./quaternion";
import {Mat4} from "./mat4";

export enum TransformSpace {
    Local,
    World
};

export class Transform {

    constructor(
        private name_: string,
        private position_ = new Vec3(),
        private orientation_ = new Quaternion()        
    ) {
        this.transform_.identity();
        this.inverse_.identity();
        this.rotation_.identity();
        this.translation_.identity();
    };

    get position() {
        return this.position_;
    };

    get orientation() {
        return this.orientation_;
    };

    get rotation() {
        return this.rotation_;
    };

    get translation() {
        return this.translation_;
    };

    get transform() {
        return this.transform_;
    };

    get up() {
        return this.up_;
    };

    get forward() {
        return this.forward_;
    };

    get right() {
        return this.right_;
    };

    get inverse() {
        this.transform_.inverse(this.inverse_);
        return this.inverse_;
    };

    update(log: boolean = false) {
        Mat4.fromQuaternion(this.orientation_, this.rotation_);
        Mat4.fromTranslation(this.position_, this.translation_);
        Mat4.multiply(this.rotation_, this.translation_, this.transform_);      
    };

    lookAt(target: Vec3) {
        
        let toTarget = target.subtract(this.position_);
        toTarget = toTarget.normalise();
        
        let q1 = Quaternion.fromAngleBetweenVectors(VEC3_FORWARD, toTarget, true);
        this.forward_ = q1.rotate(VEC3_FORWARD);
        let up = q1.rotate(VEC3_UP);
        let right = toTarget.cross(VEC3_UP);
        let up_w = right.cross(toTarget);

        let q2 = Quaternion.fromAngleBetweenVectors(up, up_w);
        let lookAtRotation = q2.multiply(q1);
        return lookAtRotation;
    };

    /*
    * Returns a unit vector representing a direction that has been rotated.
    */
    rotateAround(target: Vec3, rotation: Quaternion) {

        let fromTarget = this.position_.subtract(target);
        fromTarget = fromTarget.normalise();

        let r = rotation.rotate(fromTarget);
        return r;
    };

    addTranslation(move: Vec3) {
        this.position_.copy(this.position_.add(move));
    };

    setTranslation(translation: Vec3) {
        this.position_.copy(translation);
    };
    
    addRotation(rotation: Quaternion) {
        this.orientation_ = this.orientation_.multiply(rotation); 
    };

    setOrientation(orientation: Quaternion) {
        this.orientation_ = orientation;
    };

    private up_ = new Vec3(0.0, 1.0, 0.0);
    private forward_ = new Vec3(0.0, 0.0, -1.0);
    private right_ = new Vec3(1.0, 0.0, 0.0);

    private transform_ = new Mat4();
    private inverse_ = new Mat4();
    private rotation_ = new Mat4();
    private translation_ = new Mat4();
};