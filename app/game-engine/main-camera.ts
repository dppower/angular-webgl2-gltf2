import { Injectable, Inject} from "@angular/core";

import { InputManager } from "./input-manager";
import { Transform, Vec3, vec3_up, vec3_forward, vec3_right, Mat4, Quaternion } from "./transform";
import { Vec2 } from "./vec2";

@Injectable()
export class MainCamera {

    get view() { return this.view_; };

    get projection() { return this.projection_; };

    get inverse_view() { return this.transform_matrix_; };

    get inverse_projection() { return this.inverse_projection_; };

    set target_position(position: Vec3) {
        this.target_position_ = position;
    };

    private min_distance_target = 3.0;
    private max_distance_target = 15.0;
    private zoom_speed = 1.5;

    private znear: number;
    private zfar: number;
    // TODO Should the FoV be adjustable by user?
    private yfov: number;
    
    private camera_orbit_velocity = 100;
    
    private view_ = new Mat4();
    private projection_ = new Mat4();
    private transform_matrix_ = new Mat4();
    private inverse_projection_ = new Mat4();

    private view_forward: Vec3;
    private view_up: Vec3;
    private view_right: Vec3;

    private lerp_duration = 0.4;
    private current_lerp_time = 0;
    private start_distance: number;
    private end_distance: number;

    // Transform relative to origin
    private transform_: Transform;
    private target_position_ = new Vec3(0.0, 1.0, 0.0);

    constructor(private input_manager_: InputManager) { };

    initialiseCamera(camera_data: glTF.Perspective) {
        this.zfar = camera_data.zfar || 100;
        this.znear = camera_data.znear;
        this.yfov = camera_data.yfov;

        let initial_camera_offset = new Vec3(0.0, 1.0, 8.0);

        this.start_distance = this.end_distance = initial_camera_offset.length;

        this.updateOrthoNormalVectors(initial_camera_offset.normalise());

        let initial_camera_position = this.target_position_.add(initial_camera_offset).from_array;
        let initial_angle = Math.acos(initial_camera_offset.normalise().scale(-1.0).dot(vec3_forward));
        let initial_rotation = Quaternion.fromAxisAngle(new Vec3(-1.0, 0.0, 0.0), initial_angle).array;
        
        this.transform_ = new Transform(initial_camera_position, initial_rotation);
    };

    updateOrthoNormalVectors(view_normal: Vec3) {
        this.view_forward = view_normal;
        this.view_right = this.view_forward.cross(vec3_up);
        this.view_right = this.view_right.normalise();
        this.view_up = this.view_right.cross(this.view_forward);
        this.view_up = this.view_up.normalise();
    };
    
    setTargetTransform(target_transform: Transform) {

    };

    updateCamera(dt: number) {

        let from_target = this.transform_.position.subtract(this.target_position_);
        this.updateOrthoNormalVectors(from_target.normalise());

        // Handle zooming
        let updated_distance = this.updateCameraDistanceFromTarget(dt, from_target);

        // Rotate camera position around target
        let updated_rotation = this.updateCameraOrbitPosition(dt);
        let updated_direction = this.transform_.rotateAround(this.target_position_, updated_rotation);
        let rotated_point = updated_direction.scale(updated_distance);
        let updated_position = this.target_position_.add(rotated_point);
        
        this.transform_.setTranslation(updated_position);

        // Rotate camera to face target
        let look_at_rotation = this.transform_.lookAt(this.target_position_);
        this.transform_.setOrientation(look_at_rotation);
        
        // Update matrices after transformations
        this.transform_.updateTransform();

        this.transform_matrix_ = this.transform_.transform;
        this.view_ = this.transform_.inverse;
        this.setProjection();
        this.setInverseProjection();
    };

    updateCameraDistanceFromTarget(dt: number, from_target: Vec3) {
        // Handle zooming
        //let wheel_direction = this.camera_inputs_.wheel_direction;
        let wheel_direction = this.input_manager_.wheel;
        let current_distance = from_target.length;

        if (wheel_direction !== 0) {
            this.current_lerp_time = 0;
            this.start_distance = current_distance;

            let zoom = wheel_direction * this.zoom_speed;

            let desired_distance = current_distance + zoom;

            this.end_distance = (desired_distance <= this.min_distance_target) ?
                this.min_distance_target : (desired_distance >= this.max_distance_target) ?
                    this.max_distance_target : desired_distance;
        }

        // TODO: Collisions!!
        // Lerp between current distance and allowed distance:
        this.current_lerp_time += dt;
        if (this.current_lerp_time > this.lerp_duration) {
            this.current_lerp_time = this.lerp_duration;
        }
        let t = this.current_lerp_time / this.lerp_duration;
        return (1 - t) * this.start_distance + (t * this.end_distance);
    };

    updateCameraOrbitPosition(dt: number) {

        if (!this.input_manager_.isButtonDown("right")) return new Quaternion();

        let dx = this.input_manager_.delta.x;
        let dy = this.input_manager_.delta.y;

        let rotation = new Quaternion();

        if (dx) {
            let rotation_angle = dx * this.camera_orbit_velocity * dt;
            let x_rotation = Quaternion.fromAxisAngle(vec3_up, rotation_angle);
            rotation = x_rotation.multiply(rotation);
        }

        if (dy) {
            let rotation_angle = dy * this.camera_orbit_velocity * dt;
            let y_rotation = Quaternion.fromAxisAngle(this.view_right, rotation_angle);
            rotation = y_rotation.multiply(rotation);
        }

        return rotation;
        //let length = Math.sqrt(input_x * input_x + input_y * input_y);
        //input_x *= length;
        //input_y *= length;
        //if (input_x !== 0 || input_y !== 0) {
        //    let input_rotation = this.getInputRotation(input_x, input_y);

        //    let rotation_angle = this.camera_orbit_velocity * dt;
        //    let rotation_axis = this.view_forward.cross(input_rotation).normalise();
        //    let update_rotation = Quaternion.fromAxisAngle(rotation_axis, rotation_angle);

        //    return update_rotation;
        //}
        //return new Quaternion();
    };

    getInputRotation(input_x: number, input_y: number) {
        let input_rotation: Vec3;
        let scaled_up = this.view_up.scale(input_y);
        let scaled_right = this.view_right.scale(input_x);
        let scaled_xy = scaled_right.add(scaled_up);

        let length_squared = scaled_xy.squared_length;
        if (length_squared < 1.0) {
            let z_length = Math.sqrt(1.0 - length_squared);
            let scaled_view = this.view_forward.scale(z_length);
            input_rotation = scaled_xy.add(scaled_view);
        }
        else {
            input_rotation = scaled_xy.normalise();
        }

        return input_rotation;
    };

    setProjection() {
        let aspect = this.input_manager_.aspect;
        let f = Math.tan(0.5 * (Math.PI - this.yfov));
        let depth = 1.0 / (this.znear - this.zfar);

        this.projection_.array[0] = f / aspect;
        this.projection_.array[5] = f;
        this.projection_.array[10] = (this.znear + this.zfar) * depth;
        this.projection_.array[11] = -1.0;
        this.projection_.array[14] = 2.0 * (this.znear * this.zfar) * depth;
    };

    setInverseProjection() {
        this.inverse_projection_.array[0] = 1.0 / this.projection_.array[0];
        this.inverse_projection_.array[5] = 1.0 / this.projection_.array[5];
        this.inverse_projection_.array[11] = 1.0 / this.projection_.array[14];
        this.inverse_projection_.array[14] = -1.0;
        this.inverse_projection_.array[15] = this.projection_.array[10] / this.projection_.array[14];
    };
}