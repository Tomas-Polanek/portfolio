/** T and P sharing one stem (32-unit grid): left half of the T's bar, the stem, the P's bowl. */
export const TP_LIGATURE = "M8 8.5h7M15 8.5v15M15 8.5h4a4.5 4.5 0 0 1 0 9h-4";

/** The logo mark alone, drawn in `currentColor`; place it on the gradient monogram tile. */
export function TpMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path
        d={TP_LIGATURE}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
