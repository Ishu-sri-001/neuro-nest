import { GoogleGenerativeAI } from "@google/generative-ai"
import { initialMessage } from "@/lib/data"

const MODEL_NAME = "gemini-1.5-pro"
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json()

    if (!API_KEY) {
      console.error("Missing API key for Gemini")
      return new Response(JSON.stringify({ error: "Missing API key configuration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    // Format messages for Gemini
    const formattedMessages = messages.map((message: any) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }))

    // Add the initial system message if it doesn't exist
    if (messages[0]?.role !== "system") {
      formattedMessages.unshift({
        role: "model",
        parts: [{ text: initialMessage.content }]
      });
    }

    // Non-streaming approach - get the full response
    const result = await model.generateContent({
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    })

    const responseText = result.response.text()

    // Return the response in the format that useChat expects
    return new Response(responseText, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    console.error("Error in Gemini API:", error)

    // Return a properly formatted error response
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}