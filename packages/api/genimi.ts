import ky, { KyInstance } from "ky";

type GeminiResponseCandidate = {
  content: {
    parts: {
      text: string;
    }[];
  };
};

type GeminiResponse = {
  candidates: GeminiResponseCandidate[];
};

type GeminiStreamData = {
  candidates: GeminiResponseCandidate[];
  usageMetadata: UsageMetadata;
  /** like "gemini-2.5-flash" */
  modelVersion: string;
  responseId: string;
};

type UsageMetadata = {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: { modality: string; tokenCount: number }[];
  thoughtsTokenCount: number;
};

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";

export class Gemini {
  private ky: KyInstance;

  constructor(opts: {
    /** API Key */
    apiKey: string;
    /** Base URL */
    baseUrl?: string;
  }) {
    const prefixUrl = opts.baseUrl || DEFAULT_BASE_URL;
    const headers = {
      "Content-Type": "application/json",
      "x-goog-api-key": opts.apiKey,
    };
    this.ky = ky.create({ prefixUrl, headers });
  }

  static buildGenerateContentRequestBody(text: string, instruction?: string) {
    const contents = [{ parts: [{ text }] }];
    return {
      ...(instruction
        ? {
          system_instruction: { parts: [{ text: instruction }] },
        }
        : undefined),
      contents,
      generationConfig: {
        thinkingConfig: { includeThoughts: false },
      },
    };
  }

  async generateContent(json: unknown, model = "gemini-2.5-flash-lite") {
    const endpoint = `v1beta/models/${model}:generateContent`;
    return await this.ky.post<GeminiResponse>(endpoint, {
      json,
      timeout: 70000,
    }).json();
  }

  async streamGenerateContent(json: unknown, model = "gemini-2.5-flash-lite") {
    const endpoint = `v1beta/models/${model}:streamGenerateContent`;
    return await this.ky.post(endpoint, {
      json,
      searchParams: { alt: "sse" },
      timeout: 70000,
    });
  }

  static createAsyncIterableStreamFromGeminiResponse(
    res: Response,
  ): AsyncIterable<GeminiStreamData> {
    const decoder = new TextDecoder("utf-8");
    let left = "";

    const ai = {
      async *[Symbol.asyncIterator]() {
        for await (const c of res.body as ReadableStream<Uint8Array>) {
          const decoded = decoder.decode(c, { stream: true });

          const withLeft = left + decoded;
          const dataLines = withLeft.split("\r\n\r\n");

          if (dataLines.length === 1) {
            left += decoded;
            continue;
          }
          left = dataLines.pop() || "";

          for (const ln of dataLines) {
            if (!ln.startsWith("data: ")) continue;
            const t = parseDataLine(ln);
            if (t) yield t;
          }
        }

        if (left) {
          const text = parseDataLine(left);
          if (text) yield text;
        }
      },
    };
    return ai;
  }
}

function parseDataLine(ln: string) {
  try {
    return JSON.parse(ln.substring(6)) as GeminiStreamData;
    // return json.candidates?.[0]?.content?.parts[0]?.text;
  } catch (e) {
    console.error(e);
    console.log(`Unable to parse [${ln.substring(6)}] (content in []) as JSON`);
  }
}
