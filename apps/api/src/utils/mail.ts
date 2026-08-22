import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtppro.zoho.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE =
  String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const SMTP_FROM_EMAIL =
  process.env.SMTP_FROM_EMAIL || 'support@medhaa.net';

const SMTP_FROM_NAME =
  process.env.SMTP_FROM_NAME || 'Medhā';

if (!SMTP_USER || !SMTP_PASSWORD) {
  console.warn(
    'SMTP configuration is incomplete. Password reset emails cannot be sent.'
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const info = await transporter.sendMail({
    from: {
      name: SMTP_FROM_NAME,
      address: SMTP_FROM_EMAIL,
    },

    to,

    subject: 'Reset your Medhā password',

    text: [
      'Hello,',
      '',
      'We received a request to reset your Medhā password.',
      '',
      'Use the link below to create a new password:',
      resetUrl,
      '',
      'This link will expire in 30 minutes and can only be used once.',
      '',
      'If you did not request a password reset, you can safely ignore this email.',
      '',
      'Regards,',
      'Medhā Support',
      'support@medhaa.net',
    ].join('\n'),

    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f8f8;font-family:Arial,Helvetica,sans-serif;">
          <div style="padding:40px 20px;">
            <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:36px;">

              <div style="text-align:center;margin-bottom:28px;">
                <div style="font-size:30px;font-weight:800;color:#087f83;">
                  Medhā
                </div>
              </div>

              <h1 style="margin:0 0 14px;text-align:center;color:#183c42;font-size:24px;">
                Reset your password
              </h1>

              <p style="margin:0 0 22px;color:#5f7074;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your Medhā account.
              </p>

              <div style="text-align:center;margin:28px 0;">
                <a
                  href="${resetUrl}"
                  style="display:inline-block;padding:13px 24px;border-radius:10px;background:#2869eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;"
                >
                  Reset Password
                </a>
              </div>

              <p style="margin:0 0 14px;color:#68787c;font-size:13px;line-height:1.6;">
                This password reset link will expire in 30 minutes and can only be used once.
              </p>

              <p style="margin:0;color:#68787c;font-size:13px;line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email.
              </p>

              <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5eeee;text-align:center;">
                <div style="font-weight:700;color:#087f83;">
                  Medhā Support
                </div>
                <div style="font-size:12px;color:#7a898c;margin-top:4px;">
                  support@medhaa.net
                </div>
              </div>

            </div>
          </div>
        </body>
      </html>
    `,
  });

  console.log(
    `Password reset email sent to ${to}. Message ID: ${info.messageId}`
  );

  return info;
}