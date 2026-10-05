import React, { useState } from 'react';
import { Move, Layers, Scale, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface Props {
  onRecordExperiment?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

type SurfaceType = 'ice' | 'wood' | 'sandpaper' | 'rubber';

const SURFACES: Record<SurfaceType, { name: string; frictionCoef: number; color: string; desc: string }> = {
  ice: { name: 'Ice / Polished Teflon', frictionCoef: 0.1, color: '#BAE6FD', desc: 'Minimal microscopic interlocking. Very low friction.' },
  wood: { name: 'Smooth Polished Wood', frictionCoef: 0.35, color: '#FDE68A', desc: 'Standard classroom surface. Moderate friction.' },
  sandpaper: { name: 'Rough Sandpaper (Grit 80)', frictionCoef: 0.75, color: '#D6D3D1', desc: 'High roughness. Many microscopic ridges interlock.' },
  rubber: { name: 'Textured Tread Rubber', frictionCoef: 0.95, color: '#475569', desc: 'High grip adhesive contact. Maximum friction.' }
};

export const ForcesFrictionLab: React.FC<Props> = ({ onRecordExperiment, onUnlockBadge }) => {
  const [activeTab, setActiveTab] = useState<'pull' | 'spring' | 'ramp'>('pull');
  
  // Pull Mode States
  const [selectedSurface, setSelectedSurface] = useState<SurfaceType>('wood');
  const [blockMass, setBlockMass] = useState<number>(2.0); // kg
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullForce, setPullForce] = useState<number>(7.0); // Newtons applied
  
  // Spring Mode States (Hooke's Law)
  const [springWeight, setSpringWeight] = useState<number>(200); // grams
  const [springConstant] = useState<number>(25); // N/m

  // Ramp Mode States
  const [rampAngle, setRampAngle] = useState<number>(20); // degrees
  const [isRampSliding, setIsRampSliding] = useState<boolean>(false);

  // Surface friction calculation (Normal force N = mg, F_friction = mu * N)
  const g = 9.8;
  const normalForce = blockMass * g;
  const maxStaticFriction = Math.round(SURFACES[selectedSurface].frictionCoef * normalForce * 10) / 10;
  
  // Pull simulation movement
  const isMoving = pullForce >= maxStaticFriction;
  const netForce = Math.max(0, Math.round((pullForce - maxStaticFriction) * 10) / 10);

  // Hooke's Law: F = k * x  => x = (m * g) / k
  // Original length = 10 cm
  const originalLength = 10;
  const forceNewtons = (springWeight / 1000) * g;
  const extensionCm = Math.round((forceNewtons / springConstant) * 100 * 10) / 10;
  const totalLength = Math.round((originalLength + extensionCm) * 10) / 10;

  // Ramp physics: Downward component = mg * sin(theta); Opposing friction = mu * mg * cos(theta)
  const rampRad = (rampAngle * Math.PI) / 180;
  const rampDownForce = normalForce * Math.sin(rampRad);
  const rampFricForce = SURFACES[selectedSurface].frictionCoef * normalForce * Math.cos(rampRad);
  const willSlideOnRamp = rampDownForce > rampFricForce;

  const handleTestPull = () => {
    soundEffects.playClick();
    setIsPulling(true);
    setTimeout(() => {
      setIsPulling(false);
      if (isMoving) {
        soundEffects.playCorrect();
      }
      onRecordExperiment?.();
      onUnlockBadge?.('badge_friction_pro');
    }, 1200);
  };

  const handleRampRelease = () => {
    soundEffects.playClick();
    setIsRampSliding(true);
    if (willSlideOnRamp) {
      soundEffects.playCorrect();
    } else {
      soundEffects.playWrong();
    }
    setTimeout(() => setIsRampSliding(false), 1400);
    onRecordExperiment?.();
  };

  return (
    <div className="bg-white/95 rounded-3xl border border-sky-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Simulation Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-sky-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-sky-50/80 via-indigo-50/50 to-blue-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-sky-200/80 text-sky-950 shadow-2xs">
              <Move className="w-4 h-4 fill-sky-700" />
            </span>
            <h2 className="text-lg font-bold text-sky-950 tracking-tight">
              Virtual Lab: Forces, Friction & Spring Elasticity
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Measure frictional resistance with a spring balance, explore Hooke's Law, and test inclined ramps.
          </p>
        </div>

        {/* Experiment Mode Tabs (Pastel Rounded) */}
        <div className="flex items-center gap-1.5 p-1 bg-sky-50/80 rounded-2xl border border-sky-100/80">
          <button
            onClick={() => { soundEffects.playClick(); setActiveTab('pull'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'pull' ? 'bg-white text-sky-950 shadow-xs' : 'text-slate-600 hover:text-sky-950'
            }`}
          >
            Friction Pull Test
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setActiveTab('spring'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'spring' ? 'bg-white text-sky-950 shadow-xs' : 'text-slate-600 hover:text-sky-950'
            }`}
          >
            Spring Balance (Hooke's Law)
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setActiveTab('ramp'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'ramp' ? 'bg-white text-sky-950 shadow-xs' : 'text-slate-600 hover:text-sky-950'
            }`}
          >
            Ramp Angle Friction
          </button>
        </div>
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Zone: Interactive SVG Simulation Canvas (8 cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-sky-100/70 bg-gradient-to-b from-sky-50/30 via-white to-slate-50/40 relative select-none">
          
          {/* TAB 1: Friction Pull Test */}
          {activeTab === 'pull' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <div>
                  Testing Surface: <strong className="text-slate-800">{SURFACES[selectedSurface].name}</strong>
                </div>
                <div className="font-mono">
                  Limiting Friction: <span className="font-bold text-rose-600">{maxStaticFriction} N</span>
                </div>
              </div>

              {/* Interactive SVG Pull Canvas */}
              <div className="w-full aspect-[16/9] bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-inner">
                <svg viewBox="0 0 640 260" className="w-full h-full">
                  {/* Table Base */}
                  <rect x="20" y="180" width="600" height="20" fill="#E2E8F0" rx="3" />
                  
                  {/* Test Surface Strip */}
                  <rect
                    x="40"
                    y="172"
                    width="560"
                    height="8"
                    fill={SURFACES[selectedSurface].color}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    rx="2"
                  />
                  <text x="320" y="195" textAnchor="middle" fontSize="9.5" fill="#64748B" fontWeight="600">
                    {SURFACES[selectedSurface].name} (Roughness µ = {SURFACES[selectedSurface].frictionCoef})
                  </text>

                  {/* Wooden Block with Mass */}
                  <g
                    transform={`translate(${isPulling && isMoving ? 220 : 120}, 92)`}
                    className="transition-transform duration-700 ease-out"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="90"
                      height="80"
                      fill="#F59E0B"
                      stroke="#B45309"
                      strokeWidth="2"
                      rx="4"
                    />
                    <text x="45" y="42" textAnchor="middle" fill="#78350F" fontSize="13" fontWeight="bold">
                      {blockMass} kg
                    </text>
                    <text x="45" y="58" textAnchor="middle" fill="#92400E" fontSize="9">
                      Block
                    </text>

                    {/* Weight (Gravity) Vector downward */}
                    <line x1="45" y1="80" x2="45" y2="120" stroke="#DC2626" strokeWidth="2" markerEnd="url(#arrowDown)" />
                    <text x="52" y="115" fill="#DC2626" fontSize="8.5" fontWeight="bold">
                      W = {normalForce.toFixed(1)} N
                    </text>

                    {/* Opposing Friction Vector backward */}
                    <line x1="0" y1="80" x2="-45" y2="80" stroke="#E11D48" strokeWidth="2.5" />
                    <polygon points="-45,80 -38,76 -38,84" fill="#E11D48" />
                    <text x="-50" y="74" textAnchor="end" fill="#E11D48" fontSize="8.5" fontWeight="bold">
                      Friction {maxStaticFriction} N
                    </text>

                    {/* Pull Hook */}
                    <path d="M 90 40 L 105 40" stroke="#475569" strokeWidth="3" />
                  </g>

                  {/* Spring Balance pulling the block */}
                  <g
                    transform={`translate(${isPulling && isMoving ? 325 : 225}, 120)`}
                    className="transition-transform duration-700 ease-out"
                  >
                    {/* Metal Hook */}
                    <path d="M 0 12 L 20 12" stroke="#475569" strokeWidth="2.5" />

                    {/* Tubular Casing */}
                    <rect x="20" y="0" width="130" height="24" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
                    <rect x="24" y="4" width="122" height="16" rx="2" fill="#E0F2FE" />

                    {/* Spring Coils */}
                    <path
                      d="M 30 12 Q 35 7, 40 12 T 50 12 T 60 12 T 70 12 T 80 12"
                      fill="none"
                      stroke="#0369A1"
                      strokeWidth="2"
                    />

                    {/* Pointer Indicator */}
                    <polygon
                      points={`${30 + Math.min(85, pullForce * 5.5)},6 ${30 + Math.min(85, pullForce * 5.5)},18 ${36 + Math.min(85, pullForce * 5.5)},12`}
                      fill="#DC2626"
                    />

                    <text x="85" y="16" textAnchor="middle" fontSize="10" fill="#0C4A6E" fontWeight="bold" fontFamily="monospace">
                      {pullForce.toFixed(1)} N
                    </text>

                    {/* Hand Pull Vector forward */}
                    <line x1="150" y1="12" x2="220" y2="12" stroke="#059669" strokeWidth="3" />
                    <polygon points="220,12 212,8 212,16" fill="#059669" />
                    <text x="180" y="6" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">
                      Pull Force: {pullForce} N
                    </text>
                  </g>
                </svg>

                {/* State Banner */}
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs">
                  <div className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                    isMoving ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {isMoving ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Forces Unbalanced: Pull ({pullForce}N) &gt; Friction ({maxStaticFriction}N) → Block Accelerates!</span>
                      </>
                    ) : (
                      <>
                        <span>Forces Balanced: Pull ({pullForce}N) ≤ Limiting Friction ({maxStaticFriction}N) → Block Stays At Rest</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleTestPull}
                  disabled={isPulling}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95 transition-all"
                >
                  {isPulling ? 'Applying Pull Force...' : 'Test Pull with Spring Balance'}
                </button>
                <span className="text-xs text-slate-500">
                  Net Force: <strong className="font-mono text-slate-900">{netForce} N</strong>
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Spring Balance (Hooke's Law) */}
          {activeTab === 'spring' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <div>
                  Hooke's Law: <strong>Extension is proportional to applied load</strong>
                </div>
                <div className="font-mono">
                  Extension: <span className="font-bold text-blue-600">+{extensionCm} cm</span>
                </div>
              </div>

              <div className="w-full aspect-[16/9] bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden flex items-center justify-around shadow-inner">
                {/* Vertical Ruler & Spring */}
                <svg viewBox="0 0 400 240" className="h-full w-auto">
                  {/* Top Stand Hook */}
                  <rect x="140" y="10" width="120" height="8" fill="#475569" rx="2" />
                  <circle cx="200" cy="18" r="4" fill="#94A3B8" />

                  {/* Vertical Ruler */}
                  <g transform="translate(100, 20)">
                    <rect x="0" y="0" width="28" height="200" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" rx="2" />
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map(y => (
                      <g key={y}>
                        <line x1="18" y1={y} x2="28" y2={y} stroke="#854D0E" strokeWidth="1" />
                        <text x="4" y={y + 3} fontSize="7" fill="#854D0E" fontFamily="monospace">
                          {(y / 10).toFixed(0)}cm
                        </text>
                      </g>
                    ))}
                  </g>

                  {/* The Spring */}
                  <g transform="translate(200, 20)">
                    {/* Unstretched reference mark at 10cm (100px) */}
                    <line x1="-30" y1="100" x2="30" y2="100" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 2" />
                    <text x="35" y="103" fontSize="8" fill="#DC2626" fontWeight="bold">
                      L₀ = 10 cm
                    </text>

                    {/* Spring coils dynamically stretched */}
                    <path
                      d={`M 0 0 
                          Q 8 ${totalLength * 2}, -8 ${totalLength * 4} 
                          T 8 ${totalLength * 6} 
                          T -8 ${totalLength * 8} 
                          T 0 ${totalLength * 10}`}
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="3"
                    />

                    {/* Slotted Weight Hanger */}
                    <g transform={`translate(0, ${totalLength * 10})`}>
                      <circle cx="0" cy="5" r="4" fill="#64748B" />
                      <rect x="-18" y="10" width="36" height="24" rx="3" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
                      <text x="0" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        {springWeight}g
                      </text>
                    </g>
                  </g>
                </svg>

                {/* Calculation Summary Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 max-w-xs">
                  <div className="font-bold text-slate-900">Primary 6 Math & Physics:</div>
                  <div className="text-slate-600">
                    Original Spring Length ($L_0$): <span className="font-bold text-slate-800">10.0 cm</span>
                  </div>
                  <div className="text-slate-600">
                    Force exerted by mass ($W = mg$): <span className="font-mono font-bold text-blue-600">{forceNewtons.toFixed(2)} N</span>
                  </div>
                  <div className="text-slate-600">
                    Extension ($\Delta L$): <span className="font-mono font-bold text-emerald-600">{extensionCm} cm</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-slate-800 font-bold">
                    Total Spring Length: <span className="font-mono text-indigo-600 text-sm">{totalLength} cm</span>
                  </div>
                </div>
              </div>

              {/* Weight Selector */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-slate-500 font-medium">Add Slotted Weights:</span>
                {[100, 200, 300, 400, 500].map(wt => (
                  <button
                    key={wt}
                    onClick={() => {
                      soundEffects.playClick();
                      setSpringWeight(wt);
                      onRecordExperiment?.();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      springWeight === wt
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {wt} g
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Ramp Angle Test */}
          {activeTab === 'ramp' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <div>
                  Inclined Ramp Surface: <strong className="text-slate-800">{SURFACES[selectedSurface].name}</strong>
                </div>
                <div className="font-mono">
                  Ramp Angle: <span className="font-bold text-blue-600">{rampAngle}°</span>
                </div>
              </div>

              <div className="w-full aspect-[16/9] bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-inner">
                <svg viewBox="0 0 600 240" className="w-full h-full">
                  {/* Ground line */}
                  <line x1="50" y1="200" x2="550" y2="200" stroke="#94A3B8" strokeWidth="2" />
                  
                  {/* Inclined Ramp */}
                  <g transform="translate(80, 200)">
                    {/* Wedge path */}
                    <polygon
                      points={`0,0 400,0 ${400 * Math.cos(rampRad)},${-400 * Math.sin(rampRad)}`}
                      fill="#F1F5F9"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                    />
                    {/* Ramp Surface with texture color */}
                    <line
                      x1="0"
                      y1="0"
                      x2={400 * Math.cos(rampRad)}
                      y2={-400 * Math.sin(rampRad)}
                      stroke={SURFACES[selectedSurface].color}
                      strokeWidth="6"
                    />

                    {/* Block on Ramp */}
                    <g
                      transform={`translate(${
                        isRampSliding && willSlideOnRamp
                          ? 60 * Math.cos(rampRad)
                          : 280 * Math.cos(rampRad)
                      }, ${
                        isRampSliding && willSlideOnRamp
                          ? -60 * Math.sin(rampRad)
                          : -280 * Math.sin(rampRad)
                      }) rotate(${-rampAngle})`}
                      className="transition-transform duration-700 ease-in"
                    >
                      <rect x="-25" y="-35" width="50" height="35" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                      <text x="0" y="-14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350F">
                        {blockMass}kg
                      </text>
                    </g>
                  </g>
                </svg>

                {/* State Label */}
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs">
                  <div className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                    willSlideOnRamp ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}>
                    {willSlideOnRamp ? (
                      <span>Critical Angle Reached! Downward Force ({rampDownForce.toFixed(1)}N) &gt; Friction ({rampFricForce.toFixed(1)}N) → Slides Down!</span>
                    ) : (
                      <span>Static Friction Prevents Sliding: Downward Pull ({rampDownForce.toFixed(1)}N) ≤ Friction ({rampFricForce.toFixed(1)}N)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ramp Angle Slider & Release Button */}
              <div className="flex items-center justify-between gap-4 mt-4">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Adjust Ramp Incline Angle</span>
                    <span className="font-mono text-blue-600">{rampAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={rampAngle}
                    onChange={e => setRampAngle(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
                <button
                  onClick={handleRampRelease}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                >
                  Release Block
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Controls & Scientific Concepts (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-slate-50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Surface & Load Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Investigate how surface texture and normal load alter friction.
              </p>
            </div>

            {/* Surface Selector */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Select Test Surface
              </label>
              <div className="space-y-1.5">
                {(Object.keys(SURFACES) as SurfaceType[]).map(key => (
                  <button
                    key={key}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedSurface(key);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between ${
                      selectedSurface === key
                        ? 'bg-blue-50 border border-blue-300 text-blue-900'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{SURFACES[key].name}</div>
                      <div className="text-[10px] text-slate-500">{SURFACES[key].desc}</div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-800 tabular-nums">
                      µ = {SURFACES[key].frictionCoef}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Block Mass Slider */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-600" /> Block Mass (Load)
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">{blockMass.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={blockMass}
                onChange={e => setBlockMass(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="text-[11px] text-slate-400">
                Heavier block presses harder against surface → increases frictional force.
              </div>
            </div>

            {/* Pull Force Slider for Pull Mode */}
            {activeTab === 'pull' && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Spring Balance Pulling Force</span>
                  <span className="font-mono text-xs font-bold text-blue-600 tabular-nums">{pullForce} N</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="0.5"
                  value={pullForce}
                  onChange={e => setPullForce(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Primary 6 Answering Checklist */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-700" />
              <span>Primary 6 Exam Keyword Formula:</span>
            </div>
            <p className="text-blue-900 mt-1 leading-relaxed text-[11px]">
              When explaining friction in exams: <em>"As the surface is rougher, there is <strong>more friction</strong> between the surface and the object, requiring a <strong>greater force</strong> to overcome friction and move the object."</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
