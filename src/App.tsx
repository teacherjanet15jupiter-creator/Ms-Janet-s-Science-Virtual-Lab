import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Award, Zap, Leaf, Move, Trees, Cpu, Play,
  Search, BookOpen, Bot, Sparkles, Flame, Moon, Scan, Camera
} from 'lucide-react';
import { BinaBangsaLogo } from './components/common/BinaBangsaLogo';
import { LabHeroBanner } from './components/common/LabHeroBanner';
import { CurriculumBadgeBar } from './components/common/CurriculumBadgeBar';
import { CurriculumIntegrationHub } from './components/curriculum/CurriculumIntegrationHub';
import { EnergyCoasterLab } from './components/labs/EnergyCoasterLab';
import { PlantTransportLab } from './components/labs/PlantTransportLab';
import { ForcesFrictionLab } from './components/labs/ForcesFrictionLab';
import { EcosystemFoodWebLab } from './components/labs/EcosystemFoodWebLab';
import { CircuitBuilderLab } from './components/labs/CircuitBuilderLab';
import { EarthMoon3DLab } from './components/labs/EarthMoon3DLab';
import { AugmentedRealityHub } from './components/ar/AugmentedRealityHub';
import { QuizArena } from './components/quiz/QuizArena';
import { ScienceMystery } from './components/mystery/ScienceMystery';
import { ScienceNotes } from './components/notes/ScienceNotes';
import { AiScienceMentor } from './components/mentor/AiScienceMentor';
import { BadgesModal } from './components/profile/BadgesModal';
import { INITIAL_USER_PROGRESS } from './data/scienceCurriculum';
import { UserProgress, ScienceTopic } from './types/science';
import { soundEffects } from './utils/sound';

type MainView = 'labs' | 'ar' | 'quiz' | 'curriculum' | 'detective' | 'notes' | 'mentor';
type LabId = 'energy' | 'moon' | 'plant' | 'forces' | 'ecosystem' | 'circuit';

