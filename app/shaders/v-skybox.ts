export default {
attributes: ["aPosition"],
uniforms: ["uInverseProjection", "uInverseView"],
source: "#version 100\nattribute vec2 aPosition;\nuniform mat4 uInverseProjection;\nuniform mat4 uInverseView;\nvarying vec3 vViewDirection;\nvoid main() {\ngl_Position = vec4(aPosition, 0.0, 1.0);\nvec4 unprojected = uInverseProjection * vec4(aPosition, 0.0, 1.0);\nvViewDirection = normalize(mat3(uInverseView) * vec3(unprojected));\n}\n"
}