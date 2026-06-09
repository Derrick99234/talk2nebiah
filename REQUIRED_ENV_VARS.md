# Required Environment Variables for Production

To activate the Talk2Nebiah production system, please configure the following environment variables:

## Database
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/talk2nebiah`)

## Paystack (Payment Gateway)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your Paystack Public Key
- `PAYSTACK_SECRET_KEY`: Your Paystack Secret Key (for webhook verification)

## WhatsApp Business API
- `WHATSAPP_PHONE_NUMBER_ID`: The ID of the phone number registered with WhatsApp Business API
- `WHATSAPP_ACCESS_TOKEN`: Permanent access token for the WhatsApp Business API
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`: The token you set in Meta App dashboard for webhook verification
- `NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL`: Your production webhook URL (e.g., `https://yourdomain.com/api/whatsapp/webhook`)

## AI Engine
- `AI_API_KEY`: API key for your AI provider (OpenAI, Gemini, etc.)
- `AI_MODEL`: (Optional) The model to use (e.g., `gpt-4o`, `gemini-pro`). Defaults to `gpt-4o`.
- `AI_ENDPOINT`: (Optional) The API endpoint for completions. Defaults to OpenAI endpoint.
- `NEXT_PUBLIC_AI_SYSTEM_PROMPT`: The system prompt that defines Nebiah's behavior.

## Pricing Configuration
- `NEXT_PUBLIC_SINGLE_NAIRA`: Price for one session in Naira (e.g., `15000`)
- `NEXT_PUBLIC_SINGLE_USD`: Price for one session in USD (e.g., `20`)
- `NEXT_PUBLIC_MONTHLY_NAIRA`: Price for monthly plan in Naira (e.g., `120000`)
- `NEXT_PUBLIC_MONTHLY_USD`: Price for monthly plan in USD (e.g., `150`)

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

---
**Note:** Ensure all `NEXT_PUBLIC_` variables are available at build time for the frontend.