export default function App() {
  const [activeView, setActiveView] = useState<MainView>('labs');
  const [activeLab, setActiveLab] = useState<LabId>('energy');
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getIsMuted());
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('sciquest_user_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_PROGRESS;
      }
    }
    return INITIAL_USER_PROGRESS;
  });

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('sciquest_user_progress', JSON.stringify(progress));
  }, [progress]);

  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEffects.playClick();
    }
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (!progress.unlockedBadges.includes(badgeId)) {
      soundEffects.playFanfare();
      setProgress(prev => ({
        ...prev,
        xp: prev.xp + 100,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
        level: Math.floor((prev.xp + 100) / 250) + 1
      }));
    }
  };

  const handleRecordExperiment = () => {
    setProgress(prev => ({
      ...prev,
      experimentsRunCount: prev.experimentsRunCount + 1,
      xp: prev.xp + 15
    }));
  };

  const handleCompleteQuiz = (score: number, total: number, earnedXp: number) => {
    setProgress(prev => {
      const nextXp = prev.xp + earnedXp;
      return {
        ...prev,
        xp: nextXp,
        level: Math.floor(nextXp / 250) + 1,
        quizzesCompleted: prev.quizzesCompleted + 1,
        correctAnswersCount: prev.correctAnswersCount + score,
        totalQuestionsAttempted: prev.totalQuestionsAttempted + total
      };
    });
  };

  const handleSolveMystery = (mysteryId: string) => {
    if (!progress.mysteriesSolved.includes(mysteryId)) {
      setProgress(prev => ({
        ...prev,
        xp: prev.xp + 75,
        mysteriesSolved: [...prev.mysteriesSolved, mysteryId]
      }));
    }
  };

  const getLabTopic = (labId: LabId): ScienceTopic => {
    switch (labId) {
      case 'energy': return 'energy';
      case 'moon': return 'earth_space';
      case 'plant': return 'plant_transport';
      case 'forces': return 'forces';
      case 'ecosystem': return 'ecosystems';
      case 'circuit': return 'circuits';
      default: return 'energy';
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      {/* Strict Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-indigo-100/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Bina Bangsa School Logo & Title */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveView('labs');
            }}
            className="text-left hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-3"
          >
            <BinaBangsaLogo variant="header" size="sm" />
          </button>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50 text-xs font-semibold">
            <button
              onClick={() => { soundEffects.playClick(); setActiveView('labs'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeView === 'labs'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              Virtual Labs
            </button>
            <button
              onClick={() => {
                soundEffects.playHologramActivate();
                setActiveView('ar');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'ar'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-sky-800 hover:text-sky-950 bg-sky-50/70'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-sky-500" />
              <span>AR Lab 📱</span>
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveView('quiz'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeView === 'quiz'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              Quiz Arena
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveView('curriculum'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                activeView === 'curriculum'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>Syllabus Map</span>
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveView('detective'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeView === 'detective'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              Detective Files
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveView('notes'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeView === 'notes'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              Cheat Sheets
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveView('mentor'); }}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeView === 'mentor'
                  ? 'bg-white text-indigo-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              Dr. Atom
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-900 hover:bg-indigo-50/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setIsBadgesModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-rose-100 hover:from-amber-200 hover:to-rose-200 border border-amber-200/80 text-indigo-950 text-xs font-bold shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Level {progress.level} ·</span>
              <span className="font-mono text-indigo-900 font-bold">{progress.xp} XP</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-indigo-100/60 bg-white/90 px-1 py-2 text-[10px] font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveView('labs')}
            className={`px-2 py-1 rounded-lg ${activeView === 'labs' ? 'bg-indigo-100 text-indigo-900 font-bold' : ''}`}
          >
            Labs
          </button>
          <button
            onClick={() => {
              soundEffects.playHologramActivate();
              setActiveView('ar');
            }}
            className={`px-2 py-1 rounded-lg ${activeView === 'ar' ? 'bg-sky-500 text-white font-bold' : 'text-sky-700 font-bold'}`}
          >
            AR
          </button>
          <button
            onClick={() => setActiveView('quiz')}
            className={`px-2 py-1 rounded-lg ${activeView === 'quiz' ? 'bg-rose-100 text-rose-900 font-bold' : ''}`}
          >
            Quiz
          </button>
          <button
            onClick={() => setActiveView('curriculum')}
            className={`px-2 py-1 rounded-lg ${activeView === 'curriculum' ? 'bg-sky-100 text-sky-900 font-bold' : ''}`}
          >
            Syllabus
          </button>
          <button
            onClick={() => setActiveView('detective')}
            className={`px-2 py-1 rounded-lg ${activeView === 'detective' ? 'bg-purple-100 text-purple-900 font-bold' : ''}`}
          >
            Detective
          </button>
          <button
            onClick={() => setActiveView('notes')}
            className={`px-2 py-1 rounded-lg ${activeView === 'notes' ? 'bg-emerald-100 text-emerald-900 font-bold' : ''}`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveView('mentor')}
            className={`px-2 py-1 rounded-lg ${activeView === 'mentor' ? 'bg-amber-100 text-amber-900 font-bold' : ''}`}
          >
            Mentor
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* VIEW 1: Virtual Labs */}
        {activeView === 'labs' && (
          <div className="space-y-6">
            {/* Featured Hero Banner with School Crest & Ms. Janet Cartoon Squad */}
            <LabHeroBanner
              onGoToLabs={() => setActiveLab('energy')}
              onGoToQuiz={() => setActiveView('quiz')}
              onGoToMentor={() => setActiveView('mentor')}
              onGoToSyllabus={() => setActiveView('curriculum')}
              onGoToAr={() => setActiveView('ar')}
            />

            {/* Lab Switcher Bar (Pastel Tones) */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'energy', label: 'Energy Roller Coaster', icon: Zap, pastelBg: 'bg-amber-100/90 text-amber-950 border-amber-300/80', iconColor: 'text-amber-700' },
                { id: 'moon', label: '3D Earth & Moon Phases', icon: Moon, pastelBg: 'bg-sky-100/90 text-sky-950 border-sky-300/80', iconColor: 'text-sky-700' },
                { id: 'plant', label: 'Plant Xylem & Transpiration', icon: Leaf, pastelBg: 'bg-emerald-100/90 text-emerald-950 border-emerald-300/80', iconColor: 'text-emerald-700' },
                { id: 'forces', label: 'Forces & Friction Sandbox', icon: Move, pastelBg: 'bg-blue-100/90 text-blue-950 border-blue-300/80', iconColor: 'text-blue-700' },
                { id: 'ecosystem', label: 'Ecosystem Food Web', icon: Trees, pastelBg: 'bg-teal-100/90 text-teal-950 border-teal-300/80', iconColor: 'text-teal-700' },
                { id: 'circuit', label: 'Circuit Builder & Fuses', icon: Cpu, pastelBg: 'bg-indigo-100/90 text-indigo-950 border-indigo-300/80', iconColor: 'text-indigo-700' },
              ].map(item => {
                const IconComponent = item.icon;
                const isSelected = activeLab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setActiveLab(item.id as LabId);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                      isSelected
                        ? `${item.pastelBg} shadow-sm ring-2 ring-white`
                        : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? item.iconColor : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Reusable Curriculum Bar for current active lab */}
            <CurriculumBadgeBar
              topic={getLabTopic(activeLab)}
              onOpenSyllabusMap={() => setActiveView('curriculum')}
            />

            {/* Active Lab Component */}
            {activeLab === 'energy' && (
              <EnergyCoasterLab
                onRecordExperiment={handleRecordExperiment}
                onUnlockBadge={handleUnlockBadge}
              />
            )}
            {activeLab === 'moon' && (
              <EarthMoon3DLab
                onRecordExperiment={handleRecordExperiment}
                onUnlockBadge={handleUnlockBadge}
                onLaunchAr={() => {
                  soundEffects.playHologramActivate();
                  setActiveView('ar');
                }}
              />
            )}
            {activeLab === 'plant' && (
              <PlantTransportLab
                onRecordExperiment={handleRecordExperiment}
                onUnlockBadge={handleUnlockBadge}
              />
            )}
            {activeLab === 'forces' && (
              <ForcesFrictionLab
                onRecordExperiment={handleRecordExperiment}
                onUnlockBadge={handleUnlockBadge}
              />
            )}
            {activeLab === 'ecosystem' && (
              <EcosystemFoodWebLab
                onRecordExperiment={handleRecordExperiment}
                onUnlockBadge={handleUnlockBadge}
              />
            )}
            {activeLab === 'circuit' && (
              <CircuitBuilderLab
                onRecordExperiment={handleRecordExperiment}
                onUnlockBadge={handleUnlockBadge}
              />
            )}
          </div>
        )}

        {/* VIEW 2: Augmented Reality (AR) Hub */}
        {activeView === 'ar' && (
          <AugmentedRealityHub onUnlockBadge={handleUnlockBadge} />
        )}

        {/* VIEW 3: Gamified Quiz Arena */}
        {activeView === 'quiz' && (
          <QuizArena
            onCompleteQuiz={handleCompleteQuiz}
            onUnlockBadge={handleUnlockBadge}
            onOpenSyllabusMap={() => setActiveView('curriculum')}
          />
        )}

        {/* VIEW 4: Dedicated Cambridge & My Pals Curriculum Hub */}
        {activeView === 'curriculum' && (
          <CurriculumIntegrationHub
            onNavigateToLab={(labId) => {
              setActiveLab(labId);
              setActiveView('labs');
            }}
            onNavigateToQuiz={() => {
              setActiveView('quiz');
            }}
            onNavigateToDetective={() => {
              setActiveView('detective');
            }}
          />
        )}

        {/* VIEW 5: Detective Files */}
        {activeView === 'detective' && (
          <ScienceMystery
            onSolveMystery={handleSolveMystery}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {/* VIEW 6: Revision Cheat Sheets & Exam Answering Techniques */}
        {activeView === 'notes' && <ScienceNotes />}

        {/* VIEW 7: Dr. Atom AI Mentor */}
        {activeView === 'mentor' && <AiScienceMentor />}
      </main>

      {/* Badges Drawer Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        progress={progress}
      />

      {/* Quiet, tasteful pastel footer */}
      <footer className="border-t border-indigo-100/60 bg-white/70 backdrop-blur-xs py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
            <span>✨ SciQuest Primary 6</span>
            <span>·</span>
            <span className="font-normal text-slate-500">Bina Bangsa School Science Hub</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500 text-[11px]">
            <span className="font-semibold text-sky-900">Cambridge Primary Science (Stage 6)</span>
            <span>·</span>
            <span className="font-semibold text-amber-900">My Pals Are Here! Science P6 (Marshall Cavendish)</span>
            <span>·</span>
            <span>Earth Science, 3D Orbits & Augmented Reality</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
