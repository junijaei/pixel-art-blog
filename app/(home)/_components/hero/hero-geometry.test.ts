import { describe, expect, it } from 'vitest';

import {
  createCoreGeometry,
  createParticles,
  createRings,
  createWireframe,
} from '@/app/(home)/_components/hero/hero-geometry';

describe('hero geometry', () => {
  it('reproduces the particle field without random render-time input', () => {
    const points = createParticles(3000);
    expect(points).toEqual(createParticles(3000));
    expect(points.length).toBe(9000);
    expect(Array.from(points).every((value) => Number.isFinite(value) && Math.abs(value) <= 20)).toBe(true);
  });

  it('builds twenty outward-facing flat icosahedron faces with unit normals', () => {
    const { positions, normals } = createCoreGeometry();
    expect(positions.length).toBe(180);
    expect(normals.length).toBe(180);
    for (let i = 0; i < positions.length; i += 3) {
      expect(Math.hypot(...positions.slice(i, i + 3))).toBeCloseTo(1);
      expect(Math.hypot(...normals.slice(i, i + 3))).toBeCloseTo(1);
      expect(
        positions[i] * normals[i] + positions[i + 1] * normals[i + 1] + positions[i + 2] * normals[i + 2]
      ).toBeGreaterThan(0);
    }
  });

  it('retains all twelve octahedron edges and three complete tilted orbits', () => {
    expect(createWireframe().length).toBe(12 * 2 * 3);
    const rings = createRings();
    expect(rings.length).toBe(3 * 128 * 6 * 3);
    expect(Array.from(rings).every(Number.isFinite)).toBe(true);
    expect(Math.hypot(...rings.slice(0, 3))).toBeCloseTo(7);
  });
});
