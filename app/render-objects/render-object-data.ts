export interface RenderObjectData {
    name: string;
    position: number[];
    rotation: number[];
    mesh_id: string;
    uniform_color?: number[],
    texture_name?: string,
    textures?: string[]
};