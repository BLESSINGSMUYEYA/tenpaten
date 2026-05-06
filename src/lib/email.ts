import { Resend } from 'resend';

// Only instantiate if API key exists to avoid crash on startup
if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is missing from environment variables. Emails will not be sent.');
}

export const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null as unknown as Resend;

// Default sender. 
export const EMAIL_SENDER = process.env.EMAIL_SENDER || 'onboarding@resend.dev';

if (resend) {
    console.log(`✅ Resend Email Client initialized with sender: ${EMAIL_SENDER}`);
}
