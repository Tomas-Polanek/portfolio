"use client";

import Image from "next/image";
import { useId, useRef, type ReactNode } from "react";

/**
 * Project cover that opens the screenshot uncropped in a modal dialog, with the app's name and
 * description underneath. Native <dialog>: Esc, the close button and a backdrop click close it.
 */
export function CoverDialog({
  image,
  alt,
  title,
  description,
  openLabel,
  closeLabel,
  children,
}: {
  image: string;
  alt: string;
  title: string;
  description: string;
  openLabel: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        className="bn-coverBtn"
        aria-haspopup="dialog"
        aria-label={`${openLabel}: ${title}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        {children}
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
