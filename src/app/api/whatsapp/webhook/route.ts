import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, markTokenAsUsed } from '@/lib/token';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { generateAIResponse, SYSTEM_PROMPT } from '@/lib/ai';
import { checkRateLimit } from '@/lib/rate-limit';

// GET verification check from Meta / WhatsApp Business setup
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    if (!VERIFY_TOKEN) {
      return new Response('Server not configured', { status: 500 });
    }
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Verification failed', { status: 403 });
    }
  }

  return new Response('Bad Request', { status: 400 });
}

// POST webhook updates from WhatsApp API
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    console.log('[WEBHOOK] POST received from IP:', ip);

    if (!checkRateLimit(`whatsapp:${ip}`, 30, 60_000)) {
      console.log('[WEBHOOK] Rate limited:', ip);
      return NextResponse.json({ status: 'rate_limited' }, { status: 429 });
    }

    const body = await request.json();
    console.log('[WEBHOOK] Body keys:', Object.keys(body));
    
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      const contact = value?.contacts?.[0];

      console.log('[WEBHOOK] Message present:', !!message);
      console.log('[WEBHOOK] Contact present:', !!contact);

      if (message) {
        const from = message.from;
        const name = contact?.profile?.name || 'WhatsApp Client';
        let text = '';
        let mediaUrl: string | null = null;
        let transcript: string | null = null;

        console.log('[WEBHOOK] From:', from);
        console.log('[WEBHOOK] Message type:', message.type);

        if (message.type === 'text') {
          text = message.text?.body.trim();
          console.log('[WEBHOOK] Text received:', text);
        } else if (message.type === 'audio' || message.type === 'voice') {
          mediaUrl = message.audio?.url || message.voice?.url;
          text = "[Audio Message]";
          transcript = "Transcription service would process this audio...";
          console.log('[WEBHOOK] Audio received, URL:', mediaUrl);
        }

        if (!text && !mediaUrl) {
          console.log('[WEBHOOK] Empty message, ignoring');
          return NextResponse.json({ status: 'success' });
        }

        // 1. Find user by WhatsApp Number
        let user = await prisma.user.findUnique({
          where: { whatsappNumber: from },
        });
        console.log('[WEBHOOK] Existing user found:', !!user);

        // 2. Authentication Flow
        if (!user) {
          console.log('[WEBHOOK] No user found, checking if message is auth token. Text length:', text?.length);
          if (text.length === 32) {
            console.log('[WEBHOOK] Text is 32 chars, attempting token verification');
            const authToken = await verifyToken(text.toUpperCase());
            console.log('[WEBHOOK] Token valid:', !!authToken);
            if (authToken) {
              // Valid token! Link user to this WhatsApp number
              user = await prisma.user.update({
                where: { id: authToken.userId },
                data: { 
                  whatsappNumber: from,
                  name,
                },
              });
              await markTokenAsUsed(authToken.id);
              await sendWhatsAppMessage(from, `Welcome to Talk2Nebiah, ${user.name || 'friend'}! Your access has been verified. How can I help you today?`);
              return NextResponse.json({ status: 'success' });
            }
          }

          // If not a valid token and user doesn't exist
          await sendWhatsAppMessage(from, "Hello! To access Talk2Nebiah, please provide the access token you received after your payment at talk2nebiah.com. If you haven't subscribed yet, please visit our website.");
          return NextResponse.json({ status: 'success' });
        }

        // 3. Authorized User - Process Message
        // Get or create active session
        let session = await prisma.session.findFirst({
          where: { userId: user.id, status: 'ONGOING' },
          orderBy: { startDate: 'desc' },
        });

        if (!session) {
          session = await prisma.session.create({
            data: {
              userId: user.id,
              struggleCategory: 'General',
            },
          });
        }

        // Store Patient message
        await prisma.message.create({
          data: {
            sessionId: session.id,
            content: text,
            mediaUrl: mediaUrl,
            transcript: transcript,
            senderType: 'PATIENT',
          },
        });

        // Get history for AI
        const history = await prisma.message.findMany({
          where: { sessionId: session.id },
          orderBy: { timestamp: 'asc' },
          take: 10, // Last 10 messages
        });

        const aiMessages = [
          { role: 'system' as const, content: SYSTEM_PROMPT },
          ...history.map((m: { senderType: string; transcript: string | null; content: string | null }) => ({
            role: (m.senderType === 'PATIENT' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: m.transcript || m.content || '',
          })),
        ];

        // Generate AI Response
        const aiResponse = await generateAIResponse(aiMessages);

        // Send AI Response via WhatsApp
        await sendWhatsAppMessage(from, aiResponse);

        // Store AI Response
        await prisma.message.create({
          data: {
            sessionId: session.id,
            content: aiResponse,
            senderType: 'AI',
          },
        });
      }
    }

    return NextResponse.json({ status: 'success', received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
