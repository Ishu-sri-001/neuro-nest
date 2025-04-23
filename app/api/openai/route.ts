import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { initialMessage } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), { status: 400 });
    }

    const formattedMessages = [initialMessage, ...messages];

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages: formattedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('🔥 API Error:', error);
  
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: errorMessage }),
      { status: 500 }
    );
  }
}
  
