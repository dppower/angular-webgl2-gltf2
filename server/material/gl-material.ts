import * as fs from "fs";
import { glObject } from "../gl-object";

type Material = "base_color" | "metallic" | "roughness" | "normal_map" | "ambient_occulsion" /*| "emission" | "height_map" | "displacement_map"*/;
const Materials = {
    pbr: {
        base_color: "base_color",
        metal_rough_ao: "metal_rough_ao",
        normal_map: "normal_map"
    }
};
export class glMaterial extends glObject {
    //technique: number;
    values: {[type in Material]?: string} = {};

    constructor(private material_path: string, private primitive_id: string) {
        super();
        
        // primitive/mesh name + material type "cube_001" + "_" + "base_color"
        
    };

    // Look into material folder
    locateMaterial() {
        // Find and match image
        let file_regex = new RegExp("^" + this.primitive_id);
        let material_regex = new RegExp("^" + this.primitive_id + "_(base_color | metallic | roughness | normal_map)");
        fs.readdir(this.material_path, (err, files) => {
            let material_files = files.filter((file_name) => {
                return file_regex.test(file_name);
            });
            material_files.forEach(file => {
                let material_type = (<Material>file.match(material_regex)[1]);
                this.values[material_type] = file;
            });
        });

    };

    toGLTF() {
        return {
            //technique: this.technique,
            values: this.values
        };
    };
};