import React, { useState } from 'react';
import { Trees, AlertCircle, RefreshCw, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface Props {
  onRecordExperiment?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
}

interface Organism {
  id: string;
  name: string;
  role: 'Producer' | 'Primary Consumer' | 'Secondary Consumer' | 'Apex Predator' | 'Decomposer';
  population: number; // 0 to 100 index
  basePopulation: number;
  icon: string;
  x: number;
  y: number;
  feedsOn: string[];
  eatenBy: string[];
}

const INITIAL_ORGANISMS: Organism[] = [
  {
    id: 'sun',
    name: 'Sunlight Energy',
    role: 'Producer',
    population: 100,
    basePopulation: 100,
    icon: '☀️',
    x: 60,
    y: 40,
    feedsOn: [],
    eatenBy: ['grass']
  },
  {
    id: 'grass',
    name: 'Wild Grass & Ferns',
    role: 'Producer',
    population: 85,
    basePopulation: 85,
    icon: '🌾',
    x: 140,
    y: 190,
    feedsOn: ['sun'],
    eatenBy: ['caterpillar', 'rabbit']
  },
  {
    id: 'caterpillar',
    name: 'Grasshoppers & Caterpillars',
    role: 'Primary Consumer',
    population: 70,
    basePopulation: 70,
    icon: '🐛',
    x: 290,
    y: 220,
    feedsOn: ['grass'],
    eatenBy: ['frog', 'bird']
  },
  {
    id: 'rabbit',
    name: 'Wild Rabbits',
    role: 'Primary Consumer',
    population: 60,
    basePopulation: 60,
    icon: '🐇',
    x: 290,
    y: 130,
    feedsOn: ['grass'],
    eatenBy: ['hawk']
  },
  {
    id: 'frog',
    name: 'Tree Frogs',
    role: 'Secondary Consumer',
    population: 55,
    basePopulation: 55,
    icon: '🐸',
    x: 430,
    y: 210,
    feedsOn: ['caterpillar'],
    eatenBy: ['hawk']
  },
  {
    id: 'bird',
    name: 'Woodland Robins',
    role: 'Secondary Consumer',
    population: 50,
    basePopulation: 50,
    icon: '🐦',
    x: 430,
    y: 120,
    feedsOn: ['caterpillar'],
    eatenBy: ['hawk']
  },
  {
    id: 'hawk',
    name: 'Crested Hawk',
    role: 'Apex Predator',
    population: 30,
    basePopulation: 30,
    icon: '🦅',
    x: 580,
    y: 160,
    feedsOn: ['rabbit', 'frog', 'bird'],
    eatenBy: ['fungi']
  },
  {
    id: 'fungi',
    name: 'Fungi & Soil Decomposers',
    role: 'Decomposer',
    population: 80,
    basePopulation: 80,
    icon: '🍄',
    x: 350,
    y: 50,
    feedsOn: ['grass', 'caterpillar', 'rabbit', 'frog', 'bird', 'hawk'],
    eatenBy: []
  }
];

export const EcosystemFoodWebLab: React.FC<Props> = ({ onRecordExperiment, onUnlockBadge }) => {
  const [organisms, setOrganisms] = useState<Organism[]>(INITIAL_ORGANISMS);
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>('caterpillar');
  const [simulationYear, setSimulationYear] = useState<number>(1);
  const [activeShock, setActiveShock] = useState<string>('none');
  const [cascadeHistory, setCascadeHistory] = useState<string[]>([
    'Year 1: Forest ecosystem is in stable dynamic equilibrium.'
  ]);

  const selectedOrg = organisms.find(o => o.id === selectedOrganismId) || organisms[1];

  // Apply Environmental Shock Scenario
  const applyShock = (type: 'drought' | 'pesticide' | 'overhunt' | 'restore') => {
    soundEffects.playClick();
    setActiveShock(type);

    setOrganisms(prev => {
      return prev.map(org => {
        if (type === 'restore') {
          return { ...org, population: org.basePopulation };
        }
        if (type === 'drought') {
          // Severe drought kills 70% of grass
          if (org.id === 'grass') return { ...org, population: 20 };
          return org;
        }
        if (type === 'pesticide') {
          // Chemical insecticide kills 85% of insects
          if (org.id === 'caterpillar') return { ...org, population: 10 };
          return org;
        }
        if (type === 'overhunt') {
          // Poachers kill all hawks
          if (org.id === 'hawk') return { ...org, population: 0 };
          return org;
        }
        return org;
      });
    });

    if (type === 'restore') {
      setCascadeHistory(prev => [
        `Year ${simulationYear + 1}: Ecosystem restored with conservation protection!`,
        ...prev.slice(0, 4)
      ]);
    } else {
      soundEffects.playWrong();
      setCascadeHistory(prev => [
        `Year ${simulationYear + 1}: Triggered ${type.toUpperCase()} disaster shock!`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  // Advance simulation by 1 year (Trophic Cascade propagation)
  const advanceYear = () => {
    soundEffects.playBubble();
    const nextYear = simulationYear + 1;
    setSimulationYear(nextYear);

    setOrganisms(prev => {
      const grass = prev.find(o => o.id === 'grass')?.population || 80;
      const insects = prev.find(o => o.id === 'caterpillar')?.population || 70;
      const frogs = prev.find(o => o.id === 'frog')?.population || 50;
      const hawks = prev.find(o => o.id === 'hawk')?.population || 30;

      return prev.map(org => {
        let newPop = org.population;

        if (org.id === 'grass') {
          // Grass grows with sunlight, eaten by caterpillars and rabbits
          if (insects < 25) {
            newPop = Math.min(100, newPop + 15); // flourishes
          } else if (insects > 85) {
            newPop = Math.max(15, newPop - 25); // overgrazed
          }
        } else if (org.id === 'caterpillar') {
          // Depends on grass food; eaten by frogs & birds
          if (grass < 30) {
            newPop = Math.max(5, newPop - 30); // starves
          } else if (frogs < 20) {
            newPop = Math.min(100, newPop + 25); // boom without predators!
          }
        } else if (org.id === 'frog') {
          // Depends on caterpillars; eaten by hawks
          if (insects < 20) {
            newPop = Math.max(5, newPop - 25); // food shortage
          } else if (hawks === 0) {
            newPop = Math.min(95, newPop + 20); // no predator
          }
        } else if (org.id === 'hawk') {
          // Eats frogs, rabbits, birds
          if (frogs < 15) {
            newPop = Math.max(2, newPop - 10);
          }
        }

        return { ...org, population: Math.round(newPop) };
      });
    });

    onRecordExperiment?.();
    onUnlockBadge?.('badge_food_web_hero');
  };

  return (
    <div className="bg-white/95 rounded-3xl border border-teal-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-teal-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-green-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-teal-200/80 text-teal-950 shadow-2xs">
              <Trees className="w-4 h-4 fill-teal-700" />
            </span>
            <h2 className="text-lg font-bold text-teal-950 tracking-tight">
              Virtual Lab: Ecosystem Food Web & Trophic Cascades
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate energy flow from the Sun to apex predators. Test how disruptions affect interdependent populations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/90 px-3.5 py-1.5 rounded-xl border border-teal-100 shadow-2xs">
            <span className="text-slate-500">Simulation:</span>
            <span className="font-mono font-bold text-teal-900">Year {simulationYear}</span>
          </div>

          <button
            onClick={advanceYear}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-teal-200 hover:bg-teal-300 text-teal-950 border border-teal-300 shadow-xs transition-all active:scale-95"
          >
            Advance 1 Year <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Zone: Interactive SVG Food Web Graph (8 cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-gradient-to-b from-sky-50/20 to-emerald-50/20 relative select-none">
          
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div>
              Energy Flow: <span className="text-slate-700 font-semibold">Sunlight → Producers → Primary Consumers → Predators</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Click any organism node to inspect feeding relationships!
            </div>
          </div>

          {/* Food Web SVG Map */}
          <div className="w-full aspect-[16/9] bg-white rounded-xl border border-slate-200 p-2 relative shadow-inner overflow-hidden">
            <svg viewBox="0 0 680 300" className="w-full h-full">
              {/* Energy Flow Arrows (Lines between feeding pairs) */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#0D9488" />
                </marker>
                <marker id="arrowDecomposer" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#CA8A04" />
                </marker>
              </defs>

              {/* Connections */}
              {[
                { from: 'sun', to: 'grass' },
                { from: 'grass', to: 'caterpillar' },
                { from: 'grass', to: 'rabbit' },
                { from: 'caterpillar', to: 'frog' },
                { from: 'caterpillar', to: 'bird' },
                { from: 'rabbit', to: 'hawk' },
                { from: 'frog', to: 'hawk' },
                { from: 'bird', to: 'hawk' },
                { from: 'hawk', to: 'fungi' }
              ].map((conn, idx) => {
                const source = organisms.find(o => o.id === conn.from);
                const target = organisms.find(o => o.id === conn.to);
                if (!source || !target) return null;

                const isConnectedToSelected =
                  source.id === selectedOrganismId || target.id === selectedOrganismId;

                return (
                  <line
                    key={idx}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isConnectedToSelected ? '#0D9488' : '#CBD5E1'}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                    strokeDasharray={conn.to === 'fungi' ? '3 3' : 'none'}
                    markerEnd={conn.to === 'fungi' ? 'url(#arrowDecomposer)' : 'url(#arrow)'}
                    opacity={isConnectedToSelected ? 0.9 : 0.4}
                  />
                );
              })}

              {/* Organism Nodes */}
              {organisms.map(org => {
                const isSelected = org.id === selectedOrganismId;
                const popColor =
                  org.population > 60
                    ? '#10B981'
                    : org.population > 25
                    ? '#F59E0B'
                    : '#EF4444';

                return (
                  <g
                    key={org.id}
                    transform={`translate(${org.x}, ${org.y})`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedOrganismId(org.id);
                    }}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle cx="0" cy="0" r="30" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeDasharray="4 2" />
                    )}

                    {/* Node background circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="#FFFFFF"
                      stroke={isSelected ? '#0D9488' : '#E2E8F0'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />

                    {/* Emoji Icon */}
                    <text x="0" y="6" textAnchor="middle" fontSize="18">
                      {org.icon}
                    </text>

                    {/* Name tag */}
                    <text
                      x="0"
                      y="34"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#1E293B"
                    >
                      {org.name.split(' ')[0]}
                    </text>

                    {/* Live population badge */}
                    {org.id !== 'sun' && (
                      <g transform="translate(14, -14)">
                        <circle cx="0" cy="0" r="9" fill={popColor} />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#FFF"
                          fontSize="7"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {org.population}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Environmental Shock Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Trigger Environmental Shock Scenarios:
              </span>
              <button
                onClick={() => applyShock('restore')}
                className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Reset Ecosystem
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyShock('drought')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  activeShock === 'drought'
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold">Severe Drought</div>
                <div className="text-[10px] text-slate-500">70% grass withered</div>
              </button>

              <button
                onClick={() => applyShock('pesticide')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  activeShock === 'pesticide'
                    ? 'bg-rose-100 border-rose-300 text-rose-900 font-semibold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold">Insecticide Spray</div>
                <div className="text-[10px] text-slate-500">85% insects wiped out</div>
              </button>

              <button
                onClick={() => applyShock('overhunt')}
                className={`p-2 rounded-lg text-left text-xs transition-all border ${
                  activeShock === 'overhunt'
                    ? 'bg-purple-100 border-purple-300 text-purple-900 font-semibold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="font-bold">Hawk Poaching</div>
                <div className="text-[10px] text-slate-500">Apex predators eradicated</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone: Organism Profile & Cascade Log (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-slate-50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Organism Trophic Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect how this species connects in the energy chain.
              </p>
            </div>

            {/* Selected Organism Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-slate-100 rounded-xl">{selectedOrg.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedOrg.name}</h4>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedOrg.role}
                  </span>
                </div>
              </div>

              {selectedOrg.id !== 'sun' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Population Health:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedOrg.population} / 100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${selectedOrg.population}%` }}
                      className={`h-full transition-all duration-300 ${
                        selectedOrg.population > 60
                          ? 'bg-emerald-500'
                          : selectedOrg.population > 25
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="text-xs space-y-1 pt-2 border-t border-slate-100 text-slate-600">
                <div>
                  <strong>Prey / Food Source:</strong>{' '}
                  {selectedOrg.feedsOn.length > 0 ? selectedOrg.feedsOn.join(', ') : 'Direct Solar Photons'}
                </div>
                <div>
                  <strong>Predators:</strong>{' '}
                  {selectedOrg.eatenBy.length > 0 ? selectedOrg.eatenBy.join(', ') : 'None (Apex / Decomposer)'}
                </div>
              </div>
            </div>

            {/* Cascade Event Log */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700">Trophic Cascade Log:</div>
              <div className="space-y-1.5 text-[11px] text-slate-600 font-mono">
                {cascadeHistory.map((entry, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* P6 Exam Tip */}
          <div className="bg-teal-50/80 border border-teal-200/80 rounded-xl p-3.5 text-xs">
            <div className="font-bold text-teal-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>P6 Exam Trophic Interdependence:</span>
            </div>
            <p className="text-teal-900 mt-1 leading-relaxed text-[11px]">
              When top predators are removed, their direct prey population increases due to lack of predation. This in turn leads to the overconsumption and decline of organisms at the lower trophic level!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
