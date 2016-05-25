export default {
    attributes: ["aVertexPosition", "aNormals", "aTextureCoords"],
    uniforms: ["uView", "uProjection", "uTransform"],
    source: `
        attribute vec3 aVertexPosition;
        attribute vec3 aNormals;
        attribute vec2 aTextureCoords;

        uniform mat4 uView;
        uniform mat4 uProjection;
        uniform mat4 uTransform;
    
        varying vec2 vTextureCoords;
        varying vec3 vNormals;
        varying vec3 vPosition;

        void main(void) {
            vec4 vertex_position = uView * uTransform * vec4(aVertexPosition, 1.0);
            gl_Position = uProjection * vertex_position;
            vTextureCoords = aTextureCoords;
            vNormals = vec3(uView * uTransform * vec4(aNormals, 0.0));
            vPosition = vec3(vertex_position);
        }
    `
};