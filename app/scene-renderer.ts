import { Injectable, Inject, OpaqueToken } from "@angular/core";

import { Cube, cube_001, cube_002,  } from "./cube";
import { ShaderProgram, diffuse_uniform_shader } from "./shader-program";
import { webgl2_context } from "./render-context";
import { Camera } from "./game-camera";

@Injectable()
export class SceneRenderer {
    private cubes_ = new Map<OpaqueToken, Cube>();

    constructor(
        @Inject(webgl2_context) private gl: WebGL2RenderingContext,
        @Inject(diffuse_uniform_shader) private diffuse_uniform_shader: ShaderProgram
        //@Inject(CUBE_1) private cube1: Cube,
        //@Inject(CUBE_2) private cube2: Cube,
        //@Inject(CUBE_3) private cube3: Cube
    ) { };

    start() {
        this.diffuse_uniform_shader.initProgram();

        this.cube1.Start(this.gl);
        this.cube2.Start(this.gl);
        this.cube3.Start(this.gl);
    };

    updateScene(dt: number) {
        this.cube1.Update(dt);
        this.cube2.Update(dt);
        this.cube3.Update(dt);
    };

    drawAll(camera: Camera) {
        this.cube1.Draw(this.shader_program, this.gl, camera);
        this.cube2.Draw(this.shader_program, this.gl, camera);
        this.cube3.Draw(this.shader_program, this.gl, camera);
    };


    Draw(program: ShaderProgram, gl: WebGLRenderingContext, camera: Camera) {

        if (!this.textureLoaded_) return;

        program.use(gl);

        // Texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture_);
        gl.uniform1i(program.getUniform("uBaseTexture"), 0);

        // Attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(program.getAttribute("aVertexPosition"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals_);
        gl.vertexAttribPointer(program.getAttribute("aNormals"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoords_);
        gl.vertexAttribPointer(program.getAttribute("aTextureCoords"), 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        gl.uniformMatrix4fv(program.getUniform("uView"), false, camera.view);
        gl.uniformMatrix4fv(program.getUniform("uProjection"), false, camera.projection);
        gl.uniformMatrix4fv(program.getUniform("uTransform"), false, this.transform_.transform.array);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    };


    private transform_: Transform;
}