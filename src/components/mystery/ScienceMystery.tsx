import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Search, FileText, CheckCircle2, AlertCircle, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';
import { SCIENCE_MYSTERIES } from '../../data/scienceCurriculum';
import { soundEffects } from '../../utils/sound';

interface Props {
  onSolveMystery?: (mysteryId: string) => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const ScienceMystery: React.FC<Props> = ({ onSolveMystery, onUnlockBadge }) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [unlockedClueIds, setUnlockedClueIds] = useState<string[]>(['c1']);
  const [selectedVerdictId, setSelectedVerdictId] = useState<string | null>(null);
  const [isCaseClosed, setIsCaseClosed] = useState<boolean>(false);

  const currentCase = SCIENCE_MYSTERIES[selectedCaseIdx];

  const handleUnlockClue = (clueId: string) => {
    soundEffects.playBubble();
    if (!unlockedClueIds.includes(clueId)) {
      setUnlockedClueIds(prev => [...prev, clueId]);
    }
  };

  const handleSelectVerdict = (verdictId: string) => {
    if (isCaseClosed) return;
    setSelectedVerdictId(verdictId);
    const chosen = currentCase.verdictOptions.find(v => v.id === verdictId);

    if (chosen?.isCorrect) {
      soundEffects.playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setIsCaseClosed(true);
      onSolveMystery?.(currentCase.id);
      onUnlockBadge?.('badge_mystery_sleuth');
    } else {
      soundEffects.playWrong();
    }
  };

  const handleSwitchCase = (idx: number) => {
    soundEffects.playClick();
    setSelectedCaseIdx(idx);
    setUnlockedClueIds(['c1']);
    setSelectedVerdictId(null);
    setIsCaseClosed(false);
  };

  const selectedVerdict = currentCase.verdictOptions.find(v => v.id === selectedVerdictId);

  return (
    <div className="bg-white/95 rounded-3xl border border-purple-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-purple-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-50/80 via-pink-50/50 to-indigo-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-200/80 text-purple-950 shadow-2xs">
              <Search className="w-4 h-4 text-purple-800" />
            </span>
            <h2 className="text-lg font-bold text-indigo-950 tracking-tight">
              Science Detective: Mystery Case Files
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Apply the scientific method: examine evidence, connect observations to concepts, and deliver the verdict!
          </p>
        </div>

        {/* Case Selector Tabs (Pastel Rounded) */}
        <div className="flex items-center gap-1.5 p-1 bg-purple-50/80 rounded-2xl border border-purple-100/80">
          {SCIENCE_MYSTERIES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => handleSwitchCase(idx)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCaseIdx === idx
                  ? 'bg-purple-200 text-purple-950 border border-purple-300 shadow-xs'
                  : 'text-slate-600 hover:text-purple-950'
              }`}
            >
              Case #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Case Details */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Case Brief Banner (Pastel Grape Gradient) */}
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl space-y-3 relative overflow-hidden border border-purple-900 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Confidential Case Dossier #{selectedCaseIdx + 1}
            </span>
            <span className="bg-purple-800/60 text-purple-200 px-3 py-1 rounded-xl border border-purple-600/70 text-[11px] font-mono">
              Topic: {currentCase.topic.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <h3 className="text-xl font-bold font-serif-display text-white">
            {currentCase.title}
          </h3>

          <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
            {currentCase.caseBrief}
          </p>
        </div>

        {/* Clues & Lab Evidence */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Laboratory Evidence & Clues</span>
            <span className="text-xs font-normal text-slate-500">
              ({unlockedClueIds.length} of {currentCase.clues.length} uncovered)
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentCase.clues.map((clue, idx) => {
              const isUnlocked = unlockedClueIds.includes(clue.id);

              if (!isUnlocked) {
                return (
                  <button
                    key={clue.id}
                    onClick={() => handleUnlockClue(clue.id)}
                    className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>Clue #{idx + 1} (Locked)</span>
                      <Search className="w-3.5 h-3.5 text-slate-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-xs text-blue-600 font-semibold mt-3 flex items-center gap-1">
                      Inspect Evidence <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              }

              return (
                <div
                  key={clue.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 animate-in fade-in"
                >
                  <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {clue.label}
                  </div>
                  <div className="text-xs text-slate-800 font-medium">
                    "{clue.observation}"
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <strong>Deduction:</strong> {clue.scientificDeduction}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-900">
            Detective's Scientific Verdict: Which hypothesis explains the evidence?
          </h4>

          <div className="space-y-2.5">
            {currentCase.verdictOptions.map(option => {
              const isSelected = selectedVerdictId === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectVerdict(option.id)}
                  disabled={isCaseClosed}
                  className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? option.isCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                        : 'bg-rose-50 border-rose-500 text-rose-900'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="leading-relaxed">{option.text}</span>
                  {isSelected && option.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isSelected && !option.isCorrect && (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verdict Feedback */}
        {selectedVerdict && (
          <div className={`p-4 rounded-xl text-xs space-y-2 animate-in fade-in ${
            selectedVerdict.isCorrect
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
              : 'bg-rose-100 border border-rose-300 text-rose-900'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {selectedVerdict.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Case Solved! Primary 6 Concept Verified (+50 XP)
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  Hypothesis Refuted by Experimental Evidence
                </>
              )}
            </div>
            <p className="leading-relaxed">{selectedVerdict.explanation}</p>

            {selectedVerdict.isCorrect && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSwitchCase((selectedCaseIdx + 1) % SCIENCE_MYSTERIES.length)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Proceed to Next Mystery File
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
