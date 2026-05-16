import { createContext, useContext, useEffect, useState } from 'react';
import { getExpressions } from '../api/expressionsApi';

export const StatsContext = createContext(null);

export function useStats() {
  return useContext(StatsContext);
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState({
    totalExpressions: 50,
    learningCount: 0,
    masteredCount: 0,
    notStartedCount: 50,
  });

  const refreshStats = async () => {
    try {
      const response = await getExpressions(1, 1);
      if (response.stats) setStats(response.stats);
    } catch {
      // silent fail — sidebar still renders
    }
  };

  useEffect(() => { refreshStats(); }, []);

  return (
    <StatsContext.Provider value={{ stats, refreshStats }}>
      {children}
    </StatsContext.Provider>
  );
}
