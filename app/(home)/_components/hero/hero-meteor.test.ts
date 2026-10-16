import { describe, expect, it } from 'vitest';

import { getMeteorProgress } from '@/app/(home)/_components/hero/hero-meteor';

describe('ambient meteor timing', () => {
  it('keeps the initial and reduced-motion frame quiet', () => {
    expect(getMeteorProgress(0)).toBeNull();
    expect(getMeteorProgress(6)).toBeNull();
  });

  it('allows a short passage followed by a long quiet interval', () => {
    expect(getMeteorProgress(7)).toBe(0);
    expect(getMeteorProgress(7.8)).toBeCloseTo(0.5);
    expect(getMeteorProgress(8.7)).toBeNull();
    expect(getMeteorProgress(24)).toBeNull();
    expect(getMeteorProgress(33)).toBe(0);
    expect(getMeteorProgress(34.7)).toBeNull();
  });
});
