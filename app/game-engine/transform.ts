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

    get rotation() { return this.rotation_matrix_; };
    get translation() { return this.translation_matrix_; };

    get transform() { return this.transform_matrix_; };
    get inverse() { return this.inverse_matrix_; };

    get up() { return this.up_; };
    get forward() { return this.forward_; };
    get right() { return this.right_; };

    private up_ = vec3_up;
    private forward_ = vec3_forward;
    private right_ = vec3_right;

    private is_static_: boolean;

    private transform_matrix_ = new Mat4();
    private inverse_matrix_ = new Mat4();

    // T * R * S
    private translation_matrix_: Mat4;
    private rotation_matrix_: Mat4;
    private scale_matrix_: Mat4;

    private position_: Vec3;
    private orientation_: Quaternion;

    constructor(
        position?: number[],
        rotation?: number[],
        scale?: number[]
    ) {
        // Always create transform and inverse, set to identity
        this.transform_matrix_.identity();
        this.inverse_matrix_.identity();
        this.is_static_ = true;

        if (position) {
            this.position_ = Vec3.fromArray(position);
            this.translation_matrix_ = new Mat4();
            this.translation_matrix_.identity();
            this.is_static_ = false;
        }

        if (rotation) {
            this.orientation_ = Quaternion.fromArray(rotation);
            this.rotation_matrix_ = new Mat4();
            this.rotation_matrix_.identity();
            this.is_static_ = false;
        }
        
        if (scale) {
            this.scale_matrix_ = new Mat4();
            Mat4.fromScale(Vec3.fromArray(scale), this.scale_matrix_);
            this.transform_matrix_ = this.scale_matrix_;
        }

        this.updateTransform();
    };

    static fromMatrix(matrix: number[]) {
        // TODO construct Transform from Mat4; Set transform_ and mark as static
        let transform = new Transform();
        transform.transform_matrix_.setArray(matrix);
        transform.transform_matrix_.inverse(transform.inverse_matrix_);
        transform.is_static_ = true;
        return transform;
    };

    updateTransform() {
        if (this.is_static_) return;

        if (this.scale_matrix_) {
            this.transform_matrix_ = this.scale_matrix_;
        }
        else {
            this.transform_matrix_.identity();
        }

        if (this.orientation_) {
            Mat4.fromQuaternion(this.orientation_, this.rotation_matrix_);
            Mat4.multiply(this.transform_matrix_, this.rotation_matrix_, this.transform_matrix_);
        }

        if (this.position_) {
            Mat4.fromTranslation(this.position_, this.translation_matrix_);
            Mat4.multiply(this.transform_matrix_, this.translation_matrix_, this.transform_matrix_);
        }

        this.transform_matrix_.inverse(this.inverse_matrix_);
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
        if (!this.position_) return;
        this.position_.copy(this.position_.add(translation));
    };

    setTranslation(translation: Vec3) {
        this.position_.copy(translation);
    };
    
    addRotation(rotation: Quaternion) {
        if (!this.orientation_) return;
        this.orientation_ = rotation.multiply(this.orientation_);
    };

    setOrientation(orientation: Quaternion) {
        this.orientation_ = orientation;
    };
};