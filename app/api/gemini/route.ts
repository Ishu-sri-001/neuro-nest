import { streamText, Message } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { initialMessage } from "@/lib/data";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

// export const runtime = "edge";

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "user",
    content: initialMessage.content
  },
  ...messages.map((message) => ({
    id: message.id || generateId(),
    role: message.role,
    content: message.content
  }))
];

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    console.log("Received messages:", messages);
    console.log("Formatted messages:", buildGoogleGenAIPrompt(messages));

    const stream = await streamText({
      model: google("gemini-pro"),
      messages: buildGoogleGenAIPrompt(messages),
      temperature: 0.7,
    });

    return stream?.toDataStreamResponse();
  } catch (error) {
    console.error("Error in /api/gemini:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

