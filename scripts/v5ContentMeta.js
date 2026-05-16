const DROPPED_TONE_TAGS = new Set(["casual", "neutral"]);

const TONE_TAG_ALIASES = {
  emotion_booster: "emotion_intensity",
  degree_booster: "degree_intensity",
  positive_reaction: "positive_evaluation",
  directness: "direct",
  description: "descriptive",
  neutral_statement: "descriptive",
  soft_guess: "uncertainty",
  soft_disbelief: "disbelief",
  positive_outcome: "relief",
  practical: "resignation",
  emotion: "emotion_intensity",
  emotional: "emotion_intensity",
  cool: "admiration",
  funny: "enjoyment",
  warm_reaction: "warmth",
  warm_comment: "warmth",
  warm_praise: "admiration",
  light_scolding: "warning",
  mild_scolding: "warning",
  dramatic_surprise: "surprise",
  mild_surprise: "surprise",
  strong_reaction: "surprise",
  heated_reaction: "anger",
  deep_positive_reaction: "admiration",
  hard_to_judge: "evaluation",
  in_between: "evaluation",
  protest: "disagreement",
  polite_request: "request",
  courtesy: "care",
  support: "reassurance",
  reactve_comment: "comment",
  wronged: "hurt",
};

const CONTROLLED_TONE_TAGS = new Set([
  "acceptance",
  "admiration",
  "advice",
  "affection",
  "afterthought",
  "agreement",
  "alarm",
  "anger",
  "annoyance",
  "anticipation",
  "anxiety",
  "apology",
  "approval",
  "approximation",
  "arrangement",
  "asking",
  "awkwardness",
  "background",
  "boundary",
  "care",
  "causation",
  "certainty",
  "change",
  "choice",
  "clarification",
  "closure",
  "comment",
  "comfort",
  "comparison",
  "complaint",
  "completion",
  "concern",
  "concession",
  "confirmation",
  "confusion",
  "constraint",
  "contrast",
  "criticism",
  "curiosity",
  "decision",
  "degree_intensity",
  "denial",
  "descriptive",
  "direct",
  "disagreement",
  "disbelief",
  "disappointment",
  "discovery",
  "dismissal",
  "effort",
  "emotion_intensity",
  "empathy",
  "emphasis",
  "encouragement",
  "enjoyment",
  "evaluation",
  "exaggeration",
  "excitement",
  "explanation",
  "fear",
  "focus",
  "follow_up",
  "frustration",
  "guidance",
  "hearsay",
  "hesitation",
  "hurt",
  "immediacy",
  "inference",
  "instruction",
  "intention",
  "invitation",
  "limitation",
  "modesty",
  "no_choice",
  "observation",
  "ongoing_action",
  "openness",
  "panic",
  "parting",
  "permission",
  "planning",
  "pleading",
  "possibility",
  "positive_evaluation",
  "praise",
  "prediction",
  "preparation",
  "process",
  "prohibition",
  "promise",
  "questioning",
  "realization",
  "reasoning",
  "reassurance",
  "regret",
  "relief",
  "reluctance",
  "reminder",
  "repetition",
  "request",
  "resignation",
  "respect",
  "result",
  "sadness",
  "satisfaction",
  "self_consciousness",
  "shared_knowledge",
  "sincerity",
  "social_pressure",
  "softening",
  "storytelling",
  "suitability",
  "summary",
  "surprise",
  "suspicion",
  "sympathy",
  "teasing",
  "timing",
  "topic_shift",
  "transition",
  "uncertainty",
  "warning",
  "warmth",
  "willingness",
  "wonder",
]);

const FALLBACK_TONE_TAGS = {
  grammar_ending: ["explanation", "emphasis"],
  discourse_connector: ["transition", "clarification"],
  emotional_reaction: ["surprise", "emotion_intensity"],
  adverb_attitude: ["emphasis", "evaluation"],
  everyday_phrase: ["comment", "evaluation"],
  situational_sentence: ["care", "parting"],
};

const EXPR_TONE_OVERRIDES = {
  expr_0004: ["emphasis", "sincerity"],
  expr_0005: ["emphasis", "degree_intensity"],
  expr_0006: ["surprise", "admiration", "excitement"],
  expr_0007: ["surprise", "disbelief", "awkwardness"],
  expr_0008: ["frustration", "emotion_intensity", "complaint"],
  expr_0011: ["explanation", "transition", "emphasis"],
  expr_0012: ["agreement", "confirmation", "warmth"],
  expr_0013: ["topic_shift", "contrast", "clarification"],
  expr_0020: ["approximation", "dismissal", "evaluation"],
  expr_0026: ["emphasis", "explanation", "clarification"],
  expr_0028: ["softening", "dismissal", "resignation"],
  expr_0029: ["emphasis", "sincerity", "emotion_intensity"],
  expr_0031: ["disbelief", "surprise", "questioning"],
  expr_0032: ["dismissal", "disbelief", "softening"],
  expr_0033: ["dismissal", "resignation", "boundary"],
  expr_0035: ["uncertainty", "prediction", "possibility"],
  expr_0036: ["agreement", "realization", "warmth"],
  expr_0037: ["summary", "topic_shift", "transition"],
  expr_0039: ["curiosity", "questioning", "teasing"],
  expr_0040: ["questioning", "annoyance", "teasing"],
  expr_0041: ["dismissal", "annoyance", "disagreement"],
  expr_0042: ["uncertainty", "dismissal", "resignation"],
  expr_0045: ["regret", "complaint", "afterthought"],
  expr_0046: ["resignation", "no_choice", "emphasis"],
  expr_0048: ["emphasis", "storytelling", "approximation"],
  expr_0049: ["emphasis", "comparison", "contrast"],
  expr_0068: ["ongoing_action", "descriptive", "observation"],
  expr_0076: ["prohibition", "warning", "direct"],
  expr_0172: ["admiration", "positive_evaluation", "comment"],
  expr_0188: ["enjoyment", "positive_evaluation", "admiration"],
  expr_0192: ["anticipation", "approval", "admiration"],
};

