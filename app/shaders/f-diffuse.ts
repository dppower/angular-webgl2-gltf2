export default {
attributes: [],
uniforms: ["uTexture"],
source: "precision mediump float;\nconst float PI = 3.14159265358979323846;\nconst float ambient_color = 0.1;\nconst vec3 light_position = vec3(1.0, 1.0, 1.0);\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoords;\nuniform sampler2D uTexture;\nvoid main(void) {\nvec3 N = normalize(vNormal);\nvec3 L = normalize(light_position - vPosition);\nvec4 Color = texture2D(uTexture, vTextureCoords);\nfloat NdotL = max(dot(N, L), 0.0);\ngl_FragColor = vec4(Color.xyz * (ambient_color + NdotL), 1.0);\n}\n"
}