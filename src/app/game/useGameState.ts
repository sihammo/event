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
  round5: { activeTeamIds: string[], votes: Record<string, number>, productRevealed: boolean };
  round6: { type: 'images' | 'cups' | null, scoreA: number, scoreB: number, teamA: string | null, teamB: string | null, currentImageIndex: number };
}

export const TIE_BREAKER_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg", // Nikola Tesla
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Emir_Abdelkader.jpg/800px-Emir_Abdelkader.jpg", // Emir Abdelkader
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/800px-Albert_Einstein_Head.jpg", // Einstein
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ibn_Sina_portrait.jpg/800px-Ibn_Sina_portrait.jpg", // Ibn Sina
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/800px-Marie_Curie_c._1920s.jpg" // Marie Curie
];

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
  round5: { activeTeamIds: [], votes: {}, productRevealed: false },
  round6: { type: null, scoreA: 0, scoreB: 0, teamA: null, teamB: null, currentImageIndex: 0 }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('eventGameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaultState to ensure new rounds (like round5, round6) exist
      return {
        ...defaultState,
        ...parsed,
        round5: { 
          activeTeamIds: [], 
          votes: {}, 
          productRevealed: false,
          ...(parsed.round5 || {}) 
        },
        round6: { ...defaultState.round6, ...parsed.round6 }
      };
    }
    return defaultState;
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
    setGameState(prev => updater(prev));
  };

  useEffect(() => {
    localStorage.setItem('eventGameState', JSON.stringify(gameState));
  }, [gameState]);

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

  const voteTeam = (teamId: string) => {
    updateGameState(state => {
      const r5 = state.round5 || defaultState.round5;
      const votes = { ...(r5.votes || {}) };
      votes[teamId] = (votes[teamId] || 0) + 1;
      return {
        ...state,
        round5: {
          ...r5,
          votes
        }
      };
    });
  };

  const setRound5Teams = (teamIds: string[]) => {
    updateGameState(state => ({
      ...state,
      round5: { 
        ...(state.round5 || defaultState.round5), 
        activeTeamIds: teamIds, 
        votes: teamIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
        productRevealed: false 
      }
    }));
  };

  const setRound6Type = (type: 'images' | 'cups' | null, teamA: string | null, teamB: string | null) => {
    updateGameState(state => ({
      ...state,
      round6: { ...(state.round6 || defaultState.round6), type, teamA, teamB, scoreA: 0, scoreB: 0, currentImageIndex: 0 }
    }));
  };

  const nextImage = () => {
    updateGameState(state => ({
      ...state,
      round6: { 
        ...(state.round6 || defaultState.round6), 
        currentImageIndex: Math.min((state.round6?.currentImageIndex || 0) + 1, TIE_BREAKER_IMAGES.length - 1) 
      }
    }));
  };

  const prevImage = () => {
    updateGameState(state => ({
      ...state,
      round6: { 
        ...(state.round6 || defaultState.round6), 
        currentImageIndex: Math.max((state.round6?.currentImageIndex || 0) - 1, 0) 
      }
    }));
  };

  const mergeTeams = (teamIds: string[], newTeamName: string) => {
    updateGameState(state => {
      const remainingTeams = state.teams.filter(t => !teamIds.includes(t.id));
      const newTeam: Team = {
        id: `t_${Date.now()}`,
        name: newTeamName,
        score: 0,
        eliminated: false
      };
      return { ...state, teams: [...remainingTeams, newTeam] };
    });
  };

  const addTeam = (name: string) => {
    updateGameState(state => {
      const newTeam: Team = {
        id: `t_${Date.now()}`,
        name: name,
        score: 0,
        eliminated: false
      };
      return { ...state, teams: [...state.teams, newTeam] };
    });
  };

  const removeTeam = (teamId: string) => {
    updateGameState(state => ({
      ...state,
      teams: state.teams.filter(t => t.id !== teamId)
    }));
  };

  return { gameState, updateGameState, updateScore, setRound, toggleEliminate, loadTeamsFromRegistrations, voteTeam, setRound5Teams, setRound6Type, nextImage, prevImage, mergeTeams, addTeam, removeTeam };
}
