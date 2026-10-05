import { CurriculumLessonModule } from '../types/science';

export const CURRICULUM_MODULES: CurriculumLessonModule[] = [
  {
    id: 'mod_energy',
    topic: 'energy',
    title: 'Energy Forms, Conversions & Conservation',
    myPalsTheme: 'Energy',
    myPalsUnit: 'Unit 2 & 3: Forms and Uses of Energy & Energy Conversions',
    myPalsBook: 'Textbook 6A',
    myPalsPages: 'pp. 42–71',
    myPalsWorkbookActivity: 'Activity 2.1 & 3.2: Tracking Energy Paths & Bouncing Balls',
    cambridgeCode: '6Pf.01 & 6Pf.02',
    cambridgeStrand: 'Physics (Forces and Energy)',
    cambridgeObjective: 'Describe changes in energy that occur when objects move, drop, collide or change state, and state the law of conservation of energy: energy cannot be created or destroyed, only transferred or transformed.',
    cambridgeTws: '6TWSm.01: Use virtual models to test scientific predictions and evaluate energy conservation.',
    keyInquiryQuestion: 'Can energy ever disappear when a roller coaster cart rolls to a stop at the bottom of the track?',
    coreVocabulary: [
      'Gravitational Potential Energy (GPE)',
      'Kinetic Energy (KE)',
      'Chemical Potential Energy',
      'Law of Conservation of Energy',
      'Thermal (Heat) Energy',
      'Sound Energy',
      'Energy Conversion Chain'
    ],
    misconceptionsToAddress: [
      'Energy is "used up" or "destroyed" when objects stop moving (In reality, it converts to heat and sound).',
      'Only moving objects have energy (Objects at a height store gravitational potential energy).'
    ],
    labId: 'energy',
    labTitle: 'Energy Roller Coaster Physics Lab',
    quizTopic: 'energy',
    detectiveId: 'case_coaster',
    competencies: [
      {
        id: 'comp_energy_1',
        statement: 'I can explain that Gravitational Potential Energy depends on the height and mass of an object.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_energy_2',
        statement: 'I can describe how GPE converts to Kinetic Energy as an object descends along a track.',
        curriculumTag: 'Cambridge'
      },
      {
        id: 'comp_energy_3',
        statement: 'I can state the Law of Conservation of Energy and explain why total energy remains constant.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_energy_4',
        statement: 'I can trace energy conversion chains in everyday devices using My Pals C-E-O exam format.',
        curriculumTag: 'My Pals'
      }
    ],
    lesson5E: {
      engage: 'Show students a pendulum or roller coaster drop: Ask "Where does the cart get the speed to climb the loop-the-loop?"',
      explore: 'Students launch the SciQuest Energy Coaster Lab. Adjust starting height from 10m to 25m and observe changes in maximum speed and the live energy bar.',
      explain: 'Teacher guides students using the formula GPE = mgh and KE = 1/2 mv². Discuss why Total Energy bar stays at 100% even when friction is turned on.',
      elaborate: 'Test with 0% friction vs 60% friction: Identify the "lost" energy as thermal (heat) energy transferred to track and air.',
      evaluate: 'Complete the Quiz Arena Energy Quest (10 questions) and formulate a C-E-O structured response for why the cart slowed down.'
    }
  },
  {
    id: 'mod_forces',
    topic: 'forces',
    title: 'Forces, Friction & Newton Balances',
    myPalsTheme: 'Interactions',
    myPalsUnit: 'Unit 1: Forces & Motion (Frictional Force & Elastic Spring Force)',
    myPalsBook: 'Textbook 6A',
    myPalsPages: 'pp. 2–39',
    myPalsWorkbookActivity: 'Activity 1.1: Measuring Pulling Forces & Surface Roughness',
    cambridgeCode: '6Pf.03 & 6Pf.04',
    cambridgeStrand: 'Physics (Forces and Motion)',
    cambridgeObjective: 'Measure forces in Newtons (N) using forcemeters, describe balanced and unbalanced forces, and investigate how friction opposes motion between surfaces in contact.',
    cambridgeTws: '6TWSp.01: Identify independent, dependent, and controlled variables in a fair friction test.',
    keyInquiryQuestion: 'How does changing surface roughness and lubricant affect the frictional force required to move a load?',
    coreVocabulary: [
      'Frictional Force',
      'Forcemeter / Spring Balance',
      'Newtons (N)',
      'Opposing Force',
      'Lubrication',
      'Elastic Spring Force',
      'Balanced & Unbalanced Forces'
    ],
    misconceptionsToAddress: [
      'Friction only exists when things slide (Static friction exists to prevent motion too).',
      'Smooth surfaces have zero friction (All real surfaces exert some frictional force).',
      'Heavier objects fall faster in all conditions (Air resistance, not mass alone, dictates terminal velocity).'
    ],
    labId: 'forces',
    labTitle: 'Forces & Friction Surface Sandbox',
    quizTopic: 'forces',
    detectiveId: 'case_coaster',
    competencies: [
      {
        id: 'comp_forces_1',
        statement: 'I can measure pulling force in Newtons (N) using a simulated spring balance.',
        curriculumTag: 'Cambridge'
      },
      {
        id: 'comp_forces_2',
        statement: 'I can explain that friction acts in the opposite direction to motion.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_forces_3',
        statement: 'I can design a fair test keeping mass and contact area constant while changing surface texture.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_forces_4',
        statement: 'I can evaluate everyday applications of friction (treads on shoes, brake pads, oil lubrication).',
        curriculumTag: 'My Pals'
      }
    ],
    lesson5E: {
      engage: 'Challenge students to rub their dry palms vs soapy palms together: "Why does one feel hot and grip, while the other slides easily?"',
      explore: 'Use the SciQuest Forces Sandbox to pull a 500g block across Ice, Wood, Sandpaper, and Rubber. Record pulling force in Newtons.',
      explain: 'Define friction as an opposing force. Explain microscopic roughness interlocking between contact surfaces.',
      elaborate: 'Test Hooke\'s Law Spring Stretcher: Observe how adding equal 100g weights creates proportional spring extension (My Pals Activity 1.3).',
      evaluate: 'Complete the Cambridge Checkpoint Forces question set and solve the Stalled Coaster Mystery.'
    }
  },
  {
    id: 'mod_plant_transport',
    topic: 'plant_transport',
    title: 'Plant Transport: Xylem, Phloem & Transpiration',
    myPalsTheme: 'Systems',
    myPalsUnit: 'Unit 1: Plant Transport System & Water Uptake',
    myPalsBook: 'Textbook 6B',
    myPalsPages: 'pp. 1–28',
    myPalsWorkbookActivity: 'Activity 1.2: Ringing of Stem & Celery Food Dye Uptake',
    cambridgeCode: '6Bp.01 & 6Bp.02',
    cambridgeStrand: 'Biology (Plant Systems)',
    cambridgeObjective: 'Describe the transport of water and mineral salts through roots, stem (xylem vessels) to leaves, and describe the role of leaves in transpiration and photosynthesis.',
    cambridgeTws: '6TWSc.01: Make qualitative observations of dye movement and quantitative measurements of transpiration rates.',
    keyInquiryQuestion: 'How does water defy gravity to reach the tallest leaves of a tree without a mechanical pump?',
    coreVocabulary: [
      'Xylem Vessels',
      'Phloem Vessels',
      'Transpiration Pull',
      'Stomata',
      'Mineral Salts',
      'Ringing of Stem',
      'Capillary Action'
    ],
    misconceptionsToAddress: [
      'Plants drink water like animals with a heart (Water moves via transpiration pull and evaporation through stomata).',
      'Xylem and phloem carry the same substances (Xylem carries water/minerals UP; Phloem carries sugars BOTH WAYS).'
    ],
    labId: 'plant',
    labTitle: 'Plant Xylem & Transpiration Photometer Lab',
    quizTopic: 'plant_transport',
    detectiveId: 'case_celery',
    competencies: [
      {
        id: 'comp_plant_1',
        statement: 'I can identify the location and function of xylem (inner) and phloem (outer) vessels in stems.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_plant_2',
        statement: 'I can explain the Ringing of Stem experiment: swelling occurs above the cut because food in phloem cannot move down.',
        curriculumTag: 'My Pals'
      },
      {
        id: 'comp_plant_3',
        statement: 'I can investigate how wind speed, sunlight, and humidity affect the rate of transpiration.',
        curriculumTag: 'Cambridge'
      },
      {
        id: 'comp_plant_4',
        statement: 'I can describe how roots absorb water via osmosis and root hairs.',
        curriculumTag: 'Both'
      }
    ],
    lesson5E: {
      engage: 'Present the classic classroom dilemma: "Why did Teacher Janet\'s white carnation flowers turn bright red in colored water overnight?"',
      explore: 'In the SciQuest Plant Transport Lab, choose Red Eosin dye. Turn the wind fan to HIGH and sunlight to BRIGHT. Watch dye travel up stem xylem into leaves.',
      explain: 'Introduce the transpiration stream: water evaporates through stomata, creating suction tension that pulls water up continuous xylem tubes.',
      elaborate: 'Toggle the "Ringing of Stem" mode: remove outer bark (phloem) while leaving xylem intact. Predict whether the leaves wilt or the stem swells above the cut.',
      evaluate: 'Solve the "Mystery of the Wilted Celery & Swollen Tree Ring" detective dossier.'
    }
  },
  {
    id: 'mod_ecosystems',
    topic: 'ecosystems',
    title: 'Ecosystems, Food Webs & Adaptations',
    myPalsTheme: 'Interactions',
    myPalsUnit: 'Unit 2 & 3: Living Together & Adaptations for Survival',
    myPalsBook: 'Textbook 6A',
    myPalsPages: 'pp. 74–120',
    myPalsWorkbookActivity: 'Activity 2.3: Pond Community Food Web & Trophic Cascades',
    cambridgeCode: '6Be.01, 6Be.02 & 6Be.03',
    cambridgeStrand: 'Biology (Living Things in Their Environment)',
    cambridgeObjective: 'Interpret and construct food chains and webs, identify producers, consumers, and decomposers, and describe how toxic substances can bioaccumulate and how energy is transferred.',
    cambridgeTws: '6TWSe.01: Evaluate the consequences of human intervention and environmental shocks on food web equilibrium.',
    keyInquiryQuestion: 'What happens to an entire pond ecosystem if a farmer sprays pesticides that eliminate the dragonfly nymphs?',
    coreVocabulary: [
      'Producers (Photosynthesis)',
      'Primary, Secondary & Tertiary Consumers',
      'Predator and Prey',
      'Decomposers (Nutrient Recyclers)',
      'Interdependence',
      'Trophic Level',
      'Structural & Behavioural Adaptations'
    ],
    misconceptionsToAddress: [
      'Decomposers recycle energy (Energy is lost as heat; decomposers recycle MINERALS and chemical nutrients, not energy).',
      'Arrows in food chains point to what is being eaten (Arrows point in the direction of ENERGY TRANSFER to the eater).'
    ],
    labId: 'ecosystem',
    labTitle: 'Ecosystem Food Web & Trophic Cascade Simulator',
    quizTopic: 'ecosystems',
    detectiveId: 'case_pond',
    competencies: [
      {
        id: 'comp_eco_1',
        statement: 'I can trace the direction of energy flow from the Sun to producers and multiple consumer trophic levels.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_eco_2',
        statement: 'I can predict the ripple effects on predator and prey populations when one organism is removed.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_eco_3',
        statement: 'I can explain the ecological role of decomposers (fungi, bacteria) in returning nutrients to soil.',
        curriculumTag: 'My Pals'
      },
      {
        id: 'comp_eco_4',
        statement: 'I can identify structural and behavioral adaptations of organisms in freshwater and rainforest habitats.',
        curriculumTag: 'Cambridge'
      }
    ],
    lesson5E: {
      engage: 'Display an interactive pond scene: "If all algae disappeared tomorrow, which animals would starve first?"',
      explore: 'Launch the SciQuest Ecosystem Lab. Trigger the "Insecticide Shock" or "Drought Event". Observe population curves for Grass, Caterpillars, Birds, and Hawks over 10 cycles.',
      explain: 'Guide students to understand interdependence: removing primary consumers causes producers to overgrow while apex predators face starvation.',
      elaborate: 'Construct a food web matrix on screen: trace 4 overlapping food chains originating from one primary producer.',
      evaluate: 'Solve the "Silent Pond Mystery" and test your understanding in the Quiz Arena Ecosystem Challenger.'
    }
  },
  {
    id: 'mod_circuits',
    topic: 'circuits',
    title: 'Electrical Systems: Series vs Parallel Circuits',
    myPalsTheme: 'Systems',
    myPalsUnit: 'Unit 3: Electrical Systems (Primary 5 & 6 Extension)',
    myPalsBook: 'Textbook 5A & 6B Extension',
    myPalsPages: 'pp. 122–165',
    myPalsWorkbookActivity: 'Activity 3.1 & 3.2: Parallel Wiring & Conductivity Testing',
    cambridgeCode: '6Pe.01, 6Pe.02 & 6Pe.03',
    cambridgeStrand: 'Physics (Electricity and Magnetism)',
    cambridgeObjective: 'Construct series and parallel circuits, compare lamp brightness, use conventional circuit symbols, and classify materials as electrical conductors or insulators.',
    cambridgeTws: '6TWSp.01: Measure voltage and current across branches; test electrical safety and fuse operation.',
    keyInquiryQuestion: 'Why does household wiring use parallel circuits rather than series circuits?',
    coreVocabulary: [
      'Series Circuit (Single Loop)',
      'Parallel Circuit (Independent Branches)',
      'Voltage / Electric Potential',
      'Electric Current (Amperes)',
      'Electrical Conductors vs Insulators',
      'Circuit Fuse / Safety Switch',
      'Filament Bulb Resistance'
    ],
    misconceptionsToAddress: [
      'Current gets "used up" by each bulb in a series circuit (Current is identical throughout a series circuit; energy is converted).',
      'Parallel circuits drain batteries at the exact same rate as series circuits (Parallel circuits draw more total current, draining batteries faster).'
    ],
    labId: 'circuit',
    labTitle: 'Circuit Builder & Electrical Sandbox',
    quizTopic: 'circuits',
    detectiveId: 'case_coaster',
    competencies: [
      {
        id: 'comp_circ_1',
        statement: 'I can construct and distinguish between series circuits (single pathway) and parallel circuits (multiple branches).',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_circ_2',
        statement: 'I can explain why removing or blowing one bulb in parallel does not extinguish the other lamps.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_circ_3',
        statement: 'I can draw and interpret Cambridge standard circuit diagrams with cells, switches, bulbs, and fuses.',
        curriculumTag: 'Cambridge'
      },
      {
        id: 'comp_circ_4',
        statement: 'I can test conductivity of everyday materials (copper, graphite, plastic, rubber, saltwater).',
        curriculumTag: 'My Pals'
      }
    ],
    lesson5E: {
      engage: 'Unscrew one Christmas fairy light bulb: "Why do some strings go completely dark while other strings stay brightly lit?"',
      explore: 'In the SciQuest Circuit Builder, toggle between 2 Bulbs in Series vs 2 Bulbs in Parallel. Unscrew Bulb A and observe Bulb B.',
      explain: 'Clarify independent current loops in parallel circuits. Show how each branch experiences full battery potential voltage.',
      elaborate: 'Test materials in the conductivity dock: compare lead/graphite pencil versus plastic eraser.',
      evaluate: 'Complete the Cambridge Circuit Symbols challenge and achieve a 5-question streak in Quiz Arena.'
    }
  },
  {
    id: 'mod_circulatory_respiratory',
    topic: 'circulatory_respiratory',
    title: 'Human Transport: Heart, Blood & Gas Exchange',
    myPalsTheme: 'Systems',
    myPalsUnit: 'Unit 2: Human Circulatory & Respiratory Systems',
    myPalsBook: 'Textbook 6B',
    myPalsPages: 'pp. 32–64',
    myPalsWorkbookActivity: 'Activity 2.2: Tracing Blood Flow & Breathing Rate after Exercise',
    cambridgeCode: '6Bs.01 & 6Bs.02',
    cambridgeStrand: 'Biology (Humans and Animals)',
    cambridgeObjective: 'Identify and describe the functions of the human circulatory system (heart, blood, blood vessels) and describe the respiratory system (lungs, trachea, alveoli) and how oxygen enters and carbon dioxide is removed.',
    cambridgeTws: '6TWSc.01: Measure pulse rate before and after physical activity and correlate with oxygen demand.',
    keyInquiryQuestion: 'How do the respiratory, circulatory, and digestive systems collaborate to deliver energy to working muscles?',
    coreVocabulary: [
      'Heart (Muscular Pump)',
      'Arteries, Veins & Capillaries',
      'Oxygen-Rich vs Oxygen-Poor Blood',
      'Lungs & Alveoli (Air Sacs)',
      'Gaseous Exchange',
      'Cellular Respiration (Glucose + O2 → Energy + CO2)',
      'Pulse Rate & Cardiac Output'
    ],
    misconceptionsToAddress: [
      'Deoxygenated blood is blue in human bodies (It is dark crimson red; blue diagrams are just a conventional teaching representation).',
      'Exhaled air contains zero oxygen (Exhaled air still contains roughly 16% oxygen; inhaled is 21%).'
    ],
    labId: null,
    labTitle: 'Interactive Anatomy & Blood Flow Explorer',
    quizTopic: 'circulatory_respiratory',
    detectiveId: 'case_celery',
    competencies: [
      {
        id: 'comp_human_1',
        statement: 'I can trace the double circulation pathway: Heart → Lungs → Heart → Body → Heart.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_human_2',
        statement: 'I can explain why heart rate and breathing rate increase during vigorous exercise using the C-E-O model.',
        curriculumTag: 'My Pals'
      },
      {
        id: 'comp_human_3',
        statement: 'I can compare the composition of inhaled air (21% O2, 0.04% CO2) and exhaled air (16% O2, 4% CO2).',
        curriculumTag: 'Cambridge'
      },
      {
        id: 'comp_human_4',
        statement: 'I can describe the role of red blood cells (hemoglobin) in carrying oxygen throughout the body.',
        curriculumTag: 'Both'
      }
    ],
    lesson5E: {
      engage: 'Have students measure their resting wrist pulse for 15 seconds, then do 20 star jumps: "Why is your chest pumping so rapidly now?"',
      explore: 'Use the interactive anatomy diagram in Cheat Sheets: trace blood pumped by the left ventricle through the aorta to muscle cells.',
      explain: 'Cells need oxygen and glucose for cellular respiration to release energy. The heart must pump faster to deliver more oxygen and remove carbon dioxide.',
      elaborate: 'Compare human transport with plant transport: why do humans need an active muscular pump while trees can rely on transpiration?',
      evaluate: 'Complete the Human Systems Quiz Quest and master the Cambridge Checkpoint 6Bs.01 exam question.'
    }
  },
  {
    id: 'mod_earth_moon',
    topic: 'earth_space',
    title: 'Earth Science: Moon Phases & Solar-Lunar Eclipses',
    myPalsTheme: 'Cycles',
    myPalsUnit: 'Theme Cycles: Earth & The Solar System (Moon Phases & Tides)',
    myPalsBook: 'Textbook 5B & 6A',
    myPalsPages: 'pp. 140–182',
    myPalsWorkbookActivity: 'Activity 4.1 & 4.2: Tracking 29.5-Day Lunar Cycle & Shadow Umbra',
    cambridgeCode: '6Es.01 & 6Es.02',
    cambridgeStrand: 'Earth and Space (Earth, Moon & Sun)',
    cambridgeObjective: 'Describe the relative movements and orbital positions of Earth, Moon, and Sun, and explain why the Moon appears to change shape over a 29.5-day synodic month.',
    cambridgeTws: '6TWSm.01: Use interactive 3D spatial models to visualize observer perspective versus cosmic orbit view.',
    keyInquiryQuestion: 'Why does the Moon appear to change shape every night even though half of it is always lit by the Sun?',
    coreVocabulary: [
      'Moon Phases (New, Crescent, Quarter, Gibbous, Full)',
      'Waxing (Growing) vs Waning (Shrinking)',
      'Synodic Month (29.5 Days)',
      'Tidal Locking (Synchronous Rotation)',
      'Solar Eclipse (Sun-Moon-Earth Syzygy)',
      'Lunar Eclipse (Sun-Earth-Moon Syzygy)',
      'Umbra (Full Shadow) and Penumbra (Partial Shadow)'
    ],
    misconceptionsToAddress: [
      'The Moon changes shape because of Earth\'s shadow (Earth\'s shadow only causes Lunar Eclipses; normal phases are caused by viewing angles of sunlight!).',
      'The Moon produces its own light (The Moon is non-luminous; it only reflects sunlight).'
    ],
    labId: 'moon',
    labTitle: '3D Earth Science & Moon Phases Laboratory',
    quizTopic: 'earth_space',
    detectiveId: 'case_coaster',
    competencies: [
      {
        id: 'comp_moon_1',
        statement: 'I can explain that the Moon is non-luminous and only visible because it reflects light from the Sun.',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_moon_2',
        statement: 'I can name and sequence the 8 canonical phases of the Moon in order over a 29.5-day period.',
        curriculumTag: 'Cambridge'
      },
      {
        id: 'comp_moon_3',
        statement: 'I can distinguish between solar eclipses (Moon blocks Sun) and lunar eclipses (Earth blocks Moon).',
        curriculumTag: 'Both'
      },
      {
        id: 'comp_moon_4',
        statement: 'I can explain why the same side of the Moon always faces Earth (synchronous rotation/tidal locking).',
        curriculumTag: 'My Pals'
      }
    ],
    lesson5E: {
      engage: 'Turn off classroom lights and shine a flashlight at a student holding a white styrofoam ball: "Why can your classmates see a crescent while you see a full circle?"',
      explore: 'Launch the SciQuest 3D Moon Phases Lab. Drag the orbit slider day by day and compare the Space Orbit View with the Earth Observer Sky View.',
      explain: 'Clarify that 50% of the Moon is always lit by the Sun; phases arise because our vantage point on Earth sees varying fractions of that sunlit hemisphere.',
      elaborate: 'Toggle AR Mode: Project the 3D Moon hologram onto the classroom ceiling or floor to observe tidal locking and lunar craters.',
      evaluate: 'Complete the Earth & Space Quiz Challenger and check off your astronomy competencies in the Syllabus Map.'
    }
  }
];

