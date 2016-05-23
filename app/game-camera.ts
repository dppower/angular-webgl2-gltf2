import {Injectable} from "@angular/core";

@Injectable()
export class Camera {

    set aspect(inAspect: number) { this.aspect_ = inAspect; };
    
    get vMatrix() {
        // TODO Need to determine how the world should be transformed in relationship to the camera i.e. does the camera zoom or pan?
        this.vMatrix_[0] = 1.0;
        this.vMatrix_[5] = 1.0;
        this.vMatrix_[10] = 1.0;
        this.vMatrix_[14] = -6.0;
        return this.vMatrix_;
    };

    get pMatrix() {
        this.calculateFrustrum();
        return this.pMatrix_;
    };

    calculateFrustrum() {
        let f = Math.tan(0.5 * (Math.PI - this.vFieldOfView_));
        let depth = 1.0 / (this.near_ - this.far_);

        this.pMatrix_[0] = f / this.aspect_;
        this.pMatrix_[5] = f;
        this.pMatrix_[10] = (this.near_ + this.far_) * depth;
        this.pMatrix_[11] = -1.0;
        this.pMatrix_[14] = 2.0 * (this.near_ * this.far_) * depth;

    };

    private near_ = 1.0;
    private far_ = 50.0;

    private aspect_;

    private pMatrix_: Float32Array = new Float32Array(16);

    private vMatrix_: Float32Array = new Float32Array(16);

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_: number = 60.0 * Math.PI / 180;
}