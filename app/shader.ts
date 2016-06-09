export enum ShaderType {
    Vertex,
    Fragment
};

export function compileShader(gl: WebGLRenderingContext, type: ShaderType, source: string) {

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
        
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let shader_type = (type == 0) ? "Vertex" : "Fragment";
        console.log(shader_type + ", name: " + source + ", shader compilation error: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader; 
};

export interface ShaderSource {
    uniforms: string[],
    attributes: string[],
    source: string
}