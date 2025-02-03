import { LLM } from "@/types"

const GROQ_PLATORM_LINK = "https://siliconflow.cn/zh-cn/"

const DEEPSEEK_R1: LLM = {
  modelId: "deepseek-ai/DeepSeek-R1",
  modelName: "DeepSeek-R1",
  provider: "siliconflow",
  hostedId: "deepseek-ai/DeepSeek-R1",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "CNY",
    unit: "1M tokens",
    inputCost: 4,
    outputCost: 16
  }
}

const DEEPSEEK_V3: LLM = {
  modelId: "deepseek-ai/DeepSeek-V3",
  modelName: "DeepSeek-V3",
  provider: "siliconflow",
  hostedId: "deepseek-ai/DeepSeek-V3",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "CNY",
    unit: "1M tokens",
    inputCost: 2,
    outputCost: 8
  }
}

export const SILLICON_FLOW_LLM_LIST: LLM[] = [DEEPSEEK_R1, DEEPSEEK_V3]
