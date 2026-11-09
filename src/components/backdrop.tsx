/**
 * Colour fields behind the glass tiles: three soft blobs over a faint grid. Pure CSS
 * (src/styles/layout.css): each track follows the page scroll, each blob drifts slowly inside it;
 * both animate transform only, so they are composited without repaints.
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
