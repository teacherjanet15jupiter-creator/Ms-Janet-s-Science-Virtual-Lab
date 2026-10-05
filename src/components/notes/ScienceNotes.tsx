import React, { useState } from 'react';
import { BookOpen, Search, CheckCircle2, ChevronDown, ChevronRight, Zap, Leaf, Move, Cpu, Trees, Activity, Award, Sparkles } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface NoteItem {
  id: string;
  topic: string;
  gradeLevel?: 'Primary 5' | 'Primary 6';
  cambridgeCode: string;
  myPalsRef: string;
  title: string;
  p6Rule: string;
  formulaOrKeyword: string;
  commonMistake: string;
  modelAnswerExample: string;
  twsTip?: string;
}

const NOTES_DATA: NoteItem[] = [
  // Primary 5 Science Core Concepts
  {
    id: 'n_p5_reproduction_plants',
    topic: 'Reproduction',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Bs.02',
    myPalsRef: 'My Pals 5B Theme: Cycles (Unit 2: Reproduction in Plants, pp. 28–49)',
    title: 'P5: Pollination vs Fertilisation & Seed Dispersal',
    p6Rule: 'Pollination is the physical transfer of pollen from anther to stigma. Fertilisation is the fusion of male and female sex cells inside the ovule to produce seeds.',
    formulaOrKeyword: 'Stamen (Anther + Filament) = Male | Pistil/Carpel (Stigma + Style + Ovary + Ovule) = Female',
    commonMistake: 'Writing that fertilisation happens on the stigma or confusing seed dispersal with pollination.',
    modelAnswerExample: '"Pollination occurs when pollen grains are transferred from anther to stigma. Fertilisation occurs when the male reproductive cell travels down the pollen tube and fuses with the egg cell inside the ovule."',
    twsTip: 'Dispersal adaptations: Wind (feathery parachutes/wings), Animals (hooks/fleshy fruits), Water (fibrous waterproof husks), Explosive action (drying pods splitting open).'
  },
  {
    id: 'n_p5_water_states',
    topic: 'Water Cycle',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Es.01',
    myPalsRef: 'My Pals 5B Theme: Cycles (Unit 1: Water and Changes of State, pp. 2–27)',
    title: 'P5: Water Changes of State & Rate of Evaporation',
    p6Rule: 'Evaporation is liquid water absorbing heat to become water vapour at ANY temperature below boiling. Condensation is water vapour losing heat to become liquid droplets.',
    formulaOrKeyword: 'Factors increasing evaporation: Higher temperature, larger exposed surface area, wind presence, lower humidity.',
    commonMistake: 'Claiming that liquid leaked through cold glass, or that cold air turned directly into water.',
    modelAnswerExample: '"Warmer water vapour in the surrounding air comes into contact with the cooler surface of the container, loses heat to the cool surface, and condenses into liquid water droplets."',
    twsTip: 'Experimental control: When testing the effect of surface area on evaporation, keep starting water volume, liquid temperature, and wind exposure constant.'
  },
  {
    id: 'n_p5_circulatory',
    topic: 'Circulatory System',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Bs.01',
    myPalsRef: 'My Pals 5A Theme: Systems (Unit 2: The Human Circulatory System, pp. 19–37)',
    title: 'P5: Human Circulatory System & Exercise Response',
    p6Rule: 'The heart is a muscular pump. Oxygen-rich blood from lungs goes to heart then body; oxygen-poor blood returns from body to heart then lungs.',
    formulaOrKeyword: 'Heart + Blood Vessels (Arteries, Veins, Capillaries) + Blood (RBC, WBC, Platelets, Plasma)',
    commonMistake: 'Saying the heart pumps air or that arteries carry pure oxygen bubbles.',
    modelAnswerExample: '"During exercise, muscle cells respire faster and need more energy. The heart beats faster to pump more oxygen and digested food to muscle cells, and to carry away carbon dioxide faster."',
    twsTip: 'Pulse measurement: Measure resting heart rate for 1 minute before exercise, immediately after, and at 2-minute intervals until recovery to baseline.'
  },
  {
    id: 'n_p5_cells',
    topic: 'Cell System',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Bs.03',
    myPalsRef: 'My Pals 5A Theme: Systems (Unit 3: The Cell System, pp. 38–58)',
    title: 'P5: Cell as the Basic Unit of Life (Plant vs Animal)',
    p6Rule: 'All living things are made of cells. Plant cells have a rigid cellulose cell wall and chloroplasts; animal cells have neither.',
    formulaOrKeyword: 'Plant Only: Cell Wall, Chloroplasts, Large Central Vacuole. Both: Cell Membrane, Cytoplasm, Nucleus.',
    commonMistake: 'Saying all plant cells have chloroplasts. Root cells and onion bulb cells do NOT have chloroplasts because they grow in the dark underground.',
    modelAnswerExample: '"Under a microscope, the Elodea plant cell has a regular rectangular cell wall and green chloroplasts, while the cheek animal cell has an irregular flexible shape and lacks both cell wall and chloroplasts."',
    twsTip: 'Staining cells: Methylene blue stains cheek cell nuclei; Iodine solution stains plant cell walls and starch granules.'
  },

  // Primary 6 Science Core Concepts
  {
    id: 'n_energy_1',
    topic: 'Energy',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Pf.01 & 6Pf.02',
    myPalsRef: 'My Pals 6A Theme: Energy (Unit 2 & 3, pp. 42–71)',
    title: 'P6: Principle of Conservation of Energy & "Lost" Energy',
    p6Rule: 'Energy CANNOT be created or destroyed. It can only be converted from one form to another.',
    formulaOrKeyword: 'Total Energy = GPE + KE + Heat + Sound',
    commonMistake: 'Writing "energy was lost" or "energy was destroyed" when a roller coaster or bouncing ball slows down.',
    modelAnswerExample: '"Some of the kinetic energy was converted into heat energy and sound energy due to friction between the ball and the floor."',
    twsTip: 'In Cambridge exams: Always explicitly identify the force (friction/air resistance) that causes mechanical energy to transform into thermal energy.'
  },
  {
    id: 'n_forces_1',
    topic: 'Forces',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Pf.03 & 6Pf.04',
    myPalsRef: 'My Pals 6A Theme: Interactions (Unit 1, pp. 2–39)',
    title: 'P6: Balanced vs Unbalanced Forces & Friction',
    p6Rule: 'When forces are balanced, an object remains stationary or moves at constant speed. When forces are unbalanced, it accelerates.',
    formulaOrKeyword: 'Frictional Force opposes the direction of motion.',
    commonMistake: 'Thinking heavier objects fall faster in a vacuum; air resistance (frictional force) is what slows down falling objects in air.',
    modelAnswerExample: '"As surface X is rougher, there was more friction between the block and surface X, requiring a greater pulling force to overcome friction."',
    twsTip: 'In fair testing (TWS 6TWSp.01): The independent variable is the surface texture; keep block mass, contact surface area, and pulling speed constant!'
  },
  {
    id: 'n_plant_1',
    topic: 'Plant Transport',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Bp.01 & 6Bp.02',
    myPalsRef: 'My Pals 6B Theme: Systems (Unit 1, pp. 1–28)',
    title: 'P6: Xylem vs Phloem Transport & Bark Ringing',
    p6Rule: 'Xylem transports water & minerals UPWARDS from roots. Phloem transports food (sugars) BOTH WAYS from leaves.',
    formulaOrKeyword: 'Xylem = Inner vessel (Water). Phloem = Outer vessel (Food).',
    commonMistake: 'Confusing the position of xylem and phloem in stem ring experiments.',
    modelAnswerExample: '"Removing the outer bark removed the phloem tubes. Food made by the leaves could not be transported down to the roots, so it accumulated above the cut, causing the stem to swell."',
    twsTip: 'Cambridge Checkpoint keywords: transpiration stream, capillary action, evaporation through stomatal pores.'
  },
  {
    id: 'n_circuits_1',
    topic: 'Circuits',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Pe.01 & 6Pe.02',
    myPalsRef: 'My Pals 5A & 6B Theme: Systems (Unit 3, pp. 122–165)',
    title: 'P6: Series vs Parallel Circuit Resilience & Brightness',
    p6Rule: 'In parallel, each branch is an independent closed circuit. In series, all components share a single loop.',
    formulaOrKeyword: 'Parallel: Bulbs shine brightly and independently. Series: Shared voltage, dimmer bulbs.',
    commonMistake: 'Thinking parallel bulbs drain batteries slower; in parallel, more current is drawn so batteries deplete faster!',
    modelAnswerExample: '"In a parallel circuit, if bulb A fuses, branch B remains a closed loop with the battery, so bulb B remains lit with the same brightness."',
    twsTip: 'Cambridge Circuit standard: Use standard IEC symbols (circle with cross for lamp, long/short parallel lines for cell, open switch gap).'
  },
  {
    id: 'n_eco_1',
    topic: 'Ecosystems',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Be.01 & 6Be.02',
    myPalsRef: 'My Pals 6A Theme: Interactions (Unit 2, pp. 74–120)',
    title: 'P6: Energy Flow & The 10% Trophic Rule',
    p6Rule: 'Energy flows in ONE direction and is not recycled. Only ~10% of energy is transferred to the next consumer.',
    formulaOrKeyword: 'Sunlight → Producers → Primary Consumers → Predators',
    commonMistake: 'Saying energy is recycled by decomposers. Decomposers recycle minerals and nutrients, NOT energy!',
    modelAnswerExample: '"As energy is lost as heat and used for respiration at each trophic level, less energy is available for the next consumer, limiting the length of the food chain."',
    twsTip: 'Cambridge TWS 6TWSe.01: Bioaccumulation—non-biodegradable toxins (e.g. DDT, microplastics) increase in concentration up the food pyramid.'
  },
  {
    id: 'n_human_1',
    topic: 'Human Systems',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Bs.01 & 6Bs.02',
    myPalsRef: 'My Pals 6B Theme: Systems (Unit 2, pp. 32–64)',
    title: 'P6: Circulatory & Respiratory Gaseous Exchange',
    p6Rule: 'Lungs exchange O2 and CO2 across alveoli. The heart pumps oxygen-rich blood to the body and oxygen-poor blood to lungs.',
    formulaOrKeyword: 'Inhaled: 21% O2, 0.04% CO2 | Exhaled: 16% O2, 4% CO2',
    commonMistake: 'Saying exhaled air has no oxygen. Exhaled air still has ~16% oxygen!',
    modelAnswerExample: '"Blood leaving the lungs is oxygen-rich. As it travels to muscle cells, oxygen is used for cellular respiration to release energy, so blood returning to the heart is oxygen-poor."',
    twsTip: 'Connecting Systems (My Pals): Respiratory system takes in O2; Circulatory system transports O2; Digestive system supplies glucose for cellular respiration.'
  }
];

