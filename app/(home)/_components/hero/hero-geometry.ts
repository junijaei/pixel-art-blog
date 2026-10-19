/** Fixed seed keeps the field stable across remounts and theme changes. */
export function createParticles(count: number): Float32Array {
  let seed = 17321;
  const nextRandom = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i += 3) {
    // Uniform directions and volume density surround the camera without a flat backdrop.
    const azimuth = nextRandom() * Math.PI * 2;
    const vertical = nextRandom() * 2 - 1;
    const radius = Math.cbrt(8 ** 3 + nextRandom() * (55 ** 3 - 8 ** 3));
    const horizontal = Math.sqrt(1 - vertical * vertical);
    positions[i] = Math.cos(azimuth) * horizontal * radius;
    positions[i + 1] = vertical * radius;
    positions[i + 2] = Math.sin(azimuth) * horizontal * radius;
  }
  return positions;
}

/** Fixed-seed local dust cloud, matching the compact foreground field in the original hero. */
export function createDust(count: number): Float32Array {
  let seed = 9419;
  const nextRandom = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i++) positions[i] = (nextRandom() - 0.5) * 40;
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
