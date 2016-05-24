export default `
    precision mediump float;
    
    const float PI = 3.14159265358979323846;
    const float ambient_light = 0.1;
    const vec3 light_position = vec3(1.0, 1.0, 1.0);

    varying vec3 vPosition;
    varying vec3 vNormals;

    varying vec2 vTextureCoords;

    uniform sampler2D uBaseTexture;

    void main(void) {
	    vec3 N = normalize(vNormals);
	    vec3 L = normalize(light_position - vPosition);

	    vec4 color = texture2D(uBaseTexture, vTextureCoords);
        float NdotL = max(dot(N, L), 0.0);
	    gl_FragColor = vec4(color.xyz * (ambient_light + NdotL), 1.0);

    }
`;