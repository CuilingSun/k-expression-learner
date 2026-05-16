const fs = require("fs");
const path = require("path");

const { TARGET_CATEGORY_COUNTS, SEED_GROUPS } = require("./v5ExpressionSeeds");
const {
  buildExpressionIdMap,
  buildRelationIndex,
  normalizeRelationsForEntry,
  normalizeToneTagsForEntry,
} = require("./v5ContentMeta");
const CURATED_ENTRIES = [
  ...require("./v5CuratedEntries"),
  ...require("./v5CuratedEntriesBatch2"),
  ...require("./v5CuratedEntriesBatch3"),
  ...require("./v5CuratedEntriesBatch4"),
];

const ROOT_DIR = path.resolve(__dirname, "..");
const SOURCE_V4_PATH = path.join(ROOT_DIR, "korean_expression_dataset_v4_production_clean.json");
const OUTPUT_DIR = path.join(ROOT_DIR, "data", "v5");
const CANDIDATES_PATH = path.join(OUTPUT_DIR, "candidate_expressions.json");
const EXAMPLE_CANDIDATES_PATH = path.join(OUTPUT_DIR, "example_candidates.json");
const DRAFTS_PATH = path.join(OUTPUT_DIR, "expression_drafts.json");
const PRODUCTION_V5_PATH = path.join(ROOT_DIR, "korean_expression_dataset_v5_production_clean.json");
const LEGACY_COMPAT_PATH = path.join(OUTPUT_DIR, "korean_expression_dataset_v5_legacy_compat.json");
const REPORT_PATH = path.join(OUTPUT_DIR, "progress_report.json");

const CHOSEONG = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];
const JUNGSEONG = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo",
  "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
];
const JONGSEONG = [
  "", "k", "kk", "ks", "n", "nj", "nh", "t", "l", "lk", "lm", "lb", "ls", "lt", "lp", "lh",
  "m", "p", "ps", "t", "t", "ng", "t", "t", "k", "t", "p", "h",
];

const CATEGORY_FROM_GRAMMAR = {
  sentence_ending: "grammar_ending",
  connective_ending: "grammar_ending",
  polite_ending: "grammar_ending",
  question_ending: "grammar_ending",
  discourse_marker: "discourse_connector",
  response: "discourse_connector",
  response_expression: "discourse_connector",
  conjunction_adverb: "discourse_connector",
  interjection: "emotional_reaction",
  reaction_expression: "emotional_reaction",
  slang_expression: "emotional_reaction",
  slang_question: "emotional_reaction",
  adverb: "adverb_attitude",
  slang_adverb: "adverb_attitude",
  adverb_particle: "adverb_attitude",
  spoken_adverb: "adverb_attitude",
  degree_expression: "adverb_attitude",
  fixed_expression: "everyday_phrase",
  descriptive_expression: "everyday_phrase",
  descriptive_verb: "everyday_phrase",
  question_phrase: "everyday_phrase",
  verb_expression: "everyday_phrase",
  situational_sentence: "situational_sentence",
};

