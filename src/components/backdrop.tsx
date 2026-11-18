/**
 * Colour fields behind the glass tiles: three soft blobs over a faint grid. Pure CSS
 * (src/styles/layout.css), static: fixed to the viewport, no animation.
 */
export function Backdrop() {
  return (
    <div className="bs-backdrop" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="bs-blobTrack">
          <span className="bs-blob" />
        </span>
      ))}
    </div>
  );
}
