import React, { useState, useEffect, useRef } from 'react';
import {
  Microscope, ZoomIn, ZoomOut, Eye, Award, CheckCircle2, RotateCcw,
  Sparkles, Layers, Sliders, Info, ShieldCheck, Download, Scan, Tag, Volume2
} from 'lucide-react';
import { soundEffects } from '../../utils/sound';

export type SpecimenType = 'plant_elodea' | 'plant_onion' | 'animal_cheek' | 'stem_xylem' | 'blood_smear';
export type ObjectiveLens = 4 | 10 | 40 | 100;

interface SpecimenSlide {
  id: SpecimenType;
  name: string;
  category: 'Plant Biology' | 'Animal Biology' | 'Plant Systems' | 'Human Systems';
  stainUsed: string;
  description: string;
  gradeLevel: 'Primary 5' | 'Primary 6' | 'Both';
  cambridgeCode: string;
  myPalsRef: string;
  labels: {
    name: string;
    description: string;
    cambridgeTip: string;
    targetPercent: { x: number; y: number }; // Percentage position inside circular field
    color: string;
    sizeUm: string;
  }[];
}

const SPECIMENS: SpecimenSlide[] = [
  {
    id: 'plant_elodea',
    name: 'Living Plant Cell (Elodea Leaf)',
    category: 'Plant Biology',
    stainUsed: 'None (Natural Live Mount in Water)',
    description: 'Fresh aquatic Elodea leaf showing rectangular cells, thick cellulose cell walls, and vivid green chloroplasts actively circulating via cytoplasmic streaming (cyclosis).',
    gradeLevel: 'Both',
    cambridgeCode: '6Bs.01 & 5Bs.03',
    myPalsRef: 'P5 Systems Unit 3 & P6 Systems Unit 1',
    labels: [
      {
        name: 'Cellulose Cell Wall',
        description: 'Tough, rigid outer boundary maintaining regular rectangular shape and structural turgidity.',
        cambridgeTip: 'Fully permeable to water and dissolved mineral salts. Made of cellulose.',
        targetPercent: { x: 32, y: 38 },
        color: '#059669',
        sizeUm: '2.5 µm thickness'
      },
      {
        name: 'Chloroplasts (Chlorophyll)',
        description: 'Green oval biconvex discs containing chlorophyll pigments for trapping sunlight energy during photosynthesis.',
        cambridgeTip: 'Notice cyclosis: chloroplasts stream around the edge of the central vacuole to maximize light exposure.',
        targetPercent: { x: 44, y: 46 },
        color: '#16A34A',
        sizeUm: '5.2 µm length'
      },
      {
        name: 'Large Central Vacuole',
        description: 'Large clear internal reservoir of cell sap (water, dissolved sugars, and mineral salts).',
        cambridgeTip: 'Maintains turgor pressure against the cell wall, preventing plant wilting.',
        targetPercent: { x: 55, y: 52 },
        color: '#0284C7',
        sizeUm: 'Occupies ~70% volume'
      },
      {
        name: 'Nucleus (Displaced)',
        description: 'Command center containing genetic material (DNA). Pushed against the cell wall by the large vacuole.',
        cambridgeTip: 'Cambridge Exam Standard: Must state "controls all cell activities and contains genetic information."',
        targetPercent: { x: 68, y: 42 },
        color: '#7C3AED',
        sizeUm: '6.8 µm diameter'
      }
    ]
  },
  {
    id: 'animal_cheek',
    name: 'Animal Cell (Human Cheek Epithelial Cells)',
    category: 'Animal Biology',
    stainUsed: 'Methylene Blue Stain',
    description: 'Human squamous epithelial cells scraped from inner cheek lining. Stained with methylene blue to reveal irregular flexible cell membranes and deep violet nuclei.',
    gradeLevel: 'Both',
    cambridgeCode: '6Bs.02 & 5Bs.03',
    myPalsRef: 'P5 Systems Unit 3 & P6 Cambridge Checkpoint',
    labels: [
      {
        name: 'Flexible Cell Membrane',
        description: 'Thin, partially permeable outer barrier that controls entry and exit of dissolved substances.',
        cambridgeTip: 'No cell wall! The flexible membrane allows animal cells to fold, flex, and change shape.',
        targetPercent: { x: 35, y: 42 },
        color: '#E11D48',
        sizeUm: '0.009 µm thickness'
      },
      {
        name: 'Spherical Nucleus',
        description: 'Prominently stained dark violet command sphere containing hereditary DNA and nucleolus.',
        cambridgeTip: 'Centrally located in animal cells (not pushed aside because there is no large permanent central vacuole).',
        targetPercent: { x: 50, y: 50 },
        color: '#7C3AED',
        sizeUm: '7.5 µm diameter'
      },
      {
        name: 'Granular Cytoplasm',
        description: 'Translucent aqueous colloid gel where metabolic chemical reactions and protein synthesis take place.',
        cambridgeTip: 'Notice the complete absence of chloroplasts and green pigment in animal tissues.',
        targetPercent: { x: 62, y: 58 },
        color: '#D97706',
        sizeUm: 'Continuous matrix'
      }
    ]
  },
  {
    id: 'stem_xylem',
    name: 'Plant Stem Cross-Section (Vascular Bundles)',
    category: 'Plant Systems',
    stainUsed: 'Safranin (Red for Xylem) & Fast Green (Blue for Phloem)',
    description: 'Transverse cut of a herbaceous plant stem showing organized vascular bundles arranged in a ring.',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Bp.01',
    myPalsRef: 'P5 Systems Unit 1: Plant Transport System (TB pp. 2–18)',
    labels: [
      {
        name: 'Xylem Vessels (Inner)',
        description: 'Large hollow tubes with thick lignified walls. Transport water and dissolved mineral salts upwards from roots to leaves.',
        cambridgeTip: 'Non-living hollow tubes with no cross walls, forming a continuous capillary pipeline.',
        targetPercent: { x: 42, y: 54 },
        color: '#DC2626',
        sizeUm: '25 – 40 µm lumen diameter'
      },
      {
        name: 'Phloem Tubes (Outer)',
        description: 'Smaller living sieve tubes. Transport dissolved food (sucrose and amino acids) manufactured in leaves in both directions.',
        cambridgeTip: 'In bark ringing experiments, removing the outer phloem layer blocks downward food flow, causing stem swelling.',
        targetPercent: { x: 64, y: 42 },
        color: '#2563EB',
        sizeUm: '8 – 15 µm diameter'
      }
    ]
  },
  {
    id: 'blood_smear',
    name: 'Human Blood Smear (Erythrocytes & Leukocytes)',
    category: 'Human Systems',
    stainUsed: 'Wright-Giemsa Differential Stain',
    description: 'Fresh blood smear showing millions of pink biconcave red blood cells and nucleated white blood cells combating infections.',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Bs.01',
    myPalsRef: 'P5 Systems Unit 2: The Human Circulatory System',
    labels: [
      {
        name: 'Red Blood Cells (Erythrocytes)',
        description: 'Biconcave circular discs filled with iron-rich hemoglobin to transport oxygen from lungs to body tissues. Lacks a nucleus to pack more hemoglobin.',
        cambridgeTip: 'Biconcave shape increases surface-area-to-volume ratio for rapid oxygen diffusion.',
        targetPercent: { x: 38, y: 44 },
        color: '#E11D48',
        sizeUm: '7.2 µm diameter'
      },
      {
        name: 'White Blood Cell (Neutrophil)',
        description: 'Larger purple-stained defense cell with multi-lobed nucleus that engulfs and destroys invading bacteria.',
        cambridgeTip: 'Has a prominent lobed nucleus, contrasting with mature red blood cells which have no nucleus.',
        targetPercent: { x: 58, y: 48 },
        color: '#7C3AED',
        sizeUm: '12 – 15 µm diameter'
      }
    ]
  }
];

