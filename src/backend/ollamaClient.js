const OLLAMA_BASE = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5";

const SYSTEM_PROMPT = `你是一位专业的韩语老师，专门帮助中文母语的中级韩语学习者掌握地道表达。
你的反馈风格：简洁、鼓励、实用。避免过多术语，聚焦在"怎么说更自然"。`;

async function callOllama(messages) {
  let response;

  try {
    response = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
      }),
      signal: AbortSignal.timeout(55000),
    });
  } catch (networkError) {
    const err = new Error(
      "无法连接到 Ollama 服务。请确认已启动：运行 `ollama serve`，并已拉取模型：`ollama pull qwen2.5`",
    );
    err.statusCode = 503;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Ollama 返回错误：${response.status}`);
    err.statusCode = 502;
    throw err;
  }

  const data = await response.json();
  return data.message?.content || "";
}

function extractJSON(text) {
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try { return JSON.parse(arrayMatch[0]); } catch { /* fall through */ }
  }
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try { return JSON.parse(objectMatch[0]); } catch { /* fall through */ }
  }
  return null;
}

async function getRewriteFeedback({ korean, chinese, rewriteScenario, userSentence }) {
  const userPrompt = `
当前要学的表达：${korean}（${chinese}）
练习场景（请把这句话改写得更自然）：${rewriteScenario}
学生写的句子：${userSentence}

请严格按以下 JSON 格式返回，不要输出其他内容：
{
  "naturalVersion": "更地道的韩文写法",
  "score": 评分数字(1到5),
  "comment": "简短点评，1到2句话",
  "tip": "一个帮助记忆或使用这个表达的实用小贴士"
}`.trim();

  const raw = await callOllama([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const parsed = extractJSON(raw);

  if (!parsed || !parsed.naturalVersion) {
    const err = new Error("AI 返回格式异常，请重试");
    err.statusCode = 502;
    throw err;
  }

  return {
    naturalVersion: parsed.naturalVersion || "",
    score: Math.min(5, Math.max(1, Number(parsed.score) || 3)),
    comment: parsed.comment || "",
    tip: parsed.tip || "",
  };
}

async function translateUsageExamples({ korean, chinese, examples }) {
  const koreanOnly = examples.map((ex) =>
    typeof ex === "string" ? ex : ex.korean,
  );

  const userPrompt = `
表达：${korean}（${chinese}）
请将以下韩文例句逐一翻译成自然的中文（口语风格，保留语气）。
严格按以下 JSON 数组格式返回，不要输出任何其他内容：
[
  {"korean":"原句1","chinese":"中文译1"},
  {"korean":"原句2","chinese":"中文译2"}
]

韩文例句：
${JSON.stringify(koreanOnly)}`.trim();

  const raw = await callOllama([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const parsed = extractJSON(raw);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("翻译返回格式异常");
  }

  return parsed.map((item, i) => ({
    korean: item.korean || koreanOnly[i] || "",
    chinese: item.chinese || "",
  }));
}

module.exports = { getRewriteFeedback, translateUsageExamples };
