export default {
attributes: ["aVertexPosition", "aNormals", "aTextureCoords"],
uniforms: ["uView", "uProjection", "uTransform"],
source: "attribute vec3 aVertexPosition;\nattribute vec3 aNormals;\nattribute vec2 aTextureCoords;\nuniform mat4 uView;\nuniform mat4 uProjection;\nuniform mat4 uTransform;\nvarying vec2 vTextureCoords;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvoid main(void) {\nvec4 vertex_position = uView * uTransform * vec4(aVertexPosition, 1.0);\ngl_Position = uProjection * vertex_position;\nvTextureCoords = aTextureCoords;\nvNormal = vec3(uView * uTransform * vec4(aNormals, 0.0));\nvPosition = vec3(vertex_position);\n}\n"
}