const DIRECT_TAG_NORMALIZATION = {
  accidentally: "result",
  acknowledgment: "confirmation",
  active_support: "reassurance",
  actual_experience: "observation",
  actual_moment: "timing",
  addition: "emphasis",
  alternative: "choice",
  anger: "anger",
  anxiety: "anxiety",
  appetite: "anticipation",
  approximation: "evaluation",
  arrangement: "arrangement",
  arrival_request: "care",
  awkward: "awkwardness",
  awkward_refusal: "hesitation",
  awkwardness: "awkwardness",
  background: "background",
  belief: "certainty",
  better_than_expected: "admiration",
  beyond_words: "emotion_intensity",
  bickering: "disagreement",
  blissful: "admiration",
  boiling_inside: "frustration",
  broke: "constraint",
  busy: "constraint",
  cannot_bear: "frustration",
  cannot_bring_self_to: "hesitation",
  cannot_focus: "confusion",
  cannot_handle: "constraint",
  care_needed: "care",
  casual_close: "parting",
  casual_commitment: "promise",
  casual_complaint: "complaint",
  casual_confidence: "promise",
  casual_confirmation: "confirmation",
  casual_degree: "emphasis",
  casual_greeting: "warmth",
  casual_instruction: "guidance",
  casual_invitation: "invitation",
  casual_invite: "invitation",
  casual_judgment: "evaluation",
  casual_notice: "parting",
  casual_offer: "promise",
  casual_parting: "parting",
  casual_question: "questioning",
  casual_rebuttal: "disagreement",
  casual_report: "hearsay",
  casual_suggestion: "suggestion",
  casual_transition: "transition",
  caught_off_guard: "awkwardness",
  challenge: "questioning",
  choked_up: "sadness",
  clean_break: "resignation",
  clear_difference: "contrast",
  close_relationship: "warmth",
  closeness: "shared_knowledge",
  collapse: "frustration",
  colloquial_exclamation: "surprise",
  common_emphasis: "emphasis",
  complete_block: "confusion",
  complete_negation: "denial",
  completely: "emphasis",
  compression: "summary",
  concealment: "disagreement",
  conditional_meetup: "invitation",
  confidence: "certainty",
  confused: "confusion",
  convenience: "suitability",
  coordination: "transition",
  correction: "clarification",
  critical_point: "summary",
  cynical: "disbelief",
  daily_check_in: "care",
  deep_positive_reaction: "admiration",
  deescalation: "softening",
  defensive: "disagreement",
  definite_tone: "certainty",
  definition: "explanation",
  degree: "emphasis",
  dependence: "constraint",
  depessure: "reassurance",
  depreciation: "softening",
  development: "change",
  difficult_situation: "frustration",
  direct_expression: "intention",
  direct_no: "prohibition",
  disappointment: "disappointment",
  discomfort: "awkwardness",
  dislike: "disappointment",
  distance: "social_pressure",
  distracted: "confusion",
  dont_worry: "reassurance",
  downplaying: "softening",
  dramatic_complaint: "complaint",
  dramatic_reaction: "surprise",
  easy_to_notice: "observation",
  ecstactic: "admiration",
  embarrassed_reaction: "awkwardness",
  embarrassment: "awkwardness",
  emotional_distance: "hurt",
  emotional_restraint: "hesitation",
  emotional_weight: "frustration",
  emptiness: "sadness",
  equality: "agreement",
  every_time: "repetition",
  everyday: "repetition",
  exactness: "evaluation",
  exasperation: "frustration",
  exchange: "choice",
  excitement: "surprise",
  exclamation: "surprise",
  expected_bad_outcome: "prediction",
  expected_it: "prediction",
  explosive_reaction: "anger",
  extreme_degree: "emotion_intensity",
  extreme_evaluation: "surprise",
  extreme_state: "emotion_intensity",
  fear: "fear",
  filled_up: "emphasis",
  final_result: "result",
  finally_ok: "relief",
  firm_resolve: "certainty",
  firsthand_realization: "realization",
  fit: "suitability",
  flexibility: "acceptance",
  follow_up_request: "request",
  followup_question: "questioning",
  forced: "criticism",
  forceful_completion: "completion",
  foundational_point: "summary",
  framing: "transition",
  frankness: "clarification",
  friendly_emphasis: "emphasis",
  friendly_greeting: "warmth",
  from_the_start: "background",
  frustrated_negation: "frustration",
  frustrated_reply: "dismissal",
  future_judgment: "prediction",
  future_meetup: "parting",
  general_preference: "evaluation",
  general_tendency: "prediction",
  general_truth: "summary",
  generosity: "warmth",
  generous: "admiration",
  gentle_question: "care",
  gentle_transition: "transition",
  getting_it: "realization",
  giving_up: "resignation",
  gladness: "warmth",
  gradually: "change",
  guess: "prediction",
  guilt: "concern",
  habitual: "repetition",
  habitual_complaint: "complaint",
  harmony: "softening",
  helpful: "guidance",
  helplessness: "constraint",
  hidden: "softening",
  hidden_trait: "observation",
  high_intensity: "emotion_intensity",
  high_maintenance: "limitation",
  hold_on: "guidance",
  honesty: "clarification",
  hopeless: "frustration",
  hospitality: "warmth",
  humility: "modesty",
  hunch: "prediction",
  immersed: "admiration",
  impossible: "denial",
  impressed: "admiration",
  inattention: "confusion",
  independence: "willingness",
  indifference: "acceptance",
  initiative: "willingness",
  intensity: "emotion_intensity",
  interesting: "admiration",
  interruption: "contrast",
  intuition: "inference",
  irony: "teasing",
  irreversibility: "completion",
  irritation: "annoyance",
  its_nothing: "reassurance",
  just_in_case: "uncertainty",
  lack_of_intuition: "confusion",
  lack_of_progress: "frustration",
  lateness: "complaint",
  later_discovery: "realization",
  lavish_style: "admiration",
  lazy: "reluctance",
  leaving_first: "parting",
  let_it_go: "softening",
  letdown: "disappointment",
  light_acknowledgment: "confirmation",
  light_change: "softening",
  light_complaint: "complaint",
  light_conclusion: "summary",
  light_reaction: "surprise",
  lightness: "parting",
  like_it: "approval",
  lingering_concern: "concern",
  listening_response: "confirmation",
  location_check: "questioning",
  low_degree: "softening",
  low_pressure: "reassurance",
  lukewarm: "evaluation",
  measured_evaluation: "evaluation",
  memory_trigger: "realization",
  mild_complaint: "complaint",
  mild_disappointment: "disappointment",
  mild_dislike: "evaluation",
  mild_dismissal: "dismissal",
  mild_exasperation: "annoyance",
  mild_negative: "evaluation",
  mild_praise: "admiration",
  mistaken_assumption: "confusion",
  mix_up: "confusion",
  mixed_feeling: "hesitation",
  moderate_degree: "evaluation",
  moderation: "softening",
  moral_line: "criticism",
  more_than_expected: "evaluation",
  more_than_usual: "comparison",
  move_on: "softening",
  moved: "sympathy",
  much_more: "comparison",
  narration: "observation",
  near_miss: "relief",
  negative_cause: "complaint",
  negative_degree: "evaluation",
  negative_emphasis: "denial",
  negative_evaluation: "evaluation",
  negative_impression: "evaluation",
  next_step: "transition",
  no_need: "reassurance",
  no_need_to_explain: "certainty",
  no_rush: "reassurance",
  no_solution: "frustration",
  no_time: "constraint",
  nonsense: "disbelief",
  not_at_all: "denial",
  not_even: "denial",
  not_much: "softening",
  not_obvious: "softening",
  not_really: "softening",
  noticeable: "observation",
  obvious: "certainty",
  obvious_praise: "admiration",
  off: "evaluation",
  offensive: "criticism",
  ongoing: "ongoing_action",
  ongoing_tendency: "repetition",
  open_ended: "parting",
  opinion: "evaluation",
  opportunity: "suitability",
  overdue: "timing",
  parting: "parting",
  pattern: "repetition",
  pause: "guidance",
  peacekeeping: "softening",
  perfect_match: "suitability",
  perspective: "evaluation",
  persuasion: "encouragement",
  petty_fighting: "disagreement",
  pity: "sympathy",
  playful_generosity: "warmth",
  playful_or_serious_stop: "warning",
  possibility: "possibility",
  positive_evaluation: "admiration",
  pressure: "social_pressure",
  prediction: "prediction",
  preferable_option: "choice",
  premise: "background",
  pretended: "teasing",
  private_relief: "relief",
  process: "process",
  reactive_comment: "comment",
  reading_reaction: "observation",
  ready_response: "confirmation",
  realistic_limit: "constraint",
  reality_check: "realization",
  reasoning: "explanation",
  reassessment: "realization",
  reconsideration: "hesitation",
  reflection: "realization",
  reframing: "summary",
  regretful_tone: "regret",
  rejection: "disagreement",
  relax: "reassurance",
  release: "relief",
  relaying: "hearsay",
  reliance: "request",
  reported_feeling: "hearsay",
  reported_info: "hearsay",
  reserved_tone: "softening",
  reset: "topic_shift",
  respect: "admiration",
  retrospection: "realization",
  retrospective: "realization",
  reunion: "warmth",
  reveal: "clarification",
  reversal: "contrast",
  reverse_effect: "contrast",
  rough_tone: "annoyance",
  roughly: "approximation",
  sad: "sadness",
  sadness: "sadness",
  safe_space: "openness",
  satisfaction: "satisfaction",
  self_comfort: "resignation",
  self_conscious: "self_consciousness",
  self_description: "observation",
  self_pity: "sadness",
  self_reminder: "reminder",
  sense_of_direction: "realization",
  sequence: "process",
  setup: "transition",
  severity: "criticism",
  shared_realization: "realization",
  shared_understanding: "shared_knowledge",
  showing: "observation",
  sigh: "resignation",
  sincere_emphasis: "sincerity",
  sincerity: "sincerity",
  situational_response: "response",
  skeptical_reaction: "disbelief",
  slang: "annoyance",
  slight_degree: "softening",
  slight_judgment: "softening",
  slightly_formal: "softening",
  slightly_older_tone: "softening",
  small_crisis: "panic",
  social_awareness: "self_consciousness",
  speechless: "disbelief",
  spoken_narration: "observation",
  stacking_points: "emphasis",
  status_update: "explanation",
  stop: "warning",
  storytelling: "observation",
  strange: "evaluation",
  strong_degree: "degree_intensity",
  strong_dislike: "annoyance",
  strong_exclamation: "surprise",
  strong_feeling: "emotion_intensity",
  strong_negative: "denial",
  strong_praise: "admiration",
  strong_request: "request",
  stuck: "constraint",
  subjective_judgment: "evaluation",
  substitution: "choice",
  subtle_degree: "evaluation",
  sudden_realization: "realization",
  support: "reassurance",
  suspence: "prediction",
  suspense: "prediction",
  suspicion: "suspicion",
  sympathy: "sympathy",
  take_charge: "willingness",
  taking_charge: "willingness",
  tentative_realization: "realization",
  testing_waters: "hesitation",
  third_person_desire: "observation",
  time_to: "timing",
  timing: "timing",
  tiring: "frustration",
  too_easily: "repetition",
  too_far: "criticism",
  too_much: "complaint",
  topic_control: "summary",
  tradeoff: "choice",
  treating: "warmth",
  trigger: "immediacy",
  trouble: "panic",
  try_it: "encouragement",
  trying: "encouragement",
  unawareness: "confusion",
  unclear: "uncertainty",
  understanding: "acceptance",
  unease: "concern",
  uneasy: "concern",
  unfairness: "hurt",
  unfinished_action: "process",
  unnatural: "criticism",
  unnecessary: "dismissal",
  unnecessary_worry: "relief",
  unwanted_outcome: "regret",
  upset: "sadness",
  urgency: "warning",
  urgent_reaction: "panic",
  useless: "dismissal",
  utterly_not: "denial",
  wake_up: "warning",
  warmth: "warmth",
  wondering: "hesitation",
  worry: "concern",
  wrap_up: "summary",
};

