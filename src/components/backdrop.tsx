/**
 * Colour fields behind the glass tiles: three soft blobs drifting slowly over a faint grid. Pure CSS
 * (src/styles/layout.css); the drift animates transform only, so it is composited without repaints.
 */
export function Backdrop() {
  return (
    <div className="bs-backdrop" aria-hidden="true">
      <span className="bs-blob" />
      <span className="bs-blob" />
      <span className="bs-blob" />
    </div>
  );
}
