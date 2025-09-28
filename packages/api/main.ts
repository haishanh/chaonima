import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { cors } from "hono/cors";
import { Gemini } from "./genimi.ts";

const app = new Hono();

const kv = await Deno.openKv();

app.use("/api/*", cors());
app.use(async (c, next) => {
  const providedKey = c.req.header("x-api-key");
  // using 404 intentionally ¯\_(ツ)_/¯
  if (!providedKey) return c.json({}, 404);
  const validKeys = Deno.env.get("API_KEYS")!.split(",");
  if (!validKeys.includes(providedKey)) return c.json({}, 401);
  await next();
});

app.get("/ping", (c) => c.text("pong"));

app.get("/api/v2ex/summaries", async (c) => {
  const id = c.req.query("id");
  if (!id) return c.text("Missing id", 400);
  const result = await kv.get<{ summary: string; time: number }>([id]);
  if (!result.value) return c.text("Entry not found", 404);
  // consider 10-minute-old items as stale
  if (Date.now() - result.value.time > 600_000) {
    return c.text("Entry not found", 404);
  }
  return c.text(result.value.summary);
});

app.post("/api/v2ex/streamGenerateContent", async (c) => {
  const body = await c.req.json<{ text: string; id: string }>();
  const id = body.id;
  if (!id) return c.json({ message: "Missing id" }, 400);

  const instruction = [
    "我会给你发一篇帖子，可能会包含网友们的评论。",
    "用地道易懂的话总结这篇帖子。",
    "如果有网友评论的话，总结一下他们在讨论什么。",
    "如果网友们在争论的话，概括一下各方的论点。",
    '你的输出不要包含额外内容 (比如"好的，没问题！我来帮你总结一下。")',
  ].join("\n");

  return streamText(c, async (stream) => {
    let summary = "";
    await gen(
      Deno.env.get("GEMINI_API_KEY")!,
      instruction,
      body.text,
      async (t) => {
        await stream.write(t);
        summary += t;
      },
    );
    await kv.set([id], { time: Date.now(), summary });
    stream.close();
  });
});

async function gen(
  apiKey: string,
  instruction: string,
  text: string,
  onmessage: (message: string) => void | Promise<void>,
) {
  const gemini = new Gemini({ apiKey });
  const input = Gemini.buildGenerateContentRequestBody(text, instruction);
  const res = await gemini.streamGenerateContent(
    input,
    "gemini-2.5-flash-preview-09-2025",
  );
  const aig = Gemini.createAsyncIterableStreamFromGeminiResponse(res);
  for await (const json of aig) {
    const t = json.candidates?.[0]?.content?.parts[0]?.text;
    await onmessage(t);
  }
}

Deno.serve(app.fetch);
