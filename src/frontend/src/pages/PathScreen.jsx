import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpressions } from '../api/expressionsApi';
import { adaptList } from '../utils/expressionAdapter';
import { Icon } from '../components/UIComponents';

const CATEGORY_META = {
  grammar_ending:      { label: '语尾表达', ko: '어미', tint: 'oklch(0.93 0.045 80)' },
  adverb_attitude:     { label: '副词语气', ko: '부사', tint: 'oklch(0.92 0.04 160)' },
  emotional_reaction:  { label: '情绪反应', ko: '감정', tint: 'oklch(0.91 0.05 30)' },
  everyday_phrase:     { label: '日常用语', ko: '일상', tint: 'oklch(0.93 0.04 260)' },
  discourse_connector: { label: '话语连接', ko: '연결', tint: 'oklch(0.92 0.04 320)' },
  situational_sentence:{ label: '情境句式', ko: '상황', tint: 'oklch(0.92 0.035 200)' },
};

const CATEGORY_ORDER = [
  'everyday_phrase',
  'emotional_reaction',
  'grammar_ending',
  'adverb_attitude',
  'discourse_connector',
  'situational_sentence',
];

export default function PathScreen() {
  const navigate = useNavigate();
  const [allExpressions, setAllExpressions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getExpressions(1, 400);
        setAllExpressions(adaptList(res.items || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const byCategory = useMemo(() => {
    const out = {};
    CATEGORY_ORDER.forEach(c => { out[c] = []; });
    allExpressions.forEach(e => {
      const cat = e.category && out[e.category] !== undefined ? e.category : 'everyday_phrase';
      out[cat].push(e);
    });
    return out;
  }, [allExpressions]);

  const firstNonMastered = useMemo(() => {
    for (const cat of CATEGORY_ORDER) {
      const expr = (byCategory[cat] || []).find(e => e.mastery !== 'mastered');
      if (expr) return expr;
    }
    return null;
  }, [byCategory]);

  if (loading) {
    return (
      <div className="path-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  return (
    <div className="path-page fade-in">
      <div className="page-eyebrow">
        <span>학습 지도 · learning map</span>
        <span className="ko-glyph">你的旅程</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 8 }}>
        从<span className="italic">教科书</span>到 K-drama，<br />
        一片片地图慢慢点亮。
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--ink-mute)', margin: '8px 0 28px', textWrap: 'pretty', maxWidth: 600 }}>
        按表达类型学习 —— 也可以随意跳着学。
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {CATEGORY_ORDER.map((cat, idx) => {
          const meta = CATEGORY_META[cat];
          const exprs = byCategory[cat] || [];
          const mastered = exprs.filter(e => e.mastery === 'mastered').length;
          const pct = exprs.length > 0 ? Math.round((mastered / exprs.length) * 100) : 0;
          return (
            <section key={cat} className="path-level-section" style={{ '--level-tint': meta.tint }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div className="serif italic" style={{ fontSize: 36, fontWeight: 400, color: 'var(--ink-mute)', lineHeight: 1, minWidth: 32 }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                    {meta.label}
                    <span className="ko-serif" style={{ marginLeft: 8, fontSize: 13, color: 'var(--ink-mute)', fontWeight: 400 }}>{meta.ko}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                    <div style={{ width: 120, height: 3, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
                      {mastered}/{exprs.length} 掌握
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {exprs.map(e => (
                  <button
                    key={e.id}
                    onClick={() => navigate(`/learn/${e.id}`)}
                    className={`path-word-chip ${e.mastery}`}
                    title={e.meaning}
                  >
                    <span className="hangul-hero" style={{ fontSize: 16, color: 'inherit' }}>{e.hangul}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {firstNonMastered && (
        <div className="path-cta" style={{ marginTop: 36 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
              建议下一步
            </div>
            <div className="serif" style={{ fontSize: 22, marginTop: 6, textWrap: 'pretty' }}>
              学习<span className="italic">「{firstNonMastered.hangul}」</span>，还有{' '}
              {allExpressions.filter(e => e.mastery !== 'mastered').length} 个未掌握的表达。
            </div>
          </div>
          <button className="btn primary" onClick={() => navigate(`/learn/${firstNonMastered.id}`)}>
            开始学习 {Icon.arrow(14)}
          </button>
        </div>
      )}
    </div>
  );
}
