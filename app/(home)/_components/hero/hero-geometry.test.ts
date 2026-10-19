import { describe, expect, it } from 'vitest';

import { createCoreGeometry, createParticles } from '@/app/(home)/_components/hero/hero-geometry';

describe('hero geometry', () => {
  it('reproduces a spherical particle field surrounding the viewer with varied depth', () => {
    const points = createParticles(3000);
    expect(points).toEqual(createParticles(3000));
    expect(points.length).toBe(9000);
    expect(Array.from(points).every(Number.isFinite)).toBe(true);
    expect(createParticles(0)).toHaveLength(0);
    const radii: number[] = [];
    for (let i = 0; i < points.length; i += 3) {
      const radius = Math.hypot(points[i], points[i + 1], points[i + 2]);
      expect(radius).toBeGreaterThanOrEqual(8);
      expect(radius).toBeLessThanOrEqual(55);
      radii.push(radius);
    }
    expect(Math.min(...radii)).toBeLessThan(15);
    expect(Math.max(...radii)).toBeGreaterThan(50);
    for (let axis = 0; axis < 3; axis++) {
      const coordinates = Array.from(points).filter((_, index) => index % 3 === axis);
      expect(coordinates.filter((value) => value > 0).length).toBeGreaterThan(1200);
      expect(coordinates.filter((value) => value < 0).length).toBeGreaterThan(1200);
    }
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
});
