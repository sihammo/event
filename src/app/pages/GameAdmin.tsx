import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Plus, Minus, XCircle, ArrowRight, ArrowLeft, RotateCcw, Users, Vote, Eye, EyeOff, Image as ImageIcon, CupSoda, Combine, Trash2, UserPlus } from 'lucide-react';
import { useGameState, Team, TIE_BREAKER_IMAGES } from '../game/useGameState';

export default function GameAdmin() {
  const { gameState, updateScore, setRound, toggleEliminate, updateGameState, loadTeamsFromRegistrations, setRound5Teams, setRound6Type, mergeTeams, addTeam, removeTeam, nextImage, prevImage } = useGameState();

  const [isMergeMode, setIsMergeMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);

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

  const handleAddTeam = () => {
    const name = prompt('أدخل اسم الفريق الجديد:');
    if (name && name.trim()) {
      addTeam(name.trim());
    }
  };

  const handleConfirmMerge = () => {
    if (selectedForMerge.length < 2) {
      alert('يجب اختيار فريقين على الأقل للدمج');
      return;
    }
    const name = prompt('أدخل اسم الفريق الجديد المدمج:');
    if (name && name.trim()) {
      mergeTeams(selectedForMerge, name.trim());
      setIsMergeMode(false);
      setSelectedForMerge([]);
    }
  };

  const toggleMergeSelection = (id: string) => {
    setSelectedForMerge(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
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
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={handleAddTeam}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
            >
              <UserPlus className="w-5 h-5" />
              إضافة فريق
            </button>
            <button 
              onClick={() => {
                setIsMergeMode(!isMergeMode);
                setSelectedForMerge([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isMergeMode ? 'bg-purple-500/40 text-purple-300' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}
            >
              <Combine className="w-5 h-5" />
              {isMergeMode ? 'إلغاء الدمج' : 'دمج المشاركين'}
            </button>
            <button 
              onClick={handleLoadCompetitors}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
            >
              <Users className="w-5 h-5" />
              سحب المشاركين
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة تعيين 
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
            {gameState.currentRound === 5 && (
              <div className="space-y-6">
                <p>الجولة الخامسة: بيع منتج مفاجأة (تصويت الجمهور)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-xl">
                  <div className="space-y-4">
                    <h4 className="text-blue-400 font-bold">اختيار المتنافسين:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {gameState.teams.filter(t => !t.eliminated).map(t => (
                        <label key={t.id} className={`flex items-center gap-2 p-2 rounded border transition ${gameState.round5?.activeTeamIds?.includes(t.id) ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                          <input 
                            type="checkbox"
                            checked={gameState.round5?.activeTeamIds?.includes(t.id)}
                            onChange={(e) => {
                              const currentIds = gameState.round5?.activeTeamIds || [];
                              const nextIds = e.target.checked 
                                ? [...currentIds, t.id]
                                : currentIds.filter(id => id !== t.id);
                              setRound5Teams(nextIds);
                            }}
                          />
                          <span className="truncate">{t.name}</span>
                        </label>
                      ))}
                    </div>
                    <button 
                      onClick={() => updateGameState(s => ({ ...s, round5: { ...s.round5, productRevealed: !s.round5?.productRevealed }}))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${gameState.round5?.productRevealed ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}
                    >
                      {gameState.round5?.productRevealed ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      {gameState.round5?.productRevealed ? 'المنتج مكشوف' : 'كشف المنتج'}
                    </button>
                  </div>
                                   <div className="bg-slate-800 p-4 rounded-xl border border-blue-500/20 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Vote className="w-8 h-8 text-blue-400" />
                      <span className="font-bold">نتائج التصويت المباشرة:</span>
                    </div>
                    <div className="w-full space-y-3">
                      {(gameState.round5?.activeTeamIds || []).map(id => {
                        const team = gameState.teams.find(t => t.id === id);
                        return (
                          <div key={id} className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-blue-500/10">
                            <span className="text-slate-300 text-sm truncate max-w-[150px]">{team?.name}</span>
                            <span className="text-blue-400 font-bold">{gameState.round5?.votes?.[id] || 0}</span>
                          </div>
                        );
                      })}
                      {(gameState.round5?.activeTeamIds || []).length === 0 && <p className="text-slate-500 text-center text-sm">اختر فريقاً لبدء التصويت</p>}
                    </div>
                    <button 
                      onClick={() => {
                        const currentIds = gameState.round5?.activeTeamIds || [];
                        updateGameState(s => ({ 
                          ...s, 
                          round5: { 
                            ...s.round5, 
                            votes: currentIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}) 
                          } 
                        }));
                      }}
                      className="mt-4 text-xs text-red-400 hover:underline"
                    >
                      إعادة تعيين الأصوات
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {gameState.currentRound === 6 && (
              <div className="space-y-6">
                <p>الجولة الاحتياطية: فك التعادل</p>
                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => setRound6Type('images', gameState.round6?.teamA, gameState.round6?.teamB)}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border transition ${gameState.round6?.type === 'images' ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                  >
                    <ImageIcon className="w-5 h-5" /> عرض صور وتخمين
                  </button>
                  <button 
                    onClick={() => setRound6Type('cups', gameState.round6?.teamA, gameState.round6?.teamB)}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border transition ${gameState.round6?.type === 'cups' ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                  >
                    <CupSoda className="w-5 h-5" /> شكل بالكؤوس
                  </button>
                </div>

                {gameState.round6?.type && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-xl">
                    <div className="space-y-4">
                      {gameState.round6?.type === 'images' && (
                        <div className="bg-slate-800 p-4 rounded-xl border border-blue-500/30 mb-4">
                          <h4 className="text-blue-400 font-bold mb-3">التحكم في الصور:</h4>
                          <div className="flex justify-between items-center bg-black/50 rounded-lg p-2 mb-3 h-40">
                             <img src={TIE_BREAKER_IMAGES[gameState.round6?.currentImageIndex || 0]} className="h-full w-full object-contain mx-auto" alt="Preview" />
                          </div>
                          <div className="flex justify-between items-center gap-4">
                             <button onClick={prevImage} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded">السابق</button>
                             <span className="font-bold">{(gameState.round6?.currentImageIndex || 0) + 1} / {TIE_BREAKER_IMAGES.length}</span>
                             <button onClick={nextImage} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded">التالي</button>
                          </div>
                        </div>
                      )}

                      <h4 className="text-blue-400 font-bold mt-4">اختيار فريقي التعادل:</h4>
                      <select 
                        className="w-full bg-slate-800 border border-blue-500/30 p-2 rounded"
                        value={gameState.round6?.teamA || ''}
                        onChange={(e) => setRound6Type(gameState.round6?.type, e.target.value || null, gameState.round6?.teamB)}
                      >
                        <option value="">الفريق الأول</option>
                        {gameState.teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <select 
                        className="w-full bg-slate-800 border border-blue-500/30 p-2 rounded"
                        value={gameState.round6?.teamB || ''}
                        onChange={(e) => setRound6Type(gameState.round6?.type, gameState.round6?.teamA, e.target.value || null)}
                      >
                        <option value="">الفريق الثاني</option>
                        {gameState.teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                        <span>{gameState.teams.find(t => t.id === gameState.round6?.teamA)?.name || 'فريق 1'}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateGameState(s => ({ ...s, round6: { ...s.round6, scoreA: s.round6.scoreA + 1 }}))} className="bg-blue-600 p-1 rounded"><Plus className="w-4 h-4"/></button>
                          <span className="text-xl font-bold">{gameState.round6?.scoreA}</span>
                          <button onClick={() => updateGameState(s => ({ ...s, round6: { ...s.round6, scoreA: Math.max(0, s.round6.scoreA - 1) } }))} className="bg-slate-700 p-1 rounded"><Minus className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                        <span>{gameState.teams.find(t => t.id === gameState.round6?.teamB)?.name || 'فريق 2'}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateGameState(s => ({ ...s, round6: { ...s.round6, scoreB: s.round6.scoreB + 1 } }))} className="bg-blue-600 p-1 rounded"><Plus className="w-4 h-4"/></button>
                          <span className="text-xl font-bold">{gameState.round6?.scoreB}</span>
                          <button onClick={() => updateGameState(s => ({ ...s, round6: { ...s.round6, scoreB: Math.max(0, s.round6.scoreB - 1) } }))} className="bg-slate-700 p-1 rounded"><Minus className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {gameState.currentRound < 5 && <p>اتبع تعليمات كل جولة وتفاعل مع الفرق.</p>}
          </div>
        </div>

        {/* Teams List */}
        {isMergeMode && (
          <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-xl flex justify-between items-center sticky top-4 z-10 backdrop-blur-md">
            <div>
              <h3 className="text-purple-300 font-bold">وضع دمج المشاركين</h3>
              <p className="text-sm text-purple-400/80">اختر المشاركين الذين تريد دمجهم في فريق واحد ({selectedForMerge.length} محدد)</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setIsMergeMode(false); setSelectedForMerge([]); }} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600">إلغاء</button>
              <button onClick={handleConfirmMerge} disabled={selectedForMerge.length < 2} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">تأكيد الدمج</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameState.teams.map(team => (
            <motion.div 
              key={team.id}
              onClick={() => isMergeMode && toggleMergeSelection(team.id)}
              className={`p-6 rounded-2xl border transition-all ${
                isMergeMode 
                  ? (selectedForMerge.includes(team.id) ? 'bg-purple-900/50 border-purple-400 cursor-pointer scale-105' : 'bg-slate-800/50 border-slate-700 cursor-pointer hover:border-purple-500/50')
                  : (team.eliminated ? 'bg-red-950/20 border-red-500/20 opacity-70' : 'bg-slate-800 border-blue-500/30')
              }`}
              layout
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold ${team.eliminated ? 'text-red-400 line-through' : 'text-white'}`}>{team.name}</h3>
                  {!isMergeMode && (
                    <button onClick={() => {
                      if (confirm('هل تريد حذف هذا الفريق نهائياً؟')) removeTeam(team.id);
                    }} className="text-slate-500 hover:text-red-400 transition" title="حذف الفريق">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="bg-blue-900/50 px-4 py-1 rounded-full text-blue-300 font-bold text-xl">
                  {team.score}
                </div>
              </div>

              {!isMergeMode && (
                <>
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
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
