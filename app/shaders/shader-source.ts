export enum ShaderType {
    Vertex,
    Fragment
};

export interface VertexShaderSource {
    attributes: string[],
    uniforms: string[],
    source: string
}

export interface FragmentShaderSource {   
    attributes: string[],
    uniforms: string[],
    source: string
}

export function compileShader(gl: WebGL2RenderingContext, type: ShaderType,
    source: string, version: string, definitions: string[]
) {

    let shader: WebGLShader;

    switch (type) {
        case ShaderType.Vertex: {
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
        }
        case ShaderType.Fragment: {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        }
        default: {
            return null
        }
    }

    let definition = definitions.reduce((acc, next) => {
        return acc + next + "\n";
    }, "");

    let full_source = version + "\n" + definition + source;
    gl.shaderSource(shader, full_source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let shader_type = (type == 0) ? "Vertex" : "Fragment";
        console.log(shader_type + ", name: " + full_source + ", shader compilation error: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader; 
};