function normalizeToneTag(tag) {
  if (!tag || DROPPED_TONE_TAGS.has(tag)) {
    return null;
  }
  if (TONE_TAG_ALIASES[tag]) {
    return TONE_TAG_ALIASES[tag];
  }
  if (DIRECT_TAG_NORMALIZATION[tag]) {
    return DIRECT_TAG_NORMALIZATION[tag];
  }
  if (CONTROLLED_TONE_TAGS.has(tag)) {
    return tag;
  }

  const patternRules = [
    [/surprise|shock|unexpected|exclamation/, "surprise"],
    [/disbelief|nonsense|absurd|speechless/, "disbelief"],
    [/admiration|praise|respect|impressed/, "admiration"],
    [/enjoyment|funny|interesting/, "enjoyment"],
    [/warm|reunion|friendly/, "warmth"],
    [/care|hospitality/, "care"],
    [/comfort|dont_worry|safe_space/, "comfort"],
    [/reassur|supportive|support/, "reassurance"],
    [/encouragement|try_it|persuasion/, "encouragement"],
    [/apology|sorry/, "apology"],
    [/plead|leniency/, "pleading"],
    [/agreement|acknowledg/, "agreement"],
    [/confirmation|shared_understanding/, "confirmation"],
    [/clarif|correction|reveal|restatement/, "clarification"],
    [/explanation|reason|background/, "explanation"],
    [/summary|conclusion|reframing|compress/, "summary"],
    [/topic_shift|reset/, "topic_shift"],
    [/transition|next_step|framing|setup/, "transition"],
    [/question|curiosity|challenge/, "questioning"],
    [/request|asking_for_leniency|asking/, "request"],
    [/permission/, "permission"],
    [/suggestion/, "suggestion"],
    [/invitation|meetup/, "invitation"],
    [/promise|commitment/, "promise"],
    [/willingness|taking_charge/, "willingness"],
    [/intention|choice|alternative|option|tradeoff|substitution/, "choice"],
    [/warning|alarm|hold_on|stop|boundary|wake_up/, "warning"],
    [/prohibition|direct_no/, "warning"],
    [/emphasis|booster|intensity|strong_degree/, "emphasis"],
    [/certainty|confidence|firm_resolve|obvious/, "certainty"],
    [/uncertainty|possibility|guess|prediction|wondering|hunch/, "uncertainty"],
    [/inference|intuition/, "inference"],
    [/observation|commentary|storytelling|description|reported|watching|narration/, "observation"],
    [/realization|discovery|after_checking|later_discovery|afterthought|retrospective|reflection|got_it/, "realization"],
    [/comparison|contrast|reversal|reverse_effect|clear_difference/, "contrast"],
    [/evaluation|judgment|approval|measured|moderation|strange/, "evaluation"],
    [/suitability|fit|opportunity|convenience/, "suitability"],
    [/timing|time_to|lateness|soon_arrival/, "timing"],
    [/repetition|ongoing_tendency|every_time|habitual|too_easily|pattern/, "repetition"],
    [/immediacy|quick_action|trigger/, "immediacy"],
    [/ongoing/, "ongoing_action"],
    [/completion|irreversibility|forceful_completion|final_result/, "completion"],
    [/change|development|gradually/, "change"],
    [/result|aftermath|positive_outcome/, "result"],
    [/process|sequence|unfinished_action/, "process"],
    [/limitation|high_maintenance|cannot_handle/, "limitation"],
    [/constraint|no_time|broke|helplessness|realistic_limit/, "constraint"],
    [/no_choice|resigned|resignation|practical|self_comfort/, "resignation"],
    [/relief|release|finally_ok|tension_release/, "relief"],
    [/regret|unwanted_outcome|regretful/, "regret"],
    [/disappointment|letdown|mild_disappointment/, "disappointment"],
    [/hurt|upset|wronged|emotional_distance/, "hurt"],
    [/sad|sadness|emptiness|self_pity|choked_up/, "sadness"],
    [/anxiety|worry|unease|concern|social_pressure/, "concern"],
    [/panic|trouble|urgent_reaction|small_crisis/, "panic"],
    [/frustration|boiling_inside|exasperation|tiring/, "frustration"],
    [/annoyance|irritation|rough_tone/, "annoyance"],
    [/anger|explosive_reaction|heated_reaction/, "anger"],
    [/awkward|embarrass|self_conscious|social_awareness/, "awkwardness"],
    [/teasing|irony|playful/, "teasing"],
    [/dismiss|unnecessary|pointless|useless/, "dismissal"],
    [/softening|soft_|gentle_|reserved_tone|slight_|low_degree/, "softening"],
    [/modesty|humility/, "modesty"],
    [/hearsay|quoted_|relaying/, "hearsay"],
    [/parting|sendoff|follow_up|followup|see_you|arrival_request|leave/, "parting"],
    [/suspicion|skeptical/, "suspicion"],
    [/fear|scared/, "fear"],
    [/sympathy|pity/, "sympathy"],
    [/sincerity|honesty/, "sincerity"],
    [/guidance|instruction/, "guidance"],
  ];

  for (const [pattern, normalized] of patternRules) {
    if (pattern.test(tag)) {
      return normalized;
    }
  }

  return null;
}

