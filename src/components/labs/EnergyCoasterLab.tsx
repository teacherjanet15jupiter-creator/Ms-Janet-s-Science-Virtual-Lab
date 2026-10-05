import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, HelpCircle, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface Props {
  onRecordExperiment?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const EnergyCoasterLab: React.FC<Props> = ({ onRecordExperiment, onUnlockBadge }) => {
  // Track parameters
  const [releaseHeight, setReleaseHeight] = useState<number>(28); // metres
  const [cartMass, setCartMass] = useState<number>(400); // kg
  const [frictionPreset, setFrictionPreset] = useState<'none' | 'low' | 'rough'>('low');
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'jupiter'>('earth');
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackProgress, setTrackProgress] = useState<number>(0); // 0 to 1
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null);
  const [challengeAccomplished, setChallengeAccomplished] = useState<boolean>(false);
  
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Gravity constant in m/s^2
  const g = gravityPreset === 'earth' ? 9.8 : gravityPreset === 'moon' ? 1.6 : 24.8;
  const frictionCoef = frictionPreset === 'none' ? 0.0 : frictionPreset === 'low' ? 0.015 : 0.045;

  // Track profile function: gives height (y in metres) as function of s in [0, 1]
  // Hill 1: 0 to 0.35 (starts at releaseHeight, drops to valley at 2m)
  // Loop / Hill 2: 0.35 to 0.7 (rises to 18m, drops to 3m)
  // Hill 3 / Finish: 0.7 to 1.0 (rises to 8m, stops at 4m)
  const getTrackPoint = (s: number) => {
    // Canvas dimensions: 700 wide, 320 high.
    // SVG x from 40 to 660.
    const x = 40 + s * 620;
    let height = 0; // in metres

    if (s <= 0.3) {
      // Release down to valley
      const t = s / 0.3;
      // Cosine ease from releaseHeight to 2m
      height = 2 + (releaseHeight - 2) * 0.5 * (1 + Math.cos(t * Math.PI));
    } else if (s <= 0.65) {
      // Loop hill: peaks at 18m
      const t = (s - 0.3) / 0.35;
      const peakH = 17;
      height = 2 + (peakH - 2) * Math.sin(t * Math.PI);
    } else {
      // Final hill: peaks at 8m then ends
      const t = (s - 0.65) / 0.35;
      height = 2 + 6 * Math.sin(t * Math.PI * 0.85);
    }

    // Convert height in metres to SVG y (0m is ground at y=280, 35m is at y=40)
    const y = 280 - (height / 35) * 230;
    return { x, y, height };
  };

  // Current physics values
  const currentPt = getTrackPoint(trackProgress);
  const currentHeight = currentPt.height;

  // Energy calculations
  const initialGpe = cartMass * g * releaseHeight;
  // Energy dissipated through friction along path
  const frictionEnergyLost = initialGpe * (frictionCoef * 4 * trackProgress);
  const totalMechanicalEnergy = Math.max(0, initialGpe - frictionEnergyLost);
  const currentGpe = Math.min(totalMechanicalEnergy, cartMass * g * currentHeight);
  const currentKe = Math.max(0, totalMechanicalEnergy - currentGpe);
  // v = sqrt(2 * KE / m)
  const currentVelocity = Math.sqrt((2 * currentKe) / cartMass);

  // Check if cart has stalled (GPE required exceeds available energy)
  const isStalled = currentKe <= 0.5 && trackProgress > 0.05 && trackProgress < 0.95;

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Speed proportional to velocity, mapped to progress increment
      const speedScale = 0.05; // base progression speed
      const effectiveSpeed = Math.max(0.08, currentVelocity * speedScale);
      
      setTrackProgress(prev => {
        // If energy runs out on an incline
        if (currentKe <= 0.2 && prev > 0.3 && prev < 0.6) {
          setIsPlaying(false);
          return prev;
        }

        const next = prev + effectiveSpeed * dt * 0.4;
        if (next >= 1) {
          setIsPlaying(false);
          soundEffects.playCorrect();
          setChallengeAccomplished(true);
          onRecordExperiment?.();
          onUnlockBadge?.('badge_energy_master');
          if (frictionPreset === 'none') {
            onUnlockBadge?.('badge_energy_conservation');
          }
          return 1;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentVelocity, currentKe, frictionPreset, onRecordExperiment, onUnlockBadge]);

  const handlePlayToggle = () => {
    soundEffects.playClick();
    if (trackProgress >= 1 || isStalled) {
      setTrackProgress(0);
      lastTimeRef.current = null;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setIsPlaying(false);
    setTrackProgress(0);
    lastTimeRef.current = null;
  };

  // Generate SVG path for the track
  const trackPathPoints: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const pt = getTrackPoint(i / steps);
    trackPathPoints.push(`${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
  }
  const trackPathD = trackPathPoints.join(' ');

  // Total energy breakdown percentages
  const maxPossible = initialGpe || 1;
  const gpePercent = Math.min(100, Math.round((currentGpe / maxPossible) * 100));
  const kePercent = Math.min(100 - gpePercent, Math.round((currentKe / maxPossible) * 100));
  const thermalPercent = Math.max(0, 100 - gpePercent - kePercent);

  return (
    <div className="bg-white/95 rounded-3xl border border-indigo-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Simulation Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-indigo-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-50/80 via-rose-50/40 to-indigo-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-200/80 text-amber-900 shadow-2xs">
              <Zap className="w-4 h-4 fill-amber-700" />
            </span>
            <h2 className="text-lg font-bold text-indigo-950 tracking-tight">
              Virtual Lab: Energy Conversion Roller Coaster
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Observe continuous conversion between Gravitational Potential Energy (GPE) and Kinetic Energy (KE).
          </p>
        </div>

        {/* Live Status Indicators in Soft Pastel Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/90 px-3.5 py-1.5 rounded-xl border border-indigo-100 shadow-2xs">
            <span className="text-slate-500">Cart Speed:</span>
            <span className="font-mono font-bold text-indigo-900 tabular-nums">
              {currentVelocity.toFixed(1)} m/s
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-white/90 px-3.5 py-1.5 rounded-xl border border-indigo-100 shadow-2xs">
            <span className="text-slate-500">Height:</span>
            <span className="font-mono font-bold text-indigo-900 tabular-nums">
              {currentHeight.toFixed(1)} m
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Zone: Interactive SVG Physics Canvas */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-indigo-100/70 bg-gradient-to-b from-indigo-50/20 via-white to-slate-50/30 relative select-none">
          {/* Top Canvas Annotation */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <span className="text-indigo-950 font-medium">GPE = mgh</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ml-2"></span>
              <span className="text-emerald-950 font-medium">KE = 1/2 mv²</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 ml-2"></span>
              <span className="text-rose-950 font-medium">Heat & Sound</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
              Total Energy = GPE + KE + Heat
            </div>
          </div>

          {/* SVG Simulation Stage */}
          <div className="relative w-full aspect-[21/10] bg-[#1e1b4b] rounded-2xl overflow-hidden shadow-inner border border-indigo-950/40">
            <svg
              viewBox="0 0 700 320"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background Grid & Coordinate lines */}
              <defs>
                <pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse">
                  <path d="M 35 0 L 0 0 0 35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
                {/* Glow Filter for Cart */}
                <filter id="cartGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e1065" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
              </defs>

              <rect width="700" height="320" fill="url(#skyGrad)" />
              <rect width="700" height="320" fill="url(#grid)" />

              {/* Twinkling Pastel Stars */}
              {[
                { x: 80, y: 30, r: 1.5, o: 0.8 },
                { x: 160, y: 70, r: 1.2, o: 0.6 },
                { x: 230, y: 25, r: 2.0, o: 0.9 },
                { x: 340, y: 40, r: 1.5, o: 0.7 },
                { x: 420, y: 20, r: 1.8, o: 0.85 },
                { x: 510, y: 60, r: 1.3, o: 0.5 },
                { x: 590, y: 35, r: 2.2, o: 0.9 },
                { x: 650, y: 80, r: 1.5, o: 0.7 },
              ].map((star, i) => (
                <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#FDE68A" opacity={star.o} />
              ))}

              {/* Distant Science Lab Mountain Silhouettes */}
              <path
                d="M 40 280 L 120 220 L 220 280 L 320 230 L 440 280 L 560 210 L 660 280 Z"
                fill="#1E1B4B"
                opacity="0.4"
              />

              {/* Reference Height Grid Labels */}
              <text x="14" y="55" fill="#A5B4FC" fontSize="10" fontFamily="monospace" fontWeight="bold">30m</text>
              <line x1="40" y1="52" x2="660" y2="52" stroke="rgba(165,180,252,0.2)" strokeDasharray="3 3" />
              
              <text x="14" y="145" fill="#A5B4FC" fontSize="10" fontFamily="monospace" fontWeight="bold">18m</text>
              <line x1="40" y1="142" x2="660" y2="142" stroke="rgba(165,180,252,0.2)" strokeDasharray="3 3" />

              <text x="14" y="278" fill="#A5B4FC" fontSize="10" fontFamily="monospace" fontWeight="bold">0m</text>
              <line x1="40" y1="280" x2="660" y2="280" stroke="#475569" strokeWidth="2.5" />

              {/* Track Support Pillars */}
              {[0.0, 0.15, 0.3, 0.475, 0.65, 0.82, 1.0].map((s, idx) => {
                const pt = getTrackPoint(s);
                return (
                  <g key={idx}>
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={pt.x}
                      y2="280"
                      stroke="#4F46E5"
                      strokeWidth="2.5"
                      strokeDasharray="2 3"
                      opacity="0.7"
                    />
                    <circle cx={pt.x} cy="280" r="3.5" fill="#818CF8" />
                  </g>
                );
              })}

              {/* Roller Coaster Rails (Glowing Neon Track) */}
              <path
                d={trackPathD}
                fill="none"
                stroke="#0F172A"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d={trackPathD}
                fill="none"
                stroke="#67E8F9"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d={trackPathD}
                fill="none"
                stroke="#F472B6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="8 6"
                opacity="0.75"
              />

              {/* Checkpoint Indicators (Clickable) */}
              {[
                { s: 0.0, label: 'A', name: 'Release Summit', desc: 'Max Height = Max GPE. Cart speed is 0 m/s.' },
                { s: 0.3, label: 'B', name: 'Valley Floor', desc: 'Min Height = GPE converted fully into Max KE. Fastest speed!' },
                { s: 0.475, label: 'C', name: 'Loop Peak', desc: 'Must maintain enough speed (KE) to overcome gravity.' },
                { s: 1.0, label: 'D', name: 'Brake Zone', desc: 'Friction converts remaining KE into heat & sound energy.' }
              ].map((cp, idx) => {
                const pt = getTrackPoint(cp.s);
                const isSelected = selectedCheckpoint === idx;
                return (
                  <g
                    key={cp.label}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedCheckpoint(isSelected ? null : idx);
                    }}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 10 : 8}
                      fill={isSelected ? '#F59E0B' : '#0F172A'}
                      stroke={isSelected ? '#FFF' : '#38BDF8'}
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 3.5}
                      textAnchor="middle"
                      fill={isSelected ? '#000' : '#FFF'}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {cp.label}
                    </text>
                  </g>
                );
              })}

              {/* The Coaster Cart */}
              <g
                transform={`translate(${currentPt.x}, ${currentPt.y})`}
                filter="url(#cartGlow)"
              >
                {/* Wheels */}
                <circle cx="-10" cy="5" r="4.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
                <circle cx="10" cy="5" r="4.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
                
                {/* Cart Body */}
                <rect
                  x="-16"
                  y="-12"
                  width="32"
                  height="14"
                  rx="4"
                  fill="#F59E0B"
                  stroke="#FFF"
                  strokeWidth="1.5"
                />
                
                {/* Rider figure */}
                <circle cx="-4" cy="-16" r="3.5" fill="#38BDF8" />
                <circle cx="6" cy="-16" r="3.5" fill="#E2E8F0" />

                {/* Motion Trails when moving fast */}
                {currentVelocity > 10 && (
                  <line
                    x1="-24"
                    y1="-5"
                    x2="-18"
                    y2="-5"
                    stroke="#FCD34D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                )}
              </g>

              {/* Live Energy vectors atop cart */}
              <g transform={`translate(${currentPt.x}, ${currentPt.y - 32})`}>
                <rect x="-35" y="-12" width="70" height="15" rx="3" fill="rgba(15,23,42,0.85)" stroke="#334155" strokeWidth="0.8" />
                <text x="0" y="-1" textAnchor="middle" fill="#38BDF8" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  {currentVelocity.toFixed(1)} m/s
                </text>
              </g>
            </svg>

            {/* Checkpoint Callout Overlay */}
            {selectedCheckpoint !== null && (
              <div className="absolute top-4 left-4 right-4 bg-slate-900/95 border border-sky-500/40 text-white p-3 rounded-lg shadow-xl backdrop-blur-sm flex items-start justify-between gap-4 text-xs animate-in fade-in zoom-in-95">
                <div>
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Checkpoint {['A', 'B', 'C', 'D'][selectedCheckpoint]}: {
                      ['Release Summit (30m)', 'Valley Floor (Ground)', 'Loop Summit (17m)', 'Braking Zone'][selectedCheckpoint]
                    }
                  </div>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    {[
                      'At maximum height, all energy is stored as Gravitational Potential Energy (GPE). Kinetic Energy is 0 because the cart is at rest.',
                      'As the cart plunges downward, GPE is converted into Kinetic Energy (KE). At the lowest point, speed is maximum!',
                      'To complete the loop, the cart must still have enough kinetic energy. If release height was too low, the cart will stall and fall back!',
                      'Brakes apply frictional force against the wheels, converting the remaining kinetic energy into heat (thermal) and sound energy.'
                    ][selectedCheckpoint]}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCheckpoint(null)}
                  className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Stall Warning */}
            {isStalled && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-xs shadow-lg">
                <AlertTriangle className="w-4 h-4" />
                Cart stalled! Not enough GPE was converted into KE to climb this hill. Increase release height!
              </div>
            )}
          </div>

          {/* Live Energy Conservation Breakdown Bar */}
          <div className="mt-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/80">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-950 mb-2.5">
              <span className="flex items-center gap-1.5">
                <span className="font-bold">Conservation of Energy Bar</span>
                <span className="text-[11px] text-slate-400 font-normal">(Total Energy = 100%)</span>
              </span>
              <span className="font-mono text-indigo-900 font-bold tabular-nums">
                {(totalMechanicalEnergy / 1000).toFixed(1)} kJ Total
              </span>
            </div>

            {/* Stacked Live Energy Bar (Pastel Tones) */}
            <div className="w-full h-5 bg-white/80 rounded-xl overflow-hidden flex text-[10px] font-mono text-slate-800 font-bold border border-indigo-100 shadow-inner">
              {gpePercent > 4 && (
                <div
                  style={{ width: `${gpePercent}%` }}
                  className="bg-sky-200/90 text-sky-950 flex items-center justify-center transition-all duration-75 overflow-hidden whitespace-nowrap px-1"
                >
                  GPE {gpePercent}%
                </div>
              )}
              {kePercent > 4 && (
                <div
                  style={{ width: `${kePercent}%` }}
                  className="bg-emerald-200/90 text-emerald-950 flex items-center justify-center transition-all duration-75 overflow-hidden whitespace-nowrap px-1"
                >
                  KE {kePercent}%
                </div>
              )}
              {thermalPercent > 4 && (
                <div
                  style={{ width: `${thermalPercent}%` }}
                  className="bg-rose-200/90 text-rose-950 flex items-center justify-center transition-all duration-75 overflow-hidden whitespace-nowrap px-1"
                >
                  Heat {thermalPercent}%
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-3 text-center text-xs">
              <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-200/70">
                <div className="text-sky-800 text-[11px] font-medium">Potential (GPE)</div>
                <div className="font-mono font-bold text-sky-950 tabular-nums">
                  {(currentGpe / 1000).toFixed(1)} kJ
                </div>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/70">
                <div className="text-emerald-800 text-[11px] font-medium">Kinetic (KE)</div>
                <div className="font-mono font-bold text-emerald-950 tabular-nums">
                  {(currentKe / 1000).toFixed(1)} kJ
                </div>
              </div>
              <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/70">
                <div className="text-rose-800 text-[11px] font-medium">Heat & Sound</div>
                <div className="font-mono font-bold text-rose-950 tabular-nums">
                  {(frictionEnergyLost / 1000).toFixed(1)} kJ
                </div>
              </div>
            </div>
          </div>

          {/* Transport Controls Bar */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-indigo-100/70">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayToggle}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-300'
                    : 'bg-emerald-200 hover:bg-emerald-300 text-emerald-950 border border-emerald-300'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-amber-900" /> Pause Ride
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-emerald-900" /> Launch Coaster
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1 hidden sm:flex">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tap checkpoints A, B, C, D on track to inspect physics concepts!</span>
            </div>
          </div>
        </div>

        {/* Right Zone: Parameter Controls & Scientific Concept Deck */}
        <div className="lg:col-span-4 p-6 bg-gradient-to-b from-indigo-50/30 to-slate-50/50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-indigo-950 tracking-tight flex items-center gap-1.5">
                <span>Experiment Parameters</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manipulate variables to test the Primary 6 Law of Conservation.
              </p>
            </div>

            {/* Release Height Slider */}
            <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Release Height (h)</label>
                <span className="font-mono font-bold text-indigo-950 tabular-nums bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                  {releaseHeight} m
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={releaseHeight}
                onChange={e => {
                  setReleaseHeight(Number(e.target.value));
                  if (!isPlaying) setTrackProgress(0);
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Low (10m)</span>
                <span>Standard (28m)</span>
                <span>Max (35m)</span>
              </div>
            </div>

            {/* Cart Mass Slider */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Cart & Passenger Mass (m)</label>
                <span className="font-mono font-bold text-slate-900 tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                  {cartMass} kg
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={cartMass}
                onChange={e => {
                  setCartMass(Number(e.target.value));
                  if (!isPlaying) setTrackProgress(0);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Light (100kg)</span>
                <span>Medium (400kg)</span>
                <span>Heavy (1000kg)</span>
              </div>
            </div>

            {/* Friction Surface Selector */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <label className="font-semibold text-slate-700 text-xs block">
                Track Surface Friction
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'Zero Friction', sub: 'Ideal Physics' },
                  { id: 'low', label: 'Polished Steel', sub: 'Low Loss' },
                  { id: 'rough', label: 'Rough Track', sub: 'High Heat Loss' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setFrictionPreset(item.id as typeof frictionPreset);
                    }}
                    className={`p-2 rounded-lg text-left transition-all ${
                      frictionPreset === item.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold leading-tight">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${frictionPreset === item.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gravity Environment */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <label className="font-semibold text-slate-700 text-xs block">
                Planetary Gravity (g)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'moon', label: 'Moon', gVal: '1.6 m/s²' },
                  { id: 'earth', label: 'Earth', gVal: '9.8 m/s²' },
                  { id: 'jupiter', label: 'Jupiter', gVal: '24.8 m/s²' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setGravityPreset(item.id as typeof gravityPreset);
                    }}
                    className={`p-2 rounded-lg text-center transition-all ${
                      gravityPreset === item.id
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className={`text-[10px] font-mono tabular-nums ${gravityPreset === item.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.gVal}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* P6 Exam Concept Card */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              <span>Primary 6 Science Answering Tip:</span>
            </div>
            <p className="text-amber-800 mt-1 leading-relaxed text-[11px]">
              When explaining why a bouncing ball or coaster cart doesn't reach its initial height,{' '}
              <strong>never write that energy was lost or destroyed!</strong> Write that:
              <em> "Some kinetic energy was converted into heat energy and sound energy due to friction with the air and track."</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
