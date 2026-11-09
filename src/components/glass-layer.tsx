/**
 * Frosted glass surface behind a tile's content. Put it first inside a `.bn-tile` (or the panel): it
 * fills the parent, sits under the content (z-index -1 in the tile's isolated stacking context) and
 * blurs the page backdrop.
 */
export function GlassLayer({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`bs-glass ${className}`} />;
}
