import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNextExpression, getRandomExpression } from "../api/expressionsApi";
import { TONE_ZH } from "../constants/toneLabels";

function Home({ stats, appLoading }) {
  const [nextExpression, setNextExpression] = useState(null);
  const [nextLoading, setNextLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await getNextExpression();
        setNextExpression(response.item);
      } catch {
        // Non-critical: today's card just won't show
      } finally {
        setNextLoading(false);
      }
    })();
  }, []);

  const allMastered =
    !nextLoading &&
    !nextExpression &&
    !appLoading &&
    stats.totalExpressions > 0 &&
    stats.masteredCount === stats.totalExpressions;

  return (
    <section className="home-grid">
      {/* Today's recommendation */}
      <div className="today-card">
        <p className="eyebrow">今日推荐</p>
        {nextLoading || appLoading ? (
          <p className="today-loading">加载中...</p>
        ) : allMastered ? (
          <div className="today-complete">
            <p className="today-complete-text">所有表达已掌握！可以随机复习。</p>
            <RandomButton />
          </div>
        ) : nextExpression ? (
          <div className="today-content">
            {nextExpression.scenario_title && (
              <div className="today-scenario">
                <span className="today-scenario-label">场景</span>
                <span className="today-scenario-title">{nextExpression.scenario_title}</span>
              </div>
            )}
            <div className="today-hero">
              <h2 className="today-korean">{nextExpression.korean}</h2>
              <p className="today-chinese">{nextExpression.chinese}</p>
            </div>
            {nextExpression.tone && (
              <div className="today-tags">
                {nextExpression.tone.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span key={tag} className="tone-badge">{TONE_ZH[tag] || tag}</span>
                ))}
              </div>
            )}
            {nextExpression.simple_example?.korean && (
              <div className="today-example">
                <span className="today-example-quote">「{nextExpression.simple_example.korean}」</span>
                <span className="today-example-translation">{nextExpression.simple_example.translation}</span>
              </div>
            )}
            <Link className="button button-primary today-cta" to={`/learn/${nextExpression.id}`}>
              开始学习 →
            </Link>
          </div>
        ) : (
          <p className="today-loading">暂无推荐，去浏览全部表达。</p>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">总表达数</span>
          <strong className="stat-value">
            {appLoading ? "..." : stats.totalExpressions}
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">已掌握</span>
          <strong className="stat-value">
            {appLoading ? "..." : stats.masteredCount}
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">学习中</span>
          <strong className="stat-value">
            {appLoading ? "..." : stats.learningCount}
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">未开始</span>
          <strong className="stat-value">
            {appLoading ? "..." : stats.notStartedCount}
          </strong>
        </article>
      </div>

      <div className="home-actions">
        <Link className="button button-secondary" to="/expressions">
          浏览所有表达
        </Link>
        <Link className="button button-secondary" to="/learn">
          随机一条
        </Link>
      </div>
    </section>
  );
}

function RandomButton() {
  const [loading, setLoading] = useState(false);

  const handleRandom = async () => {
    try {
      setLoading(true);
      const response = await getRandomExpression();
      window.location.href = `/learn/${response.item.id}`;
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="button button-primary"
      onClick={handleRandom}
      disabled={loading}
    >
      {loading ? "加载中..." : "随机复习"}
    </button>
  );
}

export default Home;
