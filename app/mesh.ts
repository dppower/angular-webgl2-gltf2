export interface Mesh {
    vertices_count: number;
    vertex_positions: number[],
    vertex_normals?: number[],
    vertex_colors?: number[],
    texture_coordinates?: number[]
};