import dataset from "../../../../korean_expression_dataset_v5_production_clean.json";

const STORAGE_KEY = "k-expression-learner:progress:v1";
const VALID_STATUSES = new Set(["not_started", "learning", "mastered"]);

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function writeProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    throw new Error("无法保存学习记录，请检查浏览器是否允许本地存储。");
  }
}

const expressions = dataset.map((item, index) => ({
  id: index + 1,
  korean: item.expression,
  chinese: item.meaning,
  level: `Level ${item.level || 1}`,
  romanization: item.romanization || "",
  formality: item.formality || "",
  category: item.category || "",
  context: item.scenario?.context || "",
  scenario_title: item.scenario?.title || "",
  simple_example: item.simple_example || {},
  tone: Array.isArray(item.tone_tags) ? item.tone_tags.join(", ") : "",
  usage_examples: (item.usage_examples || []).map((example) => ({
    korean: example.korean || "",
    chinese: example.translation || example.chinese || "",
    tone_note: example.tone_note || "",
  })),
  similar_expressions: (item.relations || []).map((relation) => ({
    expression: relation.target_expression || "",
    difference: relation.difference || "",
    relation_type: relation.relation_type || "",
    target_expression_id: relation.target_expression_id || "",
  })),
  rewrite_tasks: (item.rewrite_tasks || []).map((task) => ({
    prompt: task.prompt || "",
    formal_sentence: task.formal_sentence || "",
    natural_answer: task.natural_answer || "",
    tokens: Array.isArray(task.tokens) ? task.tokens : [],
  })),
}));

function withProgress(item, progress = readProgress()) {
  if (!item) return null;
  const saved = progress[item.id] || {};
  return {
    ...item,
    status: VALID_STATUSES.has(saved.status) ? saved.status : "not_started",
    notes: saved.notes || "",
    last_reviewed: saved.last_reviewed || null,
  };
}

function statsFor(progress) {
  let learningCount = 0;
  let masteredCount = 0;
  for (const item of expressions) {
    const status = progress[item.id]?.status;
    if (status === "learning") learningCount += 1;
    if (status === "mastered") masteredCount += 1;
  }
  return {
    totalExpressions: expressions.length,
    learningCount,
    masteredCount,
    notStartedCount: expressions.length - learningCount - masteredCount,
  };
}

function resultFor(item, progress = readProgress()) {
  return { item: withProgress(item, progress), stats: statsFor(progress) };
}

function findById(id) {
  return expressions.find((item) => item.id === Number(id));
}

export async function getExpressions(page = 1, limit = 50, status = null) {
  const progress = readProgress();
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.max(1, Math.min(500, Number.parseInt(limit, 10) || 50));
  const filtered = VALID_STATUSES.has(status)
    ? expressions.filter((item) => (progress[item.id]?.status || "not_started") === status)
    : expressions;
  const start = (safePage - 1) * safeLimit;
  return {
    items: filtered.slice(start, start + safeLimit).map((item) => withProgress(item, progress)),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / safeLimit)),
    },
    stats: statsFor(progress),
  };
}

export async function getNextExpression() {
  const progress = readProgress();
  const item = expressions.find((candidate) => !progress[candidate.id]?.status || progress[candidate.id]?.status === "not_started");
  return resultFor(item, progress);
}

export async function getRandomExpression() {
  return resultFor(expressions[Math.floor(Math.random() * expressions.length)]);
}

export async function getExpressionById(id) {
  const item = findById(id);
  if (!item) throw new Error("Expression not found");
  return resultFor(item);
}

export async function getExpressionByKorean(korean) {
  const item = expressions.find((candidate) => candidate.korean === korean);
  if (!item) throw new Error("Expression not found");
  return resultFor(item);
}

export async function updateExpressionStatus(id, status) {
  const item = findById(id);
  if (!item) throw new Error("Expression not found");
  if (!VALID_STATUSES.has(status)) throw new Error("Invalid status value");
  const progress = readProgress();
  progress[item.id] = { ...progress[item.id], status, last_reviewed: new Date().toISOString() };
  writeProgress(progress);
  return resultFor(item, progress);
}

export async function saveExpressionNote(id, note) {
  const item = findById(id);
  if (!item) throw new Error("Expression not found");
  const progress = readProgress();
  progress[item.id] = { ...progress[item.id], notes: note || "" };
  writeProgress(progress);
  return resultFor(item, progress);
}

export async function getRewriteFeedback() {
  throw new Error("网页版暂不支持 AI 评分；可查看下方参考答案。完整 AI 评分需要部署后端服务。");
}
