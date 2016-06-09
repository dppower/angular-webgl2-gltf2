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
    };

    get position() {
        return this.position_;
    };

    get orientation() {
        return this.orientation_;
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

    get inverse() {      
        return this.inverse_;
    };

    update() {
        this.transform_.identity();
        this.transform_.rotate(this.orientation_);
        this.transform_.translate(this.position_);

        this.transform_.inverse(this.inverse_);
    };

    lookAt(target: Vec3) {
        
        let toTarget = target.subtract(this.position_);
        toTarget = toTarget.normalise();
        
        let q1 = Quaternion.fromAngleBetweenVectors(this.forward_, toTarget);
        this.forward_ = q1.rotate(this.forward_);

        let q2 = Quaternion.fromAngleBetweenVectors(VEC3_FORWARD, this.forward_);
        return q2;
    };

    /*
    * Returns a unit vector representing a direction that has been rotated.
    */
    rotateAround(target: Vec3, rotation: Quaternion) {
        let toTarget = this.position_.subtract(target);
        toTarget = toTarget.normalise();
        let v = rotation.rotate(toTarget);
        return v;
    };

    addTranslation(move: Vec3) {
        this.position_.copy(this.position_.add(move));
    };

    setTranslation(translation: Vec3) {
        this.position_.copy(translation);
    };
    
    addRotation(rotation: Quaternion) {
        this.orientation_ = this.orientation_.multiply(rotation);
        //this.up_ = this.orientation_.rotate(this.up_);
        //this.forward_ = rotation.rotate(this.forward_);
        //this.right_ = this.orientation_.rotate(this.right_);   
    };

    setOrientation(orientation: Quaternion) {
        this.orientation_ = orientation;
        this.forward_ = orientation.rotate(this.forward_);
    };

    private up_ = new Vec3(0.0, 1.0, 0.0);
    private forward_ = new Vec3(0.0, 0.0, -1.0);
    private right_ = new Vec3(1.0, 0.0, 0.0);

    private transform_ = new Mat4();
    private inverse_ = new Mat4();
};