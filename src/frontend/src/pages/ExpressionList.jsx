import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getExpressions } from "../api/expressionsApi";

const FILTERS = [
  { label: "全部", value: null },
  { label: "未开始", value: "not_started" },
  { label: "学习中", value: "learning" },
  { label: "已掌握", value: "mastered" },
];

const STATUS_LABELS = {
  not_started: "未开始",
  learning: "学习中",
  mastered: "已掌握",
};

function ExpressionList({ onStatsChange }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const [toneFilter, setToneFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExpressions = async (status) => {
    try {
      setLoading(true);
      setError("");
      const response = await getExpressions(1, 100, status);
      setItems(response.items);
      setTotal(response.pagination.total);
      onStatsChange(response.stats);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpressions(activeFilter);
    setToneFilter("");
  }, [activeFilter]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    items.forEach((item) => {
      if (item.tone) {
        item.tone.split(",").forEach((t) => {
          const tag = t.trim();
          if (tag) tagSet.add(tag);
        });
      }
    });
    return [...tagSet].sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!toneFilter) return items;
    return items.filter((item) => {
      const itemTags = (item.tone || "").split(",").map((t) => t.trim());
      return itemTags.includes(toneFilter);
    });
  }, [items, toneFilter]);

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <section className="list-layout">
      <div className="section-heading">
        <div>
          <p className="eyebrow">表达库</p>
          <h2>浏览所有表达</h2>
        </div>
        <p className="section-copy">
          {filteredItems.length} 个表达
          {toneFilter && <span className="filter-hint">（已筛选）</span>}
        </p>
      </div>

      <div className="filter-row">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={String(f.value)}
              type="button"
              className={`filter-tab ${activeFilter === f.value ? "filter-tab-active" : ""}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!loading && allTags.length > 0 && (
          <div className="tone-select-wrap">
            <select
              className="tone-select"
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value)}
            >
              <option value="">按语气筛选</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {toneFilter && (
              <button
                type="button"
                className="tone-select-clear"
                onClick={() => setToneFilter("")}
                aria-label="清除语气筛选"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="card-panel">加载中...</div>
      ) : (
        <div className="table-card">
          <div className="table-head table-row">
            <span>韩文</span>
            <span>中文</span>
            <span>难度</span>
            <span>状态</span>
          </div>
          {filteredItems.length === 0 ? (
            <p className="empty-message">该分类下暂无表达</p>
          ) : (
            filteredItems.map((item) => (
              <Link key={item.id} className="table-row table-link" to={`/learn/${item.id}`}>
                <span className="table-korean">{item.korean}</span>
                <span>{item.chinese}</span>
                <span>{item.level}</span>
                <span>
                  <span className={`status-badge status-${item.status}`}>
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default ExpressionList;
