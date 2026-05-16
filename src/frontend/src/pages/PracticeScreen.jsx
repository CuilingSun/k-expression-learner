import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExpressionById, getNextExpression, getRewriteFeedback } from '../api/expressionsApi';
import { adaptExpression } from '../utils/expressionAdapter';
import { ToneRow, Icon } from '../components/UIComponents';
import { useStats } from '../context/StatsContext';

function AiLoadingDots() {
  return (
    <div className="ai-loading">
      <div className="ai-loading-dots"><span /><span /><span /></div>
      <p className="ai-loading-text">AI 分析中，通常需要 10–30 秒…</p>
    </div>
  );
}

function FeedbackBlock({ title, titleEn, items, variant }) {
  if (!items || items.length === 0) return null;
  const bullet = variant === 'good' ? '✓' : '→';
  const bulletColor = variant === 'good' ? 'oklch(0.55 0.14 145)' : 'var(--accent)';
  return (
    <div className="feedback-block">
      <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 12 }}>
        {title} · {titleEn}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', textWrap: 'pretty' }}>
            <span style={{ color: bulletColor, fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 13, paddingTop: 2, width: 14 }}>{bullet}</span>
            <span style={{ flex: 1 }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PracticeScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refreshStats } = useStats();
  const feedbackRef = useRef(null);

  const [expression, setExpression] = useState(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [userSentence, setUserSentence] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackError, setFeedbackError] = useState('');
  const [revealRef, setRevealRef] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = id
          ? await getExpressionById(id)
          : await getNextExpression();
        setExpression(adaptExpression(response.item));
        setTaskIndex(0);
        setUserSentence('');
        setFeedback(null);
        setRevealRef(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const tasks = expression?.rewrite_tasks || [];
  const currentTask = tasks[taskIndex] || null;

  const handleSubmit = async () => {
    if (!userSentence.trim() || !expression) return;
    try {
      setSubmitting(true);
      setFeedbackError('');
      setFeedback(null);
      const response = await getRewriteFeedback(expression.id, userSentence);
      setFeedback(response.feedback);
      setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    } catch (err) {
      setFeedbackError(err.message || 'AI 服务暂时不可用。请确认 Ollama 已启动。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextTask = () => {
    if (tasks.length > 1) {
      setTaskIndex(i => (i + 1) % tasks.length);
    } else {
      navigate('/practice');
    }
    setUserSentence('');
    setFeedback(null);
    setFeedbackError('');
    setRevealRef(false);
  };

  const handleLoadNext = async () => {
    try {
      const response = await getNextExpression();
      if (response.item) navigate(`/practice/${response.item.id}`);
    } catch {
      navigate('/practice');
    }
  };

  if (loading) {
    return (
      <div className="practice-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  if (!expression) {
    return (
      <div className="practice-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>没有找到练习内容。</div>
      </div>
    );
  }

  return (
    <div className="practice-page fade-in">
      <div className="detail-topbar">
        <button className="btn ghost" onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
          {Icon.back(16)} 返回
        </button>
        <button className="btn outline" onClick={handleLoadNext}>
          {Icon.shuffle(15)} 换一个词
        </button>
      </div>

      <div className="page-eyebrow">
        <span>改写挑战 · rewrite challenge</span>
        {tasks.length > 1 && (
          <span className="ko-glyph">{taskIndex + 1} / {tasks.length}</span>
        )}
      </div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        把这句<span className="italic">教科书韩语</span>，<br />
        改成 K-drama 里的口语。
      </h1>

      <div className="practice-grid">
        <div className="practice-main">
          <section>
            <div className="section-h">
              <div>
                <span className="label">场景</span>
                <span className="ko-label">상황</span>
              </div>
            </div>
            <div className="serif italic" style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink)', textWrap: 'pretty' }}>
              {expression.scene || `练习用上「${expression.hangul}」，让句子更口语自然。`}
            </div>
          </section>

          {currentTask && (
            <section>
              <div className="section-h">
                <div>
                  <span className="label">书面原句</span>
                  <span className="ko-label">교과서식</span>
                </div>
              </div>
              <div className="formal-card">
                <div className="formal-strike">{currentTask.formal_sentence}</div>
              </div>
              <div className="hint-card">
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  建议用
                </span>
                <span className="hangul-hero" style={{ fontSize: 24, color: 'var(--ink)' }}>
                  {expression.hangul}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                  {expression.meaning.split(/[/／]/)[0]}
                </span>
              </div>
            </section>
          )}

          {!currentTask && (
            <section>
              <div className="hint-card">
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  建议用
                </span>
                <span className="hangul-hero" style={{ fontSize: 24, color: 'var(--ink)' }}>{expression.hangul}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{expression.meaning}</span>
              </div>
            </section>
          )}

          <section>
            <div className="section-h">
              <div>
                <span className="label">你的口语版</span>
                <span className="ko-label">너의 표현</span>
              </div>
            </div>
            <textarea
              value={userSentence}
              onChange={e => setUserSentence(e.target.value)}
              disabled={!!feedback}
              placeholder={`用你的话改写… 例如 ${expression.hangul} 말이야…`}
              className="draft-input"
            />
          </section>

          {!feedback && (
            <button
              className="btn primary"
              style={{ alignSelf: 'flex-start', minWidth: 220 }}
              disabled={!userSentence.trim() || submitting}
              onClick={handleSubmit}
            >
              {Icon.sparkle()} 让 AI 看看
            </button>
          )}

          {submitting && <AiLoadingDots />}

          {feedbackError && (
            <div className="alert alert-error">{feedbackError}</div>
          )}

          {feedback && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} ref={feedbackRef}>
              <div className="score-card">
                <div className="score-num">{feedback.score ?? '–'}</div>
                <div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'oklch(0.78 0.012 70)' }}>
                    AI 评分 · /5
                  </div>
                  {feedback.naturalVersion && (
                    <div className="serif" style={{ marginTop: 6, fontSize: 16, lineHeight: 1.4, color: 'var(--bg)' }}>
                      更自然的说法：{feedback.naturalVersion}
                    </div>
                  )}
                </div>
              </div>

              {feedback.comment && (
                <div style={{ padding: '16px 20px', background: 'var(--bg-soft)', border: '1px solid var(--line-soft)', borderRadius: 10 }}>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
                    点评 · comment
                  </div>
                  <div className="serif" style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', textWrap: 'pretty' }}>
                    {feedback.comment}
                  </div>
                </div>
              )}

              {feedback.tip && (
                <FeedbackBlock title="小贴士" titleEn="tip" items={[feedback.tip]} variant="good" />
              )}

              {tasks.length > 0 && (
                <>
                  {!revealRef ? (
                    <button className="btn outline" onClick={() => setRevealRef(true)}>
                      {Icon.sparkle()} 看参考答案
                    </button>
                  ) : (
                    <div className="versions-block">
                      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>
                        参考答案
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {tasks.map((task, i) => task.natural_answer && (
                          <div key={i} className="version-card">
                            <div className="version-label mono">
                              {String.fromCharCode(65 + i)} · 版本{i + 1}
                            </div>
                            <div className="ko-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.35, color: 'var(--ink)' }}>
                              {task.natural_answer}
                            </div>
                            {task.prompt && (
                              <div className="serif italic" style={{ marginTop: 10, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)', textWrap: 'pretty', paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
                                {task.prompt}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn primary" style={{ flex: 1 }} onClick={handleNextTask}>
                  {tasks.length > 1 ? '下一题' : '下一个词'} {Icon.arrow(14)}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="practice-aside">
          <div className="aside-section">
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 14 }}>
              改写小贴士
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
              <li>· 把"~ㅂ니다"换成"~어/~아"。</li>
              <li>· 删掉副词堆叠："정말로 매우" → "진짜"。</li>
              <li>· 加一个语气词："~네"、"~잖아"、"~지"。</li>
              <li>· 用短句承接情绪，而不是完整逻辑句。</li>
            </ul>
          </div>

          <div className="aside-section action-block">
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
              正在练习
            </div>
            <div className="hangul-hero" style={{ fontSize: 40 }}>{expression.hangul}</div>
            <div style={{ marginTop: 10 }}>
              <ToneRow ids={expression.tones} />
            </div>
            {expression.scene && (
              <div className="serif italic" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)', textWrap: 'pretty' }}>
                {expression.scene}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
