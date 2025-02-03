import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

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

    if (chatSettings.model.toLowerCase().includes("deepseek")) {
      const deepseek = createDeepSeek({
        baseURL: "https://api.siliconflow.cn/v1",
        apiKey: profile.siliconflow_api_key || ""
      })

      const response = await streamText({
        model: deepseek(chatSettings.model),
        messages,
        temperature: chatSettings.temperature
      })

      return response.toDataStreamResponse({
        sendReasoning: true
      })
    } else {
      // siliconFlow is compatible with the OpenAI SDK
      const siliconFlow = createOpenAI({
        apiKey: profile.siliconflow_api_key || "",
        baseURL: "https://api.siliconflow.cn/v1"
      })

      const response = await streamText({
        model: siliconFlow(chatSettings.model),
        messages,
        temperature: chatSettings.temperature
      })

      // Respond with the stream
      return response.toTextStreamResponse()
    }
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
