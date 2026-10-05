import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, Sun, Wind, Thermometer, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface Props {
  onRecordExperiment?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

export const PlantTransportLab: React.FC<Props> = ({ onRecordExperiment, onUnlockBadge }) => {
  // Environmental Variables
  const [lightLevel, setLightLevel] = useState<'dark' | 'normal' | 'bright'>('normal');
  const [windLevel, setWindLevel] = useState<'still' | 'breeze' | 'windy'>('still');
  const [humidityLevel, setHumidityLevel] = useState<'dry' | 'medium' | 'humid'>('medium');
  const [temperature, setTemperature] = useState<number>(25); // Celsius

  // Lab Experiment Modes
  const [dyeColor, setDyeColor] = useState<'clear' | 'red' | 'blue'>('red');
  const [isStemRinged, setIsStemRinged] = useState<boolean>(false);
  const [activeVesselView, setActiveVesselView] = useState<'xylem' | 'phloem' | 'both'>('both');
  
  // Real-time animation states
  const [bubblePosition, setBubblePosition] = useState<number>(15); // mm along photometer
  const [dyeProgress, setDyeProgress] = useState<number>(30); // % up the stem
  const [swellingAmount, setSwellingAmount] = useState<number>(0);

  // Compute Transpiration Rate based on P6 biological principles
  // Rate increases with Light (stomata open), Wind (strips boundary layer), Temp (evap rate)
  // Rate decreases with High Humidity (shallow vapor pressure gradient)
  const lightFactor = lightLevel === 'dark' ? 0.3 : lightLevel === 'normal' ? 1.0 : 1.8;
  const windFactor = windLevel === 'still' ? 1.0 : windLevel === 'breeze' ? 1.6 : 2.4;
  const humidityFactor = humidityLevel === 'dry' ? 1.6 : humidityLevel === 'medium' ? 1.0 : 0.4;
  const tempFactor = (temperature / 25) * 1.1;

  const transpirationRate = Math.round(
    2.5 * lightFactor * windFactor * humidityFactor * tempFactor * 10
  ) / 10; // in mL/hour

  // Transpiration bubble animation
  useEffect(() => {
    const timer = setInterval(() => {
      setBubblePosition(prev => {
        const next = prev + (transpirationRate * 0.15);
        return next > 90 ? 10 : next;
      });

      if (dyeColor !== 'clear') {
        setDyeProgress(prev => Math.min(100, prev + 0.5 * transpirationRate));
      }

      if (isStemRinged) {
        setSwellingAmount(prev => Math.min(100, prev + 0.8));
      } else {
        setSwellingAmount(prev => Math.max(0, prev - 1));
      }
    }, 150);

    return () => clearInterval(timer);
  }, [transpirationRate, dyeColor, isStemRinged]);

  const handleRingStem = () => {
    soundEffects.playClick();
    const newRinged = !isStemRinged;
    setIsStemRinged(newRinged);
    if (newRinged) {
      soundEffects.playBubble();
      onRecordExperiment?.();
      onUnlockBadge?.('badge_xylem_detective');
    }
  };

  const handleDyeChange = (color: 'clear' | 'red' | 'blue') => {
    soundEffects.playBubble();
    setDyeColor(color);
    setDyeProgress(color === 'clear' ? 0 : 25);
    onRecordExperiment?.();
  };

  return (
    <div className="bg-white/95 rounded-3xl border border-emerald-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Simulation Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-emerald-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-sky-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-200/80 text-emerald-950 shadow-2xs">
              <Leaf className="w-4 h-4 fill-emerald-700" />
            </span>
            <h2 className="text-lg font-bold text-emerald-950 tracking-tight">
              Virtual Lab: Plant Transport System & Transpiration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Investigate how water and minerals travel upward through Xylem, while food is transported by Phloem.
          </p>
        </div>

        {/* Live Transpiration Rate Display */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/90 px-3.5 py-1.5 rounded-xl border border-emerald-100 shadow-2xs">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-slate-500">Transpiration Rate:</span>
            <span className="font-mono font-bold text-sky-900 tabular-nums">
              {transpirationRate.toFixed(1)} mL/hr
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Zone: Interactive Plant & Stem Cross-Section SVG (8 cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-100/70 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50/40 relative select-none">
          
          {/* Top Vessel Mode Selector */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Highlight:</span>
              <button
                onClick={() => { soundEffects.playClick(); setActiveVesselView('both'); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeVesselView === 'both' ? 'bg-emerald-200 text-emerald-950 border border-emerald-300 shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Both Vessels
              </button>
              <button
                onClick={() => { soundEffects.playClick(); setActiveVesselView('xylem'); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeVesselView === 'xylem' ? 'bg-sky-200 text-sky-950 border border-sky-300 shadow-xs' : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
                }`}
              >
                Xylem (Water Up)
              </button>
              <button
                onClick={() => { soundEffects.playClick(); setActiveVesselView('phloem'); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeVesselView === 'phloem' ? 'bg-amber-200 text-amber-950 border border-amber-300 shadow-xs' : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                Phloem (Food)
              </button>
            </div>

            {/* Quick Dye Picker */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1 hidden sm:inline">Beaker Dye:</span>
              <button
                onClick={() => handleDyeChange('clear')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                  dyeColor === 'clear' ? 'bg-slate-200 text-slate-900 border-slate-300 shadow-xs' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Water
              </button>
              <button
                onClick={() => handleDyeChange('red')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                  dyeColor === 'red' ? 'bg-rose-200 text-rose-950 border-rose-300 shadow-xs' : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                Red Eosin
              </button>
              <button
                onClick={() => handleDyeChange('blue')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                  dyeColor === 'blue' ? 'bg-sky-200 text-sky-950 border-sky-300 shadow-xs' : 'bg-sky-50 text-sky-800 border-sky-200'
                }`}
              >
                Methylene Blue
              </button>
            </div>
          </div>

          {/* SVG Diagram: Plant in Pot with Cutaway Vascular View + Stem Cross Section */}
          <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-sky-50/50 to-emerald-50/30 rounded-xl overflow-hidden border border-slate-200 p-2">
            <svg viewBox="0 0 680 340" className="w-full h-full">
              {/* Sun & Wind visual effects based on state */}
              {lightLevel === 'bright' && (
                <g transform="translate(60, 45)">
                  <circle cx="0" cy="0" r="18" fill="#FBBF24" opacity="0.9" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                    <line
                      key={deg}
                      x1="0"
                      y1="0"
                      x2="28"
                      y2="0"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  <text x="0" y="34" textAnchor="middle" fontSize="9" fill="#B45309" fontWeight="bold">
                    Bright Light
                  </text>
                </g>
              )}

              {windLevel !== 'still' && (
                <g opacity={windLevel === 'windy' ? '0.8' : '0.4'}>
                  <path
                    d="M 20 120 C 50 115, 80 125, 110 120 C 130 115, 140 125, 135 130"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 10 140 C 40 135, 90 145, 120 140"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </g>
              )}

              {/* Beaker with Colored Liquid at Bottom */}
              <g transform="translate(180, 200)">
                {/* Glass Beaker */}
                <path
                  d="M 40 0 L 40 100 Q 40 115, 55 115 L 145 115 Q 160 115, 160 100 L 160 0"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="3"
                />
                {/* Liquid fill */}
                <path
                  d="M 43 40 L 43 98 Q 43 112, 55 112 L 145 112 Q 157 112, 157 98 L 157 40 Z"
                  fill={dyeColor === 'red' ? '#F43F5E' : dyeColor === 'blue' ? '#38BDF8' : '#BAE6FD'}
                  opacity="0.6"
                />
                {/* Beaker measurement marks */}
                <line x1="40" y1="55" x2="52" y2="55" stroke="#64748B" strokeWidth="1.5" />
                <line x1="40" y1="75" x2="56" y2="75" stroke="#64748B" strokeWidth="2" />
                <line x1="40" y1="95" x2="52" y2="95" stroke="#64748B" strokeWidth="1.5" />
                <text x="60" y="78" fontSize="8" fill="#475569" fontFamily="monospace">150 mL</text>
              </g>

              {/* Plant Stem Rising from Beaker */}
              <g transform="translate(260, 20)">
                {/* Stem Outer contour */}
                <path
                  d="M 15 100 L 15 260 L 25 260 L 25 100 Z"
                  fill="#86EFAC"
                  stroke="#16A34A"
                  strokeWidth="2"
                />

                {/* Xylem Vessel (Inner Core - Water Moving Up) */}
                {(activeVesselView === 'both' || activeVesselView === 'xylem') && (
                  <g>
                    <rect
                      x="18"
                      y={260 - (dyeProgress * 1.6)}
                      width="4"
                      height={dyeProgress * 1.6}
                      fill={dyeColor === 'red' ? '#E11D48' : '#0284C7'}
                      rx="1"
                    />
                    {/* Direction arrows upwards */}
                    {[140, 180, 220].map((yPos, i) => (
                      <polygon
                        key={i}
                        points={`20,${yPos} 17,${yPos + 6} 23,${yPos + 6}`}
                        fill="#0369A1"
                      />
                    ))}
                  </g>
                )}

                {/* Phloem Vessel (Outer Layer - Food Moving Downwards & Upwards) */}
                {(activeVesselView === 'both' || activeVesselView === 'phloem') && (
                  <g>
                    <line x1="16" y1="100" x2="16" y2="260" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
                    <line x1="24" y1="100" x2="24" y2="260" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />
                  </g>
                )}

                {/* Ringing of Stem Cut & Swelling Simulation */}
                {isStemRinged && (
                  <g>
                    {/* Ring Cut section */}
                    <rect x="13" y="195" width="14" height="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
                    <text x="32" y="204" fontSize="8" fill="#B45309" fontWeight="bold">Phloem Cut</text>

                    {/* Swelling above cut due to trapped food */}
                    <ellipse
                      cx="20"
                      cy="190"
                      rx={10 + swellingAmount * 0.08}
                      ry="8"
                      fill="#4ADE80"
                      stroke="#15803D"
                      strokeWidth="1.5"
                    />
                    <text x="36" y="190" fontSize="8" fill="#15803D" fontWeight="bold">
                      Swelling (Sugar Trapped!)
                    </text>
                  </g>
                )}

                {/* Left Leaf with Veins */}
                <g transform="translate(15, 110)">
                  <path
                    d="M 0 0 C -40 -30, -90 -20, -110 10 C -80 30, -30 25, 0 0"
                    fill={dyeColor === 'red' && dyeProgress > 60 ? '#FDA4AF' : '#22C55E'}
                    stroke="#16A34A"
                    strokeWidth="2"
                  />
                  {/* Leaf Veins */}
                  <path
                    d="M 0 0 Q -50 -5, -95 10"
                    fill="none"
                    stroke={dyeColor === 'red' && dyeProgress > 60 ? '#BE123C' : '#15803D'}
                    strokeWidth="2"
                  />
                  {/* Transpiration water droplets evaporating from stomata */}
                  <g opacity={transpirationRate > 10 ? '0.9' : '0.5'}>
                    <circle cx="-60" cy="-20" r="2.5" fill="#38BDF8" />
                    <circle cx="-45" cy="-28" r="2" fill="#38BDF8" />
                    <circle cx="-75" cy="-15" r="2" fill="#38BDF8" />
                    <text x="-95" y="-30" fontSize="7.5" fill="#0284C7" fontWeight="bold">
                      Transpiration (H₂O Vapor)
                    </text>
                  </g>
                </g>

                {/* Right Leaf with Veins */}
                <g transform="translate(25, 140)">
                  <path
                    d="M 0 0 C 40 -25, 85 -15, 105 15 C 75 35, 25 25, 0 0"
                    fill={dyeColor === 'red' && dyeProgress > 70 ? '#FDA4AF' : '#22C55E'}
                    stroke="#16A34A"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 0 Q 50 -2, 95 15"
                    fill="none"
                    stroke={dyeColor === 'red' && dyeProgress > 70 ? '#BE123C' : '#15803D'}
                    strokeWidth="2"
                  />
                </g>

                {/* Top White Flower Petals turning dyed */}
                <g transform="translate(20, 80)">
                  <circle cx="-12" cy="-12" r="14" fill={dyeColor === 'red' && dyeProgress > 80 ? '#F43F5E' : dyeColor === 'blue' && dyeProgress > 80 ? '#60A5FA' : '#F8FAFC'} stroke="#CBD5E1" strokeWidth="1.5" />
                  <circle cx="12" cy="-12" r="14" fill={dyeColor === 'red' && dyeProgress > 80 ? '#F43F5E' : dyeColor === 'blue' && dyeProgress > 80 ? '#60A5FA' : '#F8FAFC'} stroke="#CBD5E1" strokeWidth="1.5" />
                  <circle cx="-12" cy="12" r="14" fill={dyeColor === 'red' && dyeProgress > 80 ? '#F43F5E' : dyeColor === 'blue' && dyeProgress > 80 ? '#60A5FA' : '#F8FAFC'} stroke="#CBD5E1" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="14" fill={dyeColor === 'red' && dyeProgress > 80 ? '#F43F5E' : dyeColor === 'blue' && dyeProgress > 80 ? '#60A5FA' : '#F8FAFC'} stroke="#CBD5E1" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="10" fill="#FBBF24" />
                </g>
              </g>

              {/* Right Side: Microscopic Stem Cross-Section Callout */}
              <g transform="translate(500, 100)">
                <circle cx="70" cy="70" r="65" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
                <circle cx="70" cy="70" r="45" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
                
                {/* Ring of Vascular Bundles */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
                  const rad = (deg * Math.PI) / 180;
                  const bx = 70 + Math.cos(rad) * 44;
                  const by = 70 + Math.sin(rad) * 44;
                  return (
                    <g key={idx}>
                      {/* Outer Phloem (Food) */}
                      <circle
                        cx={bx + Math.cos(rad) * 6}
                        cy={by + Math.sin(rad) * 6}
                        r="5"
                        fill="#F59E0B"
                        stroke="#B45309"
                        strokeWidth="1"
                      />
                      {/* Inner Xylem (Water) */}
                      <circle
                        cx={bx - Math.cos(rad) * 6}
                        cy={by - Math.sin(rad) * 6}
                        r="6"
                        fill="#0284C7"
                        stroke="#0369A1"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                <text x="70" y="-10" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F172A">
                  Stem Cross Section
                </text>
                <text x="70" y="7" textAnchor="middle" fontSize="8.5" fill="#475569">
                  (Vascular Bundles)
                </text>

                {/* Pointer to Phloem */}
                <line x1="120" y1="40" x2="150" y2="30" stroke="#B45309" strokeWidth="1" />
                <text x="154" y="33" fontSize="9" fontWeight="bold" fill="#B45309">
                  Phloem (Outer): Food
                </text>

                {/* Pointer to Xylem */}
                <line x1="85" y1="85" x2="150" y2="90" stroke="#0369A1" strokeWidth="1" />
                <text x="154" y="93" fontSize="9" fontWeight="bold" fill="#0284C7">
                  Xylem (Inner): Water
                </text>
              </g>

              {/* Photometer Capillary Tube at Bottom Left */}
              <g transform="translate(30, 280)">
                <rect x="0" y="10" width="170" height="14" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Air bubble tracker */}
                <rect
                  x={bubblePosition}
                  y="12"
                  width="18"
                  height="10"
                  rx="3"
                  fill="#EF4444"
                  opacity="0.85"
                />
                <text x="85" y="4" textAnchor="middle" fontSize="8.5" fill="#475569" fontFamily="monospace">
                  Photometer Bubble (Live Uptake)
                </text>
                {/* Scale ticks */}
                {[20, 50, 80, 110, 140].map(tx => (
                  <line key={tx} x1={tx} y1="10" x2={tx} y2="15" stroke="#475569" strokeWidth="1" />
                ))}
              </g>
            </svg>
          </div>

          {/* Interactive Experiment Toggle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRingStem}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isStemRinged
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isStemRinged ? 'Remove Ring Cut (Restore Phloem)' : 'Ring the Stem (Cut Outer Phloem Ring)'}
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setBubblePosition(15);
                  setDyeProgress(30);
                  setSwellingAmount(0);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                Reset Setup
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Watch swelling form above the cut as food accumulates!</span>
            </div>
          </div>
        </div>

        {/* Right Zone: Environmental Controls & P6 Concept Cards (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-slate-50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Environmental Variables
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Observe how weather conditions affect stomatal transpiration rate.
              </p>
            </div>

            {/* Sunlight Control */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Intensity
                </span>
                <span className="font-mono text-xs font-bold capitalize text-slate-900">{lightLevel}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['dark', 'normal', 'bright'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => { soundEffects.playClick(); setLightLevel(lvl); }}
                    className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      lightLevel === lvl
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Wind Speed Control */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-500" /> Wind Velocity
                </span>
                <span className="font-mono text-xs font-bold capitalize text-slate-900">{windLevel}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['still', 'breeze', 'windy'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => { soundEffects.playClick(); setWindLevel(lvl); }}
                    className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      windLevel === lvl
                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Humidity Control */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-500" /> Air Humidity
                </span>
                <span className="font-mono text-xs font-bold capitalize text-slate-900">{humidityLevel}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['dry', 'medium', 'humid'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => { soundEffects.playClick(); setHumidityLevel(lvl); }}
                    className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      humidityLevel === lvl
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Temperature
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="40"
                step="1"
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Key P6 Exam Distinction Note */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 text-xs">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>P6 Answering Mastery Rule:</span>
            </div>
            <div className="text-emerald-900 mt-1 leading-relaxed text-[11px] space-y-1">
              <div>
                <strong>Xylem:</strong> Transports water and dissolved mineral salts from roots <em>upwards only</em> to leaves and flowers.
              </div>
              <div>
                <strong>Phloem:</strong> Transports sugars/food made during photosynthesis in leaves to <em>all parts of the plant</em> (two-way transport).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
