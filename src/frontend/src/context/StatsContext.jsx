import { createContext, useContext, useEffect, useState } from 'react';
import { getExpressions } from '../api/expressionsApi';

export const StatsContext = createContext(null);

export function useStats() {
  return useContext(StatsContext);
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const refreshStats = async () => {
    setStatsLoading(true);
    try {
      const response = await getExpressions(1, 1);
      if (response.stats) setStats(response.stats);
    } catch {
      // silent fail — sidebar still renders
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { refreshStats(); }, []);

  return (
    <StatsContext.Provider value={{ stats, statsLoading, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}
