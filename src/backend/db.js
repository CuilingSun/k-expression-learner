const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DATASET_PATH = path.resolve(
  __dirname,
  "../../korean_expression_dataset_v5_production_clean.json",
);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_PATH = path.join(DATA_DIR, "expressions.db");
const VALID_STATUSES = new Set(["not_started", "learning", "mastered"]);

let db;

function ensureDb() {
  if (!db) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new sqlite3.Database(DB_PATH);
  }

  return db;
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    ensureDb().run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    ensureDb().get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    ensureDb().all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function safeParseJSON(str, fallback) {
  try {
    return JSON.parse(str) ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeExpressions(rawExpressions) {
  return rawExpressions.map((item) => ({
    korean: item.expression,
    chinese: item.meaning,
    level: `Level ${item.level || 1}`,
    romanization: item.romanization || "",
    formality: item.formality || "",
    category: item.category || "",
    context: item.scenario?.context || "",
    scenario_title: item.scenario?.title || "",
    simple_example: JSON.stringify(item.simple_example || {}),
    tone: Array.isArray(item.tone_tags) ? item.tone_tags.join(", ") : "",
    usage_examples: JSON.stringify(
      (item.usage_examples || []).map((ex) => ({
        korean: ex.korean || "",
        chinese: ex.translation || ex.chinese || "",
        tone_note: ex.tone_note || "",
      })),
    ),
    similar_expressions: JSON.stringify(
      (item.relations || []).map((r) => ({
        expression: r.target_expression || "",
        difference: r.difference || "",
        relation_type: r.relation_type || "",
        target_expression_id: r.target_expression_id || "",
      })),
    ),
    rewrite_tasks: JSON.stringify(
      (item.rewrite_tasks || []).map((t) => ({
        prompt: t.prompt || "",
        formal_sentence: t.formal_sentence || "",
        natural_answer: t.natural_answer || "",
        tokens: Array.isArray(t.tokens) ? t.tokens : [],
      })),
    ),
  }));
}

function mapExpressionRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    korean: row.korean,
    chinese: row.chinese,
    level: row.level,
    romanization: row.romanization || "",
    formality: row.formality || "",
    category: row.category || "",
    context: row.context,
    tone: row.tone || "",
    usage_examples: safeParseJSON(row.usage_examples, []).map((ex) =>
      typeof ex === "string"
        ? { korean: ex, chinese: "", tone_note: "" }
        : { ...ex, tone_note: ex.tone_note || "" },
    ),
    similar_expressions: safeParseJSON(row.similar_expressions, []),
    rewrite_tasks: safeParseJSON(row.rewrite_tasks, []),
    scenario_title: row.scenario_title || "",
    simple_example: safeParseJSON(row.simple_example, {}),
    status: row.status || "not_started",
    notes: row.notes || "",
    created_at: row.created_at,
    last_reviewed: row.last_reviewed,
  };
}

async function initDb() {
  ensureDb();

  await run(`
    CREATE TABLE IF NOT EXISTS expressions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      korean TEXT NOT NULL UNIQUE,
      chinese TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT '',
      romanization TEXT NOT NULL DEFAULT '',
      formality TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      context TEXT NOT NULL DEFAULT '',
      scenario_title TEXT NOT NULL DEFAULT '',
      simple_example TEXT NOT NULL DEFAULT '{}',
      tone TEXT NOT NULL DEFAULT '',
      usage_examples TEXT NOT NULL DEFAULT '[]',
      similar_expressions TEXT NOT NULL DEFAULT '[]',
      rewrite_tasks TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expression_id INTEGER NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'not_started',
      last_reviewed TEXT,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (expression_id) REFERENCES expressions(id)
    )
  `);

  await migrateDb();
}

async function migrateDb() {
  const migrations = [
    `ALTER TABLE expressions ADD COLUMN tone TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE expressions ADD COLUMN usage_examples TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE expressions ADD COLUMN similar_expressions TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE expressions ADD COLUMN rewrite_tasks TEXT NOT NULL DEFAULT '[]'`,
    `ALTER TABLE expressions ADD COLUMN scenario_title TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE expressions ADD COLUMN simple_example TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE expressions ADD COLUMN romanization TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE expressions ADD COLUMN formality TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE expressions ADD COLUMN category TEXT NOT NULL DEFAULT ''`,
  ];

  for (const sql of migrations) {
    try {
      await run(sql);
    } catch {
      // Column already exists — safe to ignore
    }
  }
}

async function importExpressions() {
  const raw = JSON.parse(fs.readFileSync(DATASET_PATH, "utf8"));
  const normalized = normalizeExpressions(raw);

  for (const item of normalized) {
    await run(
      `
        INSERT INTO expressions
          (korean, chinese, level, romanization, formality, category, context, scenario_title, simple_example, tone, usage_examples, similar_expressions, rewrite_tasks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(korean) DO UPDATE SET
          chinese = excluded.chinese,
          level = excluded.level,
          romanization = excluded.romanization,
          formality = excluded.formality,
          category = excluded.category,
          context = excluded.context,
          scenario_title = excluded.scenario_title,
          simple_example = excluded.simple_example,
          tone = excluded.tone,
          usage_examples = excluded.usage_examples,
          similar_expressions = excluded.similar_expressions,
          rewrite_tasks = excluded.rewrite_tasks
      `,
      [
        item.korean,
        item.chinese,
        item.level,
        item.romanization,
        item.formality,
        item.category,
        item.context,
        item.scenario_title,
        item.simple_example,
        item.tone,
        item.usage_examples,
        item.similar_expressions,
        item.rewrite_tasks,
      ],
    );
  }
}

