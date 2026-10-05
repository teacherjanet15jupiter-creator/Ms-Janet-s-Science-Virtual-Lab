import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Music, Video, BookOpen,
  Award, Sparkles, CheckCircle2, ChevronRight, Download, Share2,
  Clock, Flame, HelpCircle, Layers, ExternalLink, ShieldCheck, Heart
} from 'lucide-react';
import { soundEffects } from '../../utils/sound';

export interface ScienceSong {
  id: string;
  title: string;
  theme: 'Systems' | 'Cycles' | 'Energy' | 'Interactions';
  gradeLevel: 'Primary 5' | 'Primary 6' | 'Both';
  cambridgeCode: string;
  durationSec: number;
  melodyNotes: { freq: number; duration: number }[]; // Web Audio oscillator notes
  tempoBpm: number;
  lyrics: {
    timeSec: number;
    text: string;
    chorus?: boolean;
    explanation?: string;
  }[];
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  gradeLevel: 'Primary 5' | 'Primary 6' | 'Both';
  cambridgeCode: string;
  duration: string;
  videoUrl?: string; // YouTube embed or custom video
  embedId: string;
  thumbnailGradient: string;
  description: string;
  chapters: { time: string; title: string }[];
  keyTakeaways: string[];
  examPointer: string;
}

