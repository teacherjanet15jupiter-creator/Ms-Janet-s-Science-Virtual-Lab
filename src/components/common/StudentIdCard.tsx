import React, { useState } from 'react';
import { Award, Sparkles, User, Edit2, Check, ShieldCheck } from 'lucide-react';
import { BinaBangsaLogo } from './BinaBangsaLogo';
import { UserProgress } from '../../types/science';
import { soundEffects } from '../../utils/sound';

interface Props {
  progress: UserProgress;
  onOpenBadges: () => void;
}

export const StudentIdCard: React.FC<Props> = ({ progress, onOpenBadges }) => {
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('sciquest_student_name') || 'P6 Science Cadet';
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(studentName);

  const handleSaveName = () => {
    soundEffects.playClick();
    const finalName = tempName.trim() || 'P6 Science Cadet';
    setStudentName(finalName);
    localStorage.setItem('sciquest_student_name', finalName);
    setIsEditing(false);
  };

  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return 'Junior Investigator';
    if (lvl === 2) return 'Quantum Researcher';
    if (lvl === 3) return 'Master Lab Specialist';
    return 'Chief Science Scholar';
  };

  return (
    <div className="relative rounded-3xl p-5 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-lg overflow-hidden border border-purple-400/30">
      {/* Holographic Pastel Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-pink-500/10 to-amber-500/15 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Pass Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <BinaBangsaLogo variant="crest" size="sm" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-teal-300 font-bold font-mono">
                Bina Bangsa School
              </div>
              <div className="text-xs font-bold text-white tracking-wide">
                Primary 6 Official Science Pass
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Active Scholar</span>
          </div>
        </div>

        {/* Student Profile Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-300 via-rose-300 to-indigo-300 p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
              🎓
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="px-2 py-0.5 rounded-lg bg-white/20 border border-white/40 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <span className="font-bold text-sm text-white truncate">{studentName}</span>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setIsEditing(true);
                    }}
                    className="opacity-60 hover:opacity-100 text-slate-300 transition-opacity"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="text-[11px] text-teal-200 font-medium">
              Grade 6 · Class of Ms. Janet
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Rank: <span className="text-amber-300 font-bold">{getRankTitle(progress.level)}</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-300">Level {progress.level} Progress</span>
            <span className="text-amber-300 font-bold">{progress.xp} XP</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              style={{ width: `${Math.min(100, (progress.xp % 250) / 2.5)}%` }}
              className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-amber-300 rounded-full transition-all duration-500 shadow-xs"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenBadges();
          }}
          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-purple-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>View {progress.unlockedBadges.length} Earned Science Badges</span>
        </button>
      </div>
    </div>
  );
};
