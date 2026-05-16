import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpressions } from '../api/expressionsApi';
import { adaptList } from '../utils/expressionAdapter';
import { ToneRow, Icon } from '../components/UIComponents';
import { TONES } from '../constants/toneMeta';

const LEVEL_META = {
  1: { label: '日常基础', ko: '기초', tint: 'oklch(0.56 0.16 80)' },
  2: { label: '情感表达', ko: '감정', tint: 'oklch(0.56 0.16 30)' },
  3: { label: '语气精通', ko: '고급', tint: 'oklch(0.56 0.16 260)' },
};

function WeeklyStat({ big, unit, label, ko, tint }) {
  return (
    <div className="weekly-stat">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="serif italic" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1, color: tint }}>{big}</span>
        <span className="serif italic" style={{ fontSize: 16, color: 'var(--ink-mute)' }}>{unit}</span>
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{label}</span>
        <span className="ko-serif" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{ko}</span>
      </div>
    </div>
  );
}

export default function WeeklyScreen() {
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

  const learned = useMemo(() =>
    allExpressions.filter(e => e.mastery === 'learning' || e.mastery === 'mastered'),
    [allExpressions]
  );

  const mastered = useMemo(() =>
    allExpressions.filter(e => e.mastery === 'mastered'),
    [allExpressions]
  );

  const star = mastered[0] || learned[0];

  const tonesTouched = useMemo(() => {
    const m = {};
    learned.forEach(e => { e.tones.forEach(t => { m[t] = (m[t] || 0) + 1; }); });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [learned]);

  const byLevel = useMemo(() => {
    const out = { 1: 0, 2: 0, 3: 0 };
    learned.forEach(e => { const l = Math.min(3, Math.max(1, e.levelNum || 1)); out[l]++; });
    return out;
  }, [learned]);

  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateRange = `${weekAgo.getMonth() + 1}月${weekAgo.getDate()}日 – ${today.getMonth() + 1}月${today.getDate()}日`;

  if (loading) {
    return (
      <div className="weekly-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  return (
    <div className="weekly-page fade-in">
      <div className="detail-topbar">
        <button className="btn ghost" onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
          {Icon.back(16)} 返回
        </button>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.14em' }}>
          {dateRange}
        </span>
      </div>

      <div className="page-eyebrow">
        <span>주간 요약 · weekly</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 36 }}>
        这一周，你<span className="italic">说</span>了点新的。
      </h1>

      <div className="weekly-stats">
        <WeeklyStat big={learned.length} unit="个表达" label="总共接触" ko="이번 주" tint="var(--ink)" />
        <WeeklyStat big={mastered.length} unit="个掌握" label="完全 OK" ko="마스터" tint="var(--accent)" />
        <WeeklyStat big={tonesTouched.length} unit="种语气" label="探索过" ko="어감" tint="oklch(0.55 0.14 145)" />
      </div>

      {star && (
        <section style={{ marginBottom: 36 }}>
          <div className="section-h">
            <div>
              <span className="label">本周之星</span>
              <span className="ko-label">이번 주의 표현</span>
            </div>
          </div>
          <div className="star-card" onClick={() => navigate(`/learn/${star.id}`)} style={{ cursor: 'pointer' }}>
            <div className="star-card-decor ko-serif">★</div>
            <div className="star-card-content">
              <div className="hangul-hero" style={{ fontSize: 64 }}>{star.hangul}</div>
              <div className="serif" style={{ marginTop: 16, fontSize: 22, lineHeight: 1.35, color: 'var(--ink)', textWrap: 'pretty' }}>
                {star.meaning}
              </div>
              <div style={{ marginTop: 14 }}>
                <ToneRow ids={star.tones} />
              </div>
              {star.examples[0] && (
                <div className="serif italic" style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line-soft)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', textWrap: 'pretty' }}>
                  "{star.examples[0].ko}"
                  {star.examples[0].note && ` —— ${star.examples[0].note}`}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {tonesTouched.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div className="section-h">
            <div>
              <span className="label">说过的语气</span>
              <span className="ko-label">사용한 어감</span>
            </div>
          </div>
          <div className="weekly-tones">
            {tonesTouched.map(([id, count]) => {
              const tone = TONES[id];
              if (!tone) return null;
              return (
                <div key={id} className="weekly-tone-row">
                  <span style={{ width: 10, height: 10, borderRadius: 6, background: `oklch(0.62 0.16 ${tone.hue})`, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', minWidth: 60 }}>{tone.zh}</span>
                  <span className="ko-serif" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{tone.ko}</span>
                  <div style={{ flex: 1, height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden', marginLeft: 12 }}>
                    <div style={{ width: `${Math.min(100, count * 25)}%`, height: '100%', background: `oklch(0.62 0.16 ${tone.hue})` }} />
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', minWidth: 24, textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section style={{ marginBottom: 36 }}>
        <div className="section-h">
          <div>
            <span className="label">学习层级</span>
            <span className="ko-label">레벨 분포</span>
          </div>
        </div>
        <div className="weekly-levels">
          {[1, 2, 3].map(L => {
            const lv = LEVEL_META[L];
            return (
              <div key={L} className="weekly-level" style={{ '--level-tint': lv.tint }}>
                <div className="weekly-level-num serif italic">{L}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    {lv.label}
                    <span className="ko-serif" style={{ marginLeft: 6, color: 'var(--ink-mute)' }}>{lv.ko}</span>
                  </div>
                  <div className="mono" style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.05em', color: 'var(--ink-mute)' }}>
                    {byLevel[L]} 个
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="weekly-reflection">
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          下一步
        </div>
        <div className="serif" style={{ fontSize: 22, lineHeight: 1.45, color: 'var(--ink)', textWrap: 'pretty', letterSpacing: '-0.005em' }}>
          下周想试试<span className="italic">在 K-drama 里听到这些词</span>吗？<br />
          挑一部正在看的剧，留意一下里面出现这些表达的时刻。
        </div>
      </section>
    </div>
  );
}
