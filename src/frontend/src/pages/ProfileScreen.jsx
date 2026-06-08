import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpressions } from '../api/expressionsApi';
import { adaptList } from '../utils/expressionAdapter';
import { MasteryDot, Icon } from '../components/UIComponents';
import { TONES } from '../constants/toneMeta';
import { useStats } from '../context/StatsContext';

function Stat({ n, label, tint }) {
  return (
    <div>
      <div className="serif" style={{ fontSize: 28, fontWeight: 500, color: tint || 'var(--ink)', lineHeight: 1 }}>{n}</div>
      <div className="mono" style={{ marginTop: 6, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{label}</div>
    </div>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { stats, statsLoading } = useStats();
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

  const { masteredCount = 0, learningCount = 0, totalExpressions = 0 } = stats || {};
  const pct = totalExpressions > 0 ? Math.round((masteredCount / totalExpressions) * 100) : 0;

  const byTone = useMemo(() => {
    const m = {};
    allExpressions.forEach(e => {
      if (e.mastery === 'mastered') {
        e.tones.forEach(t => {
          if (!m[t]) m[t] = [];
          m[t].push(e);
        });
      }
    });
    return m;
  }, [allExpressions]);

  const toneOrder = useMemo(() =>
    Object.keys(byTone).sort((a, b) => byTone[b].length - byTone[a].length),
    [byTone]
  );

  const bookmarked = useMemo(() =>
    allExpressions.filter(e => e.notes && e.notes.trim() !== ''),
    [allExpressions]
  );

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  return (
    <div className="profile-page fade-in">
      <div className="page-eyebrow">
        <span>나의 학습 · my progress</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        你的<span className="italic">韩语口语</span>地图。
      </h1>

      <div className="profile-grid" style={{ marginBottom: 36 }}>
        <div className="profile-hero">
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
            掌握进度 · progress
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            {statsLoading ? (
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
                loading...
              </span>
            ) : (
              <>
                <span className="serif italic" style={{ fontSize: 88, fontWeight: 400, color: 'var(--ink)', lineHeight: 0.9 }}>
                  {masteredCount}
                </span>
                <span className="serif italic" style={{ fontSize: 28, color: 'var(--ink-mute)' }}>/ {totalExpressions}</span>
                <span style={{ flex: 1 }} />
                <span style={{ padding: '6px 14px', background: 'var(--accent-soft)', borderRadius: 999, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>
                  {pct}%
                </span>
              </>
            )}
          </div>
          <div className="progress-bar" style={{ marginTop: 24 }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, paddingTop: 24, borderTop: '1px solid var(--line-soft)' }}>
            <Stat n={statsLoading ? '...' : masteredCount} label="已掌握" tint="var(--ink)" />
            <Stat n={statsLoading ? '...' : learningCount} label="学习中" tint="var(--accent)" />
            <Stat n={statsLoading ? '...' : Math.max(0, totalExpressions - masteredCount - learningCount)} label="未开始" tint="var(--ink-mute)" />
          </div>
        </div>

        <div className="profile-hero">
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 16 }}>
            掌握的语气 · tones mastered
          </div>
          {toneOrder.length === 0 ? (
            <div className="serif italic" style={{ color: 'var(--ink-mute)', fontSize: 14 }}>
              还没有完全掌握的表达。先学几个词试试 ↗
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {toneOrder.map(t => {
                const tone = TONES[t];
                if (!tone) return null;
                const words = byTone[t];
                return (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 14, borderBottom: '1px solid var(--line-soft)' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 6, background: `oklch(0.62 0.16 ${tone.hue})`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{tone.zh}</span>
                    <span className="ko-serif" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{tone.ko}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {words.map(w => (
                        <button
                          key={w.id}
                          onClick={() => navigate(`/learn/${w.id}`)}
                          className="hangul-hero"
                          style={{ fontSize: 16, color: 'var(--ink)', background: 'var(--bg-soft)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--line-soft)', cursor: 'pointer' }}
                        >
                          {w.hangul}
                        </button>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <section>
        <div className="section-h">
          <div>
            <span className="label">我的笔记</span>
            <span className="ko-label">나의 메모</span>
          </div>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.14em' }}>
            {bookmarked.length}
          </span>
        </div>

        {bookmarked.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-mute)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, background: 'var(--bg-soft)', border: '1px dashed var(--line)', borderRadius: 14 }}>
            还没有写过笔记。在表达详情页可以添加。
          </div>
        ) : (
          <div className="lib-grid">
            {bookmarked.map(e => (
              <button key={e.id} onClick={() => navigate(`/learn/${e.id}`)} className="lib-card">
                <div className="lib-card-head">
                  <span className="hangul-hero" style={{ fontSize: 36 }}>{e.hangul}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>{Icon.pencil(15)}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 10 }}>{e.meaning}</div>
                <div className="serif italic" style={{ fontSize: 12, color: 'var(--ink-mute)', marginBottom: 10, lineHeight: 1.4 }}>
                  {e.notes.slice(0, 80)}{e.notes.length > 80 ? '…' : ''}
                </div>
                <MasteryDot state={e.mastery} />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
