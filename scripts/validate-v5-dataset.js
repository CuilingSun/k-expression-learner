const fs = require("fs");
const path = require("path");
const { CONTROLLED_TONE_TAGS } = require("./v5ContentMeta");
const CURATED_ENTRIES = [
  ...require("./v5CuratedEntries"),
  ...require("./v5CuratedEntriesBatch2"),
  ...require("./v5CuratedEntriesBatch3"),
  ...require("./v5CuratedEntriesBatch4"),
];

const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "data", "v5");
const CANDIDATES_PATH = path.join(OUTPUT_DIR, "candidate_expressions.json");
const EXAMPLE_CANDIDATES_PATH = path.join(OUTPUT_DIR, "example_candidates.json");
const DRAFTS_PATH = path.join(OUTPUT_DIR, "expression_drafts.json");
const PRODUCTION_PATH = path.join(ROOT_DIR, "korean_expression_dataset_v5_production_clean.json");
const MIN_PRODUCTION_COUNT = 50 + CURATED_ENTRIES.length;

const VALID_FORMALITY = new Set(["casual", "polite", "formal"]);
const VALID_LEVEL = new Set([1, 2, 3]);
const VALID_TOKEN_ACTIONS = new Set(["keep", "replace", "shorten", "remove"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateCandidate(candidate) {
  assert(/^expr_\d{4}$/.test(candidate.id), `Invalid candidate id: ${candidate.id}`);
  assert(typeof candidate.expression === "string" && candidate.expression.length > 0, `Missing expression for ${candidate.id}`);
  assert(VALID_FORMALITY.has(candidate.formality), `Invalid formality for ${candidate.id}: ${candidate.formality}`);
  assert(VALID_LEVEL.has(candidate.level), `Invalid level for ${candidate.id}: ${candidate.level}`);
  assert(typeof candidate.category === "string" && candidate.category.length > 0, `Missing category for ${candidate.id}`);
  assert(typeof candidate.grammar_type === "string" && candidate.grammar_type.length > 0, `Missing grammar_type for ${candidate.id}`);
}

function validateProductionEntry(entry) {
  assert(/^expr_\d{4}$/.test(entry.id), `Invalid production id: ${entry.id}`);
  assert(typeof entry.expression === "string" && entry.expression.length > 0, `Missing expression for ${entry.id}`);
  assert(typeof entry.meaning === "string" && entry.meaning.length > 0, `Missing meaning for ${entry.id}`);
  assert(Array.isArray(entry.tone_tags) && entry.tone_tags.length >= 2 && entry.tone_tags.length <= 3, `Expected 2-3 tone_tags for ${entry.id}`);
  for (const tag of entry.tone_tags) {
    assert(CONTROLLED_TONE_TAGS.has(tag), `Unknown tone_tag for ${entry.id}: ${tag}`);
  }
  assert(VALID_FORMALITY.has(entry.formality), `Invalid formality for ${entry.id}: ${entry.formality}`);
  assert(VALID_LEVEL.has(entry.level), `Invalid level for ${entry.id}: ${entry.level}`);
  assert(typeof entry.grammar_type === "string" && entry.grammar_type.length > 0, `Missing grammar_type for ${entry.id}`);
  assert(typeof entry.category === "string" && entry.category.length > 0, `Missing category for ${entry.id}`);
  assert(typeof entry.romanization === "string" && entry.romanization.length > 0, `Missing romanization for ${entry.id}`);
  assert(entry.scenario && typeof entry.scenario.title === "string", `Missing scenario.title for ${entry.id}`);
  assert(entry.scenario && typeof entry.scenario.context === "string" && entry.scenario.context.length > 0, `Missing scenario.context for ${entry.id}`);
  assert(entry.simple_example && typeof entry.simple_example.korean === "string" && entry.simple_example.korean.length > 0, `Missing simple example Korean for ${entry.id}`);
  assert(entry.simple_example && typeof entry.simple_example.translation === "string" && entry.simple_example.translation.length > 0, `Missing simple example translation for ${entry.id}`);
  assert(Array.isArray(entry.usage_examples) && entry.usage_examples.length === 3, `Expected 3 usage examples for ${entry.id}`);
  assert(Array.isArray(entry.relations), `Missing relations array for ${entry.id}`);
  assert(entry.relations.length <= 4, `Expected at most 4 relations for ${entry.id}`);
  assert(Array.isArray(entry.rewrite_tasks) && entry.rewrite_tasks.length >= 1, `Expected at least 1 rewrite task for ${entry.id}`);

  for (const example of entry.usage_examples) {
    assert(/^ex_\d{4}$/.test(example.id), `Invalid example id in ${entry.id}: ${example.id}`);
    assert(example.expression_id === entry.id, `Example ${example.id} points to wrong expression_id`);
    assert(typeof example.korean === "string" && example.korean.length > 0, `Missing example Korean for ${example.id}`);
    assert(typeof example.translation === "string" && example.translation.length > 0, `Missing example translation for ${example.id}`);
    assert(typeof example.tone_note === "string" && example.tone_note.length > 0, `Missing tone_note for ${example.id}`);
  }

  const relationTargets = new Set();
  for (const relation of entry.relations) {
    assert(typeof relation.target_expression === "string" && relation.target_expression.length > 0, `Missing target_expression in ${entry.id}`);
    assert(typeof relation.relation_type === "string" && relation.relation_type.length > 0, `Missing relation_type in ${entry.id}`);
    assert(typeof relation.difference === "string" && relation.difference.length > 0, `Missing difference in ${entry.id}`);
    assert(!relationTargets.has(relation.target_expression), `Duplicate relation target in ${entry.id}: ${relation.target_expression}`);
    relationTargets.add(relation.target_expression);
  }

  for (const task of entry.rewrite_tasks) {
    assert(/^task_\d{4}$/.test(task.task_id), `Invalid task id in ${entry.id}: ${task.task_id}`);
    assert(task.expression_id === entry.id, `Task ${task.task_id} points to wrong expression_id`);
    assert(typeof task.scenario_tag === "string" && task.scenario_tag.length > 0, `Missing scenario_tag in ${task.task_id}`);
    assert(typeof task.target_expression === "string" && task.target_expression.length > 0, `Missing target_expression in ${task.task_id}`);
    assert(typeof task.prompt === "string" && task.prompt.length > 0, `Missing prompt in ${task.task_id}`);
    assert(typeof task.formal_sentence === "string" && task.formal_sentence.length > 0, `Missing formal_sentence in ${task.task_id}`);
    assert(typeof task.natural_answer === "string" && task.natural_answer.length > 0, `Missing natural_answer in ${task.task_id}`);
    assert(Array.isArray(task.tokens) && task.tokens.length >= 1, `Missing tokens in ${task.task_id}`);

    for (const token of task.tokens) {
      assert(typeof token.text === "string" && token.text.length > 0, `Missing token text in ${task.task_id}`);
      assert(VALID_TOKEN_ACTIONS.has(token.action), `Invalid token action in ${task.task_id}: ${token.action}`);
      if (token.action === "replace" || token.action === "shorten") {
        assert(typeof token.suggestion === "string" && token.suggestion.length > 0, `Missing suggestion in ${task.task_id}`);
      } else {
        assert(!("suggestion" in token), `Unexpected suggestion in ${task.task_id}`);
      }
    }
  }
}

function main() {
  const candidates = readJson(CANDIDATES_PATH);
  const exampleCandidates = readJson(EXAMPLE_CANDIDATES_PATH);
  const drafts = readJson(DRAFTS_PATH);
  const productionEntries = readJson(PRODUCTION_PATH);

  assert(Array.isArray(candidates) && candidates.length === 360, `Expected 360 candidates, got ${candidates.length}`);
  assert(Array.isArray(exampleCandidates) && exampleCandidates.length === 360, `Expected 360 example candidate records, got ${exampleCandidates.length}`);
  assert(Array.isArray(drafts) && drafts.length === 360, `Expected 360 drafts, got ${drafts.length}`);
  assert(Array.isArray(productionEntries) && productionEntries.length >= MIN_PRODUCTION_COUNT, `Expected at least ${MIN_PRODUCTION_COUNT} production entries, got ${productionEntries.length}`);

  const candidateIds = new Set();
  const candidateExpressions = new Set();
  for (const candidate of candidates) {
    validateCandidate(candidate);
    assert(!candidateIds.has(candidate.id), `Duplicate candidate id: ${candidate.id}`);
    assert(!candidateExpressions.has(candidate.expression), `Duplicate candidate expression: ${candidate.expression}`);
    candidateIds.add(candidate.id);
    candidateExpressions.add(candidate.expression);
  }

  for (const entry of productionEntries) {
    validateProductionEntry(entry);
    assert(candidateIds.has(entry.id), `Production entry missing from candidates: ${entry.id}`);
    for (const relation of entry.relations) {
      if (relation.target_expression_id !== null) {
        assert(candidateIds.has(relation.target_expression_id), `Unknown relation target_expression_id in ${entry.id}: ${relation.target_expression_id}`);
      }
    }
  }

  console.log(`Validated ${candidates.length} candidates, ${drafts.length} drafts, ${productionEntries.length} production entries.`);
}

main();
