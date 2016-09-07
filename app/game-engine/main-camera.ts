import { Injectable, Inject } from "@angular/core";

import { Transform, Vec3, vec3_up, Mat4, Quaternion } from "./transform";
import { InputState } from "./input-manager";
import { RenderObject } from "./render-object";

@Injectable()
export class MainCamera {

    get view() { return this.view_; };

    get projection() { return this.projection_; };

    get inverse_view() { return this.inverse_view_; };

    get inverse_projection() { return this.inverse_projection_; };

    set target_position(object: RenderObject) {
        this.target_position_ = object.position;
    };

    private min_distance_target = 3.0;
    private max_distance_target = 15.0;
    private zoom_speed = 0.1;

    private near = 0.1;
    private far = 100;

    private view_ = new Mat4();
    private projection_ = new Mat4();
    private projection_view_ = new Mat4();
    private transform_matrix = new Mat4();
    private inverse_projection_ = new Mat4();
    private inverse_view_ = new Mat4();

    // TODO Should the FoV be adjustable by user?
    private vertical_field_of_view = 60.0 * Math.PI / 180;

    // Transform relative to origin
    private transform_ = new Transform();

    constructor(private target_position_: Vec3) {
        let initial_camera_offset = new Vec3(0.0, 1.0, 8.0);
        let initial_camera_position = this.target_position_.add(initial_camera_offset);

        this.transform_.setTranslation(initial_camera_position);
    };

    updateCamera(inputs: InputState) {

        // Handle zooming
        let zoom = inputs.zoom * this.zoom_speed;
        let from_target = this.transform_.position.subtract(this.target_position_);
        let distance_from_target = from_target.length;

        let desired_distance = zoom + distance_from_target;
        let allowed_distance = (desired_distance <= this.min_distance_target) ?
            this.min_distance_target : (desired_distance >= this.max_distance_target) ?
                this.max_distance_target : desired_distance;

        // Orbit camera around target
        let current_right = vec3_up.cross(from_target).normalise();
        let current_up = from_target.cross(current_right).normalise();
        let movement_dy = current_up.scale(-0.2 * inputs.mouseDy);
        let movement_dx = current_right.scale(inputs.mouseDx);
        let mouse_movement = movement_dy.add(movement_dx);
        let rotation_axis = mouse_movement.cross(from_target).normalise();
        let camera_rotation = Quaternion.fromAxisAngle(rotation_axis, 1.1);

        let rotated_direction = this.transform_.rotateAround(this.target_position_, camera_rotation);
        let rotated_point = rotated_direction.scale(allowed_distance);

        // Clamp vertical rotation
        let updated_position: Vec3;
        if (rotated_direction.y >= 0.75 || rotated_direction.y <= -0.75) {
            updated_position = this.transform_.position;
        }
        else {
            updated_position = this.target_position_.add(rotated_point);
        }
        
        this.transform_.setTranslation(updated_position);

        // Rotate camera to face target
        let look_at_rotation = this.transform_.lookAt(this.target_position_);
        this.transform_.setOrientation(look_at_rotation);
        
        // Update matrices after transformations
        this.transform_.update();
        let rotation = this.transform_.rotation;
        let translation = this.transform_.translation;
        this.transform_matrix.identity();
        this.transform_matrix.array[0] = rotation.array[0];
        this.transform_matrix.array[1] = rotation.array[1];
        this.transform_matrix.array[2] = rotation.array[2];
        this.transform_matrix.array[4] = rotation.array[4];
        this.transform_matrix.array[5] = rotation.array[5];
        this.transform_matrix.array[6] = rotation.array[6];
        this.transform_matrix.array[8] = rotation.array[8];
        this.transform_matrix.array[9] = rotation.array[9];
        this.transform_matrix.array[10] = rotation.array[10];
        this.transform_matrix.array[12] = translation.array[12];
        this.transform_matrix.array[13] = translation.array[13];
        this.transform_matrix.array[14] = translation.array[14];


        //this.transform_.translation.inverse(this.view_);
        //console.log(`updated view: ${this.view_.toString()}`);
        this.transform_matrix.inverse(this.view_);
        this.setProjection(inputs.aspect);
        //this.setInverseProjection();

        //this.view_.inverse(this.inverse_view_);
    };

    setProjection(aspect: number) {
        let f = Math.tan(0.5 * (Math.PI - this.vertical_field_of_view));
        let depth = 1.0 / (this.near - this.far);

        this.projection_.array[0] = f / aspect;
        this.projection_.array[5] = f;
        this.projection_.array[10] = (this.near + this.far) * depth;
        this.projection_.array[11] = -1.0;
        this.projection_.array[14] = 2.0 * (this.near * this.far) * depth;
    };

    setInverseProjection() {
        this.inverse_projection_.array[0] = 1.0 / this.projection_.array[0];
        this.inverse_projection_.array[5] = 1.0 / this.projection_.array[5];
        this.inverse_projection_.array[14] = -1.0;
        this.inverse_projection_.array[11] = 1.0 / this.projection_.array[14];
        this.inverse_projection_.array[15] = this.projection_.array[10] / this.projection_.array[14];
    };
}