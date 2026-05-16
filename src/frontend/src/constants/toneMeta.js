import { TONE_ZH } from './toneLabels';

const TONE_KO = {
  complaint: '불평', mild_complaint: '조용한 불평', frustration: '답답함',
  annoyance: '짜증', impatience: '성급함', dismissal: '무관심',
  dismissive: '무시', surprise: '놀람', shock: '충격',
  excitement: '신남', exaggeration: '과장', degree_booster: '강조',
  emotion_booster: '감정 강조', admiration: '감탄', mild_praise: '칭찬',
  approval: '승인', agreement: '동의', confirmation: '확인',
  casual: '일상', neutral: '중립', practical: '실용',
  social_awareness: '눈치', storytelling: '이야기', background: '배경',
  curiosity: '호기심', questioning: '질문', confusion: '혼란',
  confused: '헷갈림', uncertainty: '불확실', soft_guess: '추측',
  hesitation: '망설임', disbelief: '믿기 어려움', soft_disbelief: '의아함',
  sympathy: '공감', comfort: '위로', sincerity: '진심',
  emotional: '감정', hurt: '상처', regret: '후회',
  disappointment: '실망', disappointed: '실망', resigned: '체념',
  worry: '걱정', panic: '당황', overwhelmed: '압도',
  emphasis: '강조', soft_emphasis: '부드러운 강조', shared_knowledge: '공감대',
  criticism: '비판', denial: '부정', defensive: '방어',
  comparison: '비교', topic_shift: '전환', realization: '깨달음',
  concession: '양보', pleading: '호소', reluctance: '마지못함',
  soft_disagreement: '살짝 반대', mild_dislike: '약간 싫음', suspicion: '의심',
  slang: '속어', lazy: '느긋함', roughly: '대략',
  summary: '정리', explanation: '설명', stuck: '막힘',
  speechless: '무언', awkwardness: '어색함', absurd: '황당함',
  softening: '완화', used_together: '함께 씀', strong_request: '강한 요청',
  request: '요청',
};

function keyToHue(key) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) & 0xffff;
  return 20 + (h % 300);
}

export const TONES = Object.fromEntries(
  Object.keys(TONE_ZH).map(k => [k, {
    zh: TONE_ZH[k],
    ko: TONE_KO[k] || k,
    hue: keyToHue(k),
  }])
);
