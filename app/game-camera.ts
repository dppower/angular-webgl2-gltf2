import {Injectable, Inject} from "@angular/core";
import {Transform} from "./transform";
import {Quaternion} from "./quaternion";
import {InputState} from "./input-manager";
import {Vec3} from "./vec3";
import {Mat4} from "./mat4";
import {Cube, CUBE_1, CUBE_2, CUBE_3} from "./cube";

@Injectable()
export class Camera {

    private initialDistanceToTarget_: number;
    private minDistanceToTarget_ = 3.0;
    private maxDistanceToTarget_ = 15.0;
    private zoomSpeed_ = 0.1;

    constructor(@Inject(CUBE_1) private target_: Cube) {
        let initial_position = new Vec3(0.0, 0.0, 8.0);
        this.transform_.setTranslation(this.target_.transform.position.add(initial_position));
        this.transform_.update();
    };
    
    get matrix() {
        Mat4.multiply(this.projection_, this.view_, this.matrix_);       
        return this.matrix_.array;
    };

    get inverseView() {        
        return this.transform_.transform.array;
    };

    get view() {
        return this.view_.array;
    };

    get projection() {
        return this.projection_.array;
    };

    get inverseProjection() {
        this.inverseProjection_.array[0] = 1.0 / this.projection_.array[0];
        this.inverseProjection_.array[5] = 1.0 / this.projection_.array[5];
        this.inverseProjection_.array[14] = -1.0;
        this.inverseProjection_.array[11] = 1.0 / this.projection_.array[14];
        this.inverseProjection_.array[15] = this.projection_.array[10] / this.projection_.array[14];
        return this.inverseProjection_.array;
    };

    Start(initialDistance: number) {
        //let z = (startDistance < this.minZoom_) ? this.minZoom_ : ((startDistance > this.maxZoom_) ? this.maxZoom_ : startDistance);
        this.initialDistanceToTarget_ = initialDistance;
        let initial_position = new Vec3(0.0, 0.0, initialDistance);
        this.transform_.setTranslation(this.target_.transform.position.add(initial_position));
        this.transform_.update();
    };

    update(inputs: InputState, canvasWidth: number, canvasHeight: number) {

        // Handle zooming
        let zoom = inputs.zoom * this.zoomSpeed_;
        let toTarget = this.transform_.position.subtract(this.target_.transform.position);
        let currentDistanceToTarget = toTarget.length;

        let desiredDistance = zoom + currentDistanceToTarget;
        let newDistanceToTarget = (desiredDistance <= this.minDistanceToTarget_) ? this.minDistanceToTarget_ : ((desiredDistance >= this.maxDistanceToTarget_) ? this.maxDistanceToTarget_ : desiredDistance);

        // Rotate camera around target
        let qx = Quaternion.fromAxisAngle(new Vec3(0.0, 1.0, 0.0), -0.5 * inputs.mouseDx);
        //let qy = Quaternion.fromAxisAngle(new Vec3(1.0, 0.0, 0.0), 0.5 * inputs.mouseDy);

        //let rotation = qx.multiply(qy);
        let rotatedDirection = this.transform_.rotateAround(this.target_.transform.position, qx);

        let rotatedPoint = rotatedDirection.scale(newDistanceToTarget);

        let translation = this.target_.transform.position.add(rotatedPoint);
        this.transform_.setTranslation(translation);

        // Rotate camera to face target
        let lookAtRotaion = this.transform_.lookAt(this.target_.transform.position);
        this.transform_.addRotation(lookAtRotaion);
        
        // Update matrices after transformations
        this.transform_.update();

        this.transform_.transform.inverse(this.view_);
        this.setProjection(inputs.aspect);
    };

    setProjection(aspect: number) {
        let f = Math.tan(0.5 * (Math.PI - this.vFieldOfView_));
        let depth = 1.0 / (this.near_ - this.far_);

        this.projection_.array[0] = f / aspect;
        this.projection_.array[5] = f;
        this.projection_.array[10] = (this.near_ + this.far_) * depth;
        this.projection_.array[11] = -1.0;
        this.projection_.array[14] = 2.0 * (this.near_ * this.far_) * depth;
    };

    private near_ = 0.1;
    private far_ = 100.0;

    private view_ = new Mat4();
    private projection_ = new Mat4();
    private matrix_ = new Mat4();
    private inverseProjection_ = new Mat4();

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_ = 60.0 * Math.PI / 180;

    // Transform relative to origin
    private transform_ = new Transform("camera");
}