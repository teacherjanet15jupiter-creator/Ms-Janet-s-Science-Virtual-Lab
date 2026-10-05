import React, { useState } from 'react';
import {
  BookOpen, Award, Sparkles, CheckCircle2, ChevronRight, Zap, Leaf, Move, Trees, Cpu,
  Activity, Play, Search, HelpCircle, Layers, CheckSquare, Square, Download, Share2, Moon
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../../data/curriculumData';
import { ScienceTopic } from '../../types/science';
import { soundEffects } from '../../utils/sound';

interface Props {
  onNavigateToLab: (labId: 'energy' | 'plant' | 'forces' | 'ecosystem' | 'circuit' | 'moon') => void;
  onNavigateToQuiz: (topic: ScienceTopic) => void;
  onNavigateToDetective: (mysteryId?: string) => void;
}

type HubTab = 'overview' | 'cambridge' | 'mypals' | 'lesson5e' | 'checklist';

export const CurriculumIntegrationHub: React.FC<Props> = ({
  onNavigateToLab,
  onNavigateToQuiz,
  onNavigateToDetective,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('overview');
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic | 'all'>('all');
  const [completedCompetencies, setCompletedCompetencies] = useState<string[]>(() => {
    const saved = localStorage.getItem('sciquest_completed_competencies');
    return saved ? JSON.parse(saved) : ['comp_energy_1', 'comp_plant_1', 'comp_forces_2'];
  });

  const handleToggleCompetency = (compId: string) => {
    soundEffects.playClick();
    setCompletedCompetencies(prev => {
      const next = prev.includes(compId)
        ? prev.filter(id => id !== compId)
        : [...prev, compId];
      localStorage.setItem('sciquest_completed_competencies', JSON.stringify(next));
      if (!prev.includes(compId)) {
        soundEffects.playCorrect();
      }
      return next;
    });
  };

  const allCompetenciesCount = CURRICULUM_MODULES.reduce(
    (acc, m) => acc + m.competencies.length,
    0
  );
  const masteryPercentage = Math.round((completedCompetencies.length / allCompetenciesCount) * 100);

  const filteredModules = selectedTopic === 'all'
    ? CURRICULUM_MODULES
    : CURRICULUM_MODULES.filter(m => m.topic === selectedTopic);

  const getTopicIcon = (topic: ScienceTopic) => {
    switch (topic) {
      case 'energy': return Zap;
      case 'plant_transport': return Leaf;
      case 'forces': return Move;
      case 'ecosystems': return Trees;
      case 'circuits': return Cpu;
      case 'circulatory_respiratory': return Activity;
      case 'earth_space': return Moon;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Dual Curriculum Integration Hub */}
      <div className="bg-gradient-to-r from-amber-50/90 via-sky-50/80 to-indigo-50/90 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm relative overflow-hidden backdrop-blur-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-300/80 text-sky-950 text-xs font-bold shadow-2xs">
                <Award className="w-3.5 h-3.5 text-sky-600" />
                <span>Cambridge Primary Science Stage 6</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>My Pals Are Here! Science P6 (Marshall Cavendish)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight font-serif-display">
              Cambridge & My Pals Science Curriculum Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every virtual lab, quiz, and detective scenario in SciQuest is precisely aligned with
              <strong> Cambridge Primary Stage 6 Learning Objectives</strong> and
              <strong> My Pals Are Here! Science P6 Chapters</strong> for seamless classroom lessons, homework, and exam preparation.
            </p>
          </div>

          {/* Mastery Card */}
          <div className="p-4 bg-white/95 rounded-2xl border border-indigo-100/80 shadow-xs text-center shrink-0 w-full sm:w-56 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Syllabus Competencies
            </div>
            <div className="text-3xl font-extrabold text-indigo-950 font-mono">
              {masteryPercentage}%
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${masteryPercentage}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              />
            </div>
            <div className="text-[11px] text-slate-500">
              {completedCompetencies.length} of {allCompetenciesCount} objectives mastered
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for the Hub */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Interactive Syllabus Matrix', icon: Layers },
            { id: 'cambridge', label: 'Cambridge Stage 6 View', icon: Award },
            { id: 'mypals', label: 'My Pals P6 Chapter View', icon: BookOpen },
            { id: 'lesson5e', label: "Teacher 5E Lesson Guide", icon: Sparkles },
            { id: 'checklist', label: 'Student "I Can" Checklist', icon: CheckSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab(tab.id as HubTab);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Topic filter for views that support it */}
        {activeTab !== 'checklist' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1 hidden sm:inline">Filter:</span>
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                selectedTopic === 'all'
                  ? 'bg-indigo-100 text-indigo-900 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Topics
            </button>
            {CURRICULUM_MODULES.map(m => (
              <button
                key={m.topic}
                onClick={() => setSelectedTopic(m.topic)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap ${
                  selectedTopic === m.topic
                    ? 'bg-indigo-100 text-indigo-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {m.myPalsTheme}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Dual Interactive Syllabus Matrix */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredModules.map(module => {
              const Icon = getTopicIcon(module.topic);
              return (
                <div
                  key={module.id}
                  className="bg-white/95 rounded-3xl border border-indigo-100/90 shadow-2xs p-5 sm:p-6 hover:shadow-xs transition-shadow space-y-4"
                >
                  {/* Top Bar of Module Card */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 shadow-2xs shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
                          <span>{module.title}</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {module.myPalsTheme}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inquiry: "{module.keyInquiryQuestion}"
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {module.labId && (
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            onNavigateToLab(module.labId!);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-200 transition-colors shadow-2xs"
                        >
                          <Play className="w-3 h-3 fill-indigo-800" />
                          <span>Launch {module.labTitle.split(' ')[0]} Lab</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          onNavigateToQuiz(module.topic);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors shadow-2xs"
                      >
                        <Award className="w-3 h-3 text-amber-700" />
                        <span>Quiz Quest</span>
                      </button>
                    </div>
                  </div>

                  {/* Dual Alignment Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Cambridge Box */}
                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sky-950 text-xs flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-sky-600" />
                          <span>Cambridge Primary Stage 6</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-800">
                          {module.cambridgeCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-sky-900">Official Objective:</strong> {module.cambridgeObjective}
                      </div>
                      <div className="text-[11px] text-sky-900/90 bg-white/80 p-2 rounded-xl border border-sky-100 font-medium">
                        🔬 <strong>TWS Enquiry Skill:</strong> {module.cambridgeTws}
                      </div>
                    </div>

                    {/* My Pals Science Box */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>My Pals Are Here! Science P6</span>
                        </div>
                        <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800">
                          {module.myPalsBook}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-amber-900">Chapter & Pages:</strong> {module.myPalsUnit} ({module.myPalsPages})
                      </div>
                      <div className="text-[11px] text-amber-900/90 bg-white/80 p-2 rounded-xl border border-amber-100 font-medium">
                        📝 <strong>Workbook Practice:</strong> {module.myPalsWorkbookActivity}
                      </div>
                    </div>
                  </div>

                  {/* Vocabulary Tags */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Key Vocabulary:
                    </span>
                    {module.coreVocabulary.map((vocab, vIdx) => (
                      <span
                        key={vIdx}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {vocab}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Cambridge Stage 6 Focus */}
      {activeTab === 'cambridge' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-3">
            <Award className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Cambridge Primary Science Curriculum Framework (Stage 6)</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Cambridge assessments test conceptual scientific knowledge, scientific enquiry (Thinking & Working Scientifically),
                fair testing, interpreting experimental tables, and evaluating evidence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                    {m.cambridgeCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{m.cambridgeStrand}</span>
                </div>
                <h4 className="text-sm font-bold text-indigo-950">{m.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.cambridgeObjective}</p>
                <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-[11px] text-sky-900">
                  <strong>Thinking and Working Scientifically (TWS):</strong>
                  <div className="mt-0.5 text-slate-600">{m.cambridgeTws}</div>
                </div>
                {m.labId && (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onNavigateToLab(m.labId!);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-2xs transition-all"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run Cambridge Simulation in {m.labTitle}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: My Pals Are Here! Science P6 View */}
      {activeTab === 'mypals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">My Pals Are Here! Science (Marshall Cavendish) P6 Syllabus</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Organized across 4 core primary themes: <strong>Energy</strong>, <strong>Interactions</strong>,
                <strong> Systems</strong>, and <strong>Cycles</strong>. Focuses on inquiry-based learning,
                cause-effect analysis, and open-ended answering precision (C-E-O method).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    Theme: {m.myPalsTheme}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{m.myPalsBook}</span>
                </div>
                <h4 className="text-sm font-bold text-indigo-950">{m.myPalsUnit}</h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Textbook:</strong> {m.myPalsPages}</div>
                  <div><strong>Workbook:</strong> {m.myPalsWorkbookActivity}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-[11px] text-amber-900">
                  <strong>Common Student Misconception:</strong>
                  <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                    {m.misconceptionsToAddress.map((misc, idx) => (
                      <li key={idx}>{misc}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onNavigateToQuiz(m.topic);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-all"
                >
                  <Award className="w-3 h-3 text-white" />
                  <span>Practice My Pals Open-Ended Quiz</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Teacher Janet's 5E Lesson Guide */}
      {activeTab === 'lesson5e' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
            <div className="font-bold text-sm flex items-center gap-2">
              <span>👩‍🏫 Teacher Janet's Cambridge 5E Instructional Lesson Plan</span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Use this framework for 40-minute and 80-minute science periods. It bridges the textbook inquiry phase
              with virtual laboratory experimentation and formative assessment.
            </p>
          </div>

          <div className="space-y-4">
            {filteredModules.map(m => (
              <div key={m.id} className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-indigo-950">{m.title}</h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Cambridge: {m.cambridgeCode} · My Pals: {m.myPalsTheme} ({m.myPalsBook})
                    </span>
                  </div>
                  {m.labId && (
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onNavigateToLab(m.labId!);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-bold hover:bg-indigo-100"
                    >
                      Open {m.labTitle}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 space-y-1">
                    <div className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">1. Engage</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">{m.lesson5E.engage}</div>
                  </div>
                  <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200/70 space-y-1">
                    <div className="font-bold text-sky-900 uppercase text-[10px] tracking-wider">2. Explore</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">{m.lesson5E.explore}</div>
                  </div>
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200/70 space-y-1">
                    <div className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider">3. Explain</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">{m.lesson5E.explain}</div>
                  </div>
                  <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200/70 space-y-1">
                    <div className="font-bold text-teal-900 uppercase text-[10px] tracking-wider">4. Elaborate</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">{m.lesson5E.elaborate}</div>
                  </div>
                  <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/70 space-y-1">
                    <div className="font-bold text-rose-900 uppercase text-[10px] tracking-wider">5. Evaluate</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">{m.lesson5E.evaluate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Student "I Can" Competency Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-white/95 rounded-3xl border border-emerald-100 p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Primary 6 Self-Assessment & Competency Checklist
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check off each learning outcome as you complete the virtual lab experiments and quiz challenges.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  {completedCompetencies.length} of {allCompetenciesCount} completed ({masteryPercentage}%)
                </span>
              </div>
            </div>

            {/* Competency Modules */}
            <div className="space-y-6 pt-2">
              {CURRICULUM_MODULES.map(m => (
                <div key={m.id} className="border-t border-slate-100 pt-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                      <span>{m.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">({m.cambridgeCode})</span>
                    </h4>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {m.myPalsTheme}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {m.competencies.map(comp => {
                      const isDone = completedCompetencies.includes(comp.id);
                      return (
                        <button
                          key={comp.id}
                          onClick={() => handleToggleCompetency(comp.id)}
                          className={`text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                            isDone
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                              : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </span>
                          <div className="space-y-1">
                            <p className="text-xs leading-snug">{comp.statement}</p>
                            <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 bg-white/80 rounded border border-slate-200/60 text-slate-500">
                              {comp.curriculumTag} Syllabus
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
