function parseLevelNum(s) {
  const m = /\d/.exec(s || '');
  return m ? +m[0] : 1;
}

function parseTones(toneStr) {
  if (!toneStr) return [];
  return toneStr.split(',').map(t => t.trim()).filter(Boolean);
}

export function statusToMastery(status) {
  if (status === 'mastered') return 'mastered';
  if (status === 'learning') return 'learning';
  return 'new';
}

export function masteryToStatus(mastery) {
  if (mastery === 'mastered') return 'mastered';
  if (mastery === 'learning') return 'learning';
  return 'not_started';
}

export function adaptExpression(raw) {
  if (!raw) return null;
  const similar = Array.isArray(raw.similar_expressions) ? raw.similar_expressions : [];
  return {
    id: raw.id,
    hangul: raw.korean || '',
    roman: raw.romanization || '',
    meaning: raw.chinese || '',
    tones: parseTones(raw.tone),
    levelNum: parseLevelNum(raw.level),
    level: raw.level || 'Level 1',
    formality: raw.formality || '',
    category: raw.category || '',
    scene: raw.context || '',
    examples: Array.isArray(raw.usage_examples)
      ? raw.usage_examples.map(ex => ({
          ko: typeof ex === 'string' ? ex : (ex.korean || ''),
          zh: typeof ex === 'object' ? (ex.chinese || '') : '',
          note: typeof ex === 'object' ? (ex.tone_note || '') : '',
        }))
      : [],
    related: similar.map(r => r.expression).filter(Boolean),
    diff: Object.fromEntries(similar.map(r => [r.expression, r.difference || ''])),
    similar_expressions: similar,
    rewrite_tasks: Array.isArray(raw.rewrite_tasks) ? raw.rewrite_tasks : [],
    mastery: statusToMastery(raw.status),
    status: raw.status || 'not_started',
    notes: raw.notes || '',
    last_reviewed: raw.last_reviewed || null,
  };
}

export function adaptList(items) {
  if (!Array.isArray(items)) return [];
  return items.map(adaptExpression).filter(Boolean);
}
