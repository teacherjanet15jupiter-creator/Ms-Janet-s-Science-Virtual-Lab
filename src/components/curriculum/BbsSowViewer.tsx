import React, { useState } from 'react';
import {
  Award, BookOpen, Calendar, CheckCircle2, ChevronRight, FileText,
  HelpCircle, Layers, Move, Play, ShieldAlert, Sparkles, Zap, Leaf,
  Trees, Cpu, Moon, Clock, Compass, Printer, ExternalLink, Activity
} from 'lucide-react';
import {
  BBS_SOW_METADATA, BBS_SOW_CHAPTERS, BBS_PROCESS_SKILLS,
  BBS_ASSESSMENT_CALCULATION, BBS_MODELS_OF_INSTRUCTION, BBSSowChapter
} from '../../data/bbsSowData';
import { BinaBangsaLogo } from '../common/BinaBangsaLogo';
import { ScienceTopic } from '../../types/science';
import { soundEffects } from '../../utils/sound';

interface Props {
  onNavigateToLab: (labId: 'energy' | 'plant' | 'forces' | 'ecosystem' | 'circuit' | 'moon') => void;
  onNavigateToQuiz: (topic: ScienceTopic) => void;
}

type SowViewTab = 'term1' | 'term2' | 'term3' | 'term4' | 'process_skills' | 'assessment' | 'pedagogy';

