"use client";

import { useState, type FormEvent } from "react";
import { s } from "@/components/classes";
import type { Dictionary } from "@/content/cs";
import { sendContactMessage } from "@/lib/contact-action";

/**
 * Contact form sent through the sendContactMessage server action (Resend). The hidden `botcheck`
 * checkbox is a honeypot: bots tend to tick it, and the action drops those submissions.
 * Submitted via onSubmit rather than `action` so a failed send keeps what the visitor typed.
 */

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ t }: { t: Dictionary["contact"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const { ok } = await sendContactMessage(new FormData(form));
      if (!ok) throw new Error("Message not sent");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-6 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className={s.muted}>{t.name}</span>
          <input name="name" type="text" required autoComplete="name" className="bn-field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className={s.muted}>{t.email}</span>
          <input name="email" type="email" required autoComplete="email" className="bn-field" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className={s.muted}>{t.message}</span>
        <textarea name="message" rows={4} required className="bn-field" />
      </label>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={`${s.btn} disabled:opacity-60`} disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p role="status" className={`${s.muted} text-sm`}>
          {status === "sent" ? t.sent : status === "error" ? t.error : ""}
        </p>
      </div>
    </form>
  );
}
