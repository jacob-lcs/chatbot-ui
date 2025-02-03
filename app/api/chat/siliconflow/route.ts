import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.siliconflow_api_key, "siliconFlow")

    // siliconFlow is compatible with the OpenAI SDK
    const siliconFlow = new OpenAI({
      apiKey: profile.siliconflow_api_key || "",
      baseURL: "https://api.siliconflow.cn/v1"
    })

    const response = await siliconFlow.chat.completions.create({
      model: chatSettings.model,
      messages,
      temperature: chatSettings.temperature,
      stream: true
    })

    // Convert the response into a friendly text-stream.
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "siliconFlow API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "siliconFlow API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
