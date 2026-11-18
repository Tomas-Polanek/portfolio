"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { s } from "@/components/classes";
import type { Dictionary } from "@/content/cs";
import { CONTACT_LIMITS } from "@/lib/contact";
import { sendContactMessage } from "@/lib/contact-action";
import type { Locale } from "@/lib/locales";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let turnstileLoader: Promise<Turnstile> | null = null;

/** Loads the Cloudflare Turnstile script once per page. */
function loadTurnstile(): Promise<Turnstile> {
  if (turnstileLoader) return turnstileLoader;
  const { promise, resolve, reject } = Promise.withResolvers<Turnstile>();
  const script = document.createElement("script");
  script.src = TURNSTILE_SCRIPT;
  script.async = true;
  script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
  script.onerror = () => {
    turnstileLoader = null;
    reject(new Error("Turnstile script failed to load"));
  };
  document.head.append(script);
  turnstileLoader = promise;
  return promise;
}

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact form sent through the sendContactMessage server action (Resend). Spam protection:
 * a Cloudflare Turnstile widget (loaded when the form nears the viewport, visible only when it needs
 * an interaction) puts its token into the form as `cf-turnstile-response`, and the hidden `botcheck`
 * checkbox is a honeypot. Submitted via onSubmit rather than `action` so a failed send keeps what
 * the visitor typed.
 */
export function ContactForm({ t, locale }: { t: Dictionary["contact"]["form"]; locale: Locale }) {
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    const container = widgetRef.current;
    if (!container || !TURNSTILE_SITE_KEY) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadTurnstile().then(
          (turnstile) => {
            if (cancelled) return;
            widgetId.current = turnstile.render(container, {
              sitekey: TURNSTILE_SITE_KEY,
              language: locale,
              theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
              appearance: "interaction-only",
              size: "flexible",
              callback: (value: string) => setToken(value),
              "expired-callback": () => setToken(""),
              "error-callback": () => {
                setToken("");
                setStatus("error");
              },
            });
          },
          () => {
            if (!cancelled) setStatus("error");
          },
        );
      },
      { rootMargin: "400px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [locale]);

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
    } finally {
      // Tokens are single-use: get a fresh one for the next attempt.
      setToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-6 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className={s.muted}>{t.name}</span>
          <input
            name="name"
            type="text"
            required
            maxLength={CONTACT_LIMITS.name}
            autoComplete="name"
            className="bn-field"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className={s.muted}>{t.email}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={CONTACT_LIMITS.email}
            autoComplete="email"
            className="bn-field"
          />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className={s.muted}>{t.message}</span>
        <textarea name="message" rows={4} required maxLength={CONTACT_LIMITS.message} className="bn-field" />
      </label>
      <input type="hidden" name="lang" value={locale} />
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div ref={widgetRef} />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className={`${s.btn} disabled:opacity-60`}
          disabled={status === "sending" || !token}
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p role="status" className={`${s.muted} text-sm`}>
          {status === "sent" ? t.sent : status === "error" ? t.error : ""}
        </p>
      </div>
    </form>
  );
}
