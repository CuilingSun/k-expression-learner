/**
 * 一次性脚本：用 Ollama 翻译所有表达的例句，并存入数据库。
 * 运行方法：node scripts/translate-examples.js
 * 前提：ollama serve 已启动，且已拉取 qwen2.5 模型。
 */

const { initDb, importExpressions, getAllExpressions, updateUsageExamples } = require("../src/backend/db");
const { translateUsageExamples } = require("../src/backend/ollamaClient");

const DELAY_MS = 500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("初始化数据库…");
  await initDb();
  await importExpressions();

  const result = await getAllExpressions(1, 100);
  const expressions = result.items;
  console.log(`共 ${expressions.length} 个表达需要处理。\n`);

  let translated = 0;
  let skipped = 0;
  let failed = 0;

  for (const expr of expressions) {
    const examples = Array.isArray(expr.usage_examples) ? expr.usage_examples : [];

    if (examples.length === 0) {
      skipped++;
      continue;
    }

    const alreadyDone = examples.every((e) => e.chinese && e.chinese.trim() !== "");
    if (alreadyDone) {
      console.log(`[跳过] ${expr.korean} — 已有中文译文`);
      skipped++;
      continue;
    }

    process.stdout.write(`[翻译] ${expr.korean} (${expr.chinese})… `);

    try {
      const result = await translateUsageExamples({
        korean: expr.korean,
        chinese: expr.chinese,
        examples,
      });
      await updateUsageExamples(expr.id, result);
      console.log("✓");
      translated++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n完成。翻译: ${translated}，跳过: ${skipped}，失败: ${failed}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
