/** Brief, staggered passages with long quiet intervals. Time zero stays still. */
export function getMeteorProgress(seconds: number): number | null {
  const cycle = Math.floor(seconds / 24);
  const local = seconds - cycle * 24 - (7 + (cycle % 3) * 2);
  return local >= 0 && local < 1.6 ? local / 1.6 : null;
}
