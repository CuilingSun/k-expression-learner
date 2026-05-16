import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExpressionById } from '../api/expressionsApi';
import { adaptExpression } from '../utils/expressionAdapter';
import { ToneRow, DirectorNote, Icon } from '../components/UIComponents';

function CompareCol({ expr, pinned, onClick }) {
  return (
    <button onClick={onClick} className={`compare-col hover-card ${pinned ? 'pinned' : ''}`}>
      {pinned && <span className="compare-col-pin">主词 · pinned</span>}
      <div className="hangul-hero" style={{ fontSize: 64 }}>{expr.hangul}</div>
      <div style={{ marginTop: 18 }}>
        <ToneRow ids={expr.tones} />
      </div>
      <div className="serif italic" style={{ marginTop: 18, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-soft)', textWrap: 'pretty' }}>
        {expr.meaning}
      </div>
      {expr.scene && (
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line-soft)', fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)', textWrap: 'pretty', fontFamily: 'var(--font-serif)' }}>
          {expr.scene}
        </div>
      )}
    </button>
  );
}

function ExampleCompare({ side, expr, ex }) {
  if (!ex || !ex.ko) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, paddingBottom: 22, borderBottom: '1px dashed var(--line-soft)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--accent)' }}>{side}</span>
        <span className="ko-serif" style={{ fontSize: 13, color: 'var(--ink)', writingMode: 'vertical-rl' }}>{expr.hangul}</span>
        <div style={{ width: 1, flex: 1, background: 'var(--line)' }} />
      </div>
      <div>
        <div className="ko-serif" style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}>{ex.ko}</div>
        {ex.zh && <div style={{ marginTop: 4, fontSize: 13, color: 'var(--ink-mute)' }}>{ex.zh}</div>}
        <DirectorNote>{ex.note}</DirectorNote>
      </div>
    </div>
  );
}

export default function CompareScreen() {
  const navigate = useNavigate();
  const { id1, id2 } = useParams();
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [r1, r2] = await Promise.all([
          getExpressionById(id1),
          getExpressionById(id2),
        ]);
        setLeft(adaptExpression(r1.item));
        setRight(adaptExpression(r2.item));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id1, id2]);

  if (loading) {
    return (
      <div className="compare-page">
        <div style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '60px 0' }}>加载中…</div>
      </div>
    );
  }

  if (error || !left || !right) {
    return (
      <div className="compare-page">
        <div className="alert alert-error">{error || '找不到表达。'}</div>
        <button className="btn ghost" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
          {Icon.back(16)} 返回
        </button>
      </div>
    );
  }

  const diffText = left.diff[right.hangul] || right.diff[left.hangul] ||
    `${left.hangul} 和 ${right.hangul} 在场景与语气上各有侧重，详见下方对比。`;

  return (
    <div className="compare-page fade-in">
      <div className="detail-topbar">
        <button className="btn ghost" onClick={() => navigate(-1)} style={{ paddingLeft: 0 }}>
          {Icon.back(16)} 返回
        </button>
      </div>

      <div className="page-eyebrow">
        <span>对比 · compare</span>
        <span className="ko-glyph">비슷한 듯 다른</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        <span className="ko-serif">{left.hangul}</span>{' '}
        <span className="italic" style={{ color: 'var(--ink-mute)' }}>vs.</span>{' '}
        <span className="ko-serif">{right.hangul}</span>
      </h1>

      <div className="compare-grid">
        <CompareCol expr={left} pinned onClick={() => navigate(`/learn/${left.id}`)} />
        <div className="compare-bridge">
          <div className="compare-bridge-line" />
          <div className="compare-bridge-vs">차이 · diff</div>
          <div className="compare-bridge-line" />
        </div>
        <CompareCol expr={right} onClick={() => navigate(`/learn/${right.id}`)} />
      </div>

      <div className="diff-banner">
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
          区别 · 차이
        </div>
        <div className="serif" style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--ink)', textWrap: 'pretty', letterSpacing: '-0.005em' }}>
          {diffText}
        </div>
      </div>

      {(left.examples[0] || right.examples[0]) && (
        <section style={{ marginBottom: 36 }}>
          <div className="section-h">
            <div>
              <span className="label">例句对照</span>
              <span className="ko-label">예문 비교</span>
            </div>
          </div>
          <div className="examples-compare">
            {left.examples[0] && <ExampleCompare side="A" expr={left} ex={left.examples[0]} />}
            {right.examples[0] && <ExampleCompare side="B" expr={right} ex={right.examples[0]} />}
            {left.examples[1] && right.examples[1] && (
              <>
                <ExampleCompare side="A" expr={left} ex={left.examples[1]} />
                <ExampleCompare side="B" expr={right} ex={right.examples[1]} />
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