function normalizeToneTagsForEntry(entry) {
  if (EXPR_TONE_OVERRIDES[entry.id]) {
    return EXPR_TONE_OVERRIDES[entry.id];
  }

  const normalized = [];
  for (const rawTag of entry.tone_tags || []) {
    const tag = normalizeToneTag(rawTag);
    if (tag && !normalized.includes(tag)) {
      normalized.push(tag);
    }
  }

  const fallback = FALLBACK_TONE_TAGS[entry.category] || ["evaluation", "observation"];
  for (const tag of fallback) {
    if (normalized.length >= 2) {
      break;
    }
    if (!normalized.includes(tag)) {
      normalized.push(tag);
    }
  }

  return normalized.slice(0, 3);
}

function buildRelationIndex(expressionToId) {
  const byExpr = new Map();

  function ensure(expr) {
    if (!expressionToId.has(expr)) {
      throw new Error(`Unknown expression in relation metadata: ${expr}`);
    }
  }

  function push(source, target, relation_type, difference) {
    ensure(source);
    ensure(target);
    const list = byExpr.get(source) || [];
    if (!list.some((item) => item.target_expression === target)) {
      list.push({
        target_expression: target,
        target_expression_id: expressionToId.get(target),
        relation_type,
        difference,
      });
      byExpr.set(source, list);
    }
  }

  function pair(a, b, type, diffA, diffB = null) {
    push(a, b, type, diffA);
    push(b, a, type, diffB || diffA);
  }

  function chain(type, items) {
    for (let index = 0; index < items.length - 1; index += 1) {
      const [source, sourceNote] = items[index];
      const [target, targetNote] = items[index + 1];
      pair(
        source,
        target,
        type,
        `${source}${sourceNote}，${target}${targetNote}。`,
        `${target}${targetNote}，${source}${sourceNote}。`,
      );
    }
  }

  function scenarioChain(items) {
    chain("related_scenario", items);
  }

  chain("contrast", [
    ["-잖아", "更像提醒对方一个双方都知道的事实"],
    ["-거든", "更像顺口补充理由或背景"],
    ["-는데", "更委婉，也更像给后文铺垫"],
  ]);
  chain("related_tone", [
    ["-네", "更像当场看到后立刻冒出来的反应"],
    ["-더라", "更像事后回想自己亲身经历到的发现"],
    ["-더라고", "比-더라更像把那个发现分享给对方听"],
  ]);
  pair("-네", "그렇네", "related_tone", "-네更像把眼前刚注意到的变化直接说出来，그렇네则更像听完或想通后顺着点头‘还真是这样’。");
  pair("-지", "-잖아", "softer_than", "-지更轻、更顺口，-잖아更强调‘你也知道’这个前提。");
  pair("-지", "-거든", "similar_function", "-지更像确认共识，-거든更像补一层解释或理由。");
  pair("-지 뭐", "어차피", "related_tone", "-지 뭐常带‘那就这样吧’的收尾无奈感，어차피更像先摆出‘反正如此’这个前提。");
  chain("contrast", [
    ["-(으)ㄹ까", "更像先试探、先想一下"],
    ["-(으)ㄹ래", "更直接表达意愿或邀请"],
    ["-(으)ㄹ게", "更像对对方说‘我来做’的承诺"],
    ["-아/어야지", "更像对自己说‘得这么做’"],
  ]);
  pair("-고 싶다", "-기 싫다", "contrast", "-고 싶다是积极愿望，-기 싫다는抗拒或不想去做。");
  pair("-고 싶다", "-고 싶어 하다", "contrast", "-고 싶다는说自己的愿望，-고 싶어 하다는观察或转述别人想做什么。");
  pair("-기 싫다", "귀찮아", "related_tone", "-기 싫다是不想做某件事，귀찮아更偏觉得麻烦、懒得动。");
  chain("similar_function", [
    ["-겠네", "更像根据眼前线索脱口而出的推断"],
    ["-겠지", "更像较平静、默认式的猜测"],
    ["-(으)ㄹ 것 같다", "更完整，也更适合委婉表达判断"],
    ["-(으)ㄴ가/나 보다", "更像根据外在线索做观察式推测"],
    ["-나 싶다", "更像说话人一边想一边试着下判断"],
  ]);
  pair("-(으)ㄹ걸", "설마", "related_tone", "-(으)ㄹ걸带一点主观推测或事后感，설마更像还没确认前的不敢相信。");
  pair("-(으)ㄹ걸", "-겠지", "related_tone", "-(으)ㄹ걸更随口，也常带一点主观感；-겠지는更平稳、更默认。");
  chain("related_scenario", [
    ["-아/어 보다", "更像先试试看"],
    ["-아/어도 되다", "更像问是否允许去做"],
    ["-아/어 주다", "更像请别人帮自己做"],
    ["-아/어 주세요", "比-아/어 주다更礼貌、更完整"],
  ]);
  chain("contrast", [
    ["-지 말다", "更直接地禁止某个动作"],
    ["-아/어도 되다", "更直接地允许某个动作"],
  ]);
  chain("contrast", [
    ["-고 있다", "是在描述动作正在发生"],
    ["-게 되다", "是在说事情后来变成这样"],
    ["-다 보니", "更强调过程积累后自然出现的结果"],
    ["-다 보면", "更像泛指继续下去常会出现的结果"],
  ]);
  chain("contrast", [
    ["-자고", "专门转述‘一起做吧’这种提议"],
    ["-래", "更常转述要求、邀请或‘说要……’"],
    ["-대", "主要转述一般陈述内容"],
    ["-냐고", "专门转述问句内容"],
  ]);
  pair("-아/어 놓다", "-아/어 두다", "similar_function", "两者都能表示提前准备好，但-아/어 놓다更容易让人联想到结果状态被保留着。");
  pair("-는 김에", "-는 대신", "contrast", "-는 김에是顺便一起做，-는 대신更像交换、替代或分工。");
  pair("-다 말다", "-(으)ㄹ 뻔하다", "similar_function", "-다 말다는动作已经开始后停下，-(으)ㄹ 뻔하다는差点发生但最后没发生。");
  pair("-아/어 버리다", "-고 말다", "related_tone", "-아/어 버리다更强调结果一口气定掉了，-고 말다는更常带‘最后还是变成这样了’的遗憾。");
  pair("-아/어 내다", "-아/어 치우다", "contrast", "-아/어 내다强调硬撑着终于做成，-아/어 치우다는更像干脆一口气处理掉。");
  pair("-길래", "-는 바람에", "contrast", "-길래是顺着原因自然去做下一步，-는 바람에는负面结果感更强。");
  pair("-더니", "-더니만", "related_tone", "-더니만比-더니更口语，也更容易带一点抱怨或情绪。");
  pair("-는 척하다", "-는 편이다", "contrast", "-는 척하다는临时装出来的样子，-는 편이다是在概括一个长期倾向。");
  pair("-고도 남다", "대단하다", "related_tone", "-고도 남다는说‘这个程度完全够、甚至有余’，대단하다는直接夸对方或结果很厉害。");
  pair("-는 순간", "-자마자", "similar_function", "-는 순간更像强调那个触发点本身，-자마자更像前后动作紧接着发生。");
  pair("-기에는", "-기 딱 좋다", "contrast", "-기에는常用来判断‘对……来说有点怎样’，-기 딱 좋다는直接说‘正适合用来……’。");
  pair("-는 줄 알다", "-는 줄 모르다", "contrast", "-는 줄 알다는原先误以为如此，-는 줄 모르다는事情一直发生但自己没意识到。");
  pair("-고 보니", "알고 보니", "similar_function", "-고 보니是做过或看过之后才发现，알고 보니更像后来得知真相才知道。");
  pair("-고 보니", "듣고 보니", "related_scenario", "-고 보니更偏自己做过或看过之后发现，듣고 보니更偏听别人一说之后被点醒。");
  pair("-려다가", "-다 말다", "related_scenario", "-려다가는原本正想那样做，后来转向别处；-다 말다는动作已经开始后又停住。");
  pair("-려면", "-아/어야지", "related_scenario", "-려면是在说‘想做到那个就得……’，-아/어야지는顺着这种前提对自己下决心。");
  pair("-는데도", "그래도", "related_tone", "-는데도更像‘明明都这样了还是……’，그래도更像承认前提后仍然往另一个方向说。");
  pair("-았/었다가", "-다 말다", "related_scenario", "-았/었다가는先那样后又转回来，-다 말다는做到一半停住，两个都常用来描述动作没按原路走完。");
  pair("-았/었다니", "-다니", "related_tone", "-았/었다니更像对已经发生的事实感到意外，-다니则更宽，也能直接对刚得知的信息表示惊讶。");
  pair("-아/어 죽겠다", "미치겠다", "related_tone", "-아/어 죽겠다는夸张地说状态强到受不了，미치겠다更像快被逼疯了。");
  pair("-아/어 죽겠다", "장난 아니야", "related_tone", "-아/어 죽겠다는把自己的状态夸张化，장난 아니야更常拿来夸张评价程度很厉害。");
  pair("-을 리가 없다", "설마", "contrast", "-을 리가 없다는很坚定地否定可能性，설마更像还没完全确认前先表示‘不会吧’。");
  pair("-는 거 아니야?", "뭔데", "related_tone", "-는 거 아니야?更像带怀疑和提醒地追问，뭔데更像当场直接顶回去问。");
  pair("-는 셈이다", "한마디로", "similar_function", "-는 셈이다是换个角度总结，한마디로更像把前面的意思压缩成一句话。");
  pair("-기 마련이다", "-다 보면", "related_tone", "-기 마련이다更像在讲一种规律，-다 보면更像顺着某个过程推演常见结果。");
  pair("-기 나름이다", "차라리", "contrast", "-기 나름이다强调结果取决于做法或想法，차라리는在不满意当前选项时提出更好的替代。");
  pair("-기는 하다", "-는데", "related_tone", "-기는 하다常先承认一点再转折，-는데更像把语气放软后往下铺。");
  pair("-기는요", "-기는커녕", "contrast", "-기는요是礼貌地把夸奖或说法挡回去，-기는커녕更像‘别说那个了，连……都没有’。");

  chain("similar_meaning", [
    ["그니까", "更像已经很口语地把因果往下接"],
    ["그러니까", "更完整一点，也更适合把理由讲清楚"],
    ["아니 그러니까", "更像对方没听懂时急着重新拉回重点"],
  ]);
  chain("related_scenario", [
    ["그럼", "更像顺着前文直接做决定或收尾"],
    ["그러면", "比그럼更完整一点，更像根据条件接下一步"],
    ["그래서", "更直接把原因接到结果或追问后续"],
  ]);
  chain("contrast", [
    ["근데", "最口语、最轻的转折"],
    ["그런데", "比근데稍完整一点，但还是日常转折"],
    ["그래도", "更像承认前情之后仍然往另一个方向说"],
  ]);
  pair("사실", "솔직히", "similar_meaning", "사실更像把真实情况补出来，솔직히更像直接摊开自己的主观看法。");
  chain("clarification", [
    ["그게 아니라", "更像把对方误会的方向拉回来"],
    ["내 말은", "更像直接点出自己真正想说的重点"],
    ["무슨 말이냐면", "更像正式一点地往下展开解释"],
  ]);
  pair("그건 그렇고", "아무튼", "related_tone", "그건 그렇고更像把前话先放一边，아무튼更像把散掉的话题重新收回来。");
  pair("아무튼", "어쨌든", "similar_meaning", "아무튼更口语、像聊天时顺手收口，어쨌든更像把细节先放下、抓结论。");
  pair("하긴", "그러게", "related_tone", "하긴更像听完后承认‘那倒也是’，그러게更像顺着对方的话一起点头。");
  pair("맞아", "그렇지", "similar_meaning", "맞아更像直接说‘对’，그렇지는更像把共识或已知判断再确认一下。");
  pair("아니면", "차라리", "related_tone", "아니면更像把另一个选项摆出来，차라리는在现有选项不太好时再退一步换个更能接受的方案。");
  chain("related_scenario", [
    ["보니까", "更像边看边顺口说出观察"],
    ["듣고 보니", "更像听别人一说之后才意识到"],
    ["생각해 보니", "更像自己回头想一想才发现"],
    ["그러고 보니", "更像聊着聊着突然想起来"],
  ]);
  pair("아무래도", "아마", "similar_meaning", "아무래도更像凭整体感觉下判断，아마更像保留一点余地地说‘大概’。");
  pair("어쩌면", "아마", "similar_meaning", "어쩌면更像‘说不定’，아마更像‘大概、应该’这种温和推测。");
  pair("게다가", "더욱", "related_tone", "게다가更像再叠加一个理由，더욱更像在原本基础上把程度再往上推。");
  chain("contrast", [
    ["차라리", "更像退一步换个更能接受的选项"],
    ["오히려", "更像结果和预期反过来了"],
    ["반대로", "更像明确换到另一个方向去看"],
  ]);
  pair("왜냐하면", "그래서", "contrast", "왜냐하면更像把理由明说出来，그래서는把前面的原因直接接到结果上。");
  chain("similar_function", [
    ["결론적으로", "更像正式地给出结论"],
    ["한마디로", "更像把前面的意思压成一句话"],
    ["말하자면", "更像先铺垫一下再说自己的概括"],
  ]);
  pair("듣자 하니", "-대", "related_scenario", "듣자 하니更像句首先说‘听说’，-대则是把转述直接挂在句尾。");
  pair("보아하니", "보니까", "related_tone", "보아하니更像稍书面地根据迹象判断，보니까更像口语里边看边说。");
  pair("그러다 보니", "-다 보니", "similar_function", "그러다 보니更像在句首接前文结果，-다 보니更像直接挂在动作过程后面。");
  pair("그러다 보니까", "그러다 보니", "similar_meaning", "그러다 보니까比그러다 보니更拖一点、更像聊天里的自然连接。");
  pair("어쩌다 보니", "그러다 보니", "related_tone", "어쩌다 보니更像带一点‘稀里糊涂就变这样了’的偶然感，그러다 보니更中性。");
  pair("대신", "-는 대신", "more_formal_than", "대신更像独立拿出来说的转折词，-는 대신是直接挂在前半句里的语法结构。");
  pair("그러면 말이야", "내 말은", "related_tone", "그러면 말이야更像先铺垫一下再展开，내 말은则是直接把重点挑出来。");
  pair("아무리 그래도", "그래도", "related_tone", "아무리 그래도更像把前提先抬得更重，再说‘但还是……’，그래도则更日常、更轻。");
  pair("그러면서", "아니 근데", "related_tone", "그러면서更像‘嘴上那样说，结果又……’，아니 근데更像聊天里一边反驳一边转进下一个吐槽点。");

  chain("similar_meaning", [
    ["진짜", "更像把真实性和情绪一起往上提"],
    ["정말", "更中性，也更稳地加强语气"],
    ["완전", "更像把程度推得很满"],
    ["엄청", "更口语地把程度一下拉高"],
    ["되게", "更轻松、随口地说很……"],
    ["너무", "既能单纯说很，也常带‘太过了’的感觉"],
  ]);
  chain("similar_meaning", [
    ["꽤", "更像‘还挺’、比预想高一点"],
    ["제법", "更像‘没想到还挺像样’"],
    ["의외로", "更强调和原本预期不一样"],
    ["생각보다", "更直接拿现实和预期作对比"],
  ]);
  chain("related_tone", [
    ["별로", "更像日常里说‘不太、一般般’"],
    ["그다지", "更完整一点，也更常和否定一起出现"],
    ["전혀", "更像彻底否定‘完全不’"],
  ]);
  chain("related_tone", [
    ["절대", "更像立场很硬地说‘绝对不’"],
    ["도저히", "更像到了极限、实在做不到"],
    ["도무지", "更像完全摸不着头绪、怎么都不行"],
    ["영", "更像整体感觉不太对劲、一直提不起状态"],
  ]);
  chain("similar_meaning", [
    ["설마", "更像先说‘不会吧’的怀疑"],
    ["혹시", "更像先留一点余地地试探"],
    ["아마", "更像温和地说‘大概、应该’"],
    ["어쩌면", "更像‘说不定’"],
    ["아무래도", "更像凭整体感觉判断‘我看大概是……’"],
  ]);
  chain("related_tone", [
    ["자꾸", "更像同一件事反复冒出来"],
    ["계속", "更像持续不断地延续"],
    ["맨날", "更口语、也更容易带吐槽"],
    ["매번", "更像一回回都这样"],
    ["툭하면", "更像动不动就一下跳出来"],
  ]);
  pair("살짝", "약간", "similar_meaning", "살짝更轻、更像微微一下，약간更中性、适用范围也更广。");
  chain("related_tone", [
    ["은근", "更像表面不明显、其实还挺强"],
    ["의외로", "更像和预期不一样地显出来"],
    ["유난히", "更像和平时比特别明显"],
  ]);
  chain("related_tone", [
    ["딱", "更像刚刚好、卡得很准"],
    ["굳이", "更像反问‘非得做到这步吗’"],
    ["차라리", "更像干脆换个更能接受的选项"],
    ["훨씬", "更像明确把差距一下拉开"],
    ["더욱", "更像在原有基础上再加深一层"],
    ["더더욱", "比더욱更口语，也更强调‘那就更……了’"],
  ]);
  pair("슬슬", "천천히 해", "related_tone", "슬슬更像不知不觉到了该动的时候，천천히 해更像对对方说‘别急，慢慢来’。");
  pair("잔뜩", "엄청", "related_tone", "잔뜩更像量堆得满满的，엄청更像笼统地把程度拉高。");
  pair("애초에", "어차피", "contrast", "애초에更像回到一开始的前提，어차피更像事情已成定局后的‘反正如此’。");
  pair("괜히", "괜히 걱정했네", "related_tone", "괜히更像白白地、莫名地那样做，괜히 걱정했네则是事后发现自己白担心了。");
  pair("좀", "그건 좀", "related_tone", "좀常拿来把语气放软，그건 좀则像把那个‘有点不太行’直接说出来。");
  pair("제발", "걱정하지 마", "related_tone", "제발更像强烈地拜托对方，걱정하지 마更像安慰对方先别紧张。");
  pair("대충", "그냥", "related_tone", "대충更像随便弄个大概，그냥更像不多解释、就那样吧。");
  pair("막", "진짜", "related_tone", "막更像口语叙述里把情绪一股脑往上推，진짜则更像‘真的、真的很……’。");
  pair("차마", "도저히", "related_tone", "차마更像心理上过不去、不忍心去做，도저히更像怎么都做不到、已经到极限了。");
  pair("아예", "차라리", "related_tone", "아예更像干脆彻底切过去，차라리는在不满意当前方案时退一步换一个更能接受的。");
  pair("웬만하면", "굳이", "contrast", "웬만하면更像‘如果可以的话就……’，굳이는反过来问‘真的非得做到这步吗’。");
  pair("도통", "도무지", "similar_meaning", "도통和도무지都常接否定来表示‘怎么都不行’，도통更口语一点，도무지는更像彻底摸不着头绪。");

  chain("related_tone", [
    ["대박", "更像强烈的正向惊叹"],
    ["헐", "更像震惊里带一点无语或尴尬"],
    ["말도 안 돼", "更像直接说‘这也太离谱了’"],
    ["실화야?", "更像不敢相信地追问‘真的假的’"],
    ["기막히다", "更像离谱到一时说不出话"],
  ]);
  pair("헐", "설마", "related_tone", "헐更像事情已经撞到眼前后的短促反应，설마更像在结果确认前先说‘不会吧’。");
  chain("related_tone", [
    ["어머", "更轻、更柔地表示惊讶"],
    ["세상에", "更像稍夸张地感叹‘天哪’"],
    ["아이고", "更像口头感叹里带点操心或心疼"],
    ["어이구", "比아이고更生活化、更口语"],
    ["맙소사", "更像偏戏剧一点的震惊感叹"],
    ["아이참", "更像无奈地轻轻叹一声"],
  ]);
  chain("related_tone", [
    ["부럽다", "更直接地说羡慕"],
    ["좋겠다", "更像看着对方状态顺手说‘真好啊’"],
    ["다행이다", "更像事情没出问题后的松一口气"],
  ]);
  chain("related_tone", [
    ["아쉽다", "更像有点可惜、不够圆满"],
    ["안타깝다", "更像替对方觉得可惜或心疼"],
    ["허무하다", "更像事情过后突然空掉了"],
    ["속상하다", "更像心里闷闷地难受"],
    ["서럽다", "更像委屈一下子涌上来"],
  ]);
  pair("섭섭하다", "서운하다", "similar_meaning", "섭섭하다和서운하다都像‘有点不是滋味’，섭섭하다通常再轻一点、也更生活化。");
  chain("related_tone", [
    ["민망하다", "更像场面上有点尴尬"],
    ["당황스럽다", "更像突然被打到，反应不过来"],
    ["난감하다", "更像卡在那儿不知道怎么处理"],
    ["부담스럽다", "更像心里有压力、不想接那个分量"],
  ]);
  pair("억울하다", "속상하다", "related_tone", "억울하다更像明明不是那样却受了委屈，속상하다는更像心里闷闷地难受。");
  pair("불안하다", "무섭다", "related_tone", "불안하다更像心里持续没底，무섭다는害怕感更直接。");
  chain("related_tone", [
    ["답답하다", "更像憋闷、卡着不顺"],
    ["속 터지다", "更像看得人急得上火"],
    ["짜증 나다", "更像烦躁感持续往上冒"],
    ["열받다", "更像火气一下被点起来"],
    ["빡치다", "更粗口语、也更炸"],
    ["미치겠다", "更像快被逼疯了"],
    ["환장하겠다", "更像状态夸张到要发疯"],
    ["돌겠다", "更像被搞得整个人都要转不过来"],
  ]);
  chain("related_tone", [
    ["어이없다", "更像无语到说不上话"],
    ["황당하다", "更像觉得离谱、荒唐得很明显"],
    ["억지스럽다", "更像觉得解释或展开太牵强"],
    ["이상하다", "更像整体感觉怪、不太对"],
    ["애매하다", "更像卡在中间，不好说好坏"],
    ["별로다", "更像明确表达‘不太行’"],
    ["심하다", "更像程度明显超线了"],
    ["최악이다", "更像直接把评价打到最低"],
  ]);
  pair("황당하다", "당황스럽다", "contrast", "황당하다更像觉得事情荒唐离谱，당황스럽다更像一时慌住、不知道怎么接。");
  pair("재밌다", "웃기다", "contrast", "재밌다更像整体觉得有趣，웃기다는更像当下被逗得想笑。");
  chain("related_tone", [
    ["귀엽다", "更像可爱、惹人喜欢"],
    ["예쁘다", "更像外观漂亮、好看"],
    ["멋있다", "更像帅气、有样子"],
    ["대단하다", "更像真心佩服对方厉害"],
    ["최고다", "更像把评价直接推到顶"],
  ]);
  pair("감동이다", "대단하다", "related_tone", "감동이다更像被打动了，대단하다更像佩服对方厉害。");
  pair("놀랍다", "신기하다", "related_tone", "놀랍다更像超出预期的惊讶，신기하다는更像觉得新鲜、稀奇。");
  pair("반갑다", "오랜만이야", "related_scenario", "반갑다更像表达见到你很高兴，오랜만이야则是重逢时直接打招呼。");
  pair("맛있겠다", "대박", "related_tone", "맛있겠다는看着就觉得会很好吃，대박则更像吃到或看到结果后的强烈惊叹。");
  pair("황홀하다", "감동이다", "related_tone", "황홀하다更像沉进去的陶醉感，감동이다更像被触动、心里被打到。");

  chain("related_tone", [
    ["어쩔 수 없다", "更像整体接受现实、没别的办法"],
    ["-수밖에 없다", "更像句子里直接落在‘只能这么做’"],
    ["어차피", "更像先摆出‘反正都这样了’的前提"],
    ["그럴 수 있다", "更像先理解、先接纳一下"],
    ["그럴지도 모르다", "更像保留一种‘也说不定’的可能性"],
  ]);
  chain("related_tone", [
    ["그렇구나", "更像听懂之后接住对方的信息"],
    ["그렇네", "更像被点醒后说‘还真是’"],
    ["그렇지", "更像确认双方都懂的共识"],
    ["알겠어", "更像收到、听懂了"],
    ["알지", "更像默认双方本来就知道"],
    ["알잖아", "更像提醒对方‘你本来就知道啊’"],
  ]);
  chain("related_tone", [
    ["모르겠어", "更像真不知道或一时搞不清"],
    ["나도 몰라", "更像随口顶一句‘我也不知道啊’"],
    ["감이 안 오다", "更像抓不到头绪"],
    ["헷갈리다", "更像把几个东西混在一起了"],
  ]);
  chain("related_tone", [
    ["무슨 소리야", "更像当场反驳‘你在说什么’"],
    ["무슨 말이야", "更像追问对方到底是什么意思"],
    ["무슨 일이야", "更像看出情况不对，先问发生什么事"],
    ["왜 그래", "更像柔一点地关心对方状态"],
    ["왜 그러는데", "更像进一步追问原因"],
  ]);
  pair("웬일이야", "무슨 일이야", "related_scenario", "웬일이야更像对突然出现或反常举动感到意外，무슨 일이야更像直接关心是不是出事了。");
  pair("왜 이래", "왜 그래", "related_tone", "왜 이래更像轻一点地制止或吐槽当前行为，왜 그래更像温和地问状态怎么了。");
  chain("related_tone", [
    ["어쩌지", "更像小慌张地说‘怎么办’"],
    ["큰일 났다", "更像问题一下子变大了"],
    ["죽겠다", "更像夸张地说状态受不了了"],
    ["감당 안 되다", "更像真的扛不住那个量或压力"],
    ["답이 없다", "更像已经想不出办法了"],
  ]);
  chain("related_tone", [
    ["그만해", "更像让对方停下现在这个动作"],
    ["하지 마", "更像直接禁止某个动作"],
    ["그럴 필요 없다", "更像告诉对方没必要做到那步"],
    ["상관없다", "更像我这边都行、不介意"],
    ["신경 쓰지 마", "更像让对方别放在心上"],
    ["걱정하지 마", "更像先安抚对方别担心"],
    ["신경 안 써도 돼", "更像明确允许对方不用管这件事"],
    ["무리하지 마", "更像关心对方别硬撑"],
  ]);
  chain("related_tone", [
    ["그건 아니지", "更像明确划线说‘那样就不对了’"],
    ["그건 좀", "更像不好直接说重话，只先露出保留"],
    ["좀 그렇다", "更完整地说‘有点不太好’"],
    ["그게 문제다", "更像把真正的卡点直接指出来"],
    ["말이 안 되다", "更像逻辑上根本说不通"],
  ]);
  pair("그건 좀 오바야", "그건 아니지", "related_tone", "그건 좀 오바야更像说对方反应或说法太夸张，그건 아니지는更像在道理或边界上直接说不对。");
  chain("related_tone", [
    ["정신없다", "更像事情太多、节奏太乱"],
    ["시간 없다", "更像最直接的时间不够"],
    ["돈 없다", "更像现实上手头不够"],
    ["힘이 들다", "更像身心上有点撑不住"],
    ["귀에 안 들어오다", "更像紧张或分心到听不进去"],
  ]);
  chain("related_tone", [
    ["감이 오다", "更像开始抓到门道了"],
    ["생각보다", "更像把现实和预期摆在一起比"],
    ["알고 보니", "更像后来才知道原来如此"],
    ["막상", "更像真轮到自己时和想的不一样"],
    ["보기보다", "更像外表和实际有差距"],
    ["듣기보다", "更像传闻和实际体验有差距"],
  ]);
  pair("마음에 들다", "마음에 안 들다", "contrast", "마음에 들다는合心意、看着顺眼，마음에 안 들다는不喜欢、不满意。");
  pair("티 나다", "티 안 나다", "contrast", "티 나다는一眼就看得出来，티 안 나다는看不出来、藏得住。");
  pair("눈치 없다", "눈치 보이다", "contrast", "눈치 없다는不太会看气氛，눈치 보이다则是自己太在意别人怎么看。");
  pair("마음이 놓이다", "속이 시원하다", "related_tone", "마음이 놓이다更像终于安心，속이 시원하다는更像闷着的那口气终于顺了。");
  pair("맘에 걸리다", "괜히 걱정했네", "related_tone", "맘에 걸리다는事情还悬在心里，괜히 걱정했네则是事后发现原来自己白担心。");
  pair("선 넘다", "그건 아니지", "related_tone", "선 넘다는说行为超过了边界，그건 아니지는更像直接判定‘那样不对’。");
  pair("간보다", "눈치 보이다", "related_tone", "간보다是先试探、先看反应，눈치 보이다则是自己已经开始在意别人脸色。");
  pair("티격태격하다", "장난치지 마", "related_scenario", "티격태격하다는小打小闹地拌嘴，장난치지 마则更像其中一方要对方收一点。");
  pair("발 벗고 나서다", "내가 알아서 할게", "related_tone", "발 벗고 나서다는很主动地冲出来帮忙，내가 알아서 할게则是把事情揽到自己这边处理。");
  pair("정신 차리다", "무리하지 마", "related_tone", "정신 차리다更像提醒自己或别人清醒一点，무리하지 마更像提醒别硬撑。");
  pair("손이 많이 가다", "손이 크다", "contrast", "손이 많이 가다는做起来很费工夫，손이 크다는做出来或拿出来的量容易太大。");
  pair("말해 뭐해", "대박", "related_tone", "말해 뭐해更像好到不用多说，대박则更像当下直接爆一句惊叹。");
  pair("말이 안 나오다", "기막히다", "related_tone", "말이 안 나오다는一时说不出话，기막히다는离谱到说不出话或好到说不出话。");
  pair("쓸데없다", "그건 좀", "related_tone", "쓸데없다는觉得那件事根本没意义，그건 좀则是更委婉地先露出‘那个有点不太行’。");
  pair("말도 못 하다", "말이 안 나오다", "similar_meaning", "말도 못 하다는程度夸张到‘别提有多……’，말이 안 나오다는当场被震住、一下说不出话。");

  scenarioChain([
    ["오랜만이야", "更像重逢时第一句招呼"],
    ["잘 지냈어?", "更像接着往下问近况"],
    ["밥 먹었어?", "更像更生活化的关心"],
  ]);
  scenarioChain([
    ["어디야?", "更像先确认对方的位置"],
    ["지금 가는 중이야", "更像告诉对方自己已经在路上"],
    ["금방 갈게", "更像安抚对方自己很快就到"],
    ["천천히 와", "更像告诉对方别赶、慢慢过来"],
    ["조심해서 와", "更像在等对方来时提醒路上小心"],
  ]);
  scenarioChain([
    ["조심히 가", "更像分别时说‘路上小心’"],
    ["먼저 들어가", "更像让对方先回去"],
    ["먼저 갈게", "更像自己先打个招呼离开"],
    ["잘 들어갔어?", "更像散场后再追一条确认对方到家没"],
  ]);
  scenarioChain([
    ["이따 봐", "更像短时间后还会再见"],
    ["나중에 보자", "更像这次先这样，以后再见"],
    ["시간 되면 보자", "更像不把约定说死、留一点弹性"],
    ["연락할게", "更像把后续主动揽到自己这边"],
    ["나중에 연락해", "更像把后续交给对方来联系"],
  ]);
  scenarioChain([
    ["천천히 해", "更像做事时说‘别急，慢慢来’"],
    ["급하지 않아", "更像先告诉对方这事不急"],
    ["편하게 말해", "更像鼓励对方不要拘束、直接说"],
    ["편하게 있어", "更像请对方在场合里别拘束"],
  ]);
  scenarioChain([
    ["그냥 넘어가자", "更像这次先翻篇别纠缠"],
    ["좋게 좋게 가자", "更像别把气氛搞僵、和气一点"],
    ["그만하자", "更像已经决定到此为止"],
    ["두고 보자", "更像现在先不下结论，再看看"],
  ]);
  pair("한번 해 보자", "내가 다시 말해 줄게", "related_scenario", "한번 해 보자는鼓励对方先试，내가 다시 말해 줄게则是怕对方没跟上时继续接住。");
  pair("신경 안 써도 돼", "너무 부담 갖지 마", "related_tone", "신경 안 써도 돼更像说那件事不用放在心上，너무 부담 갖지 마更像缓解对方压力。");
  pair("그 정도는 아니야", "그건 좀 오바야", "related_tone", "그 정도는 아니야更像把事情往回收，说没那么严重；그건 좀 오바야则是说对方反应太夸张。");
  pair("내가 알아서 할게", "이번만 봐줘", "contrast", "내가 알아서 할게是把事情揽过来处理，이번만 봐줘则是做错事后请求这次放一马。");
  pair("장난치지 마", "그건 좀 오바야", "related_tone", "장난치지 마更像制止当下的玩笑或胡闹，그건 좀 오바야更像点评那已经有点过了。");
  pair("그럴 줄 알았어", "이럴 줄 알았어", "similar_meaning", "그럴 줄 알았어更像早就猜到会那样，이럴 줄 알았어更像眼前局面果然变成这样。");
  pair("설마 했는데", "안 봐도 뻔하다", "contrast", "설마 했는데是原本不想信但结果还是成真，안 봐도 뻔하다는从一开始就觉得结果太明显。");
  pair("잠깐만", "내가 다시 말해 줄게", "related_scenario", "잠깐만更像先把对话停一下，내가 다시 말해 줄게则是接着重新说清楚。");
  pair("여기 앉아", "편하게 있어", "related_scenario", "여기 앉아更像先给对方一个位置坐下，편하게 있어则是再把场子放松下来。");
  pair("내가 살게", "내가 쏠게", "similar_meaning", "내가 살게更中性地说‘我来买单’，내가 쏠게更口语、也更有一点爽快感。");
  pair("너무 늦었어", "그만하자", "related_tone", "너무 늦었어更像点出时机已经过了，그만하자는在这种判断下更进一步决定先停在这里。");
  pair("괜히 걱정했네", "별일 아니다", "related_tone", "괜히 걱정했네是事后发现自己白担心，별일 아니다则是当场把事情往小里安慰。");

  for (const [expr, relations] of byExpr.entries()) {
    byExpr.set(expr, relations.slice(0, 4));
  }

  return byExpr;
}