export const SCIENCE_SONGS: ScienceSong[] = [
  {
    id: 'song_cell',
    title: 'The Living Cell Song (Plant vs Animal)',
    theme: 'Systems',
    gradeLevel: 'Both',
    cambridgeCode: '6Bs.01 & 5Bs.03',
    durationSec: 36,
    tempoBpm: 120,
    melodyNotes: [
      { freq: 261.63, duration: 0.3 }, // C4
      { freq: 329.63, duration: 0.3 }, // E4
      { freq: 392.00, duration: 0.3 }, // G4
      { freq: 523.25, duration: 0.6 }, // C5
      { freq: 440.00, duration: 0.3 }, // A4
      { freq: 392.00, duration: 0.3 }, // G4
      { freq: 349.23, duration: 0.3 }, // F4
      { freq: 329.63, duration: 0.6 }, // E4
      { freq: 293.66, duration: 0.3 }, // D4
      { freq: 329.63, duration: 0.3 }, // E4
      { freq: 349.23, duration: 0.3 }, // F4
      { freq: 392.00, duration: 0.6 }, // G4
      { freq: 261.63, duration: 0.6 }, // C4
    ],
    lyrics: [
      { timeSec: 0, text: '🎵 Plant cell has a sturdy wall, cellulose is standing tall!' },
      { timeSec: 5, text: '🛡️ Cell wall gives a regular shape, keeps the water from escape!' },
      { timeSec: 10, text: '🟢 Chloroplasts of vivid green, photosynthesizing queen!' },
      { timeSec: 15, text: '💧 One big vacuole deep and blue, cell sap keeps it firm and true!' },
      { timeSec: 20, text: '🐾 Animal cell is round and free, flexible membrane you can see!' },
      { timeSec: 25, text: '🟣 Center nucleus holds the code, commanding down the life road!' },
      { timeSec: 30, text: '✨ Tiny vacuoles in a row, that is how the living cells grow!' }
    ]
  },
  {
    id: 'song_transport',
    title: 'Xylem & Phloem Highway',
    theme: 'Systems',
    gradeLevel: 'Both',
    cambridgeCode: '6Bp.01 & 5Bp.01',
    durationSec: 32,
    tempoBpm: 128,
    melodyNotes: [
      { freq: 392.00, duration: 0.25 }, // G4
      { freq: 392.00, duration: 0.25 },
      { freq: 440.00, duration: 0.25 },
      { freq: 523.25, duration: 0.5 },
      { freq: 440.00, duration: 0.25 },
      { freq: 392.00, duration: 0.5 },
      { freq: 329.63, duration: 0.25 },
      { freq: 349.23, duration: 0.25 },
      { freq: 392.00, duration: 0.5 },
      { freq: 329.63, duration: 0.25 },
      { freq: 261.63, duration: 0.6 },
    ],
    lyrics: [
      { timeSec: 0, text: '🌿 Deep inside the stem so good, Xylem in the inner wood!' },
      { timeSec: 5, text: '💧 Drinking water from the ground, mineral salts are upward bound!' },
      { timeSec: 10, text: '☀️ Transpiration pulls it high, to the leaves beneath the sky!' },
      { timeSec: 15, text: '🍂 On the outside near the bark, Phloem tubes are making marks!' },
      { timeSec: 20, text: '🍯 Sugar food from sunny leaves, moving both ways through the trees!' },
      { timeSec: 26, text: '✂️ Cut the phloem in a ring, swollen stem is what you bring!' }
    ]
  },
  {
    id: 'song_energy',
    title: 'Energy Can Never Die (Conservation Rap)',
    theme: 'Energy',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Pf.01',
    durationSec: 34,
    tempoBpm: 130,
    melodyNotes: [
      { freq: 220.00, duration: 0.2 },
      { freq: 261.63, duration: 0.2 },
      { freq: 329.63, duration: 0.4 },
      { freq: 440.00, duration: 0.4 },
      { freq: 392.00, duration: 0.2 },
      { freq: 329.63, duration: 0.4 },
      { freq: 261.63, duration: 0.4 },
      { freq: 293.66, duration: 0.2 },
      { freq: 329.63, duration: 0.4 },
    ],
    lyrics: [
      { timeSec: 0, text: '⚡ Energy can never die, roller coaster climbing high!' },
      { timeSec: 5, text: '🏔️ At the top it is G-P-E, ready for a ride so free!' },
      { timeSec: 10, text: '🏎️ Zooming down into K-E, speed as fast as you can see!' },
      { timeSec: 16, text: '🔥 Friction rubs against the track, heat and sound are clicking back!' },
      { timeSec: 22, text: '⚖️ Never lost and not destroyed, just transformed and so enjoyed!' },
      { timeSec: 28, text: '🏆 Total energy stays in frame, that is conservation\'s name!' }
    ]
  },
  {
    id: 'song_water_cycle',
    title: 'Water Cycle Reggae (Changes of State)',
    theme: 'Cycles',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Es.01',
    durationSec: 32,
    tempoBpm: 110,
    melodyNotes: [
      { freq: 261.63, duration: 0.35 },
      { freq: 329.63, duration: 0.35 },
      { freq: 392.00, duration: 0.35 },
      { freq: 349.23, duration: 0.35 },
      { freq: 329.63, duration: 0.35 },
      { freq: 293.66, duration: 0.5 },
      { freq: 261.63, duration: 0.7 },
    ],
    lyrics: [
      { timeSec: 0, text: '☀️ Sun is shining warm and sweet, water liquid takes the heat!' },
      { timeSec: 5, text: '💨 Evaporation in the breeze, gas is rising up with ease!' },
      { timeSec: 10, text: '☁️ Up into the cooler sky, condensation floating high!' },
      { timeSec: 16, text: '💧 Vapour loses heat so fast, forming water drops at last!' },
      { timeSec: 22, text: '🌧️ Clouds get heavy, let it fall, precipitation for us all!' },
      { timeSec: 27, text: '🌊 Rivers flowing to the sea, water cycle wild and free!' }
    ]
  },
  {
    id: 'song_circuits',
    title: 'Circuit Power (Parallel vs Series)',
    theme: 'Energy',
    gradeLevel: 'Both',
    cambridgeCode: '5Pe.01 & 6Pe.01',
    durationSec: 30,
    tempoBpm: 125,
    melodyNotes: [
      { freq: 329.63, duration: 0.25 },
      { freq: 392.00, duration: 0.25 },
      { freq: 440.00, duration: 0.25 },
      { freq: 523.25, duration: 0.5 },
      { freq: 392.00, duration: 0.25 },
      { freq: 329.63, duration: 0.5 },
    ],
    lyrics: [
      { timeSec: 0, text: '💡 Series is a single loop, electricity in a group!' },
      { timeSec: 5, text: '⚠️ One bulb breaks and all goes black, open circuit stops the track!' },
      { timeSec: 10, text: '⚡ Parallel has branches two, independent through and through!' },
      { timeSec: 16, text: '🏠 In our homes we wire this way, lights are glowing night and day!' },
      { timeSec: 22, text: '🔌 If one bulb should blow tonight, all the others still shine bright!' }
    ]
  }
];

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v_cell_masterclass',
    title: 'Plant vs Animal Cells Under the Microscope',
    subject: 'Life Sciences & Biology',
    gradeLevel: 'Both',
    cambridgeCode: '6Bs.01 & 5Bs.03',
    duration: '07:45',
    embedId: 'URUJD5NEXC8', // Educational cell structure video
    thumbnailGradient: 'from-emerald-600 via-teal-700 to-indigo-900',
    description: 'Watch live light microscope preparation of Elodea waterweed leaf cells and human cheek epithelial cells. Learn why plant cells have cell walls and chloroplasts while animal cells do not.',
    chapters: [
      { time: '00:00', title: 'Introduction & Microscope Setup' },
      { time: '01:45', title: 'Elodea Plant Cell (400x) & Chloroplast Cyclosis' },
      { time: '03:30', title: 'Human Cheek Cell Methylene Blue Staining' },
      { time: '05:15', title: 'Diagnostic Comparison Table & Exam Questions' },
      { time: '06:40', title: 'Why Onion Cells Lack Chloroplasts' }
    ],
    keyTakeaways: [
      'Plant cells have a cellulose cell wall, large central vacuole, and chloroplasts (in green parts).',
      'Animal cells lack cell walls and chloroplasts, allowing flexible organic shapes.',
      'The nucleus contains hereditary genetic material (DNA) and directs all cellular activities.'
    ],
    examPointer: 'Always specify that the nucleus "controls all cellular activities and contains genetic information" — never just "the brain".'
  },
  {
    id: 'v_plant_transport',
    title: 'Plant Transport System: Xylem, Phloem & Bark Ringing',
    subject: 'Plant Biology & Systems',
    gradeLevel: 'Both',
    cambridgeCode: '6Bp.01 & 5Bp.01',
    duration: '06:30',
    embedId: 'jtuX7H05tmQ',
    thumbnailGradient: 'from-green-600 via-emerald-800 to-slate-900',
    description: 'Explore how water travels from roots to leaves through xylem capillaries, and how food manufactured in leaves travels through outer phloem sieve tubes. Includes the classic celery food coloring and bark ringing demonstrations.',
    chapters: [
      { time: '00:00', title: 'Xylem vs Phloem Structure' },
      { time: '02:00', title: 'Celery Dye Experiment (Capillary Action & Transpiration)' },
      { time: '04:15', title: 'Bark Ringing Experiment & Why Swelling Occurs' },
      { time: '05:40', title: 'Cambridge Checkpoint Exam Analysis' }
    ],
    keyTakeaways: [
      'Xylem vessels are in the inner wood, transporting water and dissolved minerals upwards.',
      'Phloem tubes are in the outer bark, transporting sugar food both upwards and downwards.',
      'Bark ringing severs phloem; food accumulates above the cut causing swelling.'
    ],
    examPointer: 'In bark ringing questions, explain that food made in leaves travels downwards and cannot pass the cut gap.'
  },
  {
    id: 'v_circulatory',
    title: 'The Human Circulatory System & Double Loop Blood Flow',
    subject: 'Human Anatomy & Systems',
    gradeLevel: 'Primary 5',
    cambridgeCode: '5Bs.01',
    duration: '08:20',
    embedId: 'q0s-1MC1hcE',
    thumbnailGradient: 'from-rose-600 via-red-800 to-indigo-950',
    description: 'Discover how the heart functions as a muscular double pump. Follow oxygen-poor blood to the lungs and oxygen-rich blood out through the aorta to powering muscles during exercise.',
    chapters: [
      { time: '00:00', title: 'Heart Chambers: Atria & Ventricles' },
      { time: '02:30', title: 'Arteries, Veins & Microscopic Capillaries' },
      { time: '05:10', title: 'Gaseous Exchange at Lung Alveoli' },
      { time: '06:55', title: 'Why Heart Rate Increases During Exercise' }
    ],
    keyTakeaways: [
      'The heart pumps blood through arteries (away from heart), veins (back to heart), and capillaries.',
      'Oxygen and glucose are delivered to muscle cells for cellular respiration to release energy.',
      'Pulse rate increases to deliver more oxygen/food and remove carbon dioxide faster.'
    ],
    examPointer: 'State that the heart beats faster to pump more oxygen and digested food to active muscles for faster respiration.'
  },
  {
    id: 'v_rollercoaster',
    title: 'Roller Coaster Physics: Gravitational Potential to Kinetic Energy',
    subject: 'Physics & Energy',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Pf.01',
    duration: '09:10',
    embedId: 'Ehx1P4aS56I',
    thumbnailGradient: 'from-amber-500 via-orange-700 to-purple-950',
    description: 'Learn the law of conservation of energy using real roller coaster track simulations. See how height converts into maximum speed at the bottom of the loop, and where friction converts energy to heat.',
    chapters: [
      { time: '00:00', title: 'Principle of Conservation of Energy' },
      { time: '02:45', title: 'GPE at Peak Height vs Maximum KE at Track Bottom' },
      { time: '05:20', title: 'Friction & Thermal Energy Transformation' },
      { time: '07:30', title: 'Common Exam Pitfalls & Section B Marking Scheme' }
    ],
    keyTakeaways: [
      'Energy cannot be created or destroyed; it can only be converted from one form to another.',
      'Maximum GPE occurs at the highest peak; maximum KE occurs at the lowest point of motion.',
      'Mechanical energy converts into thermal (heat) and sound energy due to friction.'
    ],
    examPointer: 'Never say energy is "lost" or "disappeared". Say mechanical energy is "converted into heat and sound due to friction".'
  },
  {
    id: 'v_eclipses',
    title: 'Earth & Moon: Solar vs Lunar Eclipses in 3D Space',
    subject: 'Earth & Space Science',
    gradeLevel: 'Primary 6',
    cambridgeCode: '6Es.01',
    duration: '07:50',
    embedId: 'cxrLRbkOwKs',
    thumbnailGradient: 'from-indigo-600 via-sky-800 to-slate-950',
    description: 'Visualizing alignments of the Sun, Earth, and Moon. See why solar eclipses only happen during New Moon and cast narrow shadow cones, while lunar eclipses turn the Moon copper-red during Full Moon.',
    chapters: [
      { time: '00:00', title: 'Solar Eclipse Alignment (Sun - Moon - Earth)' },
      { time: '02:30', title: 'Umbra vs Penumbra Shadow Geometry' },
      { time: '04:45', title: 'Lunar Eclipse (Sun - Earth - Moon) & Blood Moon' },
      { time: '06:20', title: 'Why Eclipses Do Not Happen Every Month' }
    ],
    keyTakeaways: [
      'Solar Eclipse: Moon is between Sun and Earth (New Moon phase).',
      'Lunar Eclipse: Earth is between Sun and Moon (Full Moon phase).',
      'The Moon\'s orbital plane is tilted ~5 degrees relative to Earth\'s orbit, so eclipses are rare.'
    ],
    examPointer: 'Remember: Solar = Sun-Moon-Earth (SME); Lunar = Sun-Earth-Moon (SEM).'
  }
];

