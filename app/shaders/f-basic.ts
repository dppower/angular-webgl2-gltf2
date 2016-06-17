export default {
attributes: [],
uniforms: ["uColour"],
source: "precision mediump float;\nuniform vec4 uColour;\nvoid main(void) {\ngl_FragColor = uColour;\n}\n"
}