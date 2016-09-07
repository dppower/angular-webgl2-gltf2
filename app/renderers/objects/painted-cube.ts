import { Vec3, Quaternion } from "../../game-engine/transform";
import { Color } from "../../game-engine/color";

export default {
name: "painted-cube",
position: Vec3.fromArray([0.0, 0.0, 0.5]),
rotation: Quaternion.fromArray([1.0, 0.0, 0.0, 0.0]),
mesh_id: "cube",
uniform_color: Color.fromArray([1.0, 0.0, 0.0, 1.0])
}