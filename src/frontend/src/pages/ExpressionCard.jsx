import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TONE_ZH } from "../constants/toneLabels";
import {
  getExpressionById,
  getExpressionByKorean,
  getNextExpression,
  getRandomExpression,
  getRewriteFeedback,
  saveExpressionNote,
  updateExpressionStatus,
} from "../api/expressionsApi";

const STATUS_LABELS = {
  not_started: "未开始",
  learning: "学习中",
  mastered: "已掌握",
};

const STEPS = [
  { id: 1, label: "理解" },
  { id: 2, label: "对比" },
  { id: 3, label: "练习" },
];

const RELATION_LABELS = {
  contrast: "对比",
  similar_meaning: "近义",
  softer_than: "更柔和",
  stronger_than: "更强烈",
  similar_function: "功能相近",
  more_formal_than: "更正式",
  related_scenario: "相关场景",
  related_tone: "相关语气",
  similar_tone: "相近语气",
  used_together: "常搭配",
};

function StepProgress({ current, maxReached, pulseDot, onStepClick }) {
  return (
    <div className="step-progress">
      {STEPS.flatMap((step, i) => [
        i > 0 ? (
          <div
            key={`line-${step.id}`}
            className={`step-line ${step.id <= current ? "step-line-done" : ""}`}
          />
        ) : null,
        <div key={step.id} className="step-progress-item">
          <button
            type="button"
            className={[
              "step-dot",
              step.id === current ? "step-dot-active" : "",
              step.id < current ? "step-dot-done" : "",
              step.id > maxReached ? "step-dot-locked" : "",
              step.id === pulseDot ? "step-dot-pulse" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => step.id <= maxReached && onStepClick(step.id)}
            disabled={step.id > maxReached}
            aria-label={step.label}
          >
            {step.id < current ? "✓" : step.id}
          </button>
          <span className={`step-label ${step.id === current ? "step-label-active" : ""}`}>
            {step.label}
          </span>
        </div>,
      ].filter(Boolean))}
    </div>
  );
}

function ScoreStars({ score }) {
  return (
    <span className="score-stars" aria-label={`自然度 ${score} 分`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? "star star-filled" : "star"}>★</span>
      ))}
    </span>
  );
}

function AiLoadingDots() {
  return (
    <div className="ai-loading">
      <div className="ai-loading-dots">
        <span /><span /><span />
      </div>
      <p className="ai-loading-text">AI 分析中，通常需要 10–30 秒…</p>
    </div>
  );
}

