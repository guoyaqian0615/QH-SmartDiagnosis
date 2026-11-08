import type { DeepSeekChatMessage } from "@/lib/clinical/llm-prompt";

type DeepSeekConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
};

type DeepSeekChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

export function getDeepSeekConfig(): DeepSeekConfig | null {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;

  return {
    apiKey,
    baseUrl: (process.env.DEEPSEEK_API_BASE?.trim() || "https://api.deepseek.com").replace(/\/$/, ""),
    model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat",
    timeoutMs: Number.parseInt(process.env.DEEPSEEK_TIMEOUT_MS?.trim() || "20000", 10) || 20000,
  };
}

export function hasDeepSeekConfig() {
  return getDeepSeekConfig() !== null;
}

function extractJsonObject(text: string) {
  const fenced =
    text.match(/```json\s*([\s\S]*?)```/i)?.[1] ?? text.match(/```\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text;
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first < 0 || last < 0 || last <= first) {
    throw new Error("DeepSeek response did not contain a JSON object");
  }
  return candidate.slice(first, last + 1);
}

export async function requestDeepSeekJson<T>(messages: DeepSeekChatMessage[]): Promise<{
  data: T;
  model: string;
}> {
  const config = getDeepSeekConfig();
  if (!config) {
    throw new Error("DeepSeek API key is not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.2,
        max_tokens: 1400,
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(detail || `DeepSeek request failed (${response.status})`);
    }

    const payload = (await response.json()) as DeepSeekChatCompletionResponse;
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("DeepSeek response content was empty");
    }

    return {
      data: JSON.parse(extractJsonObject(content)) as T,
      model: config.model,
    };
  } finally {
    clearTimeout(timer);
  }
}
