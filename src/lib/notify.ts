import dns from "node:dns";
import { site } from "@/lib/site";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { Resend } from "resend";

// VPS often has broken IPv6; Gmail SMTP must use IPv4
dns.setDefaultResultOrder("ipv4first");

export type LeadPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

type SendResult = { ok: true; provider: string } | { ok: false; error: string };

function adminSubject(lead: LeadPayload) {
  return `New lead — ${lead.name} · ${site.domain}`;
}

function adminHtml(lead: LeadPayload) {
  const company = lead.company?.trim();
  return `
    <h2>New contact form submission</h2>
    <p><strong>Site:</strong> ${site.domain}</p>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;background:#f4f6f9;padding:12px;border-radius:8px;">${escapeHtml(lead.message)}</pre>
    <p style="color:#6b7280;font-size:13px;">Reply directly to ${escapeHtml(lead.email)}. Stored in your contact database.</p>
  `;
}

function visitorHtml(name: string) {
  const first = name.split(" ")[0] || name;
  return `
    <p>Hi ${escapeHtml(first)},</p>
    <p>Thanks for reaching out via <strong>${site.domain}</strong>. I received your message and ${site.replyTime.toLowerCase()}.</p>
    <p>— Jayendra</p>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: false, error: "Resend not configured" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, provider: "resend" };
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<SendResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from) {
    return { ok: false, error: "SMTP not configured" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    lookup: (
      hostname: string,
      _options: dns.LookupOptions,
      callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void,
    ) => {
      dns.lookup(hostname, { family: 4 }, callback);
    },
  } as SMTPTransport.Options);

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      replyTo,
    });
    return { ok: true, provider: "smtp" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMTP send failed";
    return { ok: false, error: message };
  }
}

function friendlySmtpError(message: string) {
  if (message.includes("Application-specific password required")) {
    return "Gmail needs an App Password in SMTP_PASS (not your normal Gmail password).";
  }
  if (message.includes("ENETUNREACH") && message.includes("2607:")) {
    return "SMTP could not reach Gmail (IPv6 network unreachable on server). Retry after deploy or set NODE_OPTIONS=--dns-result-order=ipv4first on the service.";
  }
  return message;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<SendResult> {
  // Prefer SMTP when configured (typical VPS / Gmail setup)
  if (process.env.SMTP_PASS) {
    const smtp = await sendViaSmtp(to, subject, html, replyTo);
    if (smtp.ok) return smtp;
    const resend = await sendViaResend(to, subject, html, replyTo);
    if (resend.ok) return resend;
    return {
      ok: false,
      error: friendlySmtpError(smtp.error ?? "SMTP failed"),
    };
  }

  const resend = await sendViaResend(to, subject, html, replyTo);
  if (resend.ok) return resend;

  const smtp = await sendViaSmtp(to, subject, html, replyTo);
  if (smtp.ok) return smtp;

  return {
    ok: false,
    error: `No email provider available (${resend.error}; ${smtp.error})`,
  };
}

export async function notifyAdminOfLead(lead: LeadPayload) {
  const to = process.env.CONTACT_EMAIL ?? site.email;
  return sendEmail(to, adminSubject(lead), adminHtml(lead), lead.email);
}

export async function sendLeadAutoReply(lead: LeadPayload) {
  const subject = `Received your message — ${site.domain}`;
  return sendEmail(lead.email, subject, visitorHtml(lead.name));
}

export async function sendLoginOtpEmail(email: string, code: string) {
  const subject = `Your login code — ${site.domain}`;
  const html = `
    <p>Your one-time login code for <strong>${site.domain}</strong>:</p>
    <p style="font-size:32px;font-weight:700;letter-spacing:6px;font-family:ui-monospace,monospace;">${code}</p>
    <p>This code expires in <strong>10 minutes</strong>.</p>
    <p>After login, your session stays active for <strong>6 hours</strong>.</p>
    <p style="color:#6b7280;font-size:13px;">If you did not request this, you can ignore this email.</p>
  `;
  return sendEmail(email, subject, html);
}
