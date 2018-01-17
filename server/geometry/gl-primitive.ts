import { glObject } from "../gl-object";
import { gl } from "../gl-constants";

type DrawMode = gl.POINTS | gl.LINES | gl.LINE_LOOP | gl.LINE_STRIP | gl.TRIANGLES | gl.TRIANGLE_STRIP | gl.TRIANGLE_FAN; 

type Attribute = "POSITION" | "NORMAL" | "TANGENT" | "TEXCOORD_0" | "TEXCOORD_1" | "COLOR";

export class glPrimitive extends glObject {
    
    //indices: number; // If using indices, assessor must have byteStride = 0, componentType = unsigned byte or short, type = "SCALAR".
    //attributes: {[type in Attribute]: number };
    //material: number; // Index in material array

    //constructor(private primitive_id: string, attribs: AttributeSemantics[],
    //    public buffer_view: glBufferView, attribute_count: number,
    //    public readonly mode: DrawMode = gl.TRIANGLES
    //) {
    constructor(
        public readonly attributes: {[type in Attribute]: number },
        public readonly mode: DrawMode = gl.TRIANGLES,
        public readonly material?: number,
        public readonly indices?: number,
    ) {
        super();
        //this.mode = gl[draw_mode];

        //let byte_stride = 0;
        //attribs.forEach((attrib) => {
        //    byte_stride += MeshAttributes[attrib].stride;
        //});
        //let byte_offset = 0;
        ////this.attributes = { };
        //this.attributes = { "POSITION": null, "NORMAL": null, "TEXCOORD_0": null, "COLOR": null };
        //attribs.forEach((attrib) => {
        //    let id = this.primitive_id + "_" + attrib;
        //    this.attributes[attrib] = new glAccessor(id, buffer_view, byte_offset, byte_stride, attribute_count, MeshAttributes[attrib].type);
        //    byte_offset += MeshAttributes[attrib].stride;
        //});
    };

    toGLTF() {
        let object = {
            attributes: this.attributes,
            mode: this.mode
        }
        //for (let i in this.attributes) {
        //    object.attributes[i] = this.attributes[i];
        //}
        if (this.material) {
            object["material"] = this.material;
        }
        if (this.indices) {
            object["indices"] = this.indices;
        }
        return object;
    };
};