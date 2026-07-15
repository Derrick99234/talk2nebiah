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

function htmlTemplate(token: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f2f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3EB489,#2d9a74);padding:36px 24px 28px;text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Talk2Nebiah</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;font-weight:400;">your wellness companion</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="margin:0 0 6px;color:#1a1a2e;font-size:20px;font-weight:600;">You're all set!</h2>
              <p style="margin:0 0 24px;color:#5a5a72;font-size:15px;line-height:1.7;">
                Thanks for your payment. Your access code is ready&mdash;send it to our WhatsApp number to start talking with Nebiah.
              </p>

              <!-- Token Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6fdf9;border:2px dashed #3EB489;border-radius:10px;margin:0 0 24px;">
                <tr>
                  <td style="padding:24px 20px;text-align:center;">
                    <p style="margin:0 0 14px;color:#3EB489;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Your access code</p>
                    <div style="font-family:'SF Mono','Fira Code','Consolas','Courier New',monospace;font-size:16px;letter-spacing:3px;font-weight:700;color:#1a1a2e;word-break:break-all;user-select:all;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;background:#ffffff;border:1px solid #e0f0e6;border-radius:6px;padding:14px 12px;display:inline-block;max-width:100%;box-sizing:border-box;">
                      ${token}
                    </div>
                    <p style="margin:14px 0 0;color:#8a8aa0;font-size:12px;">Tap and hold the code above to copy it</p>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#fafbfc;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0 0 10px;color:#1a1a2e;font-size:14px;font-weight:600;">How to get started:</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="color:#3EB489;font-size:14px;font-weight:700;padding:0 8px 8px 0;">1.</td>
                        <td style="color:#5a5a72;font-size:14px;line-height:1.6;padding:0 0 8px 0;">Open WhatsApp on your phone</td>
                      </tr>
                      <tr>
                        <td valign="top" style="color:#3EB489;font-size:14px;font-weight:700;padding:0 8px 8px 0;">2.</td>
                        <td style="color:#5a5a72;font-size:14px;line-height:1.6;padding:0 0 8px 0;">Paste your access code and send it to our WhatsApp number</td>
                      </tr>
                      <tr>
                        <td valign="top" style="color:#3EB489;font-size:14px;font-weight:700;padding:0 8px 0 0;">3.</td>
                        <td style="color:#5a5a72;font-size:14px;line-height:1.6;padding:0;">Start your conversation with Nebiah ✨</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9a9ab0;font-size:12px;line-height:1.6;">
                This code expires in 24 hours. Need help? Reply to this email or contact
                <a href="mailto:talktoonebiah@gmail.com" style="color:#3EB489;text-decoration:underline;">talktoonebiah@gmail.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafbfc;padding:20px 24px;text-align:center;border-top:1px solid #eaedf0;border-radius:0 0 12px 12px;">
              <p style="margin:0;color:#bbbbcc;font-size:12px;">Talk2Nebiah &mdash; mental wellness support, anytime.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function textTemplate(token: string): string {
  return [
    'Talk2Nebiah — Your Wellness Companion',
    '=======================================',
    '',
    "You're all set!",
    '',
    'Thanks for your payment. Your access code is ready — send it to our',
    'WhatsApp number to start talking with Nebiah.',
    '',
    `Your access code: ${token}`,
    '',
    'How to get started:',
    '  1. Open WhatsApp on your phone',
    '  2. Send your access code to our WhatsApp number',
    '  3. Start your conversation with Nebiah',
    '',
    'This code expires in 24 hours.',
    'Need help? Reply to this email or contact talktoonebiah@gmail.com',
    '',
    '---',
    'Talk2Nebiah — mental wellness support, anytime.',
  ].join('\n');
}

export async function sendAuthTokenEmail(email: string, token: string): Promise<void> {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Your Talk2Nebiah access code is here',
    text: textTemplate(token),
    html: htmlTemplate(token),
  });
}
