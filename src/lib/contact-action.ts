"use server";

import { Resend } from "resend";
import { site } from "@/content/site";

const MAX_NAME = 200;
const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Sends a contact form message to site.email via Resend. Needs RESEND_API_KEY; the sender
 * (site.contactFrom) must be on a domain verified in Resend. Plain text only, so visitor input is
 * never rendered as HTML. A ticked `botcheck` honeypot reports success without sending.
 */
export async function sendContactMessage(formData: FormData): Promise<{ ok: boolean }> {
  if (formData.get("botcheck")) return { ok: true };

  const name = field(formData, "name");
  const email = field(formData, "email");
  const message = field(formData, "message");
  if (
    !name ||
    name.length > MAX_NAME ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    !message ||
    message.length > MAX_MESSAGE
  ) {
    return { ok: false };
  }

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
    text: `Od: ${name} <${email}>\n\n${message}`,
  });
  if (error) {
    console.error("Contact form: Resend rejected the message", error);
    return { ok: false };
  }
  return { ok: true };
}