export const ScienceNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'cambridge_symbols' | 'mypals_themes'>('concepts');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'Primary 5' | 'Primary 6'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('n_p5_reproduction_plants');

  const filteredNotes = NOTES_DATA.filter(n => {
    if (gradeFilter !== 'all' && n.gradeLevel && n.gradeLevel !== gradeFilter) return false;
    return (
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.p6Rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.formulaOrKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.cambridgeCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-white/95 rounded-3xl border border-emerald-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-emerald-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-sky-50/60">
          <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-200/80 text-emerald-950 shadow-2xs">
              <BookOpen className="w-4 h-4 fill-emerald-700" />
            </span>
            <h2 className="text-lg font-bold text-emerald-950 tracking-tight">
              Primary 5 & 6 Science Revision Cheat Sheets & Exam Answering Techniques
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aligned with Cambridge Primary Science (Stages 5 & 6) and My Pals Are Here! Science (5A/5B & 6A/6B).
          </p>
        </div>

        {/* Right side: Grade level filter & Search Input */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-white/90 rounded-xl border border-emerald-200 shadow-2xs gap-1">
            {(['all', 'Primary 5', 'Primary 6'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  soundEffects.playClick();
                  setGradeFilter(lvl);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  gradeFilter === lvl
                    ? lvl === 'Primary 5'
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                      : lvl === 'Primary 6'
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-800 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'All Grades' : lvl}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-emerald-600/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search syllabus keywords..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-emerald-100 bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 text-emerald-950 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('concepts');
          }}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'concepts'
              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
              : 'text-slate-600 hover:text-emerald-900 bg-slate-50'
          }`}
        >
          C-E-O Core Concept Cards
        </button>
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('cambridge_symbols');
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'cambridge_symbols'
              ? 'bg-sky-600 text-white font-bold shadow-2xs'
              : 'text-slate-600 hover:text-sky-900 bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Cambridge Stage 6 Symbols & SI Units</span>
        </button>
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('mypals_themes');
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'mypals_themes'
              ? 'bg-amber-600 text-white font-bold shadow-2xs'
              : 'text-slate-600 hover:text-amber-900 bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>My Pals Are Here! Themes</span>
        </button>
      </div>

      {activeTab === 'concepts' && (
        <div>
          {/* C-E-O Answering Framework Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white m-6 rounded-3xl shadow-sm border border-indigo-900/60">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                My Pals & Cambridge Golden Answering Strategy: The C-E-O Framework
              </h3>
              <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-sky-200">
                Full Marks Section B
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              For open-ended questions in both Cambridge Checkpoint and My Pals School exams, examiners award maximum points when you state all 3 components:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="font-bold text-sky-300">1. Cause (Science Principle)</div>
                <div className="text-slate-200 text-[11px] mt-1 leading-relaxed">
                  Name the exact scientific law or vessel (e.g. friction opposes motion, xylem transports water upwards).
                </div>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="font-bold text-emerald-300">2. Effect (Physical Change)</div>
                <div className="text-slate-200 text-[11px] mt-1 leading-relaxed">
                  Explain what physical change occurred in the experiment (e.g. kinetic energy converted into heat/sound).
                </div>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="font-bold text-amber-300">3. Observation (Result)</div>
                <div className="text-slate-200 text-[11px] mt-1 leading-relaxed">
                  Directly answer the question stem (e.g. ball bounces lower, stem swells above ring, bulb remains lit).
                </div>
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <div className="p-6 space-y-3 pt-0">
            {filteredNotes.map(note => {
              const isExpanded = expandedId === note.id;

              return (
                <div
                  key={note.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setExpandedId(isExpanded ? null : note.id);
                    }}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {note.topic}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900">
                        Cambridge: {note.cambridgeCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 space-y-3.5 text-xs border-t border-emerald-100/60 mt-1">
                      <div className="text-[11px] font-medium text-amber-800 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                        📘 <strong>Textbook Reference:</strong> {note.myPalsRef}
                      </div>

                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-900 block mb-1">Golden Exam Concept:</span>
                        <p className="text-slate-700 leading-relaxed">{note.p6Rule}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          <span className="font-bold text-indigo-900 block mb-1">Key Formula or Keyword:</span>
                          <span className="font-mono text-[11px] text-indigo-700 font-semibold">{note.formulaOrKeyword}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 shadow-2xs">
                          <span className="font-bold text-rose-900 block mb-1">Common Student Pitfall:</span>
                          <span className="text-slate-600 text-[11px] leading-relaxed">{note.commonMistake}</span>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Full Marks Model Answer (C-E-O Structure):
                        </span>
                        <p className="text-slate-700 italic font-serif leading-relaxed text-xs">
                          {note.modelAnswerExample}
                        </p>
                      </div>

                      {note.twsTip && (
                        <div className="p-2.5 rounded-xl bg-sky-50 text-[11px] text-sky-900 border border-sky-100">
                          🎓 <strong>Cambridge Checkpoint Tip:</strong> {note.twsTip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cambridge Standard Symbols & SI Units */}
      {activeTab === 'cambridge_symbols' && (
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
            <div className="font-bold text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>Cambridge Primary Science Stage 6 Standard Conventions</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Cambridge assessments mandate the use of standard SI units, fair-test variables terminology, and standard electrical schematic symbols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Units Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <h4 className="font-bold text-indigo-950 border-b pb-2">Cambridge Primary SI Units</h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Force</span>
                  <span className="font-mono font-bold text-indigo-900">Newtons (N)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Energy & Work</span>
                  <span className="font-mono font-bold text-indigo-900">Joules (J)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Mass</span>
                  <span className="font-mono font-bold text-indigo-900">Grams (g) / Kilograms (kg)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Electric Potential (Voltage)</span>
                  <span className="font-mono font-bold text-indigo-900">Volts (V)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Electric Current</span>
                  <span className="font-mono font-bold text-indigo-900">Amperes (A)</span>
                </div>
              </div>
            </div>

            {/* Circuit Symbols Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <h4 className="font-bold text-indigo-950 border-b pb-2">Cambridge Circuit Symbols</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="font-mono font-bold text-indigo-900">---| |---</div>
                  <div className="text-slate-600">Single Cell</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="font-mono font-bold text-indigo-900">---( X )---</div>
                  <div className="text-slate-600">Lamp / Bulb</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="font-mono font-bold text-indigo-900">---/ ---</div>
                  <div className="text-slate-600">Open Switch</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <div className="font-mono font-bold text-indigo-900">---[ ~ ]---</div>
                  <div className="text-slate-600">Safety Fuse</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Pals Science Themes */}
      {activeTab === 'mypals_themes' && (
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="font-bold text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>My Pals Are Here! Science (Marshall Cavendish) Core Themes</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The Singapore Primary Science syllabus groups all biological and physical phenomena under 5 overarching themes: <strong>Energy</strong>, <strong>Interactions</strong>, <strong>Systems</strong>, <strong>Cycles</strong>, and <strong>Diversity</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-amber-100 space-y-2 shadow-2xs">
              <h4 className="font-bold text-amber-950">Theme: Energy (P6)</h4>
              <p className="text-slate-600 leading-relaxed">
                Forms of energy (kinetic, potential, light, heat, electrical, sound). Conservation of energy: total energy remains constant while converting between forms. Sun as primary energy source for food chains.
              </p>
              <div className="text-[11px] font-mono text-amber-800 bg-amber-50 p-1.5 rounded">
                Textbook 6A Chapters 2 & 3
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-blue-100 space-y-2 shadow-2xs">
              <h4 className="font-bold text-blue-950">Theme: Interactions (P6)</h4>
              <p className="text-slate-600 leading-relaxed">
                Forces (gravitational, frictional, magnetic, elastic spring). Living Together: populations, communities, food webs, ecological balance, structural & behavioural adaptations.
              </p>
              <div className="text-[11px] font-mono text-blue-800 bg-blue-50 p-1.5 rounded">
                Textbook 6A Chapters 1, 4 & 5
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-2xs">
              <h4 className="font-bold text-emerald-950">Theme: Systems (P5/P6)</h4>
              <p className="text-slate-600 leading-relaxed">
                Plant transport systems (xylem, phloem, stomata). Human systems (circulatory, respiratory, digestive). Electrical systems (series and parallel circuits, fuses, conductivity).
              </p>
              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-1.5 rounded">
                Textbook 6B Chapters 1 & 2 · Textbook 5A Chapter 3
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2 shadow-2xs">
              <h4 className="font-bold text-purple-950">Theme: Cycles (P5/P6)</h4>
              <p className="text-slate-600 leading-relaxed">
                Water cycle (evaporation, condensation, clouds). Life cycles and reproduction in flowering plants (pollination, fertilization, seed dispersal) and human reproduction.
              </p>
              <div className="text-[11px] font-mono text-purple-800 bg-purple-50 p-1.5 rounded">
                Textbook 5B Chapters 1 & 2
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