export const ScienceMediaHub: React.FC = () => {
  const [activeMediaTab, setActiveMediaTab] = useState<'songs' | 'videos'>('songs');
  const [selectedSong, setSelectedSong] = useState<ScienceSong>(SCIENCE_SONGS[0]);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [songProgressSec, setSongProgressSec] = useState<number>(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(VIDEO_LESSONS[0]);
  const [gradeFilter, setGradeFilter] = useState<'all' | 'Primary 5' | 'Primary 6'>('all');

  // Web Audio Synthesizer references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<any>(null);
  const songStartTimeRef = useRef<number>(0);

  // Filtered lists
  const filteredSongs = SCIENCE_SONGS.filter(s =>
    gradeFilter === 'all' ? true : s.gradeLevel === 'Both' || s.gradeLevel === gradeFilter
  );
  const filteredVideos = VIDEO_LESSONS.filter(v =>
    gradeFilter === 'all' ? true : v.gradeLevel === 'Both' || v.gradeLevel === gradeFilter
  );

  // Play musical melody using Web Audio API
  const playSynthesizerMelody = (song: ScienceSong) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const startTime = ctx.currentTime;
      let noteTime = startTime;

      // Play notes sequence
      song.melodyNotes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Sweet melodic chiptune tone
        osc.frequency.setValueAtTime(note.freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + note.duration);

        noteTime += note.duration + 0.05;
      });
    } catch {
      // Audio fallback
    }
  };

  const handlePlaySong = () => {
    soundEffects.playClick();
    if (isPlayingSong) {
      // Pause
      setIsPlayingSong(false);
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    } else {
      // Play
      setIsPlayingSong(true);
      playSynthesizerMelody(selectedSong);

      const start = Date.now() - songProgressSec * 1000;
      songStartTimeRef.current = start;

      timerIdRef.current = setInterval(() => {
        const currentSec = (Date.now() - songStartTimeRef.current) / 1000;
        if (currentSec >= selectedSong.durationSec) {
          setIsPlayingSong(false);
          setSongProgressSec(0);
          clearInterval(timerIdRef.current);
        } else {
          setSongProgressSec(currentSec);
        }
      }, 200);
    }
  };

  const handleResetSong = () => {
    soundEffects.playClick();
    setIsPlayingSong(false);
    setSongProgressSec(0);
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  // Determine current active lyric line
  const activeLyricIdx = selectedSong.lyrics.reduce((acc, curr, idx) => {
    return songProgressSec >= curr.timeSec ? idx : acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-50/90 via-pink-50/80 to-indigo-50/90 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm relative overflow-hidden backdrop-blur-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-950 text-xs font-bold shadow-2xs border border-purple-200">
                <Music className="w-3.5 h-3.5 text-purple-700" />
                <span>Science Mnemonics & Catchy Jingles</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-950 text-xs font-bold shadow-2xs border border-pink-200">
                <Video className="w-3.5 h-3.5 text-pink-700" />
                <span>Virtual Video Tutorials</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight font-serif-display">
              Primary 5 & 6 Science Songs & Video Masterclasses
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Master complex Cambridge and Singapore Science concepts through catchy mnemonic songs with synchronized karaoke lyrics and high-definition video masterclasses taught by Teacher Janet.
            </p>
          </div>

          {/* Grade Level Switcher */}
          <div className="p-3 bg-white/95 rounded-2xl border border-purple-200/80 shadow-xs shrink-0 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Filter Grade Level:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {(['all', 'Primary 5', 'Primary 6'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    soundEffects.playClick();
                    setGradeFilter(lvl);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    gradeFilter === lvl
                      ? 'bg-purple-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lvl === 'all' ? 'All Grades' : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs (Songs vs Videos) */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveMediaTab('songs');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMediaTab === 'songs'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Interactive Science Songs ({filteredSongs.length})</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveMediaTab('videos');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMediaTab === 'videos'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Masterclasses ({filteredVideos.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: SCIENCE SONGS & KARAOKE PLAYER */}
      {activeMediaTab === 'songs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Karaoke Player Stage (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
            {/* Now Playing Header */}
            <div className="flex items-center justify-between border-b border-purple-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Music className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-indigo-950">{selectedSong.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-purple-700">{selectedSong.theme}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedSong.cambridgeCode}</span>
                    <span>•</span>
                    <span>{selectedSong.gradeLevel}</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-purple-900 font-bold bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                {Math.floor(songProgressSec)}s / {selectedSong.durationSec}s
              </div>
            </div>

            {/* Karaoke Live Lyrics Display Screen */}
            <div className="min-h-[220px] rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 p-6 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden border border-purple-900/50 shadow-inner">
              {/* Background ambient music notes animation */}
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-around">
                <span className="text-6xl text-purple-300 animate-bounce">♪</span>
                <span className="text-7xl text-pink-300 animate-pulse">♫</span>
                <span className="text-5xl text-sky-300 animate-bounce">♩</span>
              </div>

              <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                Interactive Karaoke Lyrics
              </span>

              {/* Active Highlighted Lyric */}
              <div className="relative z-10 space-y-2 max-w-lg">
                <div className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-white transition-all duration-300 leading-snug">
                  {selectedSong.lyrics[activeLyricIdx]?.text || 'Press Play to Sing Along!'}
                </div>

                {/* Upcoming next line preview */}
                {selectedSong.lyrics[activeLyricIdx + 1] && (
                  <p className="text-xs text-purple-300/60 font-medium transition-all">
                    Next: {selectedSong.lyrics[activeLyricIdx + 1].text}
                  </p>
                )}
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-purple-950">
                <div
                  style={{ width: `${(songProgressSec / selectedSong.durationSec) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Audio Playback Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlaySong}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                    isPlayingSong
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isPlayingSong ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlayingSong ? 'Pause Melody' : 'Play Song Melody'}</span>
                </button>

                <button
                  onClick={handleResetSong}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
                  title="Restart song"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>Web Audio Synthesizer</span>
              </div>
            </div>
          </div>

          {/* Right: Song Playlist (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="font-bold text-sm text-indigo-950 flex items-center justify-between">
              <span>Science Song Playlist:</span>
              <span className="text-xs text-purple-700 font-semibold">{filteredSongs.length} Tracks</span>
            </div>

            <div className="space-y-2">
              {filteredSongs.map((song, idx) => {
                const isSelected = selectedSong.id === song.id;
                return (
                  <button
                    key={song.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedSong(song);
                      setIsPlayingSong(false);
                      setSongProgressSec(0);
                      if (timerIdRef.current) clearInterval(timerIdRef.current);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-200 shadow-2xs font-semibold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-indigo-950">{song.title}</h4>
                        <span className="text-[11px] text-slate-500">{song.theme} · {song.cambridgeCode}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-md font-semibold">
                      {song.gradeLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: VIDEO TUTORIALS & MASTERCLASSES */}
      {activeMediaTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Active Video Player Stage (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-5">
            {/* Embedded Educational Video Player */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.embedId}?rel=0&modestbranding=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video Title & Meta */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  {selectedVideo.subject} · {selectedVideo.cambridgeCode}
                </span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration: {selectedVideo.duration}</span>
                </span>
              </div>

              <h2 className="text-lg font-extrabold text-indigo-950">{selectedVideo.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            {/* Key Takeaways & Cambridge Examination Insight */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Essential Lesson Takeaways:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedVideo.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Teacher Janet's Exam Pointer */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs leading-relaxed space-y-1">
                <strong>💡 Teacher Janet's Cambridge & BBS Exam Pointer: </strong>
                <span>{selectedVideo.examPointer}</span>
              </div>
            </div>
          </div>

          {/* Right: Video Library Playlist (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="font-bold text-sm text-indigo-950 flex items-center justify-between">
              <span>Curated Video Library:</span>
              <span className="text-xs text-purple-700 font-semibold">{filteredVideos.length} Lessons</span>
            </div>

            <div className="space-y-2.5">
              {filteredVideos.map((video) => {
                const isSelected = selectedVideo.id === video.id;
                return (
                  <button
                    key={video.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedVideo(video);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-200 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {/* Video Thumbnail Badge */}
                    <div className={`w-16 h-12 rounded-xl bg-gradient-to-tr ${video.thumbnailGradient} flex items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden`}>
                      <Play className="w-5 h-5 fill-white" />
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold bg-black/60 px-1 rounded text-white">
                        {video.duration}
                      </span>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                          {video.gradeLevel}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {video.cambridgeCode}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-indigo-950 truncate">{video.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{video.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
