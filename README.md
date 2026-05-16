# K-drama 말투 · 地道表达

A personalized K-drama expression learning app for Chinese speakers. Learn the nuanced oral patterns that textbooks skip — organized by category, tracked by mastery.

## Stack

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React 18 + Vite + React Router 6
- **Fonts**: Noto Serif KR · Noto Serif SC · Newsreader · JetBrains Mono · Pretendard
- **AI feedback**: Ollama (local LLM, optional)

## Install

```bash
npm install
cd src/frontend && npm install
```

## Development

```bash
npm run dev
```

Starts backend on `3300` and frontend dev server on `3301` concurrently. Open `http://localhost:3301`.

## Production build

```bash
npm run build
npm start
```

Open `http://localhost:3300`.

## Dataset

The active dataset lives at `korean_expression_dataset_v5_production_clean.json` (360 expressions). It is imported into SQLite on first start and kept in sync via `ON CONFLICT DO UPDATE`.

To rebuild or validate the v5 dataset pipeline:

```bash
npm run build:v5
npm run validate:v5
```

Pipeline outputs are in `data/v5/`.

## Project Structure

```
src/
  backend/          Express server, SQLite db layer, Ollama client
  frontend/
    src/
      pages/        HomeScreen, LibraryScreen, DetailScreen, PracticeScreen,
                    PathScreen, ReviewScreen, ProfileScreen, WeeklyScreen, CompareScreen
      components/   WebShell (sidebar layout), UIComponents (shared atoms)
      context/      StatsContext
      utils/        expressionAdapter (DB → UI field mapping)
      constants/    toneMeta (tone tag → zh/ko/hue)
      api/          expressionsApi (Axios wrappers)
data/
  expressions.db    SQLite (auto-generated, gitignored)
  v5/               Dataset pipeline outputs
korean_expression_dataset_v5_production_clean.json   Active dataset
```

## Screens

| Route | Screen | Description |
|---|---|---|
| `/` | 今日 | Featured expression + review card + tone constellation |
| `/library` | 词库 | Card grid with mastery / tone filters, pagination |
| `/learn/:id` | 详情 | Expression hero, examples, Director notes, related words |
| `/practice/:id` | 练习 | Rewrite task with AI scoring and token-level feedback |
| `/path` | 路径 | Learning map grouped by category (6 types) |
| `/review` | 复习 | 4-type quiz: recall / context / tone / compare |
| `/profile` | 我的 | Mastery stats, tone breakdown, bookmarked notes |
| `/weekly` | 本周 | Weekly review summary and tone distribution |
| `/compare/:id1/:id2` | 对比 | Side-by-side expression diff |

## Expression Schema

Each expression in the dataset has:

```json
{
  "id": "expr_0001",
  "expression": "-잖아",
  "meaning": "你明明知道啊；不是……吗",
  "romanization": "janha",
  "level": 1,
  "formality": "casual",
  "category": "grammar_ending",
  "tone_tags": ["complaint", "emphasis"],
  "scenario": { "title": "...", "context": "..." },
  "simple_example": { "korean": "...", "translation": "..." },
  "usage_examples": [{ "korean": "...", "translation": "...", "tone_note": "..." }],
  "relations": [{ "target_expression": "...", "difference": "...", "relation_type": "..." }],
  "rewrite_tasks": [{
    "prompt": "...",
    "formal_sentence": "...",
    "natural_answer": "...",
    "tokens": [{ "text": "...", "action": "keep|replace|shorten|remove" }]
  }]
}
```

**Categories**: `grammar_ending` · `adverb_attitude` · `emotional_reaction` · `everyday_phrase` · `discourse_connector` · `situational_sentence`

**Formality**: `casual` · `semi-formal` · `formal`
