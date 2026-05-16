import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpressions } from '../api/expressionsApi';
import { adaptList } from '../utils/expressionAdapter';
import { MasteryDot, Icon } from '../components/UIComponents';
import { TONES } from '../constants/toneMeta';

export default function LibraryScreen() {
  const navigate = useNavigate();
  const [allExpressions, setAllExpressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masteryFilter, setMasteryFilter] = useState('all');
  const [toneFilter, setToneFilter] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

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

  const allTones = useMemo(() => {
    const s = new Set();
    allExpressions.forEach(e => e.tones.forEach(t => s.add(t)));
    return [...s].filter(t => TONES[t]);
  }, [allExpressions]);

  const masteryCounts = useMemo(() => ({
    all: allExpressions.length,
    new: allExpressions.filter(e => e.mastery === 'new').length,
    learning: allExpressions.filter(e => e.mastery === 'learning').length,
    mastered: allExpressions.filter(e => e.mastery === 'mastered').length,
  }), [allExpressions]);

  const expressions = useMemo(() => {
    return allExpressions.filter(e => {
      if (masteryFilter !== 'all' && e.mastery !== masteryFilter) return false;
      if (toneFilter && !e.tones.includes(toneFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(e.hangul.includes(query) || e.meaning.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [allExpressions, masteryFilter, toneFilter, query]);

  const totalPages = Math.max(1, Math.ceil(expressions.length / PAGE_SIZE));
  const pagedExpressions = expressions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="library-page fade-in">
      <div className="page-eyebrow">
        <span>词库 · library</span>
        <span className="ko-glyph">표현 단어장</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 28 }}>
        所有<span className="italic">想说</span>但说不出口<br />
        的口语表达。
      </h1>

      <div className="library-toolbar">
        <div className="search-box">
          <span style={{ color: 'var(--ink-mute)' }}>{Icon.search(16)}</span>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="搜索表达或含义…"
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--ink-mute)' }}>
              {Icon.close(15)}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { id: 'all', label: '全部' },
          { id: 'new', label: '未开始' },
          { id: 'learning', label: '学习中' },
          { id: 'mastered', label: '已掌握' },
        ].map(opt => (
          <button key={opt.id} onClick={() => { setMasteryFilter(opt.id); setPage(1); }} className={`filter-pill ${masteryFilter === opt.id ? 'active' : ''}`}>
            {opt.label}
            <span className="count">{masteryCounts[opt.id]}</span>
          </button>
        ))}
      </div>

      {allTones.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
            按语气筛选
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {allTones.map(t => {
              const tone = TONES[t];
              const active = toneFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => { setToneFilter(active ? null : t); setPage(1); }}
                  className="tone"
                  style={{
                    '--tone-color': `oklch(0.62 0.16 ${tone.hue})`,
                    background: active ? 'var(--ink)' : 'var(--surface)',
                    color: active ? 'var(--bg)' : 'var(--ink)',
                    borderColor: active ? 'var(--ink)' : 'var(--line)',
                    cursor: 'pointer',
                  }}
                >
                  {tone.zh}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
          {loading ? '加载中…' : `${expressions.length} 个表达`}
        </div>
        {(toneFilter || masteryFilter !== 'all' || query) && (
          <button className="btn ghost" onClick={() => { setToneFilter(null); setMasteryFilter('all'); setQuery(''); setPage(1); }} style={{ fontSize: 11, padding: 0 }}>
            清除筛选
          </button>
        )}
      </div>

      {!loading && expressions.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-mute)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15 }}>
          这个筛选下没有词。试试别的组合？
        </div>
      ) : (
        <>
          <div className="lib-grid">
            {pagedExpressions.map(e => (
              <button key={e.id} onClick={() => navigate(`/learn/${e.id}`)} className="lib-card">
                <div className="lib-card-head">
                  <span className="hangul-hero" style={{
                    fontSize: 32,
                    lineHeight: 1.25,
                    color: e.mastery === 'mastered' ? 'var(--ink-mute)' : 'var(--ink)',
                    wordBreak: 'keep-all',
                  }}>
                    {e.hangul}
                  </span>
                  {e.notes && (
                    <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>{Icon.bookmark(15)}</span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 12, textWrap: 'pretty' }}>
                  {e.meaning}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--line-soft)' }}>
                  <MasteryDot state={e.mastery} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    {e.tones.slice(0, 2).map(t => {
                      const tone = TONES[t];
                      return tone ? (
                        <span key={t} style={{ width: 7, height: 7, borderRadius: 4, background: `oklch(0.62 0.16 ${tone.hue})` }} />
                      ) : null;
                    })}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--line-soft)' }}>
              <button
                className="btn ghost"
                onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                disabled={page === 1}
                style={{ opacity: page === 1 ? 0.3 : 1 }}
              >
                {Icon.back(14)} 上一页
              </button>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn ghost"
                onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                disabled={page === totalPages}
                style={{ opacity: page === totalPages ? 0.3 : 1 }}
              >
                下一页 {Icon.arrow(14)}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
