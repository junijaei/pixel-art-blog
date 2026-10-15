/** One demand-driven loop per canvas; decoration is capped at 30 fps. */
export function createHeroAnimation(draw: (time: number) => void, reducedMotion: boolean) {
  const interval = 1000 / 30;
  let visible = true;
  let disposed = false;
  let frameId = 0;
  let previous: number | null = null;
  let elapsed = 0;
  let dirty = true;

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previous = null;
  };

  const frame = (now: number) => {
    frameId = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous === null ? 0 : now - previous;
    if (dirty || previous === null || delta >= interval) {
      if (!reducedMotion) elapsed += Math.min(delta, 100) / 1000;
      previous = now;
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
