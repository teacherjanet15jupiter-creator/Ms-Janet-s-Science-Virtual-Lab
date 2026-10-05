import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award, Zap, HelpCircle, CheckCircle2, XCircle, ChevronRight, RotateCcw,
  Flame, Sparkles, Filter, BookOpen, ExternalLink
} from 'lucide-react';
import { QUIZ_QUESTIONS, TOPICS_META } from '../../data/scienceCurriculum';
import { QuizQuestion, ScienceTopic } from '../../types/science';
import { soundEffects } from '../../utils/sound';

interface Props {
  onCompleteQuiz: (score: number, total: number, earnedXp: number) => void;
  onUnlockBadge?: (badgeId: string) => void;
  onOpenSyllabusMap?: () => void;
  initialTopic?: ScienceTopic | 'all';
}

type CurriculumFilterMode = 'all' | 'cambridge' | 'mypals';

export const QuizArena: React.FC<Props> = ({
  onCompleteQuiz,
  onUnlockBadge,
  onOpenSyllabusMap,
  initialTopic = 'all'
}) => {
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic | 'all'>(initialTopic);
  const [curriculumMode, setCurriculumMode] = useState<CurriculumFilterMode>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [lifelinesUsed, setLifelinesUsed] = useState<{ fiftyFifty: boolean; hint: boolean }>({
    fiftyFifty: false,
    hint: false
  });

  // Filter questions based on topic and curriculum filter
  const questionsList: QuizQuestion[] = QUIZ_QUESTIONS.filter(q => {
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (curriculumMode === 'cambridge') {
      return !!q.curriculumAlignment?.cambridgeObjectiveCode;
    }
    if (curriculumMode === 'mypals') {
      return !!q.curriculumAlignment?.myPalsUnit;
    }
    return true;
  });

  const currentQ = questionsList[currentIdx] || questionsList[0] || QUIZ_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      soundEffects.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore(prev => prev + 1);

      if (nextStreak === 5) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        onUnlockBadge?.('badge_quiz_sharpshooter');
      }
    } else {
      soundEffects.playWrong();
      setStreak(0);
    }
  };

  const handleFiftyFifty = () => {
    if (lifelinesUsed.fiftyFifty || hasAnswered) return;
    soundEffects.playClick();

    // Pick two wrong options to eliminate
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter(i => i !== currentQ.correctIndex);

    // Pick 2
    const toEliminate = wrongIndices.slice(0, 2);
    setEliminatedOptions(toEliminate);
    setLifelinesUsed(prev => ({ ...prev, fiftyFifty: true }));
  };

  const handleToggleHint = () => {
    if (hasAnswered) return;
    soundEffects.playClick();
    setShowHint(!showHint);
    setLifelinesUsed(prev => ({ ...prev, hint: true }));
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentIdx + 1 < questionsList.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      setEliminatedOptions([]);
      setShowHint(false);
    } else {
      // Quiz finished
      soundEffects.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      setIsQuizComplete(true);
      const earnedXp = (score + 1) * 25 + streak * 10;
      onCompleteQuiz(score + (selectedOption === currentQ.correctIndex ? 1 : 0), questionsList.length, earnedXp);
      onUnlockBadge?.('badge_quiz_novice');
    }
  };

  const handleRestart = () => {
    soundEffects.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setStreak(0);
    setScore(0);
    setEliminatedOptions([]);
    setShowHint(false);
    setIsQuizComplete(false);
    setLifelinesUsed({ fiftyFifty: false, hint: false });
  };

  const alignment = currentQ.curriculumAlignment;

  return (
    <div className="bg-white/95 rounded-3xl border border-rose-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Header with Pastel Accents & Dual Curriculum Indicator */}
      <div className="px-6 py-4.5 border-b border-rose-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-rose-50/80 via-pink-50/50 to-amber-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-rose-200/80 text-rose-950 shadow-2xs">
              <Award className="w-4 h-4 fill-rose-700" />
            </span>
            <h2 className="text-lg font-bold text-rose-950 tracking-tight">
              P6 Science Quiz Arena & Exam Challenger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Integrated with Cambridge Stage 6 Checkpoint and My Pals Are Here! Science P6 Syllabus.
          </p>
        </div>

        {/* Live Streak & Score Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/90 px-3 py-1.5 rounded-xl border border-rose-100 shadow-2xs text-rose-950">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-slate-300'}`} />
            <span>Streak:</span>
            <span className="font-mono text-rose-700 tabular-nums">{streak}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/90 px-3 py-1.5 rounded-xl border border-rose-100 shadow-2xs text-rose-950">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Score:</span>
            <span className="font-mono text-rose-700 tabular-nums">{score} / {questionsList.length}</span>
          </div>

          {onOpenSyllabusMap && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenSyllabusMap();
              }}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white/90 px-2.5 py-1.5 rounded-xl border border-indigo-100 shadow-2xs transition-colors"
            >
              <span>Syllabus Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Curriculum Filter & Topic Selector Bar */}
      <div className="p-4 bg-slate-50/60 border-b border-slate-100 space-y-3">
        {/* Row 1: Curriculum Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">Curriculum:</span>
            <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs gap-1">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurriculumMode('all');
                  setCurrentIdx(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  curriculumMode === 'all'
                    ? 'bg-rose-100 text-rose-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Syllabi
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurriculumMode('cambridge');
                  setCurrentIdx(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  curriculumMode === 'cambridge'
                    ? 'bg-sky-100 text-sky-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3 h-3 text-sky-600" />
                <span>Cambridge Checkpoint</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setCurriculumMode('mypals');
                  setCurrentIdx(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  curriculumMode === 'mypals'
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3 h-3 text-amber-600" />
                <span>My Pals Science P6</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Showing {questionsList.length} aligned questions
          </div>
        </div>

        {/* Row 2: Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedTopic('all');
              setCurrentIdx(0);
              setSelectedOption(null);
              setHasAnswered(false);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedTopic === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            All P6 Topics
          </button>
          {(Object.keys(TOPICS_META) as ScienceTopic[]).map(key => (
            <button
              key={key}
              onClick={() => {
                soundEffects.playClick();
                setSelectedTopic(key);
                setCurrentIdx(0);
                setSelectedOption(null);
                setHasAnswered(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedTopic === key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {TOPICS_META[key].title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Display or Completion Screen */}
      {!isQuizComplete ? (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Question {currentIdx + 1} of {questionsList.length}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Topic: {currentQ.topicTitle} · {currentQ.difficulty}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${((currentIdx + 1) / questionsList.length) * 100}%` }}
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Question Card with Dual Curriculum Badges */}
          <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/80 space-y-4">
            {/* Dual Curriculum Badges on Question */}
            {alignment && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-100/90 border border-sky-200 text-sky-950 text-[11px] font-bold">
                  <Award className="w-3 h-3 text-sky-600" />
                  <span>Cambridge: {alignment.cambridgeObjectiveCode}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100/90 border border-amber-200 text-amber-950 text-[11px] font-bold">
                  <BookOpen className="w-3 h-3 text-amber-600" />
                  <span>My Pals: {alignment.myPalsTheme} ({alignment.myPalsBook})</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  {alignment.myPalsPages}
                </span>
              </div>
            )}

            {currentQ.scenario && (
              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 inline-block shadow-2xs">
                📋 Experiment Scenario: {currentQ.scenario}
              </div>
            )}

            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Lifelines Toolbar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <button
                onClick={handleFiftyFifty}
                disabled={lifelinesUsed.fiftyFifty || hasAnswered}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  lifelinesUsed.fiftyFifty
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                50:50 Lifeline
              </button>

              <button
                onClick={handleToggleHint}
                disabled={hasAnswered}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  showHint ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint ? 'Hide Clue' : 'Concept Hint'}
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 animate-in fade-in">
                <strong>💡 Concept Clue:</strong> {currentQ.p6KeyConcept}
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const isEliminated = eliminatedOptions.includes(idx);

              let optionStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-400';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              if (isEliminated) {
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs italic bg-slate-50/50"
                  >
                    [Option {String.fromCharCode(65 + idx)} eliminated by 50:50 lifeline]
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3 shadow-2xs ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    hasAnswered && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : hasAnswered && isSelected && !isCorrect
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{optionText}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Scientific Concept & Misconception Breakdown (Shows immediately upon answer) */}
          {hasAnswered && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Primary 6 Scientific & Exam Breakdown
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  selectedOption === currentQ.correctIndex ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {selectedOption === currentQ.correctIndex ? 'Correct Answer (+25 XP)' : 'Incorrect'}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>

              {/* Dual Curriculum Exam Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                {/* Cambridge Examiner Tip */}
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-sky-900/60 space-y-1">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Cambridge Examiner Tip:</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {alignment?.cambridgeDescription || currentQ.p6KeyConcept}
                  </div>
                </div>

                {/* My Pals C-E-O Framework */}
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-amber-900/60 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>My Pals C-E-O Exam Model:</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {alignment?.examFocus || currentQ.commonPitfall}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>{currentIdx + 1 < questionsList.length ? 'Next Question' : 'Complete Quiz'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Quest Complete, Primary 6 Scholar!
            </h3>
            <p className="text-xs text-slate-600">
              You scored <span className="font-bold text-rose-600">{score}</span> out of{' '}
              <span className="font-bold text-slate-900">{questionsList.length}</span> questions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold">XP Awarded: +{(score + 1) * 25 + streak * 10} XP</div>
            <div className="text-slate-600">
              Your Cambridge and My Pals competency scores have been updated in your profile!
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz Quest</span>
            </button>

            {onOpenSyllabusMap && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenSyllabusMap();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs shadow-2xs hover:bg-indigo-100 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Check Syllabus Progress</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
