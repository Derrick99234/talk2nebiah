# Required Environment Variables for Production

## Database
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/talk2nebiah`)

## Paystack (Payment Gateway)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your Paystack Public Key (public, bundled in frontend)
- `PAYSTACK_SECRET_KEY`: Your Paystack Secret Key (server-side only, webhook verification)

## WhatsApp Business API
- `WHATSAPP_PHONE_NUMBER_ID`: The ID of the phone number registered with WhatsApp Business API
- `WHATSAPP_ACCESS_TOKEN`: Permanent access token for the WhatsApp Business API
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`: The token you set in Meta App dashboard for webhook verification
- `WHATSAPP_WEBHOOK_URL`: Your production webhook URL (e.g., `https://yourdomain.com/api/whatsapp/webhook`)

## AI Engine (OpenAI-compatible)
- `AI_API_KEY`: API key for your AI provider (OpenAI, Gemini, etc.)
- `AI_MODEL`: (Optional) The model to use (e.g., `gpt-4o`, `gemini-pro`). Defaults to `gpt-4o`.
- `AI_ENDPOINT`: (Optional) The API endpoint for completions. Defaults to OpenAI endpoint.

## Email (Auth Token Delivery)
- `SMTP_HOST`: SMTP server hostname (e.g., `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (default: `587`)
- `SMTP_SECURE`: Set to `true` for SSL (port 465), `false` for STARTTLS (default: `false`)
- `SMTP_USER`: SMTP username (usually your email)
- `SMTP_PASS`: SMTP password or app password
- `SMTP_FROM`: Sender email address (default: `noreply@talk2nebiah.com`)

## Admin Authentication
- `JWT_SECRET`: Secret key used to sign session tokens
- `ADMIN_EMAIL`: Email address of the initial admin user (used by seed script)
- `ADMIN_PASSWORD`: Password of the initial admin user (used by seed script)

## Pricing (build-time defaults — DB overrides at runtime)
- `NEXT_PUBLIC_SINGLE_NAIRA`: Default one-session price in Naira
- `NEXT_PUBLIC_SINGLE_USD`: Default one-session price in USD
- `NEXT_PUBLIC_MONTHLY_NAIRA`: Default monthly plan price in Naira
- `NEXT_PUBLIC_MONTHLY_USD`: Default monthly plan price in USD