/* ── Step 1: 理解 ── */
function StepUnderstand({ expression, onNext }) {
  const examples = Array.isArray(expression.usage_examples) ? expression.usage_examples : [];

  return (
    <div className="step-body">
      <div className="step-hero">
        <h2 className="step-korean-hero">{expression.korean}</h2>
        <p className="step-meaning">{expression.chinese}</p>
      </div>

      <div className="step-meta-row">
        {expression.tone && expression.tone.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
          <span key={tag} className="tone-badge">{TONE_ZH[tag] || tag}</span>
        ))}
        <span className="level-tag">{expression.level}</span>
        {expression.context && (
          <span className="context-text">场景：{expression.context}</span>
        )}
      </div>

      {examples.length > 0 && (
        <div className="step-section">
          <p className="step-section-label">例句</p>
          <ul className="step-examples">
            {examples.map((ex, i) => {
              const korean = typeof ex === "string" ? ex : ex.korean;
              const chinese = typeof ex === "object" && ex.chinese ? ex.chinese : null;
              const toneNote = typeof ex === "object" && ex.tone_note ? ex.tone_note : null;
              return (
                <li key={i} className="step-example-card">
                  {toneNote && <span className="example-card-note">{toneNote}</span>}
                  <p className="example-card-korean">{korean}</p>
                  {chinese && <p className="example-card-chinese">{chinese}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="step-footer">
        <button type="button" className="button step-cta" onClick={onNext}>
          我理解了，看对比 →
        </button>
      </div>
    </div>
  );
}

const SPECTRUM_TYPES = new Set(["softer_than", "stronger_than", "more_formal_than"]);
const CONTRAST_TYPES = new Set(["contrast"]);

function RelationCard({ item, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const [meaning, setMeaning] = useState(null);
  const [loadingMeaning, setLoadingMeaning] = useState(false);

  const badgeType = CONTRAST_TYPES.has(item.relation_type)
    ? "contrast"
    : SPECTRUM_TYPES.has(item.relation_type)
    ? "spectrum"
    : "association";

  const handleToggle = async () => {
    if (!expanded && meaning === null) {
      setLoadingMeaning(true);
      try {
        const res = await getExpressionByKorean(item.expression);
        setMeaning(res?.item?.chinese ?? "");
      } catch {
        setMeaning("");
      } finally {
        setLoadingMeaning(false);
      }
    }
    setExpanded((v) => !v);
  };

  return (
    <div className={`relation-card ${expanded ? "relation-card-open" : ""}`}>
      <div
        className="relation-card-header"
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === "Enter" && handleToggle()}
      >
        <span className="relation-card-korean">{item.expression}</span>
        <div className="relation-card-header-right">
          {item.relation_type && (
            <span className={`relation-badge relation-badge-${badgeType}`}>
              {RELATION_LABELS[item.relation_type] || item.relation_type}
            </span>
          )}
          <span className="relation-card-chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="relation-card-body">
          {loadingMeaning ? (
            <p className="relation-card-loading">加载中…</p>
          ) : meaning ? (
            <p className="relation-card-meaning">{meaning}</p>
          ) : null}
          <p className="relation-card-diff">{item.difference}</p>
          <button
            type="button"
            className="relation-card-jump"
            onClick={() => onNavigate(item.expression)}
          >
            学习这个 →
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Step 2: 对比 ── */
function StepCompare({ expression, onNext, onNavigate }) {
  const similar = Array.isArray(expression.similar_expressions)
    ? expression.similar_expressions
    : [];

  return (
    <div className="step-body">
      <div className="step-back-ref">
        <span className="step-back-korean">{expression.korean}</span>
        <span className="step-back-chinese">{expression.chinese}</span>
      </div>

      {similar.length > 0 ? (
        <div className="step-section">
          <p className="step-section-label">点击查看详情</p>
          <div className="relation-cards">
            {similar.map((item) => (
              <RelationCard key={item.expression} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ) : (
        <p className="step-empty">暂无对比表达数据。</p>
      )}

      <div className="step-footer">
        <button type="button" className="button step-cta" onClick={onNext}>
          我记住了，去练习 →
        </button>
      </div>
    </div>
  );
}

/* ── Step 3: 练习 ── */
function StepPractice({
  expression,
  saving,
  onStatusChange,
  note,
  onNoteChange,
  onSaveNote,
  notice,
}) {
  const tasks = Array.isArray(expression.rewrite_tasks) && expression.rewrite_tasks.length > 0
    ? expression.rewrite_tasks
    : expression.rewrite_scenario
      ? [{ formal_sentence: expression.rewrite_scenario, prompt: "", natural_answer: "" }]
      : [];

  const [taskIndex, setTaskIndex] = useState(0);
  const [userSentence, setUserSentence] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const feedbackRef = useRef(null);

  const currentTask = tasks[taskIndex] || null;

  const handleNextTask = () => {
    setTaskIndex((i) => (i + 1) % tasks.length);
    setUserSentence("");
    setFeedback(null);
    setFeedbackError("");
    setShowAnswer(false);
  };

  const handleSubmit = async () => {
    if (!userSentence.trim()) return;
    try {
      setFeedbackLoading(true);
      setFeedbackError("");
      setFeedback(null);
      const response = await getRewriteFeedback(expression.id, userSentence);
      setFeedback(response.feedback);
      setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    } catch (err) {
      setFeedbackError(err.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="step-body">
      <div className="step-back-ref">
        <span className="step-back-korean">{expression.korean}</span>
        <span className="step-back-chinese">{expression.chinese}</span>
      </div>

      {currentTask ? (
        <div className="step-section">
          <p className="step-section-label">
            练习任务
            {tasks.length > 1 && (
              <span className="task-counter"> {taskIndex + 1}/{tasks.length}</span>
            )}
          </p>
          <p className="practice-instruction">
            {currentTask.prompt
              ? currentTask.prompt
              : `把下面这句话改写得更自然，试着用上「${expression.korean}」：`}
          </p>
          <div className="practice-scenario">
            <p className="practice-source">{currentTask.formal_sentence}</p>
            <p className="practice-hint">（将这句书面语改写得更口语自然）</p>
          </div>

          <textarea
            className="practice-input"
            value={userSentence}
            onChange={(e) => setUserSentence(e.target.value)}
            placeholder="在这里写下你的韩文句子..."
            rows={3}
          />

          <div className="practice-actions">
            <button
              type="button"
              className="button button-primary practice-submit"
              onClick={handleSubmit}
              disabled={feedbackLoading || !userSentence.trim()}
            >
              {feedbackLoading ? "提交中…" : "提交练习"}
            </button>

            {currentTask.natural_answer && (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowAnswer((v) => !v)}
              >
                {showAnswer ? "隐藏答案" : "看参考答案"}
              </button>
            )}
          </div>

          {showAnswer && currentTask.natural_answer && (
            <div className="answer-reveal">
              <span className="meta-label">参考答案</span>
              <p className="answer-text">{currentTask.natural_answer}</p>
            </div>
          )}

          {feedbackLoading && <AiLoadingDots />}

          {feedbackError && (
            <div className="alert alert-error" style={{ marginTop: "12px" }}>
              {feedbackError}
            </div>
          )}

          {feedback && (
            <div className="feedback-slide-in" ref={feedbackRef}>
              <div className="feedback-panel">
                <div className="feedback-header">
                  <span className="step-section-label" style={{ margin: 0 }}>AI 反馈</span>
                  <ScoreStars score={feedback.score} />
                </div>
                <div className="feedback-natural">
                  <span className="meta-label">更自然的写法</span>
                  <p className="feedback-korean">{feedback.naturalVersion}</p>
                </div>
                {feedback.comment && (
                  <div className="feedback-section">
                    <span className="meta-label">点评</span>
                    <p>{feedback.comment}</p>
                  </div>
                )}
                {feedback.tip && (
                  <div className="feedback-section feedback-tip">
                    <span className="meta-label">小贴士</span>
                    <p>{feedback.tip}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tasks.length > 1 && (
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                type="button"
                className="button button-secondary"
                onClick={handleNextTask}
              >
                下一道练习 →
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="step-empty">此表达暂无练习任务。</p>
      )}

      {/* 笔记（可折叠） */}
      <div className="notes-collapse">
        <button
          type="button"
          className="notes-toggle"
          onClick={() => setNotesOpen((v) => !v)}
        >
          {notesOpen ? "▾" : "▸"} 学习笔记 {note ? "●" : ""}
        </button>
        {notesOpen && (
          <div className="notes-body">
            <textarea
              id="note-input"
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="写下你的例句、记忆点或理解..."
            />
            <div className="notes-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={onSaveNote}
                disabled={saving}
              >
                保存笔记
              </button>
              {notice && <span className="notice-text">{notice}</span>}
            </div>
          </div>
        )}
      </div>

      {/* 状态操作 */}
      <div className="step-status-row">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => onStatusChange("learning")}
          disabled={saving || expression.status === "learning"}
        >
          标记为学习中
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => onStatusChange("mastered")}
          disabled={saving || expression.status === "mastered"}
        >
          标记为已掌握 ✓
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ── */
function ExpressionCard({ onStatsChange }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expression, setExpression] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [pulseDot, setPulseDot] = useState(null);
  const [totalExpressions, setTotalExpressions] = useState(null);

  const advanceStep = (next) => {
    setPulseDot(step);
    setTimeout(() => setPulseDot(null), 500);
    setStep(next);
    setMaxReached((prev) => Math.max(prev, next));
  };

  const loadExpression = async (expressionId) => {
    try {
      setLoading(true);
      setError("");
      setNotice("");
      setStep(1);
      setMaxReached(1);

      const response = expressionId
        ? await getExpressionById(expressionId)
        : await getNextExpression();

      const item = response.item;
      setExpression(item);
      setNote(item?.notes || "");
      onStatsChange(response.stats);
      setTotalExpressions(response.stats?.totalExpressions ?? null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpression(id);
  }, [id]);

  const handleNext = async () => {
    try {
      setSaving(true);
      const response = await getNextExpression();
      const target = response.item || (await getRandomExpression()).item;
      onStatsChange(response.stats);
      navigate(`/learn/${target.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrev = () => {
    if (expression?.id > 1) {
      navigate(`/learn/${expression.id - 1}`);
    }
  };

  const handleNavigateByKorean = async (korean) => {
    try {
      const response = await getExpressionByKorean(korean);
      if (response.item) navigate(`/learn/${response.item.id}`);
    } catch {
      // target not in dataset — silent fail
    }
  };

  const handleStatusChange = async (status) => {
    if (!expression) return;
    try {
      setSaving(true);
      setNotice("");
      const response = await updateExpressionStatus(expression.id, status);
      setExpression(response.item);
      onStatsChange(response.stats);
      setNotice(`已标记为「${STATUS_LABELS[status]}」`);
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
      setNotice("");
      const response = await saveExpressionNote(expression.id, note);
      setExpression(response.item);
      onStatsChange(response.stats);
      setNotice("笔记已保存。");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card-layout">
        <div className="card-panel step-loading">加载中…</div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!expression) {
    return (
      <div className="card-panel">
        <p>没有找到表达。</p>
        <Link className="button button-primary" to="/expressions">浏览全部</Link>
      </div>
    );
  }

  const similarCount = Array.isArray(expression.similar_expressions)
    ? expression.similar_expressions.length
    : 0;
  const hasCompare = similarCount > 0;
  const effectiveMaxReached = hasCompare ? maxReached : Math.max(maxReached, step === 2 ? 3 : step);

  return (
    <section className="card-layout step-layout">
      <StepProgress
        current={step}
        maxReached={effectiveMaxReached}
        pulseDot={pulseDot}
        onStepClick={(s) => {
          setStep(s);
          setMaxReached((prev) => Math.max(prev, s));
        }}
      />

      <article className="expression-card step-card">
        <div className="step-topbar">
          <span className={`status-badge status-${expression.status}`}>
            {STATUS_LABELS[expression.status]}
          </span>
          <span className="step-kdrama">{expression.kdrama}</span>
        </div>

        {step === 1 && (
          <StepUnderstand
            expression={expression}
            onNext={() => advanceStep(hasCompare ? 2 : 3)}
          />
        )}
        {step === 2 && (
          <StepCompare
            expression={expression}
            onNext={() => advanceStep(3)}
            onNavigate={handleNavigateByKorean}
          />
        )}
        {step === 3 && (
          <StepPractice
            expression={expression}
            saving={saving}
            onStatusChange={handleStatusChange}
            note={note}
            onNoteChange={setNote}
            onSaveNote={handleSaveNote}
            notice={notice}
          />
        )}
      </article>

      {/* 固定底栏 */}
      <div className="sticky-nav">
        <div className="sticky-nav-inner">
          <button
            type="button"
            className="button button-secondary sticky-nav-btn"
            onClick={handlePrev}
            disabled={saving || !expression || expression.id <= 1}
          >
            ← 上一条
          </button>
          <span className="progress-counter">
            {expression.id} / {totalExpressions ?? "—"}
          </span>
          <button
            type="button"
            className="button button-primary sticky-nav-btn"
            onClick={handleNext}
            disabled={saving}
          >
            下一条 →
          </button>
        </div>
      </div>
    </section>
  );
}

export default ExpressionCard;
