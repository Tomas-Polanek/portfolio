"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { raiseMagicCursor } from "@/components/magic-cursor";

/**
 * "Preview" chip that opens the project's screenshot uncropped in a modal dialog, with the app's
 * name and description underneath. Native <dialog>: Esc, the close button and a backdrop click
 * close it.
 */
export function ScreenshotDialog({
  image,
  alt,
  title,
  description,
  label,
  closeLabel,
  className,
}: {
  image: string;
  alt: string;
  title: string;
  description: string;
  /** Visible button text ("Preview"); the accessible name adds the project title. */
  label: string;
  closeLabel: string;
  className: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        className={className}
        aria-haspopup="dialog"
        aria-label={`${label}: ${title}`}
        onClick={() => {
          dialogRef.current?.showModal();
          raiseMagicCursor();
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m3 16 5-5 4 4 3-3 6 6" />
          <circle cx="15.5" cy="8.5" r="1.5" />
        </svg>
        {label}
      </button>
      <dialog
        ref={dialogRef}
        className="bn-shot"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="bn-shotInner">
          <div className="bn-shotImage">
            <Image src={image} alt={alt} fill sizes="(min-width: 1180px) 1100px, 94vw" />
          </div>
          <div className="bn-shotText">
            <h3 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h3>
            <p className="bn-muted mt-1.5 text-[0.93rem] leading-relaxed">{description}</p>
          </div>
          <form method="dialog">
            <button type="submit" className="bn-iconBtn bn-shotClose" aria-label={closeLabel}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
