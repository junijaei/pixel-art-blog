/** Visibility-aware 60 fps loop with a continuous clock and fractional frame budget. */
export function createHeroAnimation(draw: (time: number) => void, reducedMotion: boolean) {
  const interval = 1000 / 60;
  let visible = true;
  let disposed = false;
  let frameId = 0;
  let previous: number | null = null;
  let elapsed = 0;
  let sinceDraw = 0;
  let dirty = true;

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previous = null;
    sinceDraw = 0;
  };

  const frame = (now: number) => {
    frameId = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous === null ? 0 : Math.min(now - previous, 100);
    previous = now;
    if (!reducedMotion) elapsed += delta / 1000;
    sinceDraw += delta;
    // RAF timestamps jitter around 16.67 ms; don't accidentally halve the rate.
    if (dirty || sinceDraw + 0.5 >= interval) {
      sinceDraw = sinceDraw >= interval ? sinceDraw % interval : 0;
      dirty = false;
      draw(reducedMotion ? 0 : elapsed);
    }
    if (!reducedMotion) frameId = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (!disposed && visible && !document.hidden && !frameId) frameId = requestAnimationFrame(frame);
  };
  const onVisibility = () => {
    stop();
    dirty = true;
    wake();
  };
  document.addEventListener('visibilitychange', onVisibility);
  wake();

  return {
    setVisible(value: boolean) {
      visible = value;
      stop();
      if (value) {
        dirty = true;
        wake();
      }
    },
    setReducedMotion(value: boolean) {
      reducedMotion = value;
      stop();
      dirty = true;
      wake();
    },
    invalidate() {
      dirty = true;
      wake();
    },
    dispose() {
      disposed = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
