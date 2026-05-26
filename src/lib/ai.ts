const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

export async function generateAIResponse(messages: { role: 'system' | 'user' | 'assistant', content: string }[]) {
  if (!AI_API_KEY) {
    console.error('AI API Key missing');
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Generation error:', error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
}

export const SYSTEM_PROMPT = `
You are Nebiah, a compassionate and professional mental health AI assistant for Talk2Nebiah. 
Your goal is to provide a safe, judgment-free space for users to share their feelings.
Be empathetic, supportive, and practical. 
If a user expresses thoughts of self-harm or severe crisis, gently encourage them to seek professional help and provide resources.
Keep responses concise and suitable for WhatsApp.
`;
