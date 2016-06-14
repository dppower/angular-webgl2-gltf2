import {Injectable, Inject} from "@angular/core";
import {Transform} from "./transform";
import {Observable, Observer} from "rxjs/Rx";
import {ShaderProgram} from "./shader-program";
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

    constructor() { };

    private vertices_: WebGLBuffer;
    private texture_: WebGLTexture;
    private texturesLoaded_ = false;

    initialise(gl: WebGLRenderingContext) {

        this.vertices_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        let vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.texture_ = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture_);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
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
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.texture);
            },
            () => { },
            () => {
                this.texturesLoaded_ = true;
            }
        );        
    };

    draw(program: ShaderProgram, gl: WebGLRenderingContext, camera: Camera) {
        if (!this.texturesLoaded_) return;

        program.use();
       
        gl.depthMask(false);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture_);
        gl.uniform1i(program.getUniform("uSkyboxTexture"), 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_);
        gl.vertexAttribPointer(program.getAttribute("aPosition"), 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(program.getUniform("uInverseView"), false, camera.inverseView);

        gl.uniformMatrix4fv(program.getUniform("uInverseProjection"), false, camera.inverseProjection);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.depthMask(true);
    }

    private transform_ = new Transform("skybox");
}