const PARTICLES = [
  "에게", "한테", "에서", "으로", "로", "랑", "하고", "보다", "처럼", "까지", "부터",
  "은", "는", "이", "가", "을", "를", "도", "만", "에", "와", "과",
];
const INSERTABLE_NATURAL_TOKENS = new Set(["좀", "진짜", "아", "와", "에이", "그냥", "막"]);
const CURATED_TONE_TAGS = {
  expr_0051: ["discovery", "light_reaction", "observation"],
  expr_0052: ["confirmation", "shared_knowledge", "soft_emphasis"],
  expr_0053: ["resignation", "light_conclusion", "self_comfort"],
  expr_0054: ["insistence", "emphasis", "frustration"],
  expr_0055: ["repeated_instruction", "impatience", "warning"],
  expr_0056: ["suggestion", "hesitation", "wondering"],
  expr_0057: ["intention", "choice", "casual_invitation"],
  expr_0058: ["promise", "willingness", "immediate_decision"],
  expr_0059: ["self_reminder", "resolve", "planning"],
  expr_0060: ["desire", "personal_wish", "direct_expression"],
  expr_0061: ["reluctance", "annoyance", "avoidance"],
  expr_0062: ["inference", "observation", "sympathy"],
  expr_0063: ["guessing", "assumption", "soft_prediction"],
  expr_0064: ["observation", "guessing", "uncertainty"],
  expr_0065: ["prediction", "subjective_judgment", "softening"],
  expr_0066: ["afterthought", "guessing", "regretful_tone"],
  expr_0067: ["trying", "suggestion", "encouragement"],
  expr_0068: ["ongoing_action", "description", "neutral_statement"],
  expr_0069: ["change", "result", "development"],
  expr_0070: ["quoted_proposal", "relaying", "casual_report"],
  expr_0071: ["quoted_information", "hearsay", "casual_report"],
  expr_0072: ["quoted_request", "relaying", "instruction"],
  expr_0073: ["surprise", "disbelief", "reaction"],
  expr_0074: ["quoted_question", "relaying", "repetition"],
  expr_0075: ["permission", "asking", "confirmation"],
  expr_0076: ["prohibition", "warning", "directness"],
  expr_0077: ["request", "help", "soft_command"],
  expr_0078: ["preparation", "result_state", "readiness"],
  expr_0079: ["preparation", "planning", "readiness"],
  expr_0080: ["criticism", "limitation", "complaint"],
  expr_0081: ["interruption", "unfinished_action", "change_of_flow"],
  expr_0082: ["exaggeration", "strong_feeling", "complaint"],
  expr_0083: ["achievement", "effort", "completion"],
  expr_0084: ["forceful_completion", "decisiveness", "rough_tone"],
  expr_0085: ["firsthand_realization", "retrospective", "discovery"],
  expr_0086: ["shared_realization", "retrospective", "observation"],
  expr_0087: ["cautious_inference", "concern", "anticipation"],
  expr_0088: ["reasoning", "situational_response", "background"],
  expr_0089: ["contrast", "change", "retrospective"],
  expr_0090: ["accumulated_result", "process", "realization"],
  expr_0091: ["general_tendency", "encouragement", "prediction"],
  expr_0092: ["pretending", "concealment", "criticism"],
  expr_0093: ["tendency", "self_description", "moderation"],
  expr_0094: ["near_miss", "relief", "surprise"],
  expr_0095: ["third_person_desire", "observation", "reported_feeling"],
  expr_0096: ["possibility", "uncertainty", "softening"],
  expr_0097: ["no_choice", "resignation", "constraint"],
  expr_0098: ["convenience", "opportunity", "casual_suggestion"],
  expr_0099: ["negative_cause", "complaint", "regret"],
  expr_0100: ["tradeoff", "substitution", "arrangement"],
};
const CURATED_EXTRA_RELATIONS = {
  expr_0051: { target_expression: "-겠네", target_expression_id: "expr_0062", relation_type: "related_tone", difference: "-네是眼前看到后的即时反应，-겠네则更带一点根据线索做推断的感觉。" },
  expr_0052: { target_expression: "-거든", target_expression_id: "expr_0002", relation_type: "softer_than", difference: "-지更短更顺，常用于确认共识；-거든更像补充理由或解释背景。" },
  expr_0053: { target_expression: "어차피", target_expression_id: "expr_0046", relation_type: "related_tone", difference: "-지 뭐常带‘那就这样吧’的无奈收尾，어차피则更强调‘反正都这样了’的前提。" },
  expr_0054: { target_expression: "-라니까", target_expression_id: "expr_0055", relation_type: "similar_function", difference: "-다니까更常用来强调陈述内容，-라니까更常重复命令、要求或催促。" },
  expr_0055: { target_expression: "-다니까", target_expression_id: "expr_0054", relation_type: "similar_function", difference: "-라니까常转到命令和要求上，-다니까则多用来坚持说明一个事实。" },
  expr_0056: { target_expression: "-겠지", target_expression_id: "expr_0063", relation_type: "related_tone", difference: "-(으)ㄹ까带提议或自问的感觉，-겠지는比较平静地做猜测。" },
  expr_0057: { target_expression: "-(으)ㄹ까", target_expression_id: "expr_0056", relation_type: "contrast", difference: "-(으)ㄹ래更直接表达意愿或邀请，-(으)ㄹ까更像先试探、先想一下。" },
  expr_0058: { target_expression: "-아/어야지", target_expression_id: "expr_0059", relation_type: "contrast", difference: "-(으)ㄹ게是对别人说‘我来做’，-아/어야지更像对自己说‘得这么做’。" },
  expr_0059: { target_expression: "-고 싶다", target_expression_id: "expr_0060", relation_type: "related_tone", difference: "-아/어야지是给自己定行动，-고 싶다只是表达想做的愿望。" },
  expr_0060: { target_expression: "-(으)ㄹ래", target_expression_id: "expr_0057", relation_type: "contrast", difference: "-고 싶다偏单纯愿望，-(으)ㄹ래更常落到明确选择、决定或邀请上。" },
  expr_0061: { target_expression: "귀찮아", target_expression_id: "expr_0017", relation_type: "related_tone", difference: "-기 싫다是不想做某个动作，귀찮아更偏觉得麻烦、懒得动。" },
  expr_0062: { target_expression: "-(으)ㄹ 것 같다", target_expression_id: "expr_0065", relation_type: "similar_function", difference: "-겠네比较像看着情况脱口而出的推断，-(으)ㄹ 것 같다는更中性、更可用于委婉表达。" },
  expr_0063: { target_expression: "-(으)ㄹ 것 같다", target_expression_id: "expr_0065", relation_type: "related_tone", difference: "-겠지는随口的默认猜测，-(으)ㄹ 것 같다는更完整，也更适合委婉说出判断。" },
  expr_0064: { target_expression: "어쩌면", target_expression_id: "expr_0035", relation_type: "similar_meaning", difference: "-(으)ㄴ가/나 보다는贴近口语里的观察推测，어쩌면更像‘说不定、也许’这种副词式可能性表达。" },
  expr_0065: { target_expression: "-겠지", target_expression_id: "expr_0063", relation_type: "similar_function", difference: "-(으)ㄹ 것 같다는更完整、可委婉表达判断，-겠지는更短、更顺口的猜测。" },
  expr_0066: { target_expression: "설마", target_expression_id: "expr_0014", relation_type: "related_tone", difference: "-(으)ㄹ걸是带主观感的推测，설마更常用于还没确认前的不敢相信。" },
  expr_0067: { target_expression: "제발", target_expression_id: "expr_0044", relation_type: "used_together", difference: "-아/어 보다는建议对方先试试看，和제발搭配时语气会更强，像在恳请对方至少去试一下。" },
  expr_0068: { target_expression: "-아/어 보다", target_expression_id: "expr_0067", relation_type: "related_scenario", difference: "-고 있다描述正在做，-아/어 보다는建议先试一下，两个都很常出现在口语任务里。" },
  expr_0069: { target_expression: "-다 보니", target_expression_id: "expr_0090", relation_type: "related_scenario", difference: "-게 되다는结果变化本身，-다 보니更强调经历某个过程后慢慢导致这个结果。" },
  expr_0070: { target_expression: "-래", target_expression_id: "expr_0072", relation_type: "related_scenario", difference: "-자고是转述‘一起做吧’这种提议，-래则更宽，常转述叫人做事或说想做什么。" },
  expr_0071: { target_expression: "-냐고", target_expression_id: "expr_0074", relation_type: "contrast", difference: "-대转述陈述内容，-냐고专门转述问句，两者在转述系统里常成对学习。" },
  expr_0072: { target_expression: "-자고", target_expression_id: "expr_0070", relation_type: "related_scenario", difference: "-래覆盖要求、打算等更宽内容，-자고则专注在‘一起……吧’的提议转述上。" },
  expr_0073: { target_expression: "대박", target_expression_id: "expr_0006", relation_type: "related_tone", difference: "-다니常直接挂在一句事实后表达惊讶，대박则更像单独蹦出的强烈反应词。" },
  expr_0074: { target_expression: "뭔데", target_expression_id: "expr_0040", relation_type: "related_scenario", difference: "-냐고是转述问题内容，뭔데则是当场直接丢给对方的口语问法。" },
  expr_0075: { target_expression: "좀", target_expression_id: "expr_0043", relation_type: "used_together", difference: "-아/어도 되다和좀一起用时很常见，能把询问许可的口气再放软一点。" },
  expr_0076: { target_expression: "제발", target_expression_id: "expr_0044", relation_type: "used_together", difference: "-지 말다和제발经常一起出现，会把禁止或劝阻说得更急切、更带情绪。" },
  expr_0077: { target_expression: "-아/어도 되다", target_expression_id: "expr_0075", relation_type: "related_scenario", difference: "-아/어 주다는请求别人帮忙做，-아/어도 되다는问自己可不可以做，都是请求类高频表达。" },
  expr_0078: { target_expression: "-는 김에", target_expression_id: "expr_0098", relation_type: "related_scenario", difference: "-아/어 놓다는提前准备好状态，-는 김에는利用当前机会顺便做别的事，常一起出现在生活安排场景里。" },
  expr_0079: { target_expression: "-는 김에", target_expression_id: "expr_0098", relation_type: "related_scenario", difference: "-아/어 두다는提前备着，-는 김에는趁机会顺手做，两者都很适合表达生活里的安排感。" },
  expr_0080: { target_expression: "말이야", target_expression_id: "expr_0026", relation_type: "related_tone", difference: "-기만 하다는带批评地说‘只会这样’，말이야则常拿来接着展开说明或加强语气。" },
  expr_0081: { target_expression: "-더니", target_expression_id: "expr_0089", relation_type: "related_scenario", difference: "-다 말다는动作做到一半停下，-더니则常把前一个动作和后一个变化串起来讲。" },
  expr_0082: { target_expression: "장난 아니야", target_expression_id: "expr_0009", relation_type: "similar_tone", difference: "-아/어 죽겠다更像夸张地说自己状态很强，장난 아니야更常用来夸张评价程度很厉害。" },
  expr_0083: { target_expression: "-게 되다", target_expression_id: "expr_0069", relation_type: "related_scenario", difference: "-아/어 내다는拼命做成，-게 되다는事情后来变成这样，前者更有‘硬撑着完成’的力度。" },
  expr_0084: { target_expression: "됐다", target_expression_id: "expr_0033", relation_type: "related_tone", difference: "-아/어 치우다는干脆一口气做掉，됐다则常有‘够了、算了’那种利落收口感。" },
  expr_0085: { target_expression: "-더라고", target_expression_id: "expr_0086", relation_type: "related_tone", difference: "-더라像自己回想发现，-더라고更像把那个发现分享给对方听。" },
  expr_0086: { target_expression: "-더라", target_expression_id: "expr_0085", relation_type: "related_tone", difference: "-더라고的分享感更明显，-더라는更像自己把经历后的结论说出来。" },
  expr_0087: { target_expression: "-(으)ㄹ 것 같다", target_expression_id: "expr_0065", relation_type: "related_tone", difference: "-겠는데比-(으)ㄹ 것 같다更悬着一点，常带后文铺垫或担心。" },
  expr_0088: { target_expression: "-다 보니", target_expression_id: "expr_0090", relation_type: "contrast", difference: "-길래是看到原因后顺势去做，-다 보니是某个过程持续下来后自然出现结果。" },
  expr_0089: { target_expression: "-더라", target_expression_id: "expr_0085", relation_type: "related_scenario", difference: "-더니强调前后变化，-더라는回顾亲身发现，两者都常用于讲经历和观察。" },
  expr_0090: { target_expression: "-게 되다", target_expression_id: "expr_0069", relation_type: "related_scenario", difference: "-다 보니强调过程积累后得到结果，-게 되다는更直接点出最后变成了什么状态。" },
  expr_0091: { target_expression: "-수도 있다", target_expression_id: "expr_0096", relation_type: "related_tone", difference: "-다 보면常用来鼓励或讲规律，-수도 있다는只是保留可能性，不一定真的会发生。" },
  expr_0092: { target_expression: "어이없다", target_expression_id: "expr_0024", relation_type: "related_tone", difference: "-는 척하다常带揭穿和批评，어이없다는情绪上更直接表达‘太无语了’。" },
  expr_0093: { target_expression: "괜찮네", target_expression_id: "expr_0019", relation_type: "related_tone", difference: "-는 편이다是概括一种长期倾向，괜찮네则是当下对状态的即时评价。" },
  expr_0094: { target_expression: "어떡해", target_expression_id: "expr_0050", relation_type: "related_tone", difference: "-(으)ㄹ 뻔하다는回头说差点发生，어떡해更像事情临头时当场慌张的反应。" },
  expr_0095: { target_expression: "-(으)ㄴ가/나 보다", target_expression_id: "expr_0064", relation_type: "used_together", difference: "-고 싶어 하다常和-(으)ㄴ가/나 보다一起出现，用来推测‘他好像想……’。" },
  expr_0096: { target_expression: "어쩌면", target_expression_id: "expr_0035", relation_type: "similar_meaning", difference: "-수도 있다是句子里的可能性结构，어쩌면更像句首副词‘说不定、也许’。" },
  expr_0097: { target_expression: "어차피", target_expression_id: "expr_0046", relation_type: "related_tone", difference: "-수밖에 없다는‘只能这样做’，어차피则更像先把‘反正都这样了’这个前提摆出来。" },
  expr_0098: { target_expression: "-아/어 보다", target_expression_id: "expr_0067", relation_type: "related_scenario", difference: "-는 김에는顺便一起做，-아/어 보다는先试试看，两个都很常出现在轻松提议里。" },
  expr_0099: { target_expression: "황당하다", target_expression_id: "expr_0025", relation_type: "related_tone", difference: "-는 바람에는事情出岔子的因果感更强，황당하다는结果出来后主观上觉得离谱或错愕。" },
  expr_0100: { target_expression: "-아/어 주다", target_expression_id: "expr_0077", relation_type: "related_scenario", difference: "-는 대신常用于分工和交换，-아/어 주다는直接请对方帮忙做一件事。" },
};
const LEVEL_OVERRIDES = {
  "-잖아": 1,
  "-거든": 1,
  "-는데": 2,
  "진짜": 1,
  "완전": 1,
  "대박": 1,
  "헐": 1,
  "미치겠다": 1,
  "장난 아니야": 2,
  "너무하다": 2,
  "그니까": 1,
  "맞아": 1,
  "아니 근데": 1,
  "설마": 1,
  "그럴 리가": 2,
  "어쩌라고": 2,
  "귀찮아": 1,
  "별로야": 1,
  "괜찮네": 1,
  "대충": 1,
  "눈치 없다": 2,
  "답답하다": 2,
  "서운하다": 2,
  "어이없다": 2,
  "황당하다": 2,
  "말이야": 1,
  "그러니까": 2,
  "그냥": 1,
  "진심": 1,
  "미쳤다": 1,
  "실화야?": 1,
  "에이": 1,
  "됐다": 1,
  "왜 굳이": 2,
  "어쩌면": 2,
  "그러게": 1,
  "아무튼": 1,
  "이렇게까지": 2,
  "그게 뭔데": 2,
  "뭔데": 1,
  "내가 알게 뭐야": 2,
  "몰라": 1,
  "좀": 1,
  "제발": 1,
  "괜히": 2,
  "어차피": 1,
  "그래도": 1,
  "막": 1,
  "더더욱": 2,
  "어떡해": 1,
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function toNumericId(id) {
  const match = /(\d+)$/.exec(id);
  return match ? Number(match[1]) : 0;
}

function padId(prefix, num) {
  return `${prefix}_${String(num).padStart(4, "0")}`;
}

function mapDifficultyToLevel(difficulty) {
  if (difficulty === "advanced_intermediate") {
    return 3;
  }
  if (difficulty === "intermediate" || difficulty === "beginner_intermediate") {
    return 2;
  }
  return 1;
}

function pickLevel(expression, fallbackDifficulty) {
  return LEVEL_OVERRIDES[expression] || mapDifficultyToLevel(fallbackDifficulty);
}

function mapFormality(formality) {
  if (formality === "formal") {
    return "formal";
  }
  if (formality === "neutral" || formality === "polite") {
    return "polite";
  }
  return "casual";
}

function categorizeGrammarType(grammarType) {
  return CATEGORY_FROM_GRAMMAR[grammarType] || "everyday_phrase";
}

function romanizeHangul(text) {
  let result = "";

  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) {
      if (/\s/.test(char)) {
        result += " ";
      } else if (/[A-Za-z0-9]/.test(char)) {
        result += char.toLowerCase();
      }
      continue;
    }

    const syllableIndex = code - 0xac00;
    const choseongIndex = Math.floor(syllableIndex / 588);
    const jungseongIndex = Math.floor((syllableIndex % 588) / 28);
    const jongseongIndex = syllableIndex % 28;

    result += `${CHOSEONG[choseongIndex]}${JUNGSEONG[jungseongIndex]}${JONGSEONG[jongseongIndex]}`;
  }

  return result.replace(/\s+/g, " ").trim();
}

