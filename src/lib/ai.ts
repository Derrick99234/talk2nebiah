const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

export async function generateAIResponse(messages: { role: 'system' | 'user' | 'assistant', content: string }[]) {
  if (!AI_API_KEY) {
    console.error('AI API Key missing');
    return '';
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
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('[AI] Empty content from model:', JSON.stringify(data));
      return '';
    }
    return content;
  } catch (error) {
    console.error('AI Generation error:', error);
    return '';
  }
}
