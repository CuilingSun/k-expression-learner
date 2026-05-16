import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getExpressionById,
  getExpressionByKorean,
  getNextExpression,
  getRandomExpression,
  updateExpressionStatus,
  saveExpressionNote,
} from '../api/expressionsApi';
import { adaptExpression, masteryToStatus } from '../utils/expressionAdapter';
import { ToneRow, MasteryDot, DirectorNote, Icon, MASTERY_LABEL } from '../components/UIComponents';
import { useStats } from '../context/StatsContext';
import { TONES } from '../constants/toneMeta';

const STATUS_LABELS = { not_started: '未开始', learning: '学习中', mastered: '已掌握' };

export default function DetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refreshStats } = useStats();

  const [expression, setExpression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const loadExpression = async (expressionId) => {
    try {
      setLoading(true);
      setError('');
      const response = expressionId
        ? await getExpressionById(expressionId)
        : await getNextExpression();
      const adapted = adaptExpression(response.item);
      setExpression(adapted);
      setNote(response.item?.notes || '');
      setNoteSaved(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadExpression(id); }, [id]);

  const handleStatusChange = async (mastery) => {
    if (!expression) return;
    try {
      setSaving(true);
      const status = masteryToStatus(mastery);
      const response = await updateExpressionStatus(expression.id, status);
      setExpression(adaptExpression(response.item));
      refreshStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!expression) return;
    try {
      setSaving(true);
      const response = await saveExpressionNote(expression.id, note);
      setExpression(adaptExpression(response.item));
      setNoteSaved(true);
      refreshStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNavigateToRelated = async (korean) => {
    try {
      const response = await getExpressionByKorean(korean);
      if (response.item) navigate(`/learn/${response.item.id}`);
    } catch {
      // silent fail
    }
  };

  const handleCompare = async (korean) => {
    try {
      const response = await getExpressionByKorean(korean);
      if (response.item) navigate(`/compare/${expression.id}/${response.item.id}`);
    } catch {
      // silent fail
    }
  };

  const handleNext = async () => {
    try {
      setSaving(true);
      const response = await getNextExpression();
      const target = response.item || (await getRandomExpression()).item;
      navigate(`/learn/${target.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!expression) {
    return (
      <div className="detail-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>没有找到表达。</div>
      </div>
    );
  }

  return (
    <div className="detail-page fade-in">
      <div className="detail-topbar">
        <button className="btn ghost" onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
          {Icon.back(16)} 返回
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn outline" onClick={handleNext} disabled={saving} style={{ fontSize: 12 }}>
            下一个 {Icon.arrow(13)}
          </button>
        </div>
      </div>

      <header className="detail-hero">
        <div className="detail-hero-left">
          <div className="page-eyebrow">
            <span>표현 · expression</span>
            {expression.tones.length > 0 && (
              <span className="ko-glyph">
                {expression.tones.map(t => TONES[t]?.ko || t).join(' · ')}
              </span>
            )}
          </div>
          <div className="hangul-hero detail-hangul">{expression.hangul}</div>
          {expression.kdrama && (
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.04em', marginTop: 10 }}>
              {expression.kdrama}
            </div>
          )}
        </div>
        <div className="detail-hero-right">
          <div className="serif" style={{ fontSize: 32, lineHeight: 1.25, color: 'var(--ink)', letterSpacing: '-0.01em', textWrap: 'pretty' }}>
            {expression.meaning}
          </div>
          <div style={{ marginTop: 20 }}>
            <ToneRow ids={expression.tones} />
          </div>
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <MasteryDot state={expression.mastery} />
            <span style={{ color: 'var(--line)' }}>·</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.12em' }}>
              {expression.examples.length} 句例句
            </span>
            {expression.related.length > 0 && (
              <>
                <span style={{ color: 'var(--line)' }}>·</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.12em' }}>
                  {expression.related.length} 个相似
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          {expression.scene && (
            <section style={{ marginBottom: 36 }}>
              <div className="section-h">
                <div>
                  <span className="label">何时会出现</span>
                  <span className="ko-label">상황</span>
                </div>
              </div>
              <div className="scene-card">
                <span className="mono scene-tag">scene</span>
                <div className="serif italic" style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)', textWrap: 'pretty', flex: 1 }}>
                  {expression.scene}
                </div>
              </div>
            </section>
          )}

          {expression.examples.length > 0 && (
            <section>
              <div className="section-h">
                <div>
                  <span className="label">例句 与 语气注释</span>
                  <span className="ko-label">예문 · 어감</span>
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {expression.examples.length} 句
                </span>
              </div>
              <div className="examples">
                {expression.examples.map((ex, idx) => (
                  <div key={idx} className="example-row">
                    <div className="example-num mono">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="example-body">
                      {ex.ko && (
                        <div className="ko" style={{ fontFamily: 'var(--font-serif-ko)', fontSize: 24, lineHeight: 1.4, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                          {ex.ko}
                        </div>
                      )}
                      {ex.zh && (
                        <div style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-mute)' }}>{ex.zh}</div>
                      )}
                      <DirectorNote label="导演注">{ex.note}</DirectorNote>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="detail-aside">
          {expression.related.length > 0 && (
            <div className="aside-section">
              <div className="section-h">
                <div>
                  <span className="label">容易混淆</span>
                  <span className="ko-label">비슷한 표현</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {expression.related.map(hangul => {
                  const diff = expression.diff[hangul];
                  return (
                    <button
                      key={hangul}
                      className="related-card hover-card"
                      onClick={() => handleCompare(hangul)}
                    >
                      <div className="related-card-head">
                        <span className="hangul-hero" style={{ fontSize: 28 }}>{hangul}</span>
                        <span style={{ color: 'var(--ink-mute)' }}>{Icon.arrow(14)}</span>
                      </div>
                      {diff && (
                        <div className="serif" style={{ marginTop: 10, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)', textWrap: 'pretty' }}>
                          {diff}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="aside-section action-block">
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 12 }}>
              掌握程度
            </div>
            <div className="mastery-toggle">
              {['new', 'learning', 'mastered'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={saving}
                  className={`mastery-pill ${expression.mastery === s ? 'active' : ''}`}
                >
                  {MASTERY_LABEL[s]}
                </button>
              ))}
            </div>
            <button
              className="btn primary"
              style={{ width: '100%', marginTop: 16 }}
              onClick={() => navigate(`/practice/${expression.id}`)}
            >
              {Icon.sparkle()} 用 {expression.hangul} 练一句
            </button>
          </div>

          <div className="aside-section">
            <button
              className="notes-toggle"
              onClick={() => setNoteOpen(v => !v)}
              style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 13, color: 'var(--ink-mute)', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {noteOpen ? '▾' : '▸'} 学习笔记 {note ? '●' : ''}
            </button>
            {noteOpen && (
              <div style={{ marginTop: 12 }}>
                <textarea
                  value={note}
                  onChange={e => { setNote(e.target.value); setNoteSaved(false); }}
                  placeholder="写下记忆点、例句或想法…"
                  style={{
                    width: '100%', minHeight: 80, padding: '10px 12px',
                    fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.6,
                    border: '1px solid var(--line)', borderRadius: 8,
                    background: 'var(--surface)', color: 'var(--ink)', resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn outline" onClick={handleSaveNote} disabled={saving}>
                    保存笔记
                  </button>
                  {noteSaved && (
                    <span className="mono" style={{ fontSize: 10, color: 'oklch(0.55 0.14 145)' }}>已保存 ✓</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
