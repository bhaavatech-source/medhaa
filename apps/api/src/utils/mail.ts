import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'support@medhaa.net';
const FROM_NAME = process.env.MAIL_FROM_NAME || 'Medhā';

let resend: Resend | null = null;

if (!RESEND_API_KEY) {
  console.error('FATAL: RESEND_API_KEY missing. Emails cannot be sent.');
} else {
  resend = new Resend(RESEND_API_KEY);
  console.log('[MAIL] Resend client initialized successfully.');
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: { to: string; resetUrl: string }): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.error('[MAIL] Resend client not initialized. Skipping send.');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: 'Reset your Medhā password',
      text: [
        'Hello,',
        '',
        'We received a request to reset your Medhā password.',
        'Use the link below to create a new password:',
        resetUrl,
        '',
        'This link expires in 30 minutes and can only be used once.',
        'If you did not request this, ignore this email.',
        '',
        'Regards,',
        'Medhā Support',
      ].join('\n'),
      html: `
        <p>Hello,</p>
        <p>We received a request to reset the password for your Medhā account.</p>
        <p><a href="${resetUrl}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 30 minutes and can only be used once.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      console.error('[MAIL] SEND FAILED:', error.name || 'UNKNOWN', '-', error.message);
      return { success: false, error: error.message };
    }

    console.log('[MAIL] Sent successfully. MessageId:', data?.id);
    return { success: true };
  } catch (error: any) {
    console.error('[MAIL] SEND FAILED:', error.code || 'UNKNOWN', '-', error.message);
    return { success: false, error: error.message };
  }
}
