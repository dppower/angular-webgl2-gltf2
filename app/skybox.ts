import {Injectable, Inject} from "@angular/core";
import {Transform} from "./transform";
import {Observable, Observer} from "rxjs/Rx";
import {ShaderProgram, SKYBOX_SHADER} from "./shader-program";
import {webgl2_context} from "./render-context";
import {Camera} from "./game-camera";
import {Mesh, CUBE_MESH} from "./cube-mesh";

const textureNames = ["skybox-right", "skybox-left", "skybox-top", "skybox-bottom", "skybox-back", "skybox-front"];

var skyboxTextures = new Map<string, number>();

textureNames.forEach((value, i) => {
    skyboxTextures[value] = i;
});

type LabelledTexture = { label: string, texture: HTMLImageElement };

@Injectable()
export class Skybox {

    constructor(
        @Inject(webgl2_context) private gl: WebGL2RenderingContext,
        @Inject(SKYBOX_SHADER) private shader_program: ShaderProgram
    ) { };

    private vertices_: WebGLBuffer;
    private texture_: WebGLTexture;
    private texturesLoaded_ = false;

    initialise() {

        this.vertices_ = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices_);
        let vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        this.texture_ = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture_);

        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        
        let fetchTextures = new Observable<LabelledTexture>((observer: Observer<LabelledTexture>) => {
            let count = 0;
            for (let i in skyboxTextures) {
                let texture = new Image();
                texture.onload = () => {
                    let data = { label: i, texture };
                    observer.next(data);
                    count++;
                    if (count == 6) {
                        observer.complete();
                    }
                }
                texture.src = "textures/" + i + ".png";
            }
        });

        fetchTextures.subscribe(
            (data) => {
                let i = skyboxTextures[data.label];
                this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data.texture);
            },
            () => { },
            () => {
                this.texturesLoaded_ = true;
            }
        );        
    };

    disposeShaderProgram() {
        this.shader_program.dispose();
    };

    draw(camera: Camera) {
        if (!this.texturesLoaded_) return;

        this.shader_program.use(this.gl);
       
        this.gl.depthMask(false);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture_);
        this.gl.uniform1i(this.shader_program.getUniform("uSkyboxTexture"), 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices_);
        this.gl.vertexAttribPointer(this.shader_program.getAttribute("aPosition"), 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniformMatrix4fv(this.shader_program.getUniform("uInverseView"), false, camera.inverseView);

        this.gl.uniformMatrix4fv(this.shader_program.getUniform("uInverseProjection"), false, camera.inverseProjection);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        this.gl.depthMask(true);
    }

    private transform_ = new Transform("skybox");
}