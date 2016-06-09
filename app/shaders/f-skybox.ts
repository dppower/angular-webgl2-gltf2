export default {
attributes: [],
uniforms: ["uSkyboxTexture"],
source: "#version 100\nprecision mediump float;\nvarying vec3 vViewDirection;\nuniform samplerCube uSkyboxTexture;\nvoid main() {\ngl_FragColor = textureCube(uSkyboxTexture, vViewDirection);\n}\n"
}