export const BbsSowViewer: React.FC<Props> = ({ onNavigateToLab, onNavigateToQuiz }) => {
  const [activeTab, setActiveTab] = useState<SowViewTab>('term1');
  const [expandedChapter, setExpandedChapter] = useState<string | null>('bbs_ch1_forces');

  const filteredChapters = BBS_SOW_CHAPTERS.filter(ch => {
    if (activeTab === 'term1') return ch.term === 1;
    if (activeTab === 'term2') return ch.term === 2;
    if (activeTab === 'term3') return ch.term === 3;
    if (activeTab === 'term4') return ch.term === 4;
    return false;
  });

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Official BBS Document Header Banner */}
      <div className="bg-white rounded-3xl border-2 border-indigo-200/80 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Top Restricted Stamp and Approval Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-4">
            <BinaBangsaLogo variant="full" size="md" />
            <div>
              <div className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase">
                Official Curriculum Scheme of Work
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                SCIENCE — SOW PRIMARY 6
              </h1>
              <div className="text-xs text-slate-500 font-medium">
                ACADEMIC YEAR {BBS_SOW_METADATA.academicYears} · 6 Periods / Week (180 mins)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            {/* Restricted Stamp Box */}
            <div className="px-4 py-1.5 rounded-lg border-2 border-rose-600 bg-rose-50 text-rose-700 font-mono font-black text-xs tracking-widest uppercase shadow-2xs self-start sm:self-auto">
              RESTRICTED
            </div>
            <div className="text-[11px] text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              Approval Date: <span className="font-semibold text-slate-800">{BBS_SOW_METADATA.approvalDate}</span> by{' '}
              <span className="font-bold text-indigo-900">{BBS_SOW_METADATA.approvedBy}</span>
            </div>
          </div>
        </div>

        {/* Framework & Pedagogical Summary Pill */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-bold border border-blue-200">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Following MOE Singapore Science Curriculum Framework</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>CIE Cambridge Primary Checkpoint Ready (0097)</span>
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print SOW</span>
          </button>
        </div>
      </div>

      {/* SOW Tabs: Terms 1-4, Process Skills, Holistic Assessment, Pedagogy */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-indigo-100 text-xs font-bold">
        {[
          { id: 'term1', label: 'Term 1: Forces & Habitats (WA1/WA2)', badge: '20%' },
          { id: 'term2', label: 'Term 2: Food Webs, Adaptations & Man (BMT1/WA4)', badge: '20%' },
          { id: 'term3', label: 'Term 3: Energy in Food, Forms & Sources (BMT2/WA6)', badge: '20%' },
          { id: 'term4', label: 'Term 4: P6 FYE & CIE Cambridge (Exam Wk 6-7)', badge: '40%' },
          { id: 'process_skills', label: 'Science Process Skills Matrix (P1–P6)', badge: '13 Skills' },
          { id: 'assessment', label: 'Holistic Assessment & Mark Weights (100%)', badge: 'WA & BMT' },
          { id: 'pedagogy', label: '5E & Blended Learning Models', badge: 'Chew 2016' }
        ].map(t => {
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveTab(t.id as SowViewTab);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW: Term Chapters (Term 1, 2, 3, 4) */}
      {(activeTab === 'term1' || activeTab === 'term2' || activeTab === 'term3' || activeTab === 'term4') && (
        <div className="space-y-5">
          {/* Term Overview Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-indigo-950">
                {activeTab === 'term1' && 'Term 1 · Theme: INTERACTIONS · Weeks 1–10 (Enrichment in Wk 10)'}
                {activeTab === 'term2' && 'Term 2 · Theme: INTERACTIONS · Weeks 1–10 (BMT1 in Wk 4 · 3D Adaptations Model PT)'}
                {activeTab === 'term3' && 'Term 3 · Theme: INTERACTIONS & ENERGY · Weeks 1–10 (BMT2 in Wk 7 · Renewable Energy PT)'}
                {activeTab === 'term4' && 'Term 4 · P6 Final Year Exam (Wk 1-2) + CIE Cambridge Extension (Wk 3-4) + Checkpoint (Wk 6-7)'}
              </span>
            </div>
            <div className="font-mono font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
              Weight: {activeTab === 'term4' ? '40% Final Exam' : '20% Weighted Assessment'}
            </div>
          </div>

          {/* Chapters List */}
          <div className="space-y-4">
            {filteredChapters.map(chapter => {
              const isExpanded = expandedChapter === chapter.id;
              return (
                <div
                  key={chapter.id}
                  className="bg-white rounded-3xl border border-indigo-100 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Chapter Header */}
                  <div
                    onClick={() => {
                      soundEffects.playClick();
                      setExpandedChapter(isExpanded ? null : chapter.id);
                    }}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold">
                          Chapter {chapter.chapterNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono">
                          {chapter.durationWeeks}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 font-semibold border border-sky-200">
                          Theme: {chapter.theme}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-indigo-950">{chapter.title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Resources Pill */}
                      <div className="text-right text-xs hidden md:block">
                        <div className="font-bold text-slate-800">{chapter.resources.textbook}</div>
                        <div className="text-slate-500">{chapter.resources.workbook} · {chapter.resources.workout}</div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                          isExpanded ? 'rotate-90 bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 border-t border-slate-100 pt-5 space-y-5 bg-slate-50/30">
                      {/* Grid: Learning Objectives & Process Skills */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Learning Objectives (LOs) */}
                        <div className="lg:col-span-7 space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            Official Learning Objectives ({chapter.learningObjectives.length} LOs)
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-700">
                            {chapter.learningObjectives.map((lo, idx) => (
                              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                <span>{lo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Process Skills & Assessment */}
                        <div className="lg:col-span-5 space-y-4">
                          {/* Process Skills */}
                          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              Target Science Process Skills
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {chapter.processSkills.map((ps, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80"
                                >
                                  {ps}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Assessments */}
                          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <Award className="w-4 h-4 text-emerald-600" />
                              Assessments (Holistic)
                            </h4>
                            <div className="text-xs space-y-1.5">
                              <div className="font-semibold text-emerald-900">
                                Summative: {chapter.summativeAssessments.join(', ')}
                              </div>
                              <div className="text-slate-600 text-[11px]">
                                Formative: {chapter.formativeAssessments.join(' · ')}
                              </div>
                            </div>
                          </div>

                          {/* Teaching Resources */}
                          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                            <div className="font-bold text-slate-900">Assigned BBS Materials:</div>
                            <div className="text-slate-700">
                              <span className="font-semibold">Textbook:</span> {chapter.resources.textbook} |{' '}
                              <span className="font-semibold">Workbook:</span> {chapter.resources.workbook} |{' '}
                              <span className="font-semibold">WorkOut:</span> {chapter.resources.workout}
                            </div>
                            {chapter.resources.notes && (
                              <div className="text-[11px] text-slate-500 italic mt-1">{chapter.resources.notes}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SciQuest Interactive Actions */}
                      <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                          <Play className="w-4 h-4 text-indigo-600" />
                          <span>Connected SciQuest Interactive Simulations:</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {chapter.connectedLabId && (
                            <button
                              onClick={() => {
                                soundEffects.playClick();
                                onNavigateToLab(chapter.connectedLabId!);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
                            >
                              <span>Open 3D Lab Simulation</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                          {chapter.connectedQuizTopic && (
                            <button
                              onClick={() => {
                                soundEffects.playClick();
                                onNavigateToQuiz(chapter.connectedQuizTopic!);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold border border-indigo-200 transition-all shadow-2xs"
                            >
                              Practice Quiz Questions
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Science Process Skills Matrix (P1–P6) */}
      {activeTab === 'process_skills' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white border border-indigo-100 shadow-2xs space-y-2">
            <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Science Process Skills Progressive Structure (Primary 1 to Primary 6)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              As students advance through the MOE Singapore curriculum at Bina Bangsa School, skills evolve from basic sensory observations into integrated hypothesis formulation, controlled variable investigation, and creative engineering problem-solving.
            </p>
          </div>

          {/* Interactive Skills Table */}
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3.5 sm:p-4">Process Skill</th>
                  <th className="p-3.5 text-center">Category</th>
                  <th className="p-3.5 text-center font-mono">P1</th>
                  <th className="p-3.5 text-center font-mono">P2</th>
                  <th className="p-3.5 text-center font-mono">P3</th>
                  <th className="p-3.5 text-center font-mono">P4</th>
                  <th className="p-3.5 text-center font-mono">P5</th>
                  <th className="p-3.5 text-center font-mono bg-indigo-100 text-indigo-950">P6</th>
                  <th className="p-3.5 sm:p-4">Official SOW Definition & Authentic Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {BBS_PROCESS_SKILLS.map((skill, sIdx) => (
                  <tr key={sIdx} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-indigo-950 whitespace-nowrap">
                      {skill.name}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          skill.category === 'Basic'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {skill.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-400">{skill.taughtInLevels.p1 ? '✓' : '—'}</td>
                    <td className="p-3.5 text-center font-bold text-slate-400">{skill.taughtInLevels.p2 ? '✓' : '—'}</td>
                    <td className="p-3.5 text-center font-bold text-slate-400">{skill.taughtInLevels.p3 ? '✓' : '—'}</td>
                    <td className="p-3.5 text-center font-bold text-slate-400">{skill.taughtInLevels.p4 ? '✓' : '—'}</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">{skill.taughtInLevels.p5 ? '✓' : '—'}</td>
                    <td className="p-3.5 text-center font-extrabold text-indigo-700 bg-indigo-50/50">
                      {skill.taughtInLevels.p6 ? '✓' : '—'}
                    </td>
                    <td className="p-3.5 sm:p-4 max-w-md">
                      <div className="font-medium text-slate-800">{skill.definition}</div>
                      <div className="text-slate-500 italic text-[11px] mt-0.5">
                        e.g. {skill.example}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: Holistic Assessment & Mark Calculation */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {/* Assessment Breakdown Card */}
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xs p-6 space-y-4">
            <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Calculation of Marks for Primary 6 Science (Report Book & FYE)
            </h3>
            <p className="text-xs text-slate-600">
              The overall Primary 6 Science grade is determined through three Weighted Assessments (WA1, WA2, WA3) and the comprehensive Final Year Examination (FYE).
            </p>

            {/* Weights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {BBS_ASSESSMENT_CALCULATION.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center space-y-1.5"
                >
                  <div className="text-xs font-bold text-indigo-900">{item.term}</div>
                  <div className="text-2xl font-mono font-black text-indigo-950">{item.weight}</div>
                  <div className="text-[11px] font-semibold text-slate-700">{item.assessment}</div>
                  <div className="text-[10px] text-slate-500">{item.type}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold text-center">
              Total Weight: 20% (Term 1) + 20% (Term 2) + 20% (Term 3) + 40% (Term 4 FYE) = 100%
            </div>
          </div>

          {/* Vocabulary and Terminologies */}
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xs p-6 space-y-4">
            <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              BBS Science Terminologies & Examination Roles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {BBS_ASSESSMENT_CALCULATION.glossary.map((g, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-indigo-950 flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold">
                      {g.term}
                    </span>
                    <span>{g.full}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Models of Instruction (5E, Station Rotation, Flipped Classroom) */}
      {activeTab === 'pedagogy' && (
        <div className="space-y-6">
          {/* 5 E's Model */}
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xs p-6 space-y-5">
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Dr. Charles Chew (My Pals Are Here Primary Science Series 3rd Ed 2016)
              </div>
              <h3 className="text-lg font-bold text-indigo-950">The 5 E’s Instructional Model</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { phase: 'ENGAGE', color: 'from-blue-500 to-indigo-600', desc: 'Generate interest, stimulate curiosity, and raise inquiry questions.' },
                { phase: 'EXPLORE', color: 'from-sky-500 to-blue-600', desc: 'Address a problem directly using apparatus, simulations, or digital models.' },
                { phase: 'EXPLAIN', color: 'from-emerald-500 to-teal-600', desc: 'Formulate hypotheses and make sure students clearly understand concepts.' },
                { phase: 'ELABORATE', color: 'from-amber-500 to-orange-600', desc: 'Apply concepts to novel real-world situations and engineering design.' },
                { phase: 'EVALUATE', color: 'from-purple-500 to-pink-600', desc: 'Assess student understanding and self-regulation through feedback rubrics.' }
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div className={`py-1.5 px-3 rounded-xl bg-gradient-to-r ${p.color} text-white font-mono font-bold text-center text-xs tracking-wider shadow-2xs`}>
                    {p.phase}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed text-center">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Station Rotation & Flipped Classroom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xs p-6 space-y-3">
              <h4 className="text-base font-bold text-indigo-950">Station Rotation Blended Learning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students cycle across four structured stations during 6 weekly periods:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>Teacher Station</strong>: Guided inquiry, Socratic questioning, and misconception diagnostics.</li>
                <li><strong>Tech Station</strong>: SciQuest 3D Virtual Labs, AR Moon Sandbox, and quiz challenges.</li>
                <li><strong>Collaborative Station</strong>: Team poster design, 3D model prototyping (WA4), and peer debates.</li>
                <li><strong>Independent Station</strong>: My Pals Workbook (WB) and WorkOut drills.</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-indigo-100 shadow-2xs p-6 space-y-3">
              <h4 className="text-base font-bold text-indigo-950">The "Flipped Classroom"</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional roles are inverted to maximize high-impact interactive laboratory time:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>Before Class (Home)</strong>: Students review foundational theory and interactive notes.</li>
                <li><strong>During Class (In-Class)</strong>: Hands-on investigations, apparatus handling, and feedback.</li>
                <li><strong>After Class (Home)</strong>: Reflection logs, KWL completion, and self-checks.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