export const VirtualMicroscopeLab: React.FC = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimenSlide>(SPECIMENS[0]);
  const [objective, setObjective] = useState<ObjectiveLens>(40); // 4x, 10x, 40x, 100x
  const [focusOffset, setFocusOffset] = useState<number>(0); // 0 = perfect sharp focus, -10 to +10 is blurry
  const [lightIntensity, setLightIntensity] = useState<number>(85); // 0 to 100%
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [selectedLabelIdx, setSelectedLabelIdx] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Eyepiece lens is 10x
  const totalMagnification = 10 * objective;

  // Calculate blur filter based on focusOffset
  const blurPx = Math.abs(focusOffset) * 0.45;

  // Scale factor based on objective lens
  const zoomScale = objective === 4 ? 0.75 : objective === 10 ? 1.25 : objective === 40 ? 2.3 : 3.8;

  // Calibrated micrometer bar length in µm
  const scaleBarUm = objective === 4 ? 500 : objective === 10 ? 200 : objective === 40 ? 50 : 10;

  const handleSelectObjective = (newObj: ObjectiveLens) => {
    soundEffects.playClick();
    setObjective(newObj);
    // Add slight defocus when revolving nosepiece clicks into place
    setFocusOffset(Math.round((Math.random() - 0.5) * 6));
    soundEffects.playPhaseUnlock();
  };

  const handleFineFocus = (delta: number) => {
    soundEffects.playOrbitTick();
    setFocusOffset(prev => {
      const next = Math.max(-10, Math.min(10, prev + delta));
      return next;
    });
  };

  const handleAutoTuneFocus = () => {
    soundEffects.playPhaseUnlock();
    setFocusOffset(0);
  };

  const currentLabel = selectedSpecimen.labels[selectedLabelIdx] || selectedSpecimen.labels[0];

  return (
    <div className="bg-white/95 rounded-3xl border border-emerald-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-900 shadow-2xs">
              <Microscope className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-indigo-950 tracking-tight font-serif-display flex items-center gap-2">
                <span>Virtual Compound Light Microscope</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {totalMagnification}x Magnification
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                10x Widefield Eyepiece × {objective}x DIN Achromatic Objective Lens · Cambridge Stage 5 & 6
              </p>
            </div>
          </div>
        </div>

        {/* Specimen Slide Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {SPECIMENS.map(spec => {
            const isSelected = selectedSpecimen.id === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedSpecimen(spec);
                  setSelectedLabelIdx(0);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {spec.name.split(' (')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Microscope Bench: Eyepiece Viewport (Left) + Optical Controls & Microscope Stage (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Circular Microscope Eyepiece Field of View (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[500px] aspect-square rounded-full p-3 bg-gradient-to-b from-stone-800 via-stone-900 to-black shadow-2xl border-4 border-stone-700 flex items-center justify-center select-none overflow-hidden">
            {/* Brass Eyepiece Bezel Ring */}
            <div className="absolute inset-1 rounded-full border-4 border-amber-600/40 pointer-events-none z-30" />
            <div className="absolute inset-2 rounded-full border-2 border-stone-600 pointer-events-none z-30" />

            {/* Circular Optical Aperture */}
            <div
              onMouseDown={e => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
              }}
              onMouseMove={e => {
                if (!isDragging) return;
                setPanOffset({
                  x: Math.max(-100, Math.min(100, e.clientX - dragStart.x)),
                  y: Math.max(-100, Math.min(100, e.clientY - dragStart.y))
                });
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              style={{
                filter: `blur(${blurPx}px)`,
                opacity: lightIntensity / 100,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              className="relative w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center transition-all duration-75"
            >
              {/* SPECIMEN 1: PLANT ELODEA CELL */}
              {selectedSpecimen.id === 'plant_elodea' && (
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                    transition: isDragging ? 'none' : 'transform 200ms ease-out'
                  }}
                  className="relative w-[360px] h-[360px] flex items-center justify-center"
                >
                  {/* Grid of rectangular plant cells (brickwork) */}
                  <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full p-2">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`relative rounded-sm border-2 border-emerald-700 bg-emerald-900/40 shadow-inner overflow-hidden flex items-center justify-center ${
                          i === 4 ? 'ring-2 ring-emerald-400' : ''
                        }`}
                      >
                        {/* Cellulose cell wall outline */}
                        <div className="absolute inset-0 border border-emerald-500/80 m-0.5 rounded-xs" />

                        {/* Large central vacuole */}
                        <div className="w-16 h-12 rounded-lg bg-sky-400/25 border border-sky-300/40 shadow-inner" />

                        {/* Pushed nucleus */}
                        <div className="absolute top-1 right-2 w-4 h-4 rounded-full bg-purple-700/80 border border-purple-400 flex items-center justify-center shadow-xs">
                          <div className="w-1.5 h-1.5 bg-purple-950 rounded-full" />
                        </div>

                        {/* Orbiting chloroplasts */}
                        <div className="absolute inset-1 pointer-events-none">
                          {[
                            { t: '10%', l: '15%' },
                            { t: '15%', l: '45%' },
                            { t: '20%', l: '75%' },
                            { t: '75%', l: '20%' },
                            { t: '80%', l: '50%' },
                            { t: '75%', l: '78%' },
                            { t: '45%', l: '10%' },
                            { t: '50%', l: '85%' },
                          ].map((pos, cIdx) => (
                            <div
                              key={cIdx}
                              style={{ top: pos.t, left: pos.l }}
                              className="absolute w-3 h-2 rounded-full bg-emerald-500 border border-emerald-300 shadow-2xs shadow-emerald-400/50"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPECIMEN 2: ANIMAL CHEEK EPITHELIAL CELL */}
              {selectedSpecimen.id === 'animal_cheek' && (
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                    transition: isDragging ? 'none' : 'transform 200ms ease-out'
                  }}
                  className="relative w-[360px] h-[360px] flex items-center justify-center"
                >
                  {/* Scattered irregular cheek cells with methylene blue stain */}
                  <div className="relative w-64 h-52 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] border-2 border-blue-600 bg-blue-900/35 backdrop-blur-2xs shadow-lg flex items-center justify-center">
                    {/* Granular cytoplasm texture */}
                    <div className="absolute inset-3 rounded-[40%_50%_55%_45%/45%_40%_50%_45%] bg-blue-500/10 border border-blue-400/30" />

                    {/* Deep violet-stained nucleus */}
                    <div className="w-12 h-12 rounded-full bg-indigo-800 border-2 border-indigo-400 shadow-md flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-indigo-950" />
                    </div>

                    {/* Small scattered temporary vacuoles */}
                    <div className="absolute top-6 left-8 w-3 h-3 rounded-full bg-cyan-300/40 border border-cyan-200" />
                    <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-cyan-300/40 border border-cyan-200" />
                  </div>
                </div>
              )}

              {/* SPECIMEN 3: STEM XYLEM & PHLOEM */}
              {selectedSpecimen.id === 'stem_xylem' && (
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                    transition: isDragging ? 'none' : 'transform 200ms ease-out'
                  }}
                  className="relative w-[360px] h-[360px] flex items-center justify-center"
                >
                  <div className="relative w-72 h-72 rounded-full border-4 border-stone-600 bg-stone-900/40 flex items-center justify-center">
                    {/* Ring of vascular bundles */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                      <div
                        key={deg}
                        style={{ transform: `rotate(${deg}deg) translateY(-85px)` }}
                        className="absolute flex flex-col items-center gap-1"
                      >
                        {/* Phloem (outer blue) */}
                        <div className="w-6 h-5 rounded-md bg-blue-600/80 border border-blue-400 text-[8px] font-bold text-white flex items-center justify-center shadow-xs">
                          P
                        </div>
                        {/* Cambium strip */}
                        <div className="w-7 h-1 bg-amber-400/70" />
                        {/* Xylem (inner red/hollow large vessels) */}
                        <div className="w-8 h-8 rounded-lg bg-red-700/85 border-2 border-red-400 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                          X
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPECIMEN 4: HUMAN BLOOD SMEAR */}
              {selectedSpecimen.id === 'blood_smear' && (
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                    transition: isDragging ? 'none' : 'transform 200ms ease-out'
                  }}
                  className="relative w-[360px] h-[360px] flex items-center justify-center"
                >
                  {/* Field of biconcave red blood cells */}
                  <div className="grid grid-cols-6 grid-rows-6 gap-3 p-4">
                    {[...Array(36)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
                          idx === 14
                            ? 'w-10 h-10 bg-purple-700 border-2 border-purple-300 ring-2 ring-purple-400 z-10' // White blood cell
                            : 'bg-rose-500 border border-rose-300' // Red blood cell
                        }`}
                      >
                        {idx === 14 ? (
                          <div className="flex gap-0.5">
                            <div className="w-2.5 h-2.5 bg-purple-950 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-purple-950 rounded-full" />
                          </div>
                        ) : (
                          // Biconcave dimple
                          <div className="w-3 h-3 rounded-full bg-rose-400/70 border border-rose-600/30" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Pointer Needle targeting selected label */}
              {showLabels && currentLabel && (
                <div
                  style={{
                    left: `${currentLabel.targetPercent.x}%`,
                    top: `${currentLabel.targetPercent.y}%`
                  }}
                  className="absolute pointer-events-none z-20 -translate-x-full -translate-y-1/2 flex items-center animate-in fade-in"
                >
                  <div className="bg-slate-950/90 text-white font-bold text-[10px] px-2 py-0.5 rounded border border-white/40 shadow-md whitespace-nowrap">
                    {currentLabel.name}
                  </div>
                  <div className="w-12 h-0.5 bg-amber-400 shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-amber-300 border border-black -ml-1" />
                </div>
              )}
            </div>

            {/* Lens Vignette & Eyepiece Reticle Overlay */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.92)] pointer-events-none z-25 flex items-center justify-center">
              {showReticle && (
                <>
                  {/* Fine Crosshairs */}
                  <div className="w-full h-[1px] bg-sky-300/35 absolute" />
                  <div className="h-full w-[1px] bg-sky-300/35 absolute" />
                  <div className="w-24 h-24 border border-sky-400/40 rounded-full absolute" />

                  {/* Calibrated Micrometer Scale Bar at Bottom */}
                  <div className="absolute bottom-10 flex flex-col items-center gap-1 bg-black/60 px-3 py-1 rounded-md backdrop-blur-2xs border border-white/20">
                    <div className="w-20 h-1 bg-white flex justify-between items-center">
                      <div className="w-0.5 h-2 bg-white" />
                      <div className="w-0.5 h-1.5 bg-white" />
                      <div className="w-0.5 h-2 bg-white" />
                    </div>
                    <span className="text-[10px] font-mono text-white font-bold tracking-wider">
                      {scaleBarUm} µm
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Ocular Status Bar */}
          <div className="mt-3 flex items-center justify-between w-full max-w-[500px] text-xs font-mono text-slate-500 px-2">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${Math.abs(focusOffset) <= 1 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{Math.abs(focusOffset) <= 1 ? 'SHARP FOCUS (100%)' : `DEFOCUSED (${Math.abs(focusOffset) * 10}%)`}</span>
            </span>
            <span>FIELD: ⌀ {(1800 / objective).toFixed(0)} µm</span>
          </div>
        </div>

        {/* Right: Microscope Controls & Specimen Anatomy Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* Revolving Nosepiece: Objective Lenses */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Revolving Nosepiece (Objective Lens):</span>
              </span>
              <span className="text-emerald-900 font-mono text-[11px] bg-emerald-100 px-2 py-0.5 rounded-md">
                Total: {totalMagnification}x
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { mag: 4 as ObjectiveLens, color: 'border-red-500', label: '4x Scan', total: '40x' },
                { mag: 10 as ObjectiveLens, color: 'border-yellow-500', label: '10x Low', total: '100x' },
                { mag: 40 as ObjectiveLens, color: 'border-blue-500', label: '40x High', total: '400x' },
                { mag: 100 as ObjectiveLens, color: 'border-white', label: '100x Oil', total: '1,000x' },
              ].map(item => {
                const isSelected = objective === item.mag;
                return (
                  <button
                    key={item.mag}
                    onClick={() => handleSelectObjective(item.mag)}
                    className={`py-2 px-1.5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-slate-900 text-white border-emerald-500 shadow-xs font-bold scale-[1.02]'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full border mb-1 ${item.color} ${isSelected ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    <span className="font-bold text-[11px]">{item.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{item.total}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coarse & Fine Focus Knobs */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Fine Focus Adjustment Knob:</span>
              <button
                onClick={handleAutoTuneFocus}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline"
              >
                Auto-Focus
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleFineFocus(-1)}
                className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold active:scale-95"
              >
                -
              </button>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={focusOffset}
                onChange={e => setFocusOffset(Number(e.target.value))}
                className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <button
                onClick={() => handleFineFocus(1)}
                className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold active:scale-95"
              >
                +
              </button>
            </div>

            {/* Light Intensity Dimmer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-600 font-medium">Substage Lamp Brightness:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={lightIntensity}
                  onChange={e => setLightIntensity(Number(e.target.value))}
                  className="w-24 accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-[10px] text-slate-600">{lightIntensity}%</span>
              </div>
            </div>
          </div>

          {/* Interactive Organelle Pointer Selector */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <div className="font-bold text-indigo-950 flex items-center justify-between">
              <span>Inspect Organelle Under Pointer:</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {selectedSpecimen.stainUsed}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedSpecimen.labels.map((lbl, idx) => (
                <button
                  key={lbl.name}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedLabelIdx(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    selectedLabelIdx === idx
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {lbl.name.split(' (')[0]}
                </button>
              ))}
            </div>

            {/* Organelle Callout Card */}
            {currentLabel && (
              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs space-y-1.5 mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentLabel.color }} />
                    <span>{currentLabel.name}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">{currentLabel.sizeUm}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {currentLabel.description}
                </p>
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <strong>Exam Pointer: </strong>{currentLabel.cambridgeTip}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
