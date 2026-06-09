import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || 'noreply@talk2nebiah.com';

export async function sendAuthTokenEmail(email: string, token: string): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Your Talk2Nebiah Access Token',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #3EB489;">Talk2Nebiah</h2>
        <p>Thank you for your payment! Your access token is:</p>
        <div style="background: #f0fdf4; border: 2px dashed #3EB489; border-radius: 8px; padding: 16px; text-align: center; font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #1a1a1a; margin: 24px 0;">
          ${token}
        </div>
        <p>Send this token to our WhatsApp number to start chatting with Nebiah.</p>
        <p style="color: #666; font-size: 12px;">This token expires in 24 hours.</p>
      </div>
    `,
  });
}
