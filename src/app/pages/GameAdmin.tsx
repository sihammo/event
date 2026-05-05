import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Plus, Minus, XCircle, ArrowRight, ArrowLeft, RotateCcw, Users } from 'lucide-react';
import { useGameState, Team } from '../game/useGameState';

export default function GameAdmin() {
  const { gameState, updateScore, setRound, toggleEliminate, updateGameState, loadTeamsFromRegistrations } = useGameState();

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع النقاط؟')) {
      localStorage.removeItem('eventGameState');
      window.location.reload();
    }
  };

  const handleLoadCompetitors = () => {
    if (confirm('هل أنت متأكد من سحب المشاركين من التسجيلات؟ سيتم استبدال الفرق الحالية.')) {
      const count = loadTeamsFromRegistrations();
      if (count && count > 0) {
        alert(`تم استيراد ${count} مشاركين بنجاح.`);
      } else {
        alert('لم يتم العثور على أي تسجيلات Solo أو Team. تأكد من تحميل التسجيلات في صفحة الأدمن أولاً.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-blue-500/30">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 font-arabic">لوحة تحكم المسابقة</h1>
            <p className="text-slate-400 mt-2">تحكم في النقاط والجولات والإقصاء</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleLoadCompetitors}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
            >
              <Users className="w-5 h-5" />
              سحب المشاركين من التسجيلات
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة تعيين المسابقة
            </button>
          </div>
        </div>

        {/* Round Controls */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-blue-500/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-400">الجولة الحالية: {gameState.currentRound}</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setRound(Math.max(1, gameState.currentRound - 1))}
                className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setRound(Math.min(6, gameState.currentRound + 1))}
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="text-slate-300">
            {gameState.currentRound === 1 && <p>الجولة الأولى: أسئلة عامة (أول من يضغط يجيب، إجابة صحيحة +1، خاطئة -1)</p>}
            {gameState.currentRound === 2 && <p>الجولة الثانية: حل إشكالية (5 دقائق، أقرب حل منطقي يفوز)</p>}
            {gameState.currentRound === 3 && <p>الجولة الثالثة: كلمات عشوائية وجمل واقعية (إقصاء فريق نهاية الجولة)</p>}
            {gameState.currentRound === 4 && <p>الجولة الرابعة: كشف الكذبة (إقصاء فريق آخر)</p>}
            {gameState.currentRound === 5 && <p>الجولة الخامسة: بيع منتج مفاجأة (تصويت الجمهور)</p>}
            {gameState.currentRound === 6 && <p>الجولة الاحتياطية: فك التعادل</p>}
          </div>
        </div>

        {/* Teams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameState.teams.map(team => (
            <motion.div 
              key={team.id}
              className={`p-6 rounded-2xl border ${team.eliminated ? 'bg-red-950/20 border-red-500/20 opacity-70' : 'bg-slate-800 border-blue-500/30'}`}
              layout
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${team.eliminated ? 'text-red-400 line-through' : 'text-white'}`}>{team.name}</h3>
                <div className="bg-blue-900/50 px-4 py-1 rounded-full text-blue-300 font-bold text-xl">
                  {team.score}
                </div>
              </div>

              {!team.eliminated && (
                <div className="flex justify-center gap-4 mb-6">
                  <button 
                    onClick={() => updateScore(team.id, 1)}
                    className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 flex justify-center items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> إضافة
                  </button>
                  <button 
                    onClick={() => updateScore(team.id, -1)}
                    className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 flex justify-center items-center gap-2"
                  >
                    <Minus className="w-5 h-5" /> خصم
                  </button>
                </div>
              )}

              <button 
                onClick={() => toggleEliminate(team.id, gameState.currentRound)}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                  team.eliminated 
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                    : 'bg-red-950 text-red-500 hover:bg-red-900'
                }`}
              >
                <XCircle className="w-5 h-5" />
                {team.eliminated ? 'إلغاء الإقصاء' : 'إقصاء الفريق'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
