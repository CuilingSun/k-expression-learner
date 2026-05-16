import { NavLink } from "react-router-dom";

function Navigation({ stats }) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div>
          <p className="eyebrow">K-Expression Learner</p>
          <h1 className="brand-title">K-drama 地道表达</h1>
        </div>
        <nav className="nav-links" aria-label="主导航">
          <NavLink to="/" end className="nav-link">
            首页
          </NavLink>
          <NavLink to="/learn" className="nav-link">
            学习
          </NavLink>
          <NavLink to="/expressions" className="nav-link">
            浏览
          </NavLink>
        </nav>
        <div className="stats-pill">
          <span>{stats.totalExpressions} 个表达</span>
          <span>{stats.learningCount} 学习中</span>
          <span>{stats.masteredCount} 已掌握</span>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
