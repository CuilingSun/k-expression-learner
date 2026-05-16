import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpressions, updateExpressionStatus } from '../api/expressionsApi';
import { adaptList, masteryToStatus } from '../utils/expressionAdapter';
import { ToneRow, MasteryDot, Icon } from '../components/UIComponents';
import { TONES } from '../constants/toneMeta';
import { useStats } from '../context/StatsContext';

function buildRecall(target, all) {
  const distractors = all.filter(e => e.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [target.hangul, ...distractors.map(e => e.hangul)].sort(() => Math.random() - 0.5);
  return { type: 'recall', typeLabel: '意思回想', prompt: target.meaning, promptHint: '下面哪个是 →', options, correct: target.hangul, reveal: target };
}

function buildContext(target, all) {
  if (!target.scene) return buildRecall(target, all);
  const distractors = all.filter(e => e.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 2);
  const options = [target.hangul, ...distractors.map(e => e.hangul)].sort(() => Math.random() - 0.5);
  return { type: 'context', typeLabel: '语境选择', prompt: target.scene, promptHint: '这个场景下最常说哪个？', options, correct: target.hangul, reveal: target };
}

function buildTone(target, all) {
  if (!target.tones.length) return buildRecall(target, all);
  const allToneIds = Object.keys(TONES);
  const distractors = allToneIds.filter(t => !target.tones.includes(t)).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [target.tones[0], ...distractors].sort(() => Math.random() - 0.5).map(t => ({
    key: t, label: TONES[t]?.zh || t, hue: TONES[t]?.hue,
  }));
  return {
    type: 'tone', typeLabel: '语气识别',
    prompt: target.examples[0]?.ko || target.hangul,
    promptHint: '最主要的语气是？',
    options, correct: target.tones[0], reveal: target,
  };
}

function buildCompare(target, all) {
  const related = all.find(e => target.related?.includes(e.hangul));
  if (!related) return buildRecall(target, all);
  const options = [target.hangul, related.hangul].sort(() => Math.random() - 0.5);
  return {
    type: 'compare', typeLabel: '对比学习',
    prompt: target.scene || target.meaning,
    promptHint: '这个场景下，哪个更合适？',
    options, correct: target.hangul,
    diff: target.diff?.[related.hangul],
    reveal: target, otherWord: related,
  };
}

const BUILDERS = [buildRecall, buildContext, buildTone, buildCompare];

export default function ReviewScreen() {
  const navigate = useNavigate();
  const { refreshStats } = useStats();
  const [allExpressions, setAllExpressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

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

  const queue = useMemo(() => {
    const candidates = allExpressions.filter(e => e.mastery === 'learning' || e.mastery === 'mastered');
    if (candidates.length === 0) return [];
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map((expr, i) => {
      const build = BUILDERS[i % BUILDERS.length];
      return build(expr, allExpressions);
    }).filter(Boolean);
  }, [allExpressions]);

  const current = queue[currentIdx];

  const handleSelect = async (option) => {
    if (selected !== null) return;
    const key = typeof option === 'object' ? option.key : option;
    setSelected(key);
    const correct = key === current.correct;
    setResults(r => [...r, { correct, expr: current.reveal }]);
    if (!correct && current.reveal) {
      try {
        await updateExpressionStatus(current.reveal.id, masteryToStatus('learning'));
        refreshStats();
      } catch {}
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= queue.length) {
      setDone(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="review-page fade-in">
        <div className="page-eyebrow"><span>复习 · review</span></div>
        <h1 className="page-title" style={{ marginBottom: 24 }}>还没有可以复习的词。</h1>
        <div className="serif" style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 24 }}>
          先去词库里学几个表达，标记为"学习中"，就可以来复习了。
        </div>
        <button className="btn primary" onClick={() => navigate('/library')}>去词库 {Icon.arrow(14)}</button>
      </div>
    );
  }

  if (done) {
    const correctCount = results.filter(r => r.correct).length;
    const wrongOnes = results.filter(r => !r.correct).map(r => r.expr);
    return (
      <div className="review-page fade-in">
        <div className="page-eyebrow"><span>复习完成 · done</span></div>
        <h1 className="page-title" style={{ marginBottom: 24 }}>
          答对了 <span className="italic">{correctCount}</span> / {queue.length}
        </h1>
        <div className="review-score-banner">
          {results.map((r, i) => (
            <span key={i} className={`review-pip ${r.correct ? 'correct' : 'wrong'}`} />
          ))}
        </div>
        {wrongOnes.length > 0 && (
          <section style={{ marginTop: 28 }}>
            <div className="section-h"><div><span className="label">再看看这几个</span></div></div>
            <div className="lib-grid">
              {wrongOnes.map(e => (
                <button key={e.id} onClick={() => navigate(`/learn/${e.id}`)} className="lib-card">
                  <div className="hangul-hero" style={{ fontSize: 32 }}>{e.hangul}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 8 }}>{e.meaning}</div>
                </button>
              ))}
            </div>
          </section>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button className="btn outline" onClick={() => { setCurrentIdx(0); setSelected(null); setResults([]); setDone(false); }}>
            再来一次
          </button>
          <button className="btn primary" onClick={() => navigate('/')}>
            返回首页 {Icon.arrow(14)}
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const answered = selected !== null;
  const isCorrect = selected === current.correct;

  return (
    <div className="review-page fade-in">
      <div className="detail-topbar">
        <button className="btn ghost" onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
          {Icon.back(16)} 返回
        </button>
        <div className="review-score-banner">
          {queue.map((_, i) => {
            const r = results[i];
            return (
              <span key={i} className={`review-pip ${r ? (r.correct ? 'correct' : 'wrong') : i === currentIdx ? 'current' : ''}`} />
            );
          })}
        </div>
      </div>

      <div className="page-eyebrow">
        <span>{current.typeLabel}</span>
        <span className="ko-glyph">{currentIdx + 1} / {queue.length}</span>
      </div>

      <div className="review-card">
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 16 }}>
          {current.promptHint}
        </div>

        {current.type === 'tone' ? (
          <div className="ko-serif" style={{ fontSize: 24, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 24 }}>
            {current.prompt}
          </div>
        ) : (
          <div className="serif" style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--ink)', marginBottom: 24, textWrap: 'pretty' }}>
            {current.prompt}
          </div>
        )}

        <div className="review-options">
          {current.options.map((opt, i) => {
            const key = typeof opt === 'object' ? opt.key : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            const hue = typeof opt === 'object' ? opt.hue : null;
            const isSelected = selected === key;
            const isCorrectOpt = key === current.correct;
            let cls = 'review-option';
            if (answered) {
              if (isCorrectOpt) cls += ' correct';
              else if (isSelected && !isCorrectOpt) cls += ' wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={answered}>
                {hue ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 5, background: `oklch(0.62 0.16 ${hue})`, flexShrink: 0 }} />
                    {label}
                  </span>
                ) : (
                  <span className="hangul-hero" style={{ fontSize: 22 }}>{label}</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: isCorrect ? 'oklch(0.55 0.14 145)' : 'var(--accent)' }}>
                {isCorrect ? '✓ 正确！' : '✗ 再想想'}
              </span>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--bg-soft)', border: '1px solid var(--line-soft)', borderRadius: 10, marginBottom: 16 }}>
              <div className="hangul-hero" style={{ fontSize: 32, color: 'var(--ink)' }}>{current.reveal.hangul}</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6 }}>{current.reveal.meaning}</div>
              {current.diff && (
                <div className="serif italic" style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-mute)' }}>{current.diff}</div>
              )}
            </div>
            <button className="btn primary" onClick={handleNext}>
              {currentIdx + 1 < queue.length ? '下一题' : '查看结果'} {Icon.arrow(14)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
