import React from 'react';
import { Award, CheckCircle2, Lock, X, Flame, Sparkles } from 'lucide-react';
import { ACHIEVEMENT_BADGES } from '../../data/scienceCurriculum';
import { UserProgress } from '../../types/science';
import { StudentIdCard } from '../common/StudentIdCard';
import { soundEffects } from '../../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const BadgesModal: React.FC<Props> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  const getRank = (xp: number) => {
    if (xp < 250) return { title: 'Novice Lab Tech', next: 250, badge: '🔬' };
    if (xp < 600) return { title: 'Junior Scientist', next: 600, badge: '⚡' };
    if (xp < 1000) return { title: 'Quantum Investigator', next: 1000, badge: '🔭' };
    return { title: 'Chief Science Researcher', next: 2000, badge: '👑' };
  };

  const rank = getRank(progress.xp);
  const accuracy = progress.totalQuestionsAttempted > 0
    ? Math.round((progress.correctAnswersCount / progress.totalQuestionsAttempted) * 100)
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-indigo-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-indigo-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-indigo-50/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-amber-100/80 rounded-2xl border border-amber-200">{rank.badge}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-indigo-950">{rank.title}</h3>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Level {progress.level}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {progress.xp} Total XP · {rank.next - progress.xp} XP to next rank promotion
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-indigo-900 rounded-xl hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bina Bangsa School Scholar Pass */}
        <div className="p-6 pb-2">
          <StudentIdCard progress={progress} onOpenBadges={() => {}} />
        </div>

        {/* User Stats Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/40 border-b border-indigo-100 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500">Day Streak</div>
            <div className="font-mono text-base font-bold text-amber-600 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-500" /> {progress.streak} Days
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500">Quiz Accuracy</div>
            <div className="font-mono text-base font-bold text-blue-600 mt-0.5">
              {accuracy}%
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500">Labs Tested</div>
            <div className="font-mono text-base font-bold text-emerald-600 mt-0.5">
              {progress.experimentsRunCount} Runs
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500">Cases Solved</div>
            <div className="font-mono text-base font-bold text-purple-600 mt-0.5">
              {progress.mysteriesSolved.length} / 3
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Science Honors & Achievement Badges</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {progress.unlockedBadges.length} / {ACHIEVEMENT_BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENT_BADGES.map(badge => {
              const isUnlocked = progress.unlockedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isUnlocked
                      ? 'bg-amber-50/30 border-amber-200/80 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {isUnlocked ? badge.icon : <Lock className="w-4 h-4 text-slate-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs truncate">{badge.title}</div>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Locked</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
