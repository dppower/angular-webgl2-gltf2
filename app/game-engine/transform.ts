import { Vec3, vec3_forward, vec3_up, vec3_right } from "./vec3";
import { Quaternion } from "./quaternion";
import { Mat4 } from "./mat4";

export { Vec3, vec3_forward, vec3_up, vec3_right } from "./vec3";
export { Quaternion } from "./quaternion";
export { Mat4 } from "./mat4";

export enum TransformSpace {
    Local,
    World
};

export class Transform {

    get position() { return this.position_; };
    get orientation() { return this.orientation_; };

    get rotation() { return this.rotation_; };
    get translation() { return this.translation_; };

    get transform() { return this.transform_; };
    get inverse() { return this.inverse_; };

    get up() { return this.up_; };
    get forward() { return this.forward_; };
    get right() { return this.right_; };

    private up_ = vec3_up;
    private forward_ = vec3_forward;
    private right_ = vec3_right;

    private transform_ = new Mat4();
    private inverse_ = new Mat4();
    private rotation_ = new Mat4();
    private translation_ = new Mat4();

    constructor(private position_ = new Vec3(), private orientation_ = new Quaternion()) {
        this.transform_.identity();
        this.inverse_.identity();
        this.rotation_.identity();
        this.translation_.identity();
    };

    updateTransform() {
        Mat4.multiply(this.translation_, this.rotation_, this.transform_); 
        this.transform_.inverse(this.inverse_);
        this.up_ = this.orientation_.rotate(vec3_up);
        this.forward_ = this.orientation_.rotate(vec3_forward);
        this.right_ = this.orientation_.rotate(vec3_right);
    };

    lookAt(target_position: Vec3, up = vec3_up) {
        
        let desired_forward = target_position.subtract(this.position_).normalise();
        
        let q1 = Quaternion.fromAngleBetweenVectors(vec3_forward, desired_forward, true);

        let rotated_up = q1.rotate(up);

        let right = desired_forward.cross(up).normalise();
        let desired_up = right.cross(desired_forward).normalise();

        let q2 = Quaternion.fromAngleBetweenVectors(rotated_up, desired_up);
        let look_at_rotation = q2.multiply(q1);
        return look_at_rotation;
    };

    rotateAround(target_position: Vec3, rotation: Quaternion) {
        let current_direction = this.position_.subtract(target_position).normalise();
        return rotation.rotate(current_direction);
    };

    addTranslation(translation: Vec3) {
        this.position_.copy(this.position_.add(translation));
        Mat4.fromTranslation(this.position_, this.translation_);
    };

    setTranslation(translation: Vec3) {
        this.position_.copy(translation);
        Mat4.fromTranslation(this.position_, this.translation_);
    };
    
    addRotation(rotation: Quaternion) {
        this.orientation_ = rotation.multiply(this.orientation_);
        Mat4.fromQuaternion(this.orientation_, this.rotation_); 
    };

    setOrientation(orientation: Quaternion) {
        this.orientation_ = orientation;
        Mat4.fromQuaternion(this.orientation_, this.rotation_);
    };
};