import { processDataStream } from "@ai-sdk/ui-utils"

export async function consumeReadableStream(
  stream: ReadableStream<Uint8Array>,
  callback: (chunk: string) => void,
  signal: AbortSignal
): Promise<void> {
  let isFirstReasoningPart = true
  let isFirstTextPart = true

  try {
    await processDataStream({
      stream,
      onTextPart: value => {
        if (isFirstTextPart && !isFirstReasoningPart) {
          isFirstTextPart = false
          callback("</think>" + value)
        } else {
          callback(value)
        }
      },
      onReasoningPart: value => {
        if (isFirstReasoningPart) {
          isFirstReasoningPart = false
          callback("<think>" + value)
        } else {
          callback(value)
        }
      },
      onErrorPart: value => {
        console.log("🚀 ~ onErrorPart:", value)
      }
    })
  } catch (error) {
    if (signal.aborted) {
      console.error("Stream reading was aborted:", error)
    } else {
      console.error("Error consuming stream:", error)
    }
  }
}
