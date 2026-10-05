import React, { useState } from 'react';
import { Cpu, Zap, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface Props {
  onRecordExperiment?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

type MaterialTest = 'copper' | 'graphite' | 'iron' | 'plastic' | 'rubber' | 'glass';

const TEST_MATERIALS: Record<MaterialTest, { name: string; isConductor: boolean; desc: string; icon: string }> = {
  copper: { name: 'Copper Coin', isConductor: true, desc: 'Metal with free valence electrons.', icon: '🪙' },
  iron: { name: 'Iron Nail', isConductor: true, desc: 'Magnetic metal conductor.', icon: '🔩' },
  graphite: { name: 'Graphite Pencil Lead', isConductor: true, desc: 'Non-metal form of carbon that conducts electricity!', icon: '✏️' },
  plastic: { name: 'Plastic Ruler', isConductor: false, desc: 'Insulator - tightly bound electrons prevent current flow.', icon: '📏' },
  rubber: { name: 'Rubber Eraser', isConductor: false, desc: 'Insulator - protects against electric shocks.', icon: '🧽' },
  glass: { name: 'Glass Rod', isConductor: false, desc: 'Insulator - does not allow electric current to pass.', icon: '🧪' }
};

export const CircuitBuilderLab: React.FC<Props> = ({ onRecordExperiment, onUnlockBadge }) => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel' | 'tester'>('series');
  const [batteryCount, setBatteryCount] = useState<number>(2); // 1.5V each
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [bulb1Blown, setBulb1Blown] = useState<boolean>(false);
  const [bulb2Blown, setBulb2Blown] = useState<boolean>(false);
  const [testedMaterial, setTestedMaterial] = useState<MaterialTest>('copper');

  const totalVoltage = batteryCount * 1.5; // Volts

  // Compute status for Series vs Parallel
  let bulb1Lit = false;
  let bulb2Lit = false;
  let bulbBrightnessClass = 'opacity-30';

  if (circuitType === 'series') {
    // In series, both bulbs and switch must be intact
    const circuitComplete = isSwitchClosed && !bulb1Blown && !bulb2Blown;
    bulb1Lit = circuitComplete;
    bulb2Lit = circuitComplete;
    // Two bulbs share voltage (dimmer than 1 bulb)
    bulbBrightnessClass = totalVoltage >= 4.5 ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]' : 'drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]';
  } else if (circuitType === 'parallel') {
    // In parallel, each branch is independent if main switch is closed
    if (isSwitchClosed) {
      bulb1Lit = !bulb1Blown;
      bulb2Lit = !bulb2Blown;
    }
    // Each bulb receives full voltage across branches!
    bulbBrightnessClass = 'drop-shadow-[0_0_20px_rgba(250,204,21,1.0)]';
  } else if (circuitType === 'tester') {
    const isMaterialConducting = TEST_MATERIALS[testedMaterial].isConductor;
    bulb1Lit = isSwitchClosed && isMaterialConducting;
  }

  const toggleSwitch = () => {
    soundEffects.playClick();
    setIsSwitchClosed(!isSwitchClosed);
  };

  const toggleBulb1 = () => {
    soundEffects.playClick();
    const nextState = !bulb1Blown;
    setBulb1Blown(nextState);
    if (nextState) {
      soundEffects.playWrong();
    } else {
      soundEffects.playBubble();
    }
    onRecordExperiment?.();
  };

  const toggleBulb2 = () => {
    soundEffects.playClick();
    const nextState = !bulb2Blown;
    setBulb2Blown(nextState);
    if (nextState) {
      soundEffects.playWrong();
    } else {
      soundEffects.playBubble();
    }
    onRecordExperiment?.();
  };

  return (
    <div className="bg-white/95 rounded-3xl border border-indigo-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-indigo-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-indigo-200/80 text-indigo-950 shadow-2xs">
              <Cpu className="w-4 h-4 fill-indigo-700" />
            </span>
            <h2 className="text-lg font-bold text-indigo-950 tracking-tight">
              Virtual Lab: Electrical Circuits & Conductivity
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare Series vs Parallel loops, test bulb failure resilience, and test electrical conductors.
          </p>
        </div>

        {/* Circuit Type Switcher (Pastel Rounded) */}
        <div className="flex items-center gap-1.5 p-1 bg-indigo-50/80 rounded-2xl border border-indigo-100/80">
          <button
            onClick={() => {
              soundEffects.playClick();
              setCircuitType('series');
              onUnlockBadge?.('badge_circuit_wizard');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              circuitType === 'series' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-indigo-950'
            }`}
          >
            Series Circuit
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setCircuitType('parallel');
              onUnlockBadge?.('badge_circuit_wizard');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              circuitType === 'parallel' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-indigo-950'
            }`}
          >
            Parallel Circuit
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setCircuitType('tester');
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              circuitType === 'tester' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-indigo-950'
            }`}
          >
            Conductivity Probe
          </button>
        </div>
      </div>

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Zone: Circuit Schematic SVG (8 cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/40 relative select-none">
          
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div>
              Circuit Mode: <strong className="text-slate-900 capitalize">{circuitType} Arrangement</strong>
            </div>
            <div className="font-mono text-xs">
              Supply Voltage: <span className="font-bold text-indigo-600">{totalVoltage.toFixed(1)} V</span>
            </div>
          </div>

          {/* SVG Circuit Canvas */}
          <div className="w-full aspect-[16/9] bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-inner flex items-center justify-center">
            <svg viewBox="0 0 620 280" className="w-full h-full">
              {/* Circuit Wires */}
              {circuitType === 'series' && (
                <g>
                  {/* Single closed rectangular loop */}
                  <rect
                    x="80"
                    y="60"
                    width="460"
                    height="160"
                    rx="8"
                    fill="none"
                    stroke={bulb1Lit ? '#38BDF8' : '#64748B'}
                    strokeWidth={bulb1Lit ? '4' : '3'}
                    strokeDasharray={bulb1Lit ? '8 4' : 'none'}
                    className={bulb1Lit ? 'animate-pulse-subtle' : ''}
                  />

                  {/* Battery on top wire */}
                  <g transform="translate(260, 45)">
                    <rect x="0" y="0" width="80" height="30" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <rect x="75" y="8" width="10" height="14" rx="2" fill="#E2E8F0" />
                    <text x="40" y="20" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      {totalVoltage.toFixed(1)}V
                    </text>
                  </g>

                  {/* Switch on right wire */}
                  <g
                    transform="translate(540, 140)"
                    className="cursor-pointer"
                    onClick={toggleSwitch}
                  >
                    <circle cx="0" cy="-20" r="5" fill="#334155" />
                    <circle cx="0" cy="20" r="5" fill="#334155" />
                    <line
                      x1="0"
                      y1="-20"
                      x2={isSwitchClosed ? 0 : 25}
                      y2={isSwitchClosed ? 20 : 5}
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <text x="18" y="-12" fontSize="9" fontWeight="bold" fill="#64748B">
                      {isSwitchClosed ? 'Switch Closed' : 'Switch Open'}
                    </text>
                  </g>

                  {/* Bulb 1 on bottom wire */}
                  <g
                    transform="translate(200, 220)"
                    className="cursor-pointer"
                    onClick={toggleBulb1}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill={bulb1Lit ? '#FEF08A' : '#F1F5F9'}
                      stroke={bulb1Lit ? '#EAB308' : '#94A3B8'}
                      strokeWidth="2.5"
                    />
                    <path
                      d="M -8 5 L -3 -6 L 3 -6 L 8 5"
                      fill="none"
                      stroke={bulb1Blown ? '#EF4444' : bulb1Lit ? '#CA8A04' : '#64748B'}
                      strokeWidth="2"
                    />
                    {bulb1Blown && <text x="0" y="3" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">✕</text>}
                    <text x="0" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
                      Bulb A {bulb1Blown ? '(Filament Melted)' : ''}
                    </text>
                  </g>

                  {/* Bulb 2 on bottom wire */}
                  <g
                    transform="translate(380, 220)"
                    className="cursor-pointer"
                    onClick={toggleBulb2}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill={bulb2Lit ? '#FEF08A' : '#F1F5F9'}
                      stroke={bulb2Lit ? '#EAB308' : '#94A3B8'}
                      strokeWidth="2.5"
                    />
                    <path
                      d="M -8 5 L -3 -6 L 3 -6 L 8 5"
                      fill="none"
                      stroke={bulb2Blown ? '#EF4444' : bulb2Lit ? '#CA8A04' : '#64748B'}
                      strokeWidth="2"
                    />
                    {bulb2Blown && <text x="0" y="3" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">✕</text>}
                    <text x="0" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
                      Bulb B {bulb2Blown ? '(Filament Melted)' : ''}
                    </text>
                  </g>
                </g>
              )}

              {/* Parallel Circuit Layout */}
              {circuitType === 'parallel' && (
                <g>
                  {/* Main Trunk wire */}
                  <path
                    d="M 80 60 L 520 60 L 520 220 L 80 220 Z"
                    fill="none"
                    stroke={isSwitchClosed ? '#38BDF8' : '#64748B'}
                    strokeWidth="3.5"
                  />

                  {/* Middle parallel branch wire */}
                  <line
                    x1="80"
                    y1="140"
                    x2="520"
                    y2="140"
                    stroke={isSwitchClosed ? '#38BDF8' : '#64748B'}
                    strokeWidth="3.5"
                  />

                  {/* Battery on top trunk */}
                  <g transform="translate(250, 45)">
                    <rect x="0" y="0" width="80" height="30" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <text x="40" y="20" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      {totalVoltage.toFixed(1)}V
                    </text>
                  </g>

                  {/* Main Switch on left vertical wire */}
                  <g
                    transform="translate(80, 100)"
                    className="cursor-pointer"
                    onClick={toggleSwitch}
                  >
                    <circle cx="0" cy="-15" r="4" fill="#334155" />
                    <circle cx="0" cy="15" r="4" fill="#334155" />
                    <line
                      x1="0"
                      y1="-15"
                      x2={isSwitchClosed ? 0 : -20}
                      y2={isSwitchClosed ? 15 : 0}
                      stroke="#EF4444"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Bulb 1 on Branch 1 (middle) */}
                  <g
                    transform="translate(300, 140)"
                    className="cursor-pointer"
                    onClick={toggleBulb1}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill={bulb1Lit ? '#FEF08A' : '#F1F5F9'}
                      stroke={bulb1Lit ? '#EAB308' : '#94A3B8'}
                      strokeWidth="2.5"
                      className={bulb1Lit ? bulbBrightnessClass : ''}
                    />
                    {bulb1Blown && <text x="0" y="4" textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="bold">✕</text>}
                    <text x="0" y="-25" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
                      Branch 1 Bulb
                    </text>
                  </g>

                  {/* Bulb 2 on Branch 2 (bottom) */}
                  <g
                    transform="translate(300, 220)"
                    className="cursor-pointer"
                    onClick={toggleBulb2}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill={bulb2Lit ? '#FEF08A' : '#F1F5F9'}
                      stroke={bulb2Lit ? '#EAB308' : '#94A3B8'}
                      strokeWidth="2.5"
                      className={bulb2Lit ? bulbBrightnessClass : ''}
                    />
                    {bulb2Blown && <text x="0" y="4" textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="bold">✕</text>}
                    <text x="0" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
                      Branch 2 Bulb
                    </text>
                  </g>
                </g>
              )}

              {/* Conductivity Tester Mode */}
              {circuitType === 'tester' && (
                <g>
                  {/* Loop with gap at bottom */}
                  <path
                    d="M 80 60 L 520 60 L 520 180 L 350 180"
                    fill="none"
                    stroke={bulb1Lit ? '#38BDF8' : '#64748B'}
                    strokeWidth="3.5"
                  />
                  <path
                    d="M 80 60 L 80 180 L 230 180"
                    fill="none"
                    stroke={bulb1Lit ? '#38BDF8' : '#64748B'}
                    strokeWidth="3.5"
                  />

                  {/* Battery */}
                  <g transform="translate(260, 45)">
                    <rect x="0" y="0" width="80" height="30" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="2" />
                    <text x="40" y="20" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      3.0V
                    </text>
                  </g>

                  {/* Indicator Light Bulb */}
                  <g transform="translate(520, 110)">
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill={bulb1Lit ? '#FEF08A' : '#F1F5F9'}
                      stroke={bulb1Lit ? '#EAB308' : '#94A3B8'}
                      strokeWidth="2.5"
                      className={bulb1Lit ? 'drop-shadow-[0_0_20px_rgba(250,204,21,1.0)]' : ''}
                    />
                    <text x="32" y="4" fontSize="9" fontWeight="bold" fill="#475569">
                      Test Indicator Bulb
                    </text>
                  </g>

                  {/* Test Probes touching the Material */}
                  <circle cx="230" cy="180" r="5" fill="#E11D48" />
                  <circle cx="350" cy="180" r="5" fill="#E11D48" />

                  {/* The Test Sample */}
                  <g transform="translate(240, 160)">
                    <rect
                      x="0"
                      y="0"
                      width="100"
                      height="40"
                      rx="6"
                      fill={TEST_MATERIALS[testedMaterial].isConductor ? '#DCFCE7' : '#FEE2E2'}
                      stroke={TEST_MATERIALS[testedMaterial].isConductor ? '#16A34A' : '#DC2626'}
                      strokeWidth="2"
                    />
                    <text x="50" y="24" textAnchor="middle" fontSize="18">
                      {TEST_MATERIALS[testedMaterial].icon}
                    </text>
                    <text x="50" y="55" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#1E293B">
                      {TEST_MATERIALS[testedMaterial].name}
                    </text>
                  </g>
                </g>
              )}
            </svg>

            {/* Diagnostic Alert Box */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs">
              <div className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                bulb1Lit || bulb2Lit
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {bulb1Lit || bulb2Lit ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Closed Circuit: Electric current flows through complete loop!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Open Circuit: Current path is broken. No current flows!</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Interactive Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSwitch}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSwitchClosed ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isSwitchClosed ? 'Open Circuit Switch' : 'Close Circuit Switch'}
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setBulb1Blown(false);
                  setBulb2Blown(false);
                  setIsSwitchClosed(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Replace All Filaments
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Tip: Click any bulb to simulate a melted/broken filament!
            </div>
          </div>
        </div>

        {/* Right Zone: Controls & Scientific Concepts (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-slate-50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Circuit Components
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust power voltage and test conductive materials.
              </p>
            </div>

            {/* Battery Voltage Slider */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Batteries in Series</span>
                <span className="font-mono text-xs font-bold text-indigo-600">{batteryCount} Cells ({totalVoltage}V)</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => { soundEffects.playClick(); setBatteryCount(cnt); }}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                      batteryCount === cnt
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cnt} Cell ({cnt * 1.5}V)
                  </button>
                ))}
              </div>
            </div>

            {/* If in Tester Mode: Material Selection */}
            {circuitType === 'tester' && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Material to Test
                </label>
                <div className="space-y-1">
                  {(Object.keys(TEST_MATERIALS) as MaterialTest[]).map(key => (
                    <button
                      key={key}
                      onClick={() => {
                        soundEffects.playClick();
                        setTestedMaterial(key);
                        if (TEST_MATERIALS[key].isConductor) {
                          soundEffects.playCorrect();
                        } else {
                          soundEffects.playWrong();
                        }
                      }}
                      className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                        testedMaterial === key
                          ? 'bg-indigo-50 border border-indigo-300 text-indigo-900 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{TEST_MATERIALS[key].icon}</span>
                        <span>{TEST_MATERIALS[key].name}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        TEST_MATERIALS[key].isConductor ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {TEST_MATERIALS[key].isConductor ? 'Conductor' : 'Insulator'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary 6 Answering Rule */}
          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3.5 text-xs">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-700" />
              <span>P6 Series vs Parallel Key Differences:</span>
            </div>
            <div className="text-indigo-900 mt-1 leading-relaxed text-[11px] space-y-1">
              <div>
                <strong>Parallel Advantage:</strong> Each bulb connects directly to the power source with full voltage. If one bulb blows, the other branches remain closed loops and continue shining!
              </div>
              <div>
                <strong>Series Disadvantage:</strong> Bulbs share voltage and shine dimmer. If one bulb filament melts, the whole circuit opens and all bulbs go off.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
