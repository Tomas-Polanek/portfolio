"use server";

import { Resend } from "resend";
import { site } from "@/content/site";
import { CONTACT_LIMITS } from "@/lib/contact";
import { hasLocale } from "@/lib/locales";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Redeems the Cloudflare Turnstile token from the widget; tokens are single-use and expire after 5 minutes. */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("Contact form: TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  if (!token) return false;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success) console.warn("Contact form: Turnstile rejected the token", result["error-codes"]);
    return result.success === true;
  } catch (error) {
    console.error("Contact form: Turnstile siteverify failed", error);
    return false;
  }
}

/**
 * Sends a contact form message to site.email via Resend, after a Cloudflare Turnstile check.
 * Needs RESEND_API_KEY and TURNSTILE_SECRET_KEY; the sender (site.contactFrom) must be on a domain
 * verified in Resend. Plain text only, so visitor input is never rendered as HTML. A ticked
 * `botcheck` honeypot reports success without sending.
 */
export async function sendContactMessage(formData: FormData): Promise<{ ok: boolean }> {
  if (formData.get("botcheck")) return { ok: true };

  const name = field(formData, "name");
  const email = field(formData, "email");
  const message = field(formData, "message");
  const lang = field(formData, "lang");
  if (
    !name ||
    name.length > CONTACT_LIMITS.name ||
    !EMAIL_PATTERN.test(email) ||
    email.length > CONTACT_LIMITS.email ||
    !message ||
    message.length > CONTACT_LIMITS.message ||
    !hasLocale(lang)
  ) {
    return { ok: false };
  }

  if (!(await verifyTurnstile(field(formData, "cf-turnstile-response")))) return { ok: false };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set");
    return { ok: false };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: site.contactFrom,
    to: site.email,
    replyTo: email,
    subject: `Nová zpráva z portfolia: ${name.replace(/[\r\n]+/g, " ")}`,
    text: `Od: ${name} <${email}>\nJazyk: ${lang}\n\n${message}`,
  });
  if (error) {
    console.error("Contact form: Resend rejected the message", error);
    return { ok: false };
  }
  return { ok: true };
}
