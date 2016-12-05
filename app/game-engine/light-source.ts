import { Injectable } from "@angular/core";

import { ShaderProgram } from "../shaders/shader-program";
import { Uint32 } from "../game-engine/uint32";
import { Float32 } from "../game-engine/float32";
import { Vec3 } from "./transform";

enum LightType {
    Point,
    Directional
};

@Injectable()
export class LightSource {
    light_color: Vec3;
    light_radius: Float32;
    light_direction: Vec3;
    light_position: Vec3;
    type: Uint32;
    is_active: boolean;

    static uniforms = ["light_color", "light_radius", "light_direction", "light_position", "type", "is_active"];

    constructor(private gl: WebGL2RenderingContext, private index_: number) { };

    // update() { };

    setLightUniforms(program: ShaderProgram) {
        LightSource.uniforms.forEach((variable_name) => {
            let uniform_name = `lights[${this.index_}].${variable_name}`;
            let value = this[variable_name];
            program.setUniform(uniform_name, value);
        })
    };
};