function splitSentenceTokens(text) {
  if (!text) {
    return [];
  }
  return text
    .replace(/([?!.,])/g, " $1 ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function splitParticle(token) {
  if (!/^[가-힣]+$/.test(token) || token.length < 2) {
    return null;
  }

  for (const particle of PARTICLES) {
    if (!token.endsWith(particle) || token.length <= particle.length) {
      continue;
    }

    const base = token.slice(0, -particle.length);
    if (base.length < 1) {
      continue;
    }

    if (/(다|요|까|네|죠|야|어|아)$/.test(base)) {
      continue;
    }

    return { base, particle };
  }

  return null;
}

function isPunctuation(token) {
  return /^[?!.,]$/.test(token);
}

function matchFormalToNatural(formalToken, naturalToken) {
  if (!naturalToken) {
    return { type: "none" };
  }
  if (formalToken === naturalToken) {
    return { type: "exact" };
  }
  const split = splitParticle(formalToken);
  if (split && split.base === naturalToken) {
    return { type: "split", base: split.base, particle: split.particle };
  }
  return { type: "none" };
}

function findNextAnchor(formalTokens, startFormalIndex, naturalTokens, naturalIndex) {
  for (let formalIndex = startFormalIndex; formalIndex < formalTokens.length; formalIndex += 1) {
    const formalToken = formalTokens[formalIndex];
    if (isPunctuation(formalToken)) {
      continue;
    }
    for (let candidateNaturalIndex = naturalIndex; candidateNaturalIndex < naturalTokens.length; candidateNaturalIndex += 1) {
      const match = matchFormalToNatural(formalToken, naturalTokens[candidateNaturalIndex]);
      if (match.type !== "none") {
        return { formalIndex, naturalIndex: candidateNaturalIndex, match };
      }
    }
  }
  return null;
}

function buildRewriteTokens(formalSentence, naturalAnswer) {
  const formalTokens = splitSentenceTokens(formalSentence);
  const naturalTokens = splitSentenceTokens(naturalAnswer).filter((token) => !isPunctuation(token));
  const output = [];
  let naturalIndex = 0;

  function currentNatural() {
    return naturalTokens[naturalIndex] || null;
  }

  function nextNatural() {
    return naturalTokens[naturalIndex + 1] || null;
  }

  for (let formalIndex = 0; formalIndex < formalTokens.length; formalIndex += 1) {
    const formalToken = formalTokens[formalIndex];
    if (isPunctuation(formalToken)) {
      output.push({ text: formalToken, action: "remove" });
      continue;
    }

    while (INSERTABLE_NATURAL_TOKENS.has(currentNatural()) && nextNatural()) {
      const nextMatch = matchFormalToNatural(formalToken, nextNatural());
      if (nextMatch.type !== "none") {
        break;
      }
      naturalIndex += 1;
    }

    const naturalToken = currentNatural();
    if (!naturalToken) {
      output.push({ text: formalToken, action: "remove" });
      continue;
    }

    const directMatch = matchFormalToNatural(formalToken, naturalToken);
    if (directMatch.type === "exact") {
      output.push({ text: formalToken, action: "keep" });
      naturalIndex += 1;
      continue;
    }

    if (directMatch.type === "split") {
      output.push({ text: directMatch.base, action: "keep" });
      output.push({ text: directMatch.particle, action: "remove" });
      naturalIndex += 1;
      continue;
    }

    if (naturalToken.startsWith(formalToken) && naturalToken.length > formalToken.length) {
      output.push({ text: formalToken, action: "shorten", suggestion: naturalToken });
      naturalIndex += 1;
      continue;
    }

    const nextAnchor = findNextAnchor(formalTokens, formalIndex + 1, naturalTokens, naturalIndex);
    if (nextAnchor && nextAnchor.naturalIndex === naturalIndex) {
      output.push({ text: formalToken, action: "remove" });
      continue;
    }

    if (nextAnchor && nextAnchor.naturalIndex > naturalIndex) {
      const suggestion = naturalTokens.slice(naturalIndex, nextAnchor.naturalIndex).join(" ");
      output.push({ text: formalToken, action: "replace", suggestion });
      naturalIndex = nextAnchor.naturalIndex;
      continue;
    }

    output.push({ text: formalToken, action: "replace", suggestion: naturalToken });
    naturalIndex += 1;
  }

  return output;
}

function transformExistingEntry(entry, relationIndex, expressionToId) {
  const draftEntry = {
    id: entry.id,
    expression: entry.expression,
    tone_tags: entry.tone_tags || [],
    category: categorizeGrammarType(entry.grammar_type),
  };

  return {
    id: entry.id,
    expression: entry.expression,
    meaning: entry.meaning,
    tone_tags: normalizeToneTagsForEntry(draftEntry),
    formality: mapFormality(entry.formality),
    grammar_type: entry.grammar_type,
    category: draftEntry.category,
    romanization: romanizeHangul(entry.expression),
    level: pickLevel(entry.expression, entry.difficulty),
    scenario: {
      title: entry.scenario?.title || "",
      context: entry.scenario?.context || "",
    },
    simple_example: {
      korean: entry.simple_example?.korean || "",
      translation: entry.simple_example?.translation || "",
    },
    usage_examples: (entry.usage_examples || []).map((example) => ({
      id: example.id,
      expression_id: entry.id,
      korean: example.korean || "",
      translation: example.translation || "",
      tone_note: example.tone_note || "",
    })),
    relations: normalizeRelationsForEntry(entry, relationIndex.get(entry.expression), expressionToId),
    rewrite_tasks: (entry.rewrite_tasks || []).map((task) => ({
      task_id: task.task_id,
      expression_id: entry.id,
      scenario_tag: task.scenario_tag || "",
      target_expression: task.target_expression || entry.expression,
      prompt: task.prompt || "",
      formal_sentence: task.formal_sentence || "",
      natural_answer: task.natural_answer || "",
      tokens: buildRewriteTokens(task.formal_sentence || "", task.natural_answer || ""),
    })),
    __provenance: "existing_v4_dataset",
  };
}

function buildExistingCandidate(entry) {
  return {
    id: entry.id,
    expression: entry.expression,
    grammar_type: entry.grammar_type,
    category: categorizeGrammarType(entry.grammar_type),
    romanization: romanizeHangul(entry.expression),
    formality: mapFormality(entry.formality),
    level: pickLevel(entry.expression, entry.difficulty),
    status: "verified_v4",
  };
}

function makeDraftSkeleton(candidate) {
  return {
    id: candidate.id,
    expression: candidate.expression,
    meaning: "",
    tone_tags: [],
    formality: candidate.formality,
    grammar_type: candidate.grammar_type,
    category: candidate.category,
    romanization: candidate.romanization,
    level: candidate.level,
    scenario: {
      title: "",
      context: "",
    },
    simple_example: {
      korean: "",
      translation: "",
    },
    usage_examples: [],
    relations: [],
    rewrite_tasks: [],
    draft_status: candidate.status,
    review_flags: [
      "missing_meaning",
      "missing_scenario",
      "missing_usage_examples",
      "missing_rewrite_tasks",
    ],
  };
}

function buildExampleCandidateRecord(candidate, existingEntry) {
  if (!existingEntry) {
    return {
      expression_id: candidate.id,
      expression: candidate.expression,
      category: candidate.category,
      wanted_examples: 3,
      candidate_examples: [],
      review_flags: ["missing_candidates"],
    };
  }

  return {
    expression_id: candidate.id,
    expression: candidate.expression,
    category: candidate.category,
    wanted_examples: 3,
    candidate_examples: (existingEntry.usage_examples || []).map((example) => ({
      korean: example.korean,
      translation: example.translation,
      tone_note: example.tone_note,
      source: existingEntry.__provenance || "existing_v4_dataset",
      accepted: true,
      score: 1,
    })),
    review_flags: [],
  };
}

function buildLegacyCompatEntry(v5Entry, sourceV4ById) {
  const source = sourceV4ById.get(v5Entry.id);
  return {
    id: v5Entry.id,
    expression: v5Entry.expression,
    meaning: v5Entry.meaning,
    tone_tags: v5Entry.tone_tags || source?.tone_tags || [],
    difficulty: source?.difficulty || (v5Entry.level === 1 ? "beginner" : v5Entry.level === 2 ? "intermediate" : "advanced_intermediate"),
    formality: v5Entry.formality,
    grammar_type: v5Entry.grammar_type,
    usage_examples: v5Entry.usage_examples.map((example) => ({
      id: example.id,
      expression_id: example.expression_id,
      korean: example.korean,
      translation: example.translation,
      tone_note: example.tone_note,
    })),
    relations: v5Entry.relations.map((relation) => ({
      target_expression: relation.target_expression,
      target_expression_id: relation.target_expression_id,
      relation_type: relation.relation_type,
      difference: relation.difference,
    })),
    scenario: {
      title: v5Entry.scenario.title,
      context: v5Entry.scenario.context,
    },
    simple_example: {
      korean: v5Entry.simple_example.korean,
      translation: v5Entry.simple_example.translation,
    },
    rewrite_tasks: v5Entry.rewrite_tasks,
  };
}

function stripInternalFields(entry) {
  const { __provenance, ...rest } = entry;
  return rest;
}

function materializeCuratedEntries(curatedEntries, candidateById, startingExampleNum, startingTaskNum, relationIndex, expressionToId) {
  let nextExampleNum = startingExampleNum;
  let nextTaskNum = startingTaskNum;

  return curatedEntries
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((entry) => {
      const candidate = candidateById.get(entry.id);
      if (!candidate) {
        throw new Error(`Missing candidate metadata for curated entry ${entry.id}`);
      }

      return {
        id: entry.id,
        expression: entry.expression || candidate.expression,
        meaning: entry.meaning,
        tone_tags: normalizeToneTagsForEntry({
          id: entry.id,
          expression: entry.expression || candidate.expression,
          tone_tags: entry.tone_tags || [],
          category: candidate.category,
        }),
        formality: candidate.formality,
        grammar_type: candidate.grammar_type,
        category: candidate.category,
        romanization: candidate.romanization,
        level: candidate.level,
        scenario: entry.scenario,
        simple_example: entry.simple_example,
        usage_examples: entry.usage_examples.map((example) => ({
          id: padId("ex", nextExampleNum++),
          expression_id: entry.id,
          korean: example.korean,
          translation: example.translation,
          tone_note: example.tone_note,
        })),
        relations: normalizeRelationsForEntry(
          entry,
          relationIndex.get(entry.expression || candidate.expression),
          expressionToId,
        ),
        rewrite_tasks: entry.rewrite_tasks.map((task) => ({
          task_id: padId("task", nextTaskNum++),
          expression_id: entry.id,
          scenario_tag: task.scenario_tag,
          target_expression: task.target_expression || candidate.expression,
          prompt: task.prompt,
          formal_sentence: task.formal_sentence,
          natural_answer: task.natural_answer,
          tokens: buildRewriteTokens(task.formal_sentence || "", task.natural_answer || ""),
        })),
        __provenance: "curated_v5",
      };
    });
}

function assertUniqueExpressions(entries) {
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.expression)) {
      throw new Error(`Duplicate expression found: ${entry.expression}`);
    }
    seen.add(entry.expression);
  }
}

function selectSeedCandidates(existingCandidates) {
  const selected = [...existingCandidates];
  const existingExpressionSet = new Set(existingCandidates.map((entry) => entry.expression));
  const counts = selected.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});

  let nextId = Math.max(...existingCandidates.map((entry) => toNumericId(entry.id)));

  for (const seedGroup of SEED_GROUPS) {
    for (const expression of seedGroup.expressions) {
      if ((counts[seedGroup.category] || 0) >= TARGET_CATEGORY_COUNTS[seedGroup.category]) {
        break;
      }
      if (existingExpressionSet.has(expression)) {
        continue;
      }

      nextId += 1;
      const candidate = {
        id: padId("expr", nextId),
        expression,
        grammar_type: seedGroup.grammar_type,
        category: seedGroup.category,
        romanization: romanizeHangul(expression),
        formality: seedGroup.formality,
        level: seedGroup.level,
        status: "seeded",
      };
      selected.push(candidate);
      existingExpressionSet.add(expression);
      counts[seedGroup.category] = (counts[seedGroup.category] || 0) + 1;
    }
  }

  const missing = Object.entries(TARGET_CATEGORY_COUNTS).filter(([category, target]) => (counts[category] || 0) !== target);
  if (missing.length > 0) {
    throw new Error(`Unable to reach target counts: ${JSON.stringify(missing)}`);
  }

  if (selected.length !== 360) {
    throw new Error(`Expected 360 candidates, received ${selected.length}`);
  }

  assertUniqueExpressions(selected);
  return selected;
}

function buildProgressReport(candidates, drafts, productionEntries) {
  const categoryCounts = candidates.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = candidates.reduce((acc, entry) => {
    acc[entry.status] = (acc[entry.status] || 0) + 1;
    return acc;
  }, {});

  return {
    target_count: 360,
    candidate_count: candidates.length,
    production_ready_count: productionEntries.length,
    draft_count: drafts.length,
    remaining_to_fill: drafts.length - productionEntries.length,
    category_counts: categoryCounts,
    candidate_status_counts: statusCounts,
    generated_at: new Date().toISOString(),
  };
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sourceV4 = readJson(SOURCE_V4_PATH);
  const sourceV4ById = new Map(sourceV4.map((entry) => [entry.id, entry]));

  const existingCandidates = sourceV4.map(buildExistingCandidate);
  const candidates = selectSeedCandidates(existingCandidates);
  const candidateById = new Map(candidates.map((entry) => [entry.id, entry]));
  const expressionToId = buildExpressionIdMap(candidates);
  const relationIndex = buildRelationIndex(expressionToId);
  const transformedExistingEntries = sourceV4.map((entry) => transformExistingEntry(entry, relationIndex, expressionToId));
  const highestExampleNum = Math.max(...transformedExistingEntries.flatMap((entry) => entry.usage_examples.map((example) => toNumericId(example.id))));
  const highestTaskNum = Math.max(...transformedExistingEntries.flatMap((entry) => entry.rewrite_tasks.map((task) => toNumericId(task.task_id))));
  const curatedEntries = materializeCuratedEntries(
    CURATED_ENTRIES,
    candidateById,
    highestExampleNum + 1,
    highestTaskNum + 1,
    relationIndex,
    expressionToId,
  );
  const transformedById = new Map([...transformedExistingEntries, ...curatedEntries].map((entry) => [entry.id, entry]));

  const exampleCandidates = candidates.map((candidate) => buildExampleCandidateRecord(candidate, transformedById.get(candidate.id)));
  const drafts = candidates.map((candidate) => stripInternalFields(transformedById.get(candidate.id) || makeDraftSkeleton(candidate)));
  const productionEntries = [...transformedExistingEntries, ...curatedEntries]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(stripInternalFields);
  const legacyCompatEntries = productionEntries.map((entry) => buildLegacyCompatEntry(entry, sourceV4ById));
  const report = buildProgressReport(candidates, drafts, productionEntries);

  writeJson(CANDIDATES_PATH, candidates);
  writeJson(EXAMPLE_CANDIDATES_PATH, exampleCandidates);
  writeJson(DRAFTS_PATH, drafts);
  writeJson(PRODUCTION_V5_PATH, productionEntries);
  writeJson(LEGACY_COMPAT_PATH, legacyCompatEntries);
  writeJson(REPORT_PATH, report);

  console.log(`Built ${candidates.length} candidates, ${drafts.length} drafts, ${productionEntries.length} verified production entries.`);
}

main();
