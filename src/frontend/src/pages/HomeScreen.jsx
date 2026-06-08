import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpressions, getNextExpression } from '../api/expressionsApi';
import { adaptExpression, adaptList } from '../utils/expressionAdapter';
import { ToneRow, MasteryDot, Icon } from '../components/UIComponents';
import { TONES } from '../constants/toneMeta';
import { useStats } from '../context/StatsContext';

function Stat({ n, label }) {
  return (
    <div>
      <div className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink)', lineHeight: 1 }}>
        {n}
      </div>
      <div className="mono" style={{ marginTop: 5, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
        {label}
      </div>
    </div>
  );
}

function ToneConstellation({ tones, lit }) {
  const positions = useMemo(() => {
    return tones.map(id => {
      let h = 5381;
      for (let j = 0; j < id.length; j++) h = ((h << 5) + h + id.charCodeAt(j)) & 0xffff;
      const cx = 12 + ((h & 0xff) / 255) * 76;
      const cy = 12 + (((h >> 8) & 0xff) / 255) * 76;
      return { id, cx, cy };
    });
  }, [tones]);

  return (
    <svg className="constellation-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {positions.filter(p => lit.has(p.id)).map((a, i, arr) =>
        arr.slice(i + 1, i + 3).map(b => (
          <line
            key={`${a.id}-${b.id}`}
            x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
            stroke="var(--accent)" strokeWidth="0.2" opacity="0.3"
          />
        ))
      )}
      {positions.map(p => {
        const isLit = lit.has(p.id);
        const tone = TONES[p.id];
        const color = `oklch(0.6 0.16 ${tone?.hue || 30})`;
        return (
          <g key={p.id} transform={`translate(${p.cx}, ${p.cy})`}>
            {isLit && <circle r="3.5" fill={color} opacity="0.2" />}
            <circle r={isLit ? '2' : '1'} fill={isLit ? color : 'var(--line)'} />
            {isLit && (
              <text x="0" y="5.5" textAnchor="middle" fontSize="2.5" fill="var(--ink)" fontFamily="var(--font-sans)" fontWeight="500">
                {tone?.zh}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { stats, statsLoading } = useStats();
  const [featured, setFeatured] = useState(null);
  const [allExpressions, setAllExpressions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [nextRes, allRes] = await Promise.all([
          getNextExpression(),
          getExpressions(1, 400),
        ]);
        setFeatured(adaptExpression(nextRes.item));
        setAllExpressions(adaptList(allRes.items || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const { masteredCount = 0, learningCount = 0, totalExpressions = 0 } = stats || {};
  const pct = totalExpressions > 0 ? Math.round((masteredCount / totalExpressions) * 100) : 0;

  const reviewCandidates = useMemo(() =>
    allExpressions.filter(e => e.mastery === 'learning' || e.mastery === 'mastered').slice(0, 5),
    [allExpressions]
  );

  const learningExpressions = useMemo(() =>
    allExpressions.filter(e => e.mastery === 'learning').slice(0, 4),
    [allExpressions]
  );

  const tonesProgress = useMemo(() => {
    const all = Object.keys(TONES);
    const lit = new Set();
    allExpressions.forEach(e => {
      if (e.mastery === 'mastered') e.tones.forEach(t => lit.add(t));
    });
    return { all, lit };
  }, [allExpressions]);

  const thisWeekLearned = useMemo(() =>
    allExpressions.filter(e => e.mastery !== 'new').length,
    [allExpressions]
  );

  const today = new Date();
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日 周${dayNames[today.getDay()]}`;

  if (loading || !featured) {
    return (
      <div className="home-dashboard">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>
          加载中…
        </div>
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div className="page-eyebrow">
            <span>오늘 · today</span>
            <span className="ko-glyph">{dateStr}</span>
          </div>
          <h1 className="page-title">
            안녕，<br />
            今天准备<span className="italic">说点什么</span>？
          </h1>
        </div>
      </div>

      <div className="dash-grid-1">
        <article
          className="dash-featured hover-card"
          onClick={() => navigate(`/learn/${featured.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              今日推荐
            </span>
            <MasteryDot state={featured.mastery} />
          </div>

          <div className="hangul-hero dash-hero-hangul">{featured.hangul}</div>

          <div className="serif" style={{ marginTop: 18, fontSize: 22, lineHeight: 1.3, color: 'var(--ink)', letterSpacing: '-0.005em', textWrap: 'pretty' }}>
            {featured.meaning}
          </div>

          <div style={{ marginTop: 14, marginBottom: 18 }}>
            <ToneRow ids={featured.tones} />
          </div>

          {featured.examples[0] && (
            <div style={{ paddingTop: 14, borderTop: '1px solid var(--line-soft)' }}>
              <div className="ko-serif" style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}>
                {featured.examples[0].ko}
              </div>
              {featured.examples[0].note && (
                <div className="serif italic" style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-soft)', textWrap: 'pretty', borderLeft: '2px solid var(--accent)', paddingLeft: 12 }}>
                  {featured.examples[0].note}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
            开始学这个表达 {Icon.arrow(14)}
          </div>
        </article>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <section className="dash-review-card" onClick={() => navigate('/review')} style={{ cursor: 'pointer' }}>
            <div className="dash-review-bg-ko ko-serif">복습</div>
            <div className="dash-review-content">
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                今日复习
              </span>
              <div className="serif" style={{ marginTop: 10, fontSize: 22, lineHeight: 1.3, color: 'var(--bg)', textWrap: 'pretty' }}>
                {reviewCandidates.length} 个表达<br />
                <span className="italic" style={{ color: 'oklch(0.8 0.06 70)' }}>等你回来确认</span>
              </div>
              {reviewCandidates.length > 0 && (
                <div className="dash-review-chips">
                  {reviewCandidates.slice(0, 4).map(e => (
                    <span key={e.id} className="hangul-hero" style={{ fontSize: 18, color: 'oklch(0.92 0.012 70)' }}>
                      {e.hangul}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 18, fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                开始 5 题 →
              </div>
            </div>
          </section>

          <section className="dash-progress-card">
            <div className="section-h" style={{ marginBottom: 14 }}>
              <div>
                <span className="label">学习地图</span>
                <span className="ko-label">학습 지도</span>
              </div>
              <button onClick={() => navigate('/path')} className="btn ghost" style={{ fontSize: 11, padding: 0 }}>
                查看 →
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              {statsLoading ? (
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
                  loading...
                </span>
              ) : (
                <>
                  <span className="serif italic" style={{ fontSize: 48, fontWeight: 400, color: 'var(--ink)', lineHeight: 1 }}>
                    {masteredCount}
                  </span>
                  <span className="serif italic" style={{ fontSize: 18, color: 'var(--ink-mute)' }}>
                    / {totalExpressions} 已掌握
                  </span>
                </>
              )}
            </div>
            <div className="progress-bar" style={{ marginTop: 14 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <Stat n={statsLoading ? '...' : learningCount} label="学习中" />
              <Stat n={statsLoading ? '...' : Math.max(0, totalExpressions - masteredCount - learningCount)} label="未开始" />
            </div>
          </section>
        </div>
      </div>

      <div className="dash-grid-2">
        <section className="dash-weekly hover-card" onClick={() => navigate('/weekly')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
              本周复盘
            </span>
            <span className="ko-serif" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>주간 요약</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="serif" style={{ fontSize: 40, fontWeight: 500, color: 'var(--ink)', lineHeight: 1 }}>{thisWeekLearned}</span>
            <span className="serif italic" style={{ fontSize: 18, color: 'var(--ink-mute)' }}>个表达</span>
          </div>
          <div className="serif" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)', textWrap: 'pretty' }}>
            过去 7 天，你<span className="italic">从教科书往生活又走了一步</span>。
          </div>
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12.5, fontWeight: 500 }}>
            看完整复盘 {Icon.arrow(13)}
          </div>
        </section>

        <section className="dash-constellation">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
              表达拼图
            </span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
              {tonesProgress.lit.size} / {tonesProgress.all.length}
            </span>
          </div>
          <ToneConstellation tones={tonesProgress.all} lit={tonesProgress.lit} />
          <div className="serif italic" style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-soft)', textWrap: 'pretty' }}>
            每个亮点是你已经能说出的一种语气。
          </div>
        </section>

        <section className="dash-continue">
          <div className="section-h" style={{ marginBottom: 14 }}>
            <div>
              <span className="label">继续学习</span>
              <span className="ko-label">이어서</span>
            </div>
          </div>
          {learningExpressions.length === 0 ? (
            <div className="serif italic" style={{ color: 'var(--ink-mute)', fontSize: 13 }}>
              没有进行中的词。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {learningExpressions.map(e => (
                <button key={e.id} onClick={() => navigate(`/learn/${e.id}`)} className="mini-row">
                  <span className="hangul-hero" style={{ fontSize: 20 }}>{e.hangul}</span>
                  <span style={{ flex: 1, fontSize: 12.5, color: 'var(--ink)', textAlign: 'left' }}>{e.meaning}</span>
                  <span style={{ color: 'var(--ink-mute)' }}>{Icon.arrow(13)}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
