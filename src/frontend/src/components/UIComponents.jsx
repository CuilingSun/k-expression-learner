import { TONES } from '../constants/toneMeta';

export function Tone({ id }) {
  const t = TONES[id];
  if (!t) return <span className="tone" style={{ '--tone-color': 'var(--ink-mute)' }}>{id}</span>;
  const color = `oklch(0.62 0.16 ${t.hue})`;
  return (
    <span className="tone" style={{ '--tone-color': color }}>
      {t.zh}
    </span>
  );
}

export function ToneRow({ ids = [] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <div className="tone-row">
      {ids.map(id => <Tone key={id} id={id} />)}
    </div>
  );
}

export function DirectorNote({ children, label = '语气' }) {
  if (!children) return null;
  return (
    <div className="note">
      <div className="label">{label}</div>
      <div className="text">{children}</div>
    </div>
  );
}

export const MASTERY_LABEL = {
  new: '未开始',
  learning: '学习中',
  mastered: '已掌握',
};

export function MasteryDot({ state = 'new' }) {
  return <span className={`mastery ${state}`}>{MASTERY_LABEL[state] || state}</span>;
}

export const Icon = {
  search: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  back: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6"/>
    </svg>
  ),
  bookmark: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-3.5L6 21z"/>
    </svg>
  ),
  check: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 10 17.5 19.5 7"/>
    </svg>
  ),
  pencil: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l4 4-12 12H4v-4z"/>
    </svg>
  ),
  arrow: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-5-5 5 5-5 5"/>
    </svg>
  ),
  close: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18"/>
    </svg>
  ),
  sparkle: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>
    </svg>
  ),
  shuffle: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m17 4 4 4-4 4M3 8h4l10 8h4m-4 0 4 4-4-4M3 16h4l3-2.5"/>
    </svg>
  ),
};
