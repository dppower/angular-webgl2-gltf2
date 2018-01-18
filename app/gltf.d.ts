declare namespace glTF {   
    interface Orthographic {
        xmag: number;
        ymag: number;
        zfar: number;
        znear: number;
    }
    
    interface Perspective {
        /**When this is undefined, the aspect ratio of the canvas is used.*/
        aspectRatio?: number;
        /**The floating-point vertical field of view in radians.*/
        yfov: number;
        /**If zfar is undefined, must use infinite projection matrix.*/
        zfar?: number;
        /**The floating-point distance to the near clipping plane.*/
        znear: number;
    }

    /**
    A camera's projection. A node can reference a camera to apply a transform to place the camera in the scene.
    */
    interface Camera {
        orthographic?: Orthographic;
        perspective?: Perspective;
        type: "orthographic" | "perspective";
    }

    interface Sampler {
        /**
        9728: NEAREST
        9729: LINEAR
        */
        magFilter?: 9728 | 9729;
        /**
        9728: NEAREST
        9729: LINEAR
        9984: NEAREST_MIPMAP_NEAREST
        9985: LINEAR_MIPMAP_NEAREST
        9986: NEAREST_MIPMAP_LINEAR
        9987: LINEAR_MIPMAP_LINEAR
        */
        minFilter?: 9728 | 9729 | 9984 | 9985 | 9986 | 9987;
        /**
        Default: REPEAT
        33071: CLAMP_TO_EDGE
        33648: MIRRORED_REPEAT
        10497: REPEAT
        */
        wrapS?: 33071 | 33648 | 10497;
        /**
        Default: REPEAT
        33071: CLAMP_TO_EDGE
        33648: MIRRORED_REPEAT
        10497: REPEAT
        */
        wrapT?: 33071 | 33648 | 10497;
    }

    type ImageMimeType = "image/jpeg" | "image/png";

    /**
    Image data used to create a texture. Image can be referenced by URI or bufferView index.
    mimeType is required in the latter case.
    */
    interface Image {
        /**
        The uri of the image. Relative paths are relative to the .gltf file.
        Instead of referencing an external file, the uri can also be a data-uri.
        The image format must be jpg or png.
        */
        uri?: string;
        mimeType?: ImageMimeType;
        bufferView?: number;
    }

    interface Texture {
        source: number;
        sampler?: number;
    }

    interface TextureInfo {
        index: number;
        /** default 0 => TEXCOORD_0 */
        texCoord?: number;
    }

    interface NormalTextureInfo extends TextureInfo {
        scale?: number;
    }

    interface OcclusionTextureInfo extends TextureInfo {
        strength?: number;
    }

    interface pbrMetallicRoughness {
        /**Default: [1, 1, 1, 1] */
        baseColorFactor?: number[];
        baseColorTexture?: TextureInfo;
        /** 0 is dielectric, 1 is metal, default: 1*/
        metallicFactor?: number;
        /** 0 is smooth, 1 is rough, default: 1*/
        roughnessFactor?: number;
        /** Metallic is read from B channel, Roughness read from G channel*/
        metallicRoughnessTexture?: TextureInfo;
    }

    interface Material {
        pbrMetallicRoughness?: pbrMetallicRoughness;
        normalTexture?: NormalTextureInfo;
        /**Read from R channel*/
        occulsionTexture?: OcclusionTextureInfo;
        emissiveTexture?: TextureInfo;
        /**Default: [0, 0, 0]*/
        emissiveFactor?: number[];
        /**Default: OPAQUE*/
        alphaMode?: "OPAQUE" | "MASK" | "BLEND";
        alphaCutoff?: number;
        doubleSided?: boolean;
    }

    /**Represented by ArrayBuffer*/
    interface Buffer {
        /**uri is relative, dataUrl, or not included in .glb */
        uri?: string;
        byteLength: number;
    }

    /***/
    interface BufferView {
        buffer: number;       
        byteLength: number;
        byteOffset?: number;
        /**vertexAttribPointer() stride parameter*/
        byteStride?: number;
        /**bindBuffer() target: ARRAY_BUFFER (34962), ELEMENT_ARRAY_BUFFER (34963)*/
        target?: 34962 | 34963;
    }

    interface Accessor {
        bufferView?: number;
        /**vertexAttribPointer() offset parameter*/
        byteOffset?: number;
        /**
        vertexAttribPointer() type parameter
        5120 BYTE => Int8Array
        5121 UNSIGNED_BYTE => Uint8Array
        5122 SHORT => Int16Array
        5123 UNSIGNED_SHORT => Uint16Array
        5125 UNSIGNED_INT => Uint32Array (primitive.indices only)
        5126 FLOAT => Float32Array
        */
        componentType: 5120 | 5121 | 5122 | 5123 | 5125 | 5126;
        /**vertexAttribPointer() normalized parameter*/
        normalized?: boolean;
        /**Number of vertices*/
        count: number;
        type: "SCALAR" | "VEC2" | "VEC3" | "VEC4" | "MAT2" | "MAT3" | "MAT4";
        max?: number[];
        min?: number[];
        sparse?: object;
    }

    type Attribute = "POSITION" | "NORMAL" | "TANGENT" | "TEXCOORD_0" | "TEXCOORD_1" |
        "COLOR_0" | "JOINTS_0" | "WEIGHTS_0";

    interface Primitive {
        /**
        POSITION; VEC3; 5126 (FLOAT); XYZ vertex positions

        NORMAL; VEC3; 5126 (FLOAT); Normalized XYZ vertex normals

        TANGENT; VEC4; 5126 (FLOAT); XYZW vertex tangents where the w component is a sign value (-1 or +1) indicating handedness of the tangent basis

        TEXCOORD_0; VEC2; 5126 (FLOAT), 5121 (UNSIGNED_BYTE) normalized, 5123 (UNSIGNED_SHORT) normalized
        TEXCOORD_1; VEC2; 5126 (FLOAT), 5121 (UNSIGNED_BYTE) normalized, 5123 (UNSIGNED_SHORT) normalized

        COLOR_0; VEC3, VEC4; 5126 (FLOAT), 5121 (UNSIGNED_BYTE) normalized, 5123 (UNSIGNED_SHORT) normalized; RGB or RGBA vertex color

        JOINTS_0; VEC4; 5121 (UNSIGNED_BYTE), 5123 (UNSIGNED_SHORT)
        WEIGHTS_0; VEC4; 5126 (FLOAT), 5121 (UNSIGNED_BYTE) normalized, 5123 (UNSIGNED_SHORT) normalized
        */
        attributes: { [id in Attribute]: number };
        indices?: number;
        material?: number;
        /**
        Default: 4 (TRIANGLES)
        0: POINTS
        1: LINES
        2: LINE_LOOP
        3: LINE_STRIP
        4: TRIANGLES
        5: TRIANGLE_STRIP
        6: TRIANGLE_FAN
        */
        mode?: number;
    }

    interface Mesh {
        primitives: Primitive[];
        weights?: number[];
    }

    interface Node {
        camera?: number;
        children?: number[];
        mesh?: number;
        /**Default: [0,0,0,1]*/
        rotation?: number[];
        /**Default: [0, 0, 0]*/
        translation?: number[];
        /**Default: [1,1,1]*/
        scale?: number[];
        /**Default: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]*/
        matrix?: number[];
        skin?: number;
        weights?: number[];
    }

    interface Scene {
        nodes: number[];
    }
}

interface glTF {
    samplers?: glTF.Sampler[];
    images?: glTF.Image[];
    textures?: glTF.Texture[];
    materials?: glTF.Material[];
    buffers?: glTF.Buffer[];
    bufferViews?: glTF.BufferView[];
    accessors?: glTF.Accessor[];
    cameras?: glTF.Camera[];
    meshes?: glTF.Mesh[];
    scene?: number;
    scenes?: glTF.Scene[];
    nodes?: glTF.Node[];
}