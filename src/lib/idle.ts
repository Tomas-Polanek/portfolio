/**
 * Runs `callback` once the main thread is idle (a short timeout where requestIdleCallback is
 * missing, i.e. Safari). Returns a cancel function.
 */
export function onIdle(callback: () => void, timeout = 2000): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 200);
  return () => window.clearTimeout(id);
}