function parsePaging(page = 1, limit = 10) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.max(1, Math.min(500, Number.parseInt(limit, 10) || 10));

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

async function getStats() {
  const row = await get(
    `
      SELECT
        COUNT(e.id) AS totalExpressions,
        SUM(CASE WHEN up.status = 'learning' THEN 1 ELSE 0 END) AS learningCount,
        SUM(CASE WHEN up.status = 'mastered' THEN 1 ELSE 0 END) AS masteredCount
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
    `,
  );

  const totalExpressions = row?.totalExpressions || 0;
  const learningCount = row?.learningCount || 0;
  const masteredCount = row?.masteredCount || 0;

  return {
    totalExpressions,
    learningCount,
    masteredCount,
    notStartedCount: totalExpressions - learningCount - masteredCount,
  };
}

async function getAllExpressions(page = 1, limit = 50, status = null) {
  const paging = parsePaging(page, limit);

  const statusFilter = status && VALID_STATUSES.has(status)
    ? `WHERE COALESCE(up.status, 'not_started') = ?`
    : "";
  const params = status && VALID_STATUSES.has(status)
    ? [status, paging.limit, paging.offset]
    : [paging.limit, paging.offset];

  const rows = await all(
    `
      SELECT
        e.*,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(up.notes, '') AS notes,
        up.last_reviewed
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
      ${statusFilter}
      ORDER BY e.id ASC
      LIMIT ? OFFSET ?
    `,
    params,
  );

  const countParams = status && VALID_STATUSES.has(status) ? [status] : [];
  const totalRow = await get(
    `
      SELECT COUNT(*) AS total
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
      ${statusFilter}
    `,
    countParams,
  );

  return {
    items: rows.map(mapExpressionRow),
    pagination: {
      page: paging.page,
      limit: paging.limit,
      total: totalRow?.total || 0,
      totalPages: Math.max(1, Math.ceil((totalRow?.total || 0) / paging.limit)),
    },
  };
}

async function getExpressionById(id) {
  const row = await get(
    `
      SELECT
        e.*,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(up.notes, '') AS notes,
        up.last_reviewed
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
      WHERE e.id = ?
    `,
    [id],
  );

  return mapExpressionRow(row);
}

async function getRandomExpression() {
  const row = await get(
    `
      SELECT
        e.*,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(up.notes, '') AS notes,
        up.last_reviewed
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
      ORDER BY RANDOM()
      LIMIT 1
    `,
  );

  return mapExpressionRow(row);
}

async function getNextExpression() {
  const row = await get(
    `
      SELECT
        e.*,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(up.notes, '') AS notes,
        up.last_reviewed
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
      WHERE COALESCE(up.status, 'not_started') = 'not_started'
      ORDER BY e.id ASC
      LIMIT 1
    `,
  );

  return mapExpressionRow(row);
}

async function ensureExpressionExists(id) {
  const expression = await getExpressionById(id);

  if (!expression) {
    const error = new Error("Expression not found");
    error.statusCode = 404;
    throw error;
  }

  return expression;
}

async function updateExpressionStatus(id, status) {
  if (!VALID_STATUSES.has(status)) {
    const error = new Error("Invalid status value");
    error.statusCode = 400;
    throw error;
  }

  await ensureExpressionExists(id);
  const reviewedAt = new Date().toISOString();

  await run(
    `
      INSERT INTO user_progress (expression_id, status, last_reviewed)
      VALUES (?, ?, ?)
      ON CONFLICT(expression_id) DO UPDATE SET
        status = excluded.status,
        last_reviewed = excluded.last_reviewed
    `,
    [id, status, reviewedAt],
  );

  return getExpressionById(id);
}

async function saveNote(id, note) {
  await ensureExpressionExists(id);

  await run(
    `
      INSERT INTO user_progress (expression_id, notes)
      VALUES (?, ?)
      ON CONFLICT(expression_id) DO UPDATE SET
        notes = excluded.notes
    `,
    [id, note || ""],
  );

  return getExpressionById(id);
}

async function updateUsageExamples(id, examples) {
  await run(
    `UPDATE expressions SET usage_examples = ? WHERE id = ?`,
    [JSON.stringify(examples), id],
  );
}

async function getExpressionByKorean(korean) {
  const row = await get(
    `
      SELECT
        e.*,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(up.notes, '') AS notes,
        up.last_reviewed
      FROM expressions e
      LEFT JOIN user_progress up ON up.expression_id = e.id
      WHERE e.korean = ?
    `,
    [korean],
  );
  return mapExpressionRow(row);
}

module.exports = {
  DB_PATH,
  VALID_STATUSES,
  getAllExpressions,
  getExpressionById,
  getExpressionByKorean,
  getRandomExpression,
  getNextExpression,
  getStats,
  importExpressions,
  initDb,
  saveNote,
  updateExpressionStatus,
  updateUsageExamples,
};
