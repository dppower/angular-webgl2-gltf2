import {Injectable, Inject} from "@angular/core";
import {Cube, CUBE_1, CUBE_2, CUBE_3} from "./cube";
import {ShaderProgram, DIFFUSE_SHADER} from "./shader-program";
import {RenderContext} from "./render-context";
import {Camera} from "./game-camera";

@Injectable()
export class SceneRenderer {
    private cubes_ = new Map<string, Cube>();

    constructor(
        private gl_: RenderContext,
        @Inject(CUBE_1) private cube1: Cube,
        @Inject(CUBE_2) private cube2: Cube,
        @Inject(CUBE_3) private cube3: Cube
    ) { };

    Start(gl: WebGLRenderingContext) {
        this.cube1.Start(gl);
        this.cube2.Start(gl);
        this.cube3.Start(gl);
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };

    UpdateScene(dt: number) {
        this.cube1.Update(dt);
        this.cube2.Update(dt);
        this.cube3.Update(dt);
    };

    DrawAll(program: ShaderProgram, camera: Camera) {
        let gl = this.gl_.get;

        this.cube1.Draw(program, this.gl_.get, camera);
        this.cube2.Draw(program, this.gl_.get, camera);
        this.cube3.Draw(program, this.gl_.get, camera);
    };
}