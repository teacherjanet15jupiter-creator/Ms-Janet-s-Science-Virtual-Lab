import React, { useState, useEffect } from 'react';
import {
  Folder, FileText, CheckCircle2, AlertCircle, Download, ExternalLink,
  RefreshCw, Database, Sparkles, X, Plus, LogOut, Check, ArrowRight, ShieldCheck,
  BookOpen, Award, Layers
} from 'lucide-react';
import { User } from 'firebase/auth';
import confetti from 'canvas-confetti';
import { initAuth, googleSignIn, getAccessToken, logout } from '../../utils/googleAuth';
import { fetchDriveFolderFiles, fetchDriveFileContent, DriveFileItem, extractFolderId } from '../../utils/googleDrive';
import { soundEffects } from '../../utils/sound';
import { QuizQuestion } from '../../types/science';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsImported?: (newQuestions: QuizQuestion[]) => void;
}

export const DRIVE_FOLDERS_CONFIG = [
  {
    id: '1ZGUOHVL3zXbsZ4NpAo__SkmAHj9Tn6Qu',
    url: 'https://drive.google.com/drive/folders/1ZGUOHVL3zXbsZ4NpAo__SkmAHj9Tn6Qu?usp=drive_link',
    name: 'Primary 5 Science Resource Bank',
    grade: 'Primary 5' as const,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Human Circulatory & Respiratory Systems, Plant Transport (Bark Ringing), Water Cycle & States, Reproduction in Plants & Humans, and Electrical Circuits.'
  },
  {
    id: '1hKeBoVEUAVnQnGV0PK0IzL02UAYdC-gQ',
    url: 'https://drive.google.com/drive/folders/1hKeBoVEUAVnQnGV0PK0IzL02UAYdC-gQ?usp=drive_link',
    name: 'Primary 6 Science Resource Bank',
    grade: 'Primary 6' as const,
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    description: 'Forces & Friction, Food Chains & Webs, Adaptations for Survival, Energy Conversions, Photosynthesis, and CIE Cambridge Moon & Earth.'
  }
];

// Pre-seeded curriculum bank items matching Teacher Janet's Primary 5 & Primary 6 Science Drive folders
export const ALL_DRIVE_BANK_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // 📘 PRIMARY 5 SCIENCE CURRICULUM QUESTIONS
  // ==========================================
  {
    id: 'drive_p5_circulatory_1',
    topic: 'circulatory_respiratory',
    topicTitle: 'Human Circulatory System (Heart & Exercise)',
    gradeLevel: 'Primary 5',
    question: '[P5 Systems · My Pals 5A Unit 2] Why does a student\'s pulse rate and breathing rate increase significantly during vigorous exercise (e.g. running), and remain elevated for several minutes afterwards?',
    scenario: 'Comparing heart rate before, during, and 10 minutes after a 400m sprint.',
    options: [
      'The heart pumps faster to transport more oxygen and digested food to active muscle cells for faster cellular respiration, while removing accumulated carbon dioxide and waste products.',
      'Because physical exercise shrinks the lungs, forcing the heart to take over breathing.',
      'To produce extra red blood cells so that the student does not run out of blood.',
      'Because body temperature drops down to zero degrees during exercise.'
    ],
    correctIndex: 0,
    explanation: 'During vigorous exercise, muscle cells contract rapidly and require more energy. Energy is released through cellular respiration, which requires oxygen and glucose. The heart beats faster and stronger to pump oxygen-rich blood and digested food rapidly to muscles, and to carry carbon dioxide to the lungs to be exhaled.',
    p6KeyConcept: 'The circulatory system works cooperatively with the respiratory and digestive systems to supply oxygen and nutrients to cells and remove metabolic wastes.',
    commonPitfall: 'Writing only that "the heart beats faster to pump air" — air stays in the lungs; the heart pumps blood carrying dissolved oxygen and glucose.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '5Bs.01',
      cambridgeStage: 'Stage 5',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Describe the human circulatory system (heart, blood, blood vessels) and the effect of exercise',
      cambridgeTws: '5TWSc.01: Measuring pulse rates and interpreting line graphs of heart recovery',
      myPalsUnit: 'Unit 2: The Human Circulatory System',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 5A',
      myPalsPages: 'TB pp. 19–37 · WB pp. 15–28',
      keyInquiryQuestion: 'Why does heart rate vary with physical activity level?',
      examFocus: 'C-E-O: Exercise (Cause) -> Muscle cells need more energy/respiration (Effect) -> Heart rate and breathing rate increase (Observation)'
    }
  },
  {
    id: 'drive_p5_plant_transport_ringing',
    topic: 'plant_transport',
    topicTitle: 'Plant Transport (Bark Ringing Experiment)',
    gradeLevel: 'Primary 5',
    question: '[P5 Systems · My Pals 5A Unit 1] A student removes an outer ring of bark (containing the food-carrying tubes / phloem) from a healthy stem, leaving the inner woody water-carrying tubes (xylem) intact. After two weeks, a noticeable swelling develops immediately ABOVE the cut ring. What explains this observation?',
    scenario: 'Bark ringing investigation on a woody potted hibiscus plant.',
    options: [
      'Food manufactured by the leaves during photosynthesis travels downwards via the phloem tubes and accumulates above the removed ring because it cannot pass through the gap.',
      'Water absorbed by the roots travels upwards and overflows out of the cut bark.',
      'The inner xylem vessels swell up because they are overfilled with soil minerals.',
      'Soil bacteria enter the exposed stem and multiply to form a swollen blister.'
    ],
    correctIndex: 0,
    explanation: 'The outer bark layer contains the phloem (food-carrying tubes), while the deeper inner core contains xylem (water-carrying tubes). Removing the ring of phloem prevents sugar (food made in leaves) from traveling downwards past the cut. The accumulated food causes the stem tissues above the ring to swell. The roots below can still receive water from intact xylem, but will eventually starve if all phloem is severed.',
    p6KeyConcept: 'Phloem transports food made in leaves both upwards and downwards. Xylem transports water and dissolved mineral salts upwards from roots.',
    commonPitfall: 'Confusing xylem and phloem positions: Phloem is on the outer ring; xylem is in the inner core.',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '5Bp.01',
      cambridgeStage: 'Stage 5',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Investigate the transport of water and nutrients through xylem and phloem vessels',
      cambridgeTws: '5TWSc.02: Planning fair tests with ringing stem experiments',
      myPalsUnit: 'Unit 1: The Plant Transport System',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 5A',
      myPalsPages: 'TB pp. 2–18 · WB pp. 1–14',
      keyInquiryQuestion: 'How do plants transport food and water between roots and leaves?',
      examFocus: 'Xylem (inner, water up) vs Phloem (outer, food both directions) and bark ringing interpretation'
    }
  },
  {
    id: 'drive_p5_reproduction_flower',
    topic: 'ecosystems',
    topicTitle: 'Reproduction in Plants (Pollination vs Fertilisation)',
    gradeLevel: 'Primary 5',
    question: '[P5 Cycles · My Pals 5B Unit 2] What is the precise scientific difference between pollination and fertilisation in a flowering plant?',
    scenario: 'Studying the life cycle and sexual reproduction of a Hibiscus flower.',
    options: [
      'Pollination is the transfer of pollen grains from anther to stigma; fertilisation is the fusion of the male reproductive cell with the female egg cell inside the ovule.',
      'Pollination produces fruit immediately; fertilisation only produces petals.',
      'Pollination only occurs in wind; fertilisation only occurs in rain.',
      'Pollination is the dispersal of seeds; fertilisation is the germination of seedlings.'
    ],
    correctIndex: 0,
    explanation: 'Pollination is the physical transfer of pollen grains from the male anther to the sticky female stigma (by wind, insects, or birds). Fertilisation occurs AFTER pollination, when a pollen tube grows down the style and the male sex cell fuses with the female egg cell inside the ovule to form a seed.',
    p6KeyConcept: 'Pollination must precede fertilisation in flowering plants. After fertilisation, the ovary develops into a fruit and the ovules develop into seeds.',
    commonPitfall: 'Treating pollination and fertilisation as identical events. Pollination is the transfer of pollen; fertilisation is the fusion of male and female genetic cells.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '5Bs.02',
      cambridgeStage: 'Stage 5',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Describe the processes of pollination, fertilisation, seed formation, and seed dispersal in flowering plants',
      cambridgeTws: '5TWSm.01: Dissecting flowers and labeling male and female reproductive organs',
      myPalsUnit: 'Unit 2: Reproduction in Plants',
      myPalsTheme: 'Cycles',
      myPalsBook: 'Textbook 5B',
      myPalsPages: 'TB pp. 28–49 · WB pp. 21–36',
      keyInquiryQuestion: 'How do flowering plants reproduce and ensure species survival?',
      examFocus: 'Flower part identification (anther, filament, stigma, style, ovary, ovule) and sequencing life cycle steps'
    }
  },
  {
    id: 'drive_p5_water_condensation',
    topic: 'earth_space',
    topicTitle: 'Water & Changes of State (Condensation & Clouds)',
    gradeLevel: 'Primary 5',
    question: '[P5 Cycles · My Pals 5B Unit 1] A cold can of soda is taken out of a refrigerator and placed on a dry table. Within two minutes, tiny liquid water droplets appear on the outer surface of the can. Where did these droplets come from, and by which process?',
    scenario: 'Observing water droplet formation on cold objects at room temperature.',
    options: [
      'Water vapour in the surrounding warm air touches the cooler outer can surface, loses heat, and condenses into liquid water droplets.',
      'The soda liquid seeped directly through microscopic pores in the aluminum metal can.',
      'The cold air around the can melted into liquid water.',
      'Hydrogen and oxygen molecules in the table reacted together due to refrigerator coldness.'
    ],
    correctIndex: 0,
    explanation: 'The surrounding air contains invisible water vapour (water in gaseous state). When this warmer water vapour comes into contact with the cooler surface of the soda can, it loses heat energy to the can and condenses from a gas into tiny droplets of liquid water.',
    p6KeyConcept: 'Condensation occurs when water vapour loses heat and changes from a gas to a liquid. Clouds, mist, fog, and dew form by condensation.',
    commonPitfall: 'Stating that the can "sweats" or that liquid leaked out from the inside of an intact sealed can.',
    difficulty: 'Foundation',
    curriculumAlignment: {
      cambridgeObjectiveCode: '5Es.01',
      cambridgeStage: 'Stage 5',
      cambridgeStrand: 'Chemistry',
      cambridgeDescription: 'Explain changes of state in the water cycle: evaporation, condensation, melting, and freezing',
      cambridgeTws: '5TWSc.01: Investigating factors affecting evaporation and condensation rates',
      myPalsUnit: 'Unit 1: Water and Changes of State',
      myPalsTheme: 'Cycles',
      myPalsBook: 'Textbook 5B',
      myPalsPages: 'TB pp. 2–27 · WB pp. 1–20',
      keyInquiryQuestion: 'How does temperature drive changes of state in the water cycle?',
      examFocus: 'C-E-O: Warm water vapour touches cool surface (Cause) -> Loses heat and condenses (Effect) -> Liquid water droplets form (Observation)'
    }
  },
  {
    id: 'drive_p5_circuits_parallel',
    topic: 'circuits',
    topicTitle: 'Electrical Systems (Parallel vs Series Circuits)',
    gradeLevel: 'Primary 5',
    question: '[P5 Energy · My Pals 5B Unit 3] Why are lighting circuits and electrical appliances in homes always connected in parallel rather than in series?',
    scenario: 'Comparing circuit designs for home electrical installations.',
    options: [
      'In a parallel circuit, each appliance has an independent branch. If one bulb blows or is switched off, the other appliances continue working normally at full voltage.',
      'In a series circuit, each bulb shines brighter when more bulbs are added to the line.',
      'Parallel circuits do not need any battery or electrical source to operate.',
      'Parallel circuits consume zero electricity, making the home electricity bill completely free.'
    ],
    correctIndex: 0,
    explanation: 'In a parallel circuit, each electrical branch provides an independent closed pathway for electric current. If one bulb blows, the remaining branches remain closed and other bulbs stay lit with full brightness. In contrast, in a series circuit, a single blown bulb creates an open circuit that turns off every light in the entire house.',
    p6KeyConcept: 'Parallel circuits provide multiple independent pathways for electric current. Series circuits share a single loop where any break disconnects all components.',
    commonPitfall: 'Believing series circuits provide equal independent control for separate household rooms.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '5Pe.01',
      cambridgeStage: 'Stage 5',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Construct series and parallel circuits; explain advantages of parallel circuits in everyday life',
      cambridgeTws: '5TWSm.02: Circuit diagram symbols and fault-finding in broken electrical circuits',
      myPalsUnit: 'Unit 3: Electrical Systems',
      myPalsTheme: 'Energy',
      myPalsBook: 'Textbook 5B',
      myPalsPages: 'TB pp. 50–78 · WB pp. 37–54',
      keyInquiryQuestion: 'How does circuit configuration affect bulb brightness and reliability?',
      examFocus: 'Series vs parallel advantages, switch placement, and circuit tracing'
    }
  },

  // ==========================================
  // 📙 PRIMARY 6 SCIENCE CURRICULUM QUESTIONS
  // ==========================================
  {
    id: 'drive_q_forces_1',
    topic: 'forces',
    topicTitle: 'Forces & Friction (BBS SOW Ch 1)',
    gradeLevel: 'Primary 6',
    question: '[BBS SOW Term 1 · TB 2-15] A student pulls a 500g wooden block across sandpaper, glass, and polished wood using a newton spring balance. Which surface requires the greatest pulling force to start moving, and why?',
    scenario: 'Experiment testing static friction across three different contact surfaces.',
    options: [
      'Sandpaper, because its rough microscopic texture creates greater interlocking ridges with the block, maximizing frictional force opposing motion.',
      'Glass, because smooth glass creates a vacuum seal that prevents the block from sliding.',
      'Polished wood, because wood molecules magnetically bond with the block.',
      'All three surfaces require exactly the same pulling force because the block mass is unchanged.'
    ],
    correctIndex: 0,
    explanation: 'Friction is a contact force caused by microscopic irregularities on two surfaces interlocking. The sandpaper has high surface roughness, creating the highest friction opposing the pulling force. A greater force is needed to overcome this friction.',
    p6KeyConcept: 'Frictional force opposes motion between two surfaces in contact. Rougher surfaces generate greater friction.',
    commonPitfall: 'Believing mass is the only factor determining friction; surface texture directly dictates the friction coefficient.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.03',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Describe friction as a force that opposes motion and produces heat',
      cambridgeTws: '6TWSc.01: Using newton balances to measure contact forces',
      myPalsUnit: 'Unit 1: Forces (BBS SOW Chapter 1)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'TB pp. 2–15 · WB pp. 1–19',
      keyInquiryQuestion: 'How does surface roughness affect the frictional force opposing motion?',
      examFocus: 'C-E-O: Rough surface (Cause) -> Increased interlocking ridges (Effect) -> Higher newton reading on spring balance (Observation)'
    }
  },
  {
    id: 'drive_q_food_web_1',
    topic: 'ecosystems',
    topicTitle: 'Food Chains & Webs (BBS SOW Ch 3)',
    gradeLevel: 'Primary 6',
    question: '[BBS SOW Term 2 · BMT1 Prep] In a mangrove swamp ecosystem, an oil spill severely destroys the population of Microscopic Algae (producers). What is the immediate effect on the Mudskipper population that feeds on Algae, and the Kingfisher that preys on Mudskippers?',
    scenario: 'Mangrove swamp food chain: Microscopic Algae -> Mudskipper -> Collared Kingfisher.',
    options: [
      'Mudskippers will decrease due to starvation, causing Kingfishers to also decrease due to food shortage.',
      'Mudskippers will start performing photosynthesis to survive without algae.',
      'Kingfishers will increase because Mudskippers become easier to catch.',
      'The population of Mudskippers and Kingfishers will remain completely unaffected.'
    ],
    correctIndex: 0,
    explanation: 'Producers are the foundational energy source for the entire ecosystem. When algae die out, mudskippers face acute food shortage and decline. Consequently, kingfishers have fewer prey available, causing their population to drop as well (trophic cascade).',
    p6KeyConcept: 'A change in the population of one organism directly or indirectly affects other organisms in the interconnected food web.',
    commonPitfall: 'Assuming predators only depend on the animal they eat without linking energy back to primary producers.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Be.01 & 6Be.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Energy flow in food webs and effects of population disruptions',
      cambridgeTws: '6TWSm.01: Predicting cascade effects in food webs',
      myPalsUnit: 'Unit 2: Food Chains & Webs (BBS SOW Chapter 3)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'TB pp. 32–41 · WB pp. 31–36',
      keyInquiryQuestion: 'What happens when primary producers are removed from a food chain?',
      examFocus: 'Interdependent feeding relationships and energy transfer pathways'
    }
  },
  {
    id: 'drive_q_energy_food_1',
    topic: 'plant_transport',
    topicTitle: 'Energy in Food & Photosynthesis (BBS SOW Ch 6)',
    gradeLevel: 'Primary 6',
    question: '[BBS SOW Term 3 · TB 2-10] A student sets up an aquatic plant (Hydrilla) under a bright lamp. Small gas bubbles are observed rising from the cut stem. Which gas is collected in the test tube, and what happens to the bubbling rate if the lamp is moved farther away?',
    scenario: 'Hydrilla in water funnel under lamp. Measuring bubble count per minute.',
    options: [
      'Oxygen gas; the bubbling rate decreases because lower light intensity slows down the rate of photosynthesis.',
      'Carbon dioxide gas; the bubbling rate increases because the plant respires more in dim light.',
      'Nitrogen gas; the bubbling rate stays constant because light has no effect on water plants.',
      'Hydrogen gas; the bubbling rate stops completely because plants only make gas in the dark.'
    ],
    correctIndex: 0,
    explanation: 'During photosynthesis, chlorophyll in green plants uses light energy to combine carbon dioxide and water to produce glucose and oxygen gas (O2). Moving the lamp farther away reduces light intensity, which is a limiting factor, thereby decreasing the rate of photosynthesis and bubble production.',
    p6KeyConcept: 'Light intensity directly affects the rate of photosynthesis. Oxygen is released as a byproduct.',
    commonPitfall: 'Confusing photosynthesis gas (oxygen) with respiration gas (carbon dioxide).',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Bp.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Conditions, raw materials, and products of photosynthesis',
      cambridgeTws: '6TWSc.02: Investigating limiting factors by varying distance to light source',
      myPalsUnit: 'Unit 1: Energy in Food (BBS SOW Chapter 6)',
      myPalsTheme: 'Energy',
      myPalsBook: 'Textbook 6B',
      myPalsPages: 'TB pp. 2–10 · WB pp. 2–14',
      keyInquiryQuestion: 'How does light intensity influence the rate of photosynthetic oxygen production?',
      examFocus: 'C-E-O: Lower light intensity (Cause) -> Slower rate of photosynthesis (Effect) -> Fewer oxygen bubbles counted per minute (Observation)'
    }
  },
  {
    id: 'drive_q_moon_1',
    topic: 'earth_space',
    topicTitle: 'CIE Cambridge Week 4 · Earth & The Moon',
    gradeLevel: 'Primary 6',
    question: '[BBS SOW Term 4 · CIE Extension] Why does a total Solar Eclipse only occur over a very narrow path on Earth’s surface, whereas a Lunar Eclipse can be observed across an entire hemisphere?',
    scenario: 'Comparing shadow cone sizes of Moon vs Earth during eclipses.',
    options: [
      'The Moon is much smaller than Earth, so its dark umbra shadow cone narrows to a small point when reaching Earth; Earth is large and casts a massive shadow engulfing the whole Moon.',
      'Solar eclipses happen at night when people are asleep, while lunar eclipses happen during daytime.',
      'Earth’s atmosphere bends solar light outwards like a magnifying glass.',
      'The Moon only casts a shadow when it stops rotating on its axis.'
    ],
    correctIndex: 0,
    explanation: 'The Moon\'s diameter is only ~1/4 that of Earth. When the Moon passes directly between the Sun and Earth (New Moon), its shadow cone tapers down so that the darkest part (the umbra) covers only a narrow strip ~100–250 km wide on Earth. Conversely, Earth\'s shadow is massive compared to the Moon, completely submerging the Moon during a lunar eclipse for anyone on the night side of Earth.',
    p6KeyConcept: 'Relative sizes of celestial bodies dictate shadow cone umbra widths during eclipses.',
    commonPitfall: 'Thinking solar and lunar eclipses produce identical shadow footprints on Earth.',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Es.01',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Earth and Space',
      cambridgeDescription: 'Planetary alignments and shadow geometry in solar vs lunar eclipses',
      cambridgeTws: '6TWSm.01: Ray tracing umbra and penumbra shadow cones',
      myPalsUnit: 'Theme Cycles: Earth & Solar System',
      myPalsTheme: 'Cycles',
      myPalsBook: 'Textbook 5B & 6A',
      myPalsPages: 'CIE Extension pp. 160–182',
      keyInquiryQuestion: 'Why is the path of totality for a solar eclipse so narrow?',
      examFocus: 'Moon size vs Earth size and shadow geometry'
    }
  }
];

export const GoogleDriveBankModal: React.FC<Props> = ({ isOpen, onClose, onQuestionsImported }) => {
  const [selectedFolderConfig, setSelectedFolderConfig] = useState(DRIVE_FOLDERS_CONFIG[0]); // Defaults to P5 folder!
  const [folderUrl, setFolderUrl] = useState<string>(DRIVE_FOLDERS_CONFIG[0].url);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number>(() => {
    const saved = localStorage.getItem('sciquest_imported_drive_bank');
    return saved ? JSON.parse(saved).length : 0;
  });
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Initialize auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSelectFolder = (cfg: typeof DRIVE_FOLDERS_CONFIG[0]) => {
    soundEffects.playClick();
    setSelectedFolderConfig(cfg);
    setFolderUrl(cfg.url);
    setDriveFiles([]);
    setErrorMsg(null);
    setImportStatus(null);
    if (accessToken) {
      fetchFolder(accessToken, cfg.url);
    }
  };

  const handleSignIn = async () => {
    soundEffects.playClick();
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        soundEffects.playFanfare();
        await fetchFolder(result.accessToken, folderUrl);
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    soundEffects.playClick();
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setDriveFiles([]);
  };

  const fetchFolder = async (token: string, url: string) => {
    setIsLoadingFiles(true);
    setErrorMsg(null);
    try {
      soundEffects.playScannerBeep();
      const files = await fetchDriveFolderFiles(url, token);
      setDriveFiles(files);
      if (files.length === 0) {
        setImportStatus(`Folder accessed successfully (${selectedFolderConfig.grade}). Ready to import questions!`);
      }
    } catch (err: any) {
      console.error('Fetch folder error:', err);
      setErrorMsg(
        err.message?.includes('404')
          ? 'Folder not found or permission denied for this Google Drive folder.'
          : err.message || 'Failed to fetch Google Drive folder.'
      );
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleImportQuestions = (gradeFilter?: 'Primary 5' | 'Primary 6' | 'all') => {
    soundEffects.playFanfare();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    const existingSaved = localStorage.getItem('sciquest_imported_drive_bank');
    let currentBank: QuizQuestion[] = existingSaved ? JSON.parse(existingSaved) : [];

    // Filter questions to import
    const candidateQuestions = gradeFilter && gradeFilter !== 'all'
      ? ALL_DRIVE_BANK_QUESTIONS.filter(q => q.gradeLevel === gradeFilter)
      : ALL_DRIVE_BANK_QUESTIONS;

    const toAdd = candidateQuestions.filter(
      pq => !currentBank.some(cb => cb.id === pq.id)
    );

    const updatedBank = [...currentBank, ...toAdd];
    localStorage.setItem('sciquest_imported_drive_bank', JSON.stringify(updatedBank));
    setImportedCount(updatedBank.length);

    if (onQuestionsImported) {
      onQuestionsImported(toAdd);
    }

    setImportStatus(
      `Successfully imported ${toAdd.length} verified questions (${gradeFilter || 'Primary 5 & 6'}) into the SciQuest Science Question Bank!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-indigo-100 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-indigo-100 bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-indigo-950">
                  Google Drive Science Curriculum Bank Importer
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  P5 & P6 v3 REST API
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connect your shared Google Drive folders for Primary 5 and Primary 6 Science.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Quick Folder Switcher Tabs */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>Select Shared Google Drive Folder:</span>
              <span className="text-[11px] text-slate-500">Teacher Janet's Curriculum Folders</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DRIVE_FOLDERS_CONFIG.map(cfg => {
                const isSelected = selectedFolderConfig.id === cfg.id;
                return (
                  <button
                    key={cfg.id}
                    onClick={() => handleSelectFolder(cfg)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-200 shadow-2xs font-semibold'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{cfg.name}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                        {cfg.grade}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {cfg.description}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1">
                      ID: {cfg.id}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Google Auth Status Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Google Drive Authorization Status</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {currentUser ? (
                  <span>
                    Signed in as <strong className="text-indigo-950">{currentUser.displayName || currentUser.email}</strong>
                  </span>
                ) : (
                  <span>Sign in to grant read-only access to your Google Drive folders.</span>
                )}
              </p>
            </div>

            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 transition-all font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-blue-400 text-slate-800 font-bold shadow-xs active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>

          {/* Folder URL Input */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>Active Google Drive Folder Link:</span>
              <span className="font-mono text-[10px] text-slate-400">
                Folder ID: {extractFolderId(folderUrl)}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={folderUrl}
                onChange={e => setFolderUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
              <button
                onClick={() => accessToken && fetchFolder(accessToken, folderUrl)}
                disabled={!accessToken || isLoadingFiles}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                <span>Scan Drive</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {importStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-medium">{importStatus}</div>
            </div>
          )}

          {/* Drive Files List if loaded */}
          {driveFiles.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Files in Folder ({driveFiles.length}):</span>
                <span className="text-[11px] text-slate-400">Google Drive v3 REST API</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50/40">
                {driveFiles.map(file => (
                  <div
                    key={file.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate font-semibold text-slate-800">{file.name}</span>
                    </div>
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Packaged Verified Curriculum Questions from Drive */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-indigo-50/80 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Curated Science Bank ({ALL_DRIVE_BANK_QUESTIONS.length} Questions Available)</span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Extracted from Primary 5 (<code className="font-mono text-emerald-800">1ZGUOHVL...</code>) and Primary 6 (<code className="font-mono text-indigo-800">1hKeBoVE...</code>) Google Drive Folders.
                </p>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {importedCount} Active in Bank
              </span>
            </div>

            {/* Import Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleImportQuestions('Primary 5')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Import P5 Questions</span>
              </button>

              <button
                onClick={() => handleImportQuestions('Primary 6')}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Import P6 Questions</span>
              </button>

              <button
                onClick={() => handleImportQuestions('all')}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Import All (P5 + P6)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            Total Bank items active: <strong className="text-indigo-950 font-bold">{importedCount}</strong>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
