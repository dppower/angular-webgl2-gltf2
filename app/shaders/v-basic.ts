export default {
attributes: ["aVertexPosition"],
uniforms: ["uView", "uProjection", "uTransform"],
source: "attribute vec3 aVertexPosition;\nuniform mat4 uView;\nuniform mat4 uProjection;\nuniform mat4 uTransform;\nvoid main(void) {\ngl_Position = uProjection * uView * uTransform * vec4(aVertexPosition, 1.0);\n}\n"
}