function createPlane() {
    let indices = [], vertices = [], normals = [], uvs = [];

    const c = [0, 0, 0];
    const w = 2;
    const h = 2;

    const w2 = w * 0.5;
    const h2 = h * 0.5;

    vertices.push(c[0] - w2, c[1] + h2, c[2]);
    vertices.push(c[0] + w2, c[1] + h2, c[2]);
    vertices.push(c[0] + w2, c[1] - h2, c[2]);
    vertices.push(c[0] - w2, c[1] - h2, c[2]);

    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
    uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
    indices.push(0, 2, 1, 0, 3, 2);

    return {
        indices: new Uint16Array(indices),
        vertices: new Float32Array(vertices),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs)
    };
}
