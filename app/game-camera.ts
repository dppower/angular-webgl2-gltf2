import {Injectable, Inject} from "@angular/core";
import {Transform} from "./transform";
import {Quaternion} from "./quaternion";
import {InputState} from "./input-manager";
import {Vec3, VEC3_UP, VEC3_FORWARD, VEC3_RIGHT} from "./vec3";
import {Mat4} from "./mat4";
import {Cube, CUBE_1, CUBE_2, CUBE_3} from "./cube";

@Injectable()
export class Camera {

    private initialPosition_: Vec3;
    private minDistanceToTarget_ = 3.0;
    private maxDistanceToTarget_ = 15.0;
    private zoomSpeed_ = 0.1;

    constructor(@Inject(CUBE_1) private target_: Cube) {
        let initial_position = new Vec3(0.0, 1.0, 8.0);
        this.transform_.setTranslation(this.target_.transform.position.add(initial_position));
    };

    get view() {
        return this.view_.array;
    };

    get projection() {
        return this.projection_.array;
    };

    get projectionView() {
        Mat4.multiply(this.projection_, this.view_, this.projectionView_);       
        return this.projectionView_.array;
    };

    get inverseView() {      
        this.view_.inverse(this.inverseView_);
        return this.inverseView_.array;
    };

    get inverseProjection() {
        this.inverseProjection_.array[0] = 1.0 / this.projection_.array[0];
        this.inverseProjection_.array[5] = 1.0 / this.projection_.array[5];
        this.inverseProjection_.array[14] = -1.0;
        this.inverseProjection_.array[11] = 1.0 / this.projection_.array[14];
        this.inverseProjection_.array[15] = this.projection_.array[10] / this.projection_.array[14];
        return this.inverseProjection_.array;
    };

    set target(cube: Cube) {
        this.target_ = cube;
    };

    Start(initialPosition: Vec3) {
        this.initialPosition_ = initialPosition;
        this.transform_.setTranslation(this.target_.transform.position.add(initialPosition));
    };

    Update(inputs: InputState) {

        // Handle zooming
        let zoom = inputs.zoom * this.zoomSpeed_;
        let fromTarget = this.transform_.position.subtract(this.target_.transform.position);
        let currentDistanceToTarget = fromTarget.length;

        let desiredDistance = zoom + currentDistanceToTarget;
        let allowedDistance = (desiredDistance <= this.minDistanceToTarget_) ? this.minDistanceToTarget_ : ((desiredDistance >= this.maxDistanceToTarget_) ? this.maxDistanceToTarget_ : desiredDistance);

        // Orbit camera around target
        let currentRight = VEC3_UP.cross(fromTarget).normalise();
        let currentUp = fromTarget.cross(currentRight).normalise();
        let mouseDy = currentUp.scale(inputs.mouseDy);
        let mouseDx = currentRight.scale(inputs.mouseDx);
        let mouseDelta = mouseDy.add(mouseDx);
        let rotationAxis = mouseDelta.cross(fromTarget).normalise();
        let xyRotation = Quaternion.fromAxisAngle(rotationAxis, 1.1);

        let rotatedDirection = this.transform_.rotateAround(this.target_.transform.position, xyRotation);
        let rotatedPoint = rotatedDirection.scale(allowedDistance);

        // Clamp vertical rotation
        let updatedPosition: Vec3;
        if (rotatedDirection.y >= 0.75 || rotatedDirection.y <= 0.0) {
            updatedPosition = this.transform_.position;
        }
        else {
            updatedPosition = this.target_.transform.position.add(rotatedPoint);
        }
        
        this.transform_.setTranslation(updatedPosition);

        // Rotate camera to face target
        let lookAtRotaion = this.transform_.lookAt(this.target_.transform.position);
        this.transform_.setOrientation(lookAtRotaion);
        
        // Update matrices after transformations
        this.transform_.update();
        let rotation = this.transform_.rotation;
        let translation = this.transform_.translation;
        this.matrix_.identity();
        this.matrix_.array[0] = rotation.array[0];
        this.matrix_.array[1] = rotation.array[1];
        this.matrix_.array[2] = rotation.array[2];
        this.matrix_.array[4] = rotation.array[4];
        this.matrix_.array[5] = rotation.array[5];
        this.matrix_.array[6] = rotation.array[6];
        this.matrix_.array[8] = rotation.array[8];
        this.matrix_.array[9] = rotation.array[9];
        this.matrix_.array[10] = rotation.array[10];
        this.matrix_.array[12] = translation.array[12];
        this.matrix_.array[13] = translation.array[13];
        this.matrix_.array[14] = translation.array[14];

        this.matrix_.inverse(this.view_);

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
    private projectionView_ = new Mat4();
    private matrix_ = new Mat4();
    private inverseProjection_ = new Mat4();
    private inverseView_ = new Mat4();

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_ = 60.0 * Math.PI / 180;

    // Transform relative to origin
    private transform_ = new Transform("camera");
}