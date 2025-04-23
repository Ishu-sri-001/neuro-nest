import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge'; // Ensure it runs on the Edge runtime

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('Received messages:', messages);

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), { status: 400 });
    }

    // Await the streamText function
    const result = await streamText({
      model: openai('o1-mini'),
      messages,
    });

    // Now result should have toDataStreamResponse()
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
