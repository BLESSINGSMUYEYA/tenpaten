import { resend, EMAIL_SENDER } from './email';

const BRAND_COLOR = '#36335e';
const ACCENT_COLOR = '#d5a22d';
const BG_COLOR = '#f4f7fa';
const TEXT_COLOR = '#374151';
const HEADING_COLOR = '#111827';

const baseEmailStyles = `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #e5e7eb;`;
const contentStyles = `padding: 40px 32px; color: ${TEXT_COLOR}; line-height: 1.6;`;
const buttonStyles = `background-color: ${BRAND_COLOR}; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(54, 51, 94, 0.3); transition: all 0.2s;`;
const footerStyles = `background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;`;

const emailHeader = `
    <div style="background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #2a284a 100%); padding: 60px 40px; text-align: center;">
        <div style="margin-bottom: 16px;">
            <span style="color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Tenpaten<span style="color: ${ACCENT_COLOR};">.</span></span>
        </div>
        <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
            Unlocking Global Education Opportunities
        </div>
    </div>
`;

export async function sendWelcomeEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY || !resend) {
        console.warn('RESEND_API_KEY is missing. Skipping email.');
        return;
    }

    try {
        await resend.emails.send({
            from: EMAIL_SENDER,
            to: email,
            subject: 'Welcome to Tenpaten Apply!',
            html: `
                <div style="background-color: ${BG_COLOR}; padding: 40px 20px;">
                    <div style="${baseEmailStyles}">
                        ${emailHeader}
                        <div style="${contentStyles}">
                            <h2 style="margin-top: 0; font-size: 24px; color: ${HEADING_COLOR}; font-weight: 800;">Welcome to the future of education, ${name.split(' ')[0]}!</h2>
                            <p style="font-size: 16px; margin-bottom: 24px;">We're thrilled to have you at <strong>Tenpaten Apply</strong>, the premier international education affiliate platform.</p>
                            <p style="font-size: 16px; margin-bottom: 32px;">Your journey towards global education excellence begins here. You can now access your dashboard to manage applications and explore world-class programs.</p>
                            
                            <div style="text-align: center; margin-bottom: 40px;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://tenpaten.com'}/dashboard" style="${buttonStyles}">Access Your Dashboard</a>
                            </div>
 
                            <p style="font-size: 14px; color: #6b7280; font-style: italic;">Need help getting started? Just reply to this email, and our support team will be happy to assist you.</p>
                        </div>
                        <div style="${footerStyles}">
                            <div style="margin-bottom: 12px; font-weight: 800; color: ${BRAND_COLOR};">TENPATEN APPLY</div>
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tenpaten Global. All rights reserved.</p>
                            <div style="margin-top: 12px;">
                                <a href="https://tenpaten.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 600;">Visit our Website</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}

export async function sendApplicationStatusEmail(email: string, name: string, status: string, programName: string) {
    if (!process.env.RESEND_API_KEY || !resend) return;

    const statusText = status.replace(/_/g, ' ');

    try {
        await resend.emails.send({
            from: EMAIL_SENDER,
            to: email,
            subject: `Application Update: ${statusText}`,
            html: `
                <div style="background-color: ${BG_COLOR}; padding: 40px 20px;">
                    <div style="${baseEmailStyles}">
                        ${emailHeader}
                        <div style="${contentStyles}">
                            <h2 style="margin-top: 0; font-size: 24px; color: ${HEADING_COLOR}; font-weight: 800;">Update on your application</h2>
                            <p style="font-size: 16px; margin-bottom: 24px;">Hello ${name}, the status of your application for <strong>${programName}</strong> has been updated.</p>
                            
                            <div style="background-color: #f3f4f6; padding: 24px; border-radius: 16px; margin-bottom: 32px; text-align: center; border: 1px solid #e5e7eb;">
                                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">New Status</p>
                                <p style="margin: 0; font-size: 20px; color: ${ACCENT_COLOR}; font-weight: 900; text-transform: uppercase;">${statusText}</p>
                            </div>
 
                            <p style="font-size: 16px; margin-bottom: 32px;">Log in to your dashboard to view the full details and any required next steps.</p>
                            
                            <div style="text-align: center; margin-bottom: 32px;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://tenpaten.com'}/dashboard" style="${buttonStyles}">View Full Application</a>
                            </div>
                        </div>
                        <div style="${footerStyles}">
                            <div style="margin-bottom: 12px; font-weight: 800; color: ${BRAND_COLOR};">TENPATEN APPLY</div>
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tenpaten Global. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send status email:', error);
    }
}

export async function sendPasswordResetEmail(email: string, token: string) {
    if (!process.env.RESEND_API_KEY || !resend) {
        console.warn('RESEND_API_KEY is missing. Skipping password reset email.');
        return;
    }

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://tenpaten.com'}/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: EMAIL_SENDER,
            to: email,
            subject: 'Tenpaten Apply: Password Reset',
            html: `
                <div style="background-color: ${BG_COLOR}; padding: 40px 20px;">
                    <div style="${baseEmailStyles}">
                        ${emailHeader}
                        <div style="${contentStyles}">
                            <h2 style="margin-top: 0; font-size: 24px; color: ${HEADING_COLOR}; font-weight: 800;">Password Reset Request</h2>
                            <p style="font-size: 16px; margin-bottom: 24px;">We received a request to reset your password for your Tenpaten Apply account.</p>
                            <p style="font-size: 16px; margin-bottom: 32px;">Click the button below to safely choose a new password. This link will automatically expire in 60 minutes.</p>
                            
                            <div style="text-align: center; margin-bottom: 40px;">
                                <a href="${resetLink}" style="${buttonStyles}">Reset My Password</a>
                            </div>
 
                            <div style="padding: 20px; border-radius: 12px; background-color: #fffbeb; border: 1px solid #fde68a;">
                                <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;"><strong>Security Note:</strong> If you did not request this change, you can safely ignore this email. Your dashboard access remains secure.</p>
                            </div>
                        </div>
                        <div style="${footerStyles}">
                            <div style="margin-bottom: 12px; font-weight: 800; color: ${BRAND_COLOR};">TENPATEN APPLY</div>
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tenpaten Global. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send password reset email:', error);
    }
}

export async function sendVerificationEmail(email: string, otp: string, name: string) {
    if (!process.env.RESEND_API_KEY || !resend) {
        console.warn('RESEND_API_KEY is missing. Skipping verification email.');
        return;
    }

    try {
        await resend.emails.send({
            from: EMAIL_SENDER,
            to: email,
            subject: 'Tenpaten Apply: Verify your email',
            html: `
                <div style="background-color: ${BG_COLOR}; padding: 40px 20px;">
                    <div style="${baseEmailStyles}">
                        ${emailHeader}
                        <div style="${contentStyles}">
                            <h2 style="margin-top: 0; font-size: 24px; color: ${HEADING_COLOR}; font-weight: 800;">Verify your identity</h2>
                            <p style="font-size: 16px; margin-bottom: 24px;">Hello ${name.split(' ')[0]}, thank you for joining us. Please use the following code to complete your verification.</p>
                            
                            <div style="background-color: #f3f4f6; border-radius: 20px; padding: 40px 20px; text-align: center; margin-bottom: 32px; border: 2px dashed #d1d5db;">
                                <div style="font-size: 12px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">Secure Verification Code</div>
                                <div style="font-size: 48px; font-weight: 900; color: ${BRAND_COLOR}; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace;">${otp}</div>
                            </div>
 
                            <p style="font-size: 14px; color: #6b7280; text-align: center;">This code is valid for 15 minutes. For security, never share this code with anyone.</p>
                        </div>
                        <div style="${footerStyles}">
                            <div style="margin-bottom: 12px; font-weight: 800; color: ${BRAND_COLOR};">TENPATEN APPLY</div>
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tenpaten Global. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send verification email:', error);
    }
}

