"use client";

import { useState, type FormEvent } from "react";
import { s } from "@/components/classes";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";

/**
 * Contact form posting straight to Web3Forms (no own backend). Web3Forms delivers the message to
 * the e-mail address tied to site.web3formsKey. The hidden `botcheck` checkbox is its honeypot:
 * bots tend to tick it, and Web3Forms rejects those submissions.
 */
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ t }: { t: Dictionary["contact"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          access_key: site.web3formsKey,
          subject: "Nová zpráva z portfolia",
          from_name: site.name,
        }),
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error("Web3Forms rejected the message");
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
