import { NavLink, Outlet } from 'react-router-dom';
import { useStats } from '../context/StatsContext';

const NAV_ITEMS = [
  { to: '/',         label: '今日', ko: '오늘',      hint: 'Today',   end: true },
  { to: '/path',     label: '路径', ko: '여정',      hint: 'Path' },
  { to: '/library',  label: '词库', ko: '단어',      hint: 'Library' },
  { to: '/practice', label: '练习', ko: '연습',      hint: 'Practice' },
  { to: '/profile',  label: '我的', ko: '나의 학습', hint: 'Mine' },
];

export default function WebShell() {
  const { stats, statsLoading } = useStats();
  const { masteredCount = 0, learningCount = 0, totalExpressions = 0 } = stats || {};
  const pct = totalExpressions > 0 ? Math.round((masteredCount / totalExpressions) * 100) : 0;
  const unstartedCount = Math.max(0, totalExpressions - masteredCount - learningCount);

  return (
    <div className="webshell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-row">
            <span className="brand-mark">K</span>
            <span className="brand-name">
              <span className="serif italic">drama</span>
              <span className="ko-serif">말투</span>
            </span>
          </div>
          <div className="brand-tag mono">地道表达 · 학습</div>
        </div>

        <nav className="sidenav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidenav-item${isActive ? ' active' : ''}`}
            >
              <span className="sidenav-glyph ko-serif">{item.ko}</span>
              <span className="sidenav-label">{item.label}</span>
              <span className="sidenav-hint mono">{item.hint}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-progress">
          <div className="mono" style={{
            fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}>
            진도 · progress
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            {statsLoading ? (
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                loading...
              </span>
            ) : (
              <>
                <span className="serif" style={{ fontSize: 26, color: 'var(--ink)' }}>
                  {masteredCount}
                </span>
                <span className="serif italic" style={{ fontSize: 14, color: 'var(--ink-mute)' }}>
                  / {totalExpressions}
                </span>
                <span style={{ flex: 1 }} />
                <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                  {pct}%
                </span>
              </>
            )}
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{
            marginTop: 12, display: 'flex', justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-mute)',
            letterSpacing: '0.06em',
          }}>
            {statsLoading ? (
              <span>正在同步统计</span>
            ) : (
              <>
                <span>学习中 {learningCount}</span>
                <span>未学 {unstartedCount}</span>
              </>
            )}
          </div>
        </div>

        <div className="sidebar-foot">
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-mute)' }}>
            v 0.1 · 试用版
          </div>
        </div>
      </aside>

      <main className="webmain">
        <Outlet />
      </main>
    </div>
  );
}
