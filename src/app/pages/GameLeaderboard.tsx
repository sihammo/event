import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, ShieldAlert } from 'lucide-react';
import { useGameState, Team } from '../game/useGameState';

export default function GameLeaderboard() {
  const { gameState } = useGameState();

  // Sort teams by score, but keep eliminated teams at the bottom
  const sortedTeams = [...gameState.teams].sort((a, b) => {
    if (a.eliminated && !b.eliminated) return 1;
    if (!a.eliminated && b.eliminated) return -1;
    return b.score - a.score;
  });

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden relative" dir="rtl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 border border-blue-500/30">
            <Trophy className="w-8 h-8 text-yellow-400 mx-2" />
            <span className="text-blue-300 font-bold px-4">سلم التنقيط المباشر</span>
            <Trophy className="w-8 h-8 text-yellow-400 mx-2" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-arabic tracking-tight drop-shadow-lg">
            الجولة {gameState.currentRound}
          </h1>
          <p className="text-xl text-blue-200/70 mt-4 font-arabic max-w-2xl mx-auto">
            {gameState.currentRound === 1 && "أسئلة السرعة! أول فريق يضغط على الزر يجيب"}
            {gameState.currentRound === 2 && "تحدي الإشكالية! 5 دقائق لأقرب حل منطقي"}
            {gameState.currentRound === 3 && "الكلمات العشوائية والجمل الواقعية"}
            {gameState.currentRound === 4 && "كشف الكذبة! اكتشف معلومة الفريق الآخر الخاطئة"}
            {gameState.currentRound === 5 && "تحدي البيع! تصويت الجمهور يحدد الفائز"}
            {gameState.currentRound === 6 && "الجولة الفاصلة!"}
          </p>
        </motion.div>

        {/* Leaderboard Cards */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full gap-4">
          <AnimatePresence>
            {sortedTeams.map((team, index) => (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className={`relative overflow-hidden rounded-2xl border ${
                  team.eliminated 
                    ? 'bg-red-950/40 border-red-900/50 grayscale-[0.8]' 
                    : index === 0 
                      ? 'bg-gradient-to-r from-blue-900/80 to-cyan-900/80 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-800/80 border-blue-500/20'
                } backdrop-blur-md p-6 flex items-center justify-between`}
              >
                {/* Rank indicator */}
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black ${
                    team.eliminated 
                      ? 'bg-slate-800 text-slate-500'
                      : index === 0 
                        ? 'bg-yellow-500 text-yellow-900 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                        : index === 1
                          ? 'bg-slate-300 text-slate-800'
                          : index === 2
                            ? 'bg-amber-700 text-amber-100'
                            : 'bg-blue-900 text-blue-300'
                  }`}>
                    {team.eliminated ? <ShieldAlert className="w-8 h-8" /> : index + 1}
                  </div>
                  
                  <div>
                    <h2 className={`text-3xl font-bold font-arabic ${team.eliminated ? 'text-red-400/70 line-through' : 'text-white'}`}>
                      {team.name}
                    </h2>
                    {team.eliminated && (
                      <span className="text-red-500/80 text-sm font-bold bg-red-950/50 px-3 py-1 rounded-full mt-2 inline-block">
                        تم الإقصاء في الجولة {team.eliminated}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-blue-200/50 font-bold uppercase tracking-wider mb-1">النقاط</span>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                    {team.score}
                  </div>
                </div>

                {/* First place star glow */}
                {!team.eliminated && index === 0 && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-10 -top-10 text-yellow-500/10 pointer-events-none"
                  >
                    <Star className="w-64 h-64" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
