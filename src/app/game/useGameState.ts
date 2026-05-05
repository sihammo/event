import { useState, useEffect } from 'react';

export interface Team {
  id: string;
  name: string;
  score: number;
  eliminated: false | number; // false, or the round number they were eliminated
}

export interface GameState {
  currentRound: number;
  teams: Team[];
  round1: { activeTeamId: string | null };
  round2: { timerEnd: number | null, submissions: Record<string, string> };
  round5: { votesTeamA: number, votesTeamB: number, activeTeamA: string | null, activeTeamB: string | null };
}

const defaultState: GameState = {
  currentRound: 1,
  teams: [
    { id: 't1', name: 'الفريق الأول', score: 0, eliminated: false },
    { id: 't2', name: 'الفريق الثاني', score: 0, eliminated: false },
    { id: 't3', name: 'الفريق الثالث', score: 0, eliminated: false },
    { id: 't4', name: 'الفريق الرابع', score: 0, eliminated: false },
    { id: 't5', name: 'الفريق الخامس', score: 0, eliminated: false },
  ],
  round1: { activeTeamId: null },
  round2: { timerEnd: null, submissions: {} },
  round5: { votesTeamA: 0, votesTeamB: 0, activeTeamA: null, activeTeamB: null }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('eventGameState');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eventGameState' && e.newValue) {
        setGameState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateGameState = (updater: (draft: GameState) => GameState) => {
    const newState = updater(gameState);
    setGameState(newState);
    localStorage.setItem('eventGameState', JSON.stringify(newState));
  };

  const updateScore = (teamId: string, delta: number) => {
    updateGameState(state => ({
      ...state,
      teams: state.teams.map(t => t.id === teamId ? { ...t, score: t.score + delta } : t)
    }));
  };

  const setRound = (round: number) => {
    updateGameState(state => ({ ...state, currentRound: round }));
  };

  const toggleEliminate = (teamId: string, roundNum: number) => {
    updateGameState(state => ({
      ...state,
      teams: state.teams.map(t => 
        t.id === teamId ? { ...t, eliminated: t.eliminated ? false : roundNum } : t
      )
    }));
  };

  const loadTeamsFromRegistrations = () => {
    const regsStr = localStorage.getItem('registrations');
    if (!regsStr) return;
    
    try {
      const regs = JSON.parse(regsStr);
      const competitors = regs.filter((r: any) => r.type === 'solo' || r.type === 'team');
      
      const newTeams: Team[] = competitors.map((r: any, index: number) => {
        let name = '';
        if (r.type === 'solo') {
          name = `${r.data.firstName} ${r.data.lastName}`;
        } else if (r.type === 'team') {
          // If it's a team, we can name it after the first member or just call it 'فريق + First Member'
          name = `فريق ${r.data.members[0].firstName} ${r.data.members[0].lastName}`;
        }
        
        return {
          id: `t_${Date.now()}_${index}`,
          name: name,
          score: 0,
          eliminated: false
        };
      });

      if (newTeams.length > 0) {
        updateGameState(state => ({ ...state, teams: newTeams }));
        return newTeams.length;
      }
      return 0;
    } catch (e) {
      console.error("Failed to parse registrations", e);
      return 0;
    }
  };

  return { gameState, updateGameState, updateScore, setRound, toggleEliminate, loadTeamsFromRegistrations };
}
