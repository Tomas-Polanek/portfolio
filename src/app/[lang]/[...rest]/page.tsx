import { notFound } from "next/navigation";

// Any unknown path under /cs or /en renders [lang]/not-found.tsx inside the localized layout.
export default function CatchAll() {
  notFound();
}
