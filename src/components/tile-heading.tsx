import { s } from "@/components/classes";

/** Numbered eyebrow and title for a bento tile (About, Education). `id` goes on the <h2>. */
export function TileHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <>
      <p className={s.eyebrow}>
        <span className={s.dot} /> {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </>
  );
}