function buildExpressionIdMap(candidates) {
  return new Map(candidates.map((entry) => [entry.expression, entry.id]));
}

const RELATION_TARGET_ALIASES = {
  "이건 좀 아니지": "그건 아니지",
  "하기 싫어": "-기 싫다",
  "짜증나다": "짜증 나다",
  "말이 안 된다": "말이 안 되다",
  "됐어": "됐다",
};

function normalizeRelationsForEntry(entry, generatedRelations, expressionToId) {
  const normalizedExisting = (entry.relations || []).map((relation) => {
    const rawTargetExpression = relation.target_expression || "";
    const targetExpression = RELATION_TARGET_ALIASES[rawTargetExpression] || rawTargetExpression;
    const difference =
      targetExpression !== rawTargetExpression && relation.difference
        ? relation.difference.replaceAll(rawTargetExpression, targetExpression)
        : relation.difference || "";
    return {
      target_expression: targetExpression,
      target_expression_id: expressionToId.get(targetExpression) || relation.target_expression_id || null,
      relation_type: relation.relation_type === "similar_tone" ? "related_tone" : relation.relation_type,
      difference,
    };
  });

  const merged = [];
  for (const relation of [...(generatedRelations || []), ...normalizedExisting]) {
    if (
      !relation.target_expression ||
      relation.target_expression === entry.expression ||
      merged.some((item) => item.target_expression === relation.target_expression)
    ) {
      continue;
    }
    merged.push(relation);
    if (merged.length >= 4) {
      break;
    }
  }
  return merged;
}

module.exports = {
  CONTROLLED_TONE_TAGS,
  buildExpressionIdMap,
  buildRelationIndex,
  normalizeRelationsForEntry,
  normalizeToneTagsForEntry,
};
