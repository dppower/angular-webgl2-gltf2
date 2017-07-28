
// Mesh Primitives draw mode
export const POINTS = 0x0000;
export const LINES = 0x0001;
export const LINE_LOOP = 0x0002;
export const LINE_STRIP = 0x0003;
export const TRIANGLES = 0x0004;
export const TRIANGLE_STRIP = 0x0005;
export const TRIANGLE_FAN = 0x0006;

// Uniform types
export const FLOAT_VEC2 = 0x8B50; 	 
export const FLOAT_VEC3 = 0x8B51; 	 
export const FLOAT_VEC4 = 0x8B52; 	 
export const INT_VEC2 = 0x8B53; 	 
export const INT_VEC3 = 0x8B54; 	 
export const INT_VEC4 = 0x8B55; 	 
export const BOOL = 0x8B56; 	 
export const BOOL_VEC2 = 0x8B57; 	 
export const BOOL_VEC3 = 0x8B58; 	 
export const BOOL_VEC4 = 0x8B59; 	 
export const FLOAT_MAT2 = 0x8B5A; 	 
export const FLOAT_MAT3 = 0x8B5B; 	 
export const FLOAT_MAT4 = 0x8B5C; 	 
export const SAMPLER_2D = 0x8B5E; 	 
export const SAMPLER_CUBE = 0x8B60;



// Shaders
export const FRAGMENT_SHADER = 0x8B30;
export const VERTEX_SHADER = 0x8B31;

// BufferView
export const ARRAY_BUFFER = 0x8892;
export const ELEMENT_ARRAY_BUFFER = 0x8893;

// Textures: BindTexture Target
export const TEXTURE_2D = 0x0DE1;
export const TEXTURE_CUBE_MAP = 0x8513;
export const TEXTURE_3D = 0x806F;
export const TEXTURE_2D_ARRAY = 0x8C1A;

export const TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
export const TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
export const TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
export const TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
export const TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
export const TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;

// Sampler parameters
export const NEAREST = 0x2600;
export const LINEAR = 0x2601;
export const NEAREST_MIPMAP_NEAREST = 0x2700;
export const LINEAR_MIPMAP_NEAREST = 0x2701;
export const NEAREST_MIPMAP_LINEAR = 0x2702;
export const LINEAR_MIPMAP_LINEAR = 0x2703; 
export const REPEAT = 0x2901; 	 
export const CLAMP_TO_EDGE = 0x812F; 	 
export const MIRRORED_REPEAT = 0x8370;

// Assessor
export const FLOAT = 0x1406;
export const BYTE = 0x1400;
export const UNSIGNED_BYTE = 0x1401;
export const SHORT = 0x1402;
export const UNSIGNED_SHORT = 0x1403;
export const INT = 0x1404;
export const UNSIGNED_INT = 0x1405;

export const SRGB8_ALPHA8 = 0x8C43;
export const ALPHA = 0x1906;
export const RGB = 0x1907;
export const RGBA = 0x1908;
export const LUMINANCE = 0x1909;
export const LUMINANCE_ALPHA = 0x190A;

export const UNSIGNED_SHORT_4_4_4_4 = 0x8033;
export const UNSIGNED_SHORT_5_5_5_1 = 0x8034;
export const UNSIGNED_SHORT_5_6_5 = 0x8363;