/** Fixed seed keeps the field stable across remounts and theme changes. */
export function createParticles(count: number): Float32Array {
  let seed = 17321;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    positions[i] = (seed / 4294967296 - 0.5) * 40;
  }
  return positions;
}

export function createCoreGeometry(): { positions: Float32Array; normals: Float32Array } {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    -1,
    t,
    0,
    1,
    t,
    0,
    -1,
    -t,
    0,
    1,
    -t,
    0,
    0,
    -1,
    t,
    0,
    1,
    t,
    0,
    -1,
    -t,
    0,
    1,
    -t,
    t,
    0,
    -1,
    t,
    0,
    1,
    -t,
    0,
    -1,
    -t,
    0,
    1,
  ];
  const faces = [
    0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2,
    3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
  ];
  const positions = new Float32Array(faces.length * 3);
  const normals = new Float32Array(positions.length);
  const radius = Math.hypot(1, t);
  faces.forEach((vertex, index) => {
    for (let axis = 0; axis < 3; axis++) positions[index * 3 + axis] = vertices[vertex * 3 + axis] / radius;
  });
  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i + 3] - positions[i];
    const ay = positions[i + 4] - positions[i + 1];
    const az = positions[i + 5] - positions[i + 2];
    const bx = positions[i + 6] - positions[i];
    const by = positions[i + 7] - positions[i + 1];
    const bz = positions[i + 8] - positions[i + 2];
    const normal = [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
    const length = Math.hypot(...normal);
    for (let vertex = 0; vertex < 3; vertex++) {
      for (let axis = 0; axis < 3; axis++) normals[i + vertex * 3 + axis] = normal[axis] / length;
    }
  }
  return { positions, normals };
}

export function createWireframe(): Float32Array {
  const vertices = [
    [1.8, 0, 0],
    [-1.8, 0, 0],
    [0, 1.8, 0],
    [0, -1.8, 0],
    [0, 0, 1.8],
    [0, 0, -1.8],
  ];
  const positions: number[] = [];
  for (let a = 0; a < vertices.length; a++) {
    for (let b = a + 1; b < vertices.length; b++) {
      if (Math.floor(a / 2) !== Math.floor(b / 2)) positions.push(...vertices[a], ...vertices[b]);
    }
  }
  return new Float32Array(positions);
}

export function createRings(): Float32Array {
  const positions: number[] = [];
  for (let ring = 1; ring <= 3; ring++) {
    const tilt = Math.PI / (ring * 1.5);
    for (let segment = 0; segment < 128; segment++) {
      for (const [offset, outer] of [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
        [1, 1],
        [0, 1],
      ]) {
        const angle = ((segment + offset) / 128) * Math.PI * 2;
        const radius = 5 + ring * 2 + outer * 0.02;
        positions.push(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * Math.cos(tilt),
          Math.sin(angle) * radius * Math.sin(tilt)
        );
      }
    }
  }
  return new Float32Array(positions);
}
