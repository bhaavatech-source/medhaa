import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtppro.zoho.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'support@medhaa.net';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Medhā';

let transporter: nodemailer.Transporter | null = null;

if (!SMTP_USER || !SMTP_PASSWORD) {
  console.error('FATAL: SMTP_USER or SMTP_PASSWORD missing. Emails cannot be sent.');
} else {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  transporter.verify()
    .then(() => console.log('[MAIL] SMTP connection verified successfully.'))
    .catch((err) => {
      console.error('[MAIL] SMTP VERIFY FAILED:', err.code || 'UNKNOWN', '-', err.message);
    });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: { to: string; resetUrl: string }): Promise<{ success: boolean; error?: string }> {
  if (!transporter) {
    console.error('[MAIL] Transporter not initialized. Skipping send.');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: { name: SMTP_FROM_NAME, address: SMTP_FROM_EMAIL },
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
    console.log('[MAIL] Sent successfully. MessageId:', info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error('[MAIL] SEND FAILED:', error.code || 'UNKNOWN', '-', error.message);
    return { success: false, error: error.message };
  }
}