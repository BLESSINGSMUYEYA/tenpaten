import { Resend } from 'resend';

// Only instantiate if API key exists to avoid crash on startup
export const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null as unknown as Resend;

// Default sender. 
// If you don't have a domain, use 'onboarding@resend.dev' and send ONLY to your own email.
// Once you verify a domain (e.g. updates@tenpaten.com), change this.
export const EMAIL_SENDER = process.env.EMAIL_SENDER || 'onboarding@resend.dev';
