import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Season = 'city' | 'beach';

interface SeasonContextType {
  season: Season;
  setSeason: (s: Season) => void;
  toggleSeason: () => void;
  isBeach: boolean;
  isCity: boolean;
}

const SeasonContext = createContext<SeasonContextType | null>(null);

function getDefaultSeason(): Season {
  const stored = localStorage.getItem('capanna-season');
  if (stored === 'beach' || stored === 'city') return stored;
  const month = new Date().getMonth(); // 0-indexed
  // May(4) – September(8) => beach, October(9)–April(3) => city
  return month >= 4 && month <= 8 ? 'beach' : 'city';
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeasonState] = useState<Season>(getDefaultSeason);

  useEffect(() => {
    localStorage.setItem('capanna-season', season);
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  const setSeason = (s: Season) => setSeasonState(s);
  const toggleSeason = () => setSeasonState(prev => prev === 'city' ? 'beach' : 'city');

  return (
    <SeasonContext.Provider value={{
      season,
      setSeason,
      toggleSeason,
      isBeach: season === 'beach',
      isCity: season === 'city',
    }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be used inside SeasonProvider');
  return ctx;
}
