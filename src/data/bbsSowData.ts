export interface BBSSowChapter {
  id: string;
  chapterNumber: number;
  title: string;
  term: 1 | 2 | 3 | 4;
  theme: 'Interactions' | 'Energy' | 'Cycles' | 'Systems' | 'CIE Cambridge Extension';
  durationWeeks: string; // e.g. "Week 1 to 5"
  learningObjectives: string[];
  processSkills: string[];
  formativeAssessments: string[];
  summativeAssessments: string[];
  resources: {
    textbook: string; // e.g. "TB 2-15"
    workbook: string; // e.g. "WB 1-19"
    workout: string; // e.g. "WorkOut 75-82"
    notes?: string;
  };
  connectedLabId?: 'forces' | 'ecosystem' | 'energy' | 'moon' | 'plant' | 'circuit';
  connectedQuizTopic?: 'forces' | 'ecosystems' | 'energy' | 'earth_space' | 'plant_transport' | 'circuits';
}

export interface BBSProcessSkill {
  name: string;
  category: 'Basic' | 'Integrated';
  definition: string;
  example: string;
  taughtInLevels: {
    p1: boolean;
    p2: boolean;
    p3: boolean;
    p4: boolean;
    p5: boolean;
    p6: boolean;
  };
}

export interface BBSTermSchedule {
  term: 1 | 2 | 3 | 4;
  title: string;
  theme: string;
  duration: string;
  weightPercentage: number;
  assessmentCode: string;
  chapters: BBSSowChapter[];
  keyHighlights: string[];
}

export const BBS_SOW_METADATA = {
  school: 'Bina Bangsa School (培民学校)',
  title: 'SCIENCE - SOW (Scheme of Work)',
  grade: 'PRIMARY 6',
  academicYears: '2025 - 2028',
  approvalDate: '23 Sep 2025',
  approvedBy: 'Ms. Yuliana',
  curriculumFramework: 'MOE Singapore Science Curriculum Framework & Cambridge Primary Science (CIE)',
  periodsPerWeek: 6, // 6 periods/week, 30 mins each = 3 hours/week
  restrictionLevel: 'RESTRICTED / BBS OFFICIAL CURRICULUM',
};

export const BBS_PROCESS_SKILLS: BBSProcessSkill[] = [
  {
    name: 'Observing',
    category: 'Basic',
    definition: 'Using the senses to gather information about an object or event.',
    example: 'Describing a pencil as yellow, or noting temperature rise in friction.',
    taughtInLevels: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Communicating',
    category: 'Basic',
    definition: 'Using words or graphic symbols to describe an action, object or event.',
    example: 'Describing the change in height of a plant over time in writing or through a graph.',
    taughtInLevels: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Classifying',
    category: 'Basic',
    definition: 'Grouping or ordering objects or events into categories based on properties or criteria.',
    example: 'Placing all rocks having a certain grain size or hardness into one group.',
    taughtInLevels: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Comparing',
    category: 'Basic',
    definition: 'Identifying similarities and differences between two or more objects or concepts.',
    example: 'Comparing the rates of transpiration in wind vs humid air.',
    taughtInLevels: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Inferring',
    category: 'Basic',
    definition: 'Making an "educated guess" about an object or event based on previously gathered data or information.',
    example: 'Saying that the person who used a pencil made a lot of mistakes because the eraser was well-worn.',
    taughtInLevels: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Predicting',
    category: 'Basic',
    definition: 'Stating the outcome of a future event based on a pattern of evidence.',
    example: 'Predicting the height of a plant in two weeks\' time based on a graph of its growth during the previous four weeks.',
    taughtInLevels: { p1: true, p2: true, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Measuring (Apparatus & Equipment)',
    category: 'Basic',
    definition: 'Using both standard and nonstandard measures or estimates to describe dimensions, mass, force, or time.',
    example: 'Using a spring balance (newton meter) to measure frictional force in Newtons.',
    taughtInLevels: { p1: false, p2: false, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Analysing',
    category: 'Integrated',
    definition: 'Examining information in detail to identify patterns, relationships, and trends.',
    example: 'Analyzing food web population cascades when a top predator is removed.',
    taughtInLevels: { p1: false, p2: false, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Evaluating',
    category: 'Integrated',
    definition: 'Assessing the validity of experimental procedures, data reliability, and sources of error.',
    example: 'Evaluating whether a fair test was maintained by keeping variable parameters constant.',
    taughtInLevels: { p1: false, p2: false, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Generating Possibilities',
    category: 'Integrated',
    definition: 'Brainstorming creative and plausible alternative solutions, adaptations, or experimental designs.',
    example: 'Proposing novel structural adaptations for an animal living in volcanic ash soil.',
    taughtInLevels: { p1: false, p2: false, p3: true, p4: true, p5: true, p6: true }
  },
  {
    name: 'Formulating Hypotheses',
    category: 'Integrated',
    definition: 'Stating the expected outcome of an experiment that can be tested scientifically.',
    example: 'The greater the amount of organic matter added to the soil, the greater the bean plant growth.',
    taughtInLevels: { p1: false, p2: false, p3: false, p4: false, p5: true, p6: true }
  },
  {
    name: 'Solving Problems Creatively',
    category: 'Integrated',
    definition: 'Applying knowledge to devise innovative engineering solutions to real-world challenges.',
    example: 'Designing a renewable mini wind turbine or solar circuit to power an LED.',
    taughtInLevels: { p1: false, p2: false, p3: false, p4: false, p5: true, p6: true }
  },
  {
    name: 'Investigating',
    category: 'Integrated',
    definition: 'Planning and conducting comprehensive scientific investigations, controlling variables, and drawing conclusions.',
    example: 'Investigating how different track surfaces alter rolling resistance of a toy car.',
    taughtInLevels: { p1: false, p2: false, p3: false, p4: false, p5: true, p6: true }
  }
];

export const BBS_SOW_CHAPTERS: BBSSowChapter[] = [
  // TERM 1
  {
    id: 'bbs_ch1_forces',
    chapterNumber: 1,
    title: 'Forces & Motion',
    term: 1,
    theme: 'Interactions',
    durationWeeks: 'Week 1 to 5',
    learningObjectives: [
      '1. State that a force is a push or a pull.',
      '2. Identify the forces observed in our daily activities as a push or a pull.',
      '3. Show an understanding of the effects of forces on an object (speed, direction, shape).',
      '4. Identify the different types of forces — frictional force, gravitational force and magnetic force.',
      '5. Describe friction as a force that opposes motion and is produced when two surfaces are in contact.',
      '6. Investigate the effects of the frictional force on the movement of objects.',
      '7. Recognise that frictional force can be useful (gripping soles, brakes) or harmful (wear and tear, heat).',
      '8. Describe gravitational force as the force of attraction between objects.',
      '9. Recognise that the gravitational force between objects and the Earth causes objects to have weight.',
      '10. Describe magnetic force as the force exerted by magnets (attraction and repulsion).'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Analysis', 'Evaluating', 'Predicting',
      'Generating Possibilities', 'Making Hypotheses', 'Investigating'
    ],
    formativeAssessments: [
      'Demonstrations (surface friction sledges)',
      'KWL charts for self-checks',
      'Learning Logs & Science Journal reflections'
    ],
    summativeAssessments: [
      'Topical Test (WA1) - Weighted Assessment 1 (20% of Term Mark)'
    ],
    resources: {
      textbook: 'TB 2-15',
      workbook: 'WB 1-19',
      workout: 'WorkOut 75-82',
      notes: 'Process Skills Worksheets optional. Spring balances and friction blocks required.'
    },
    connectedLabId: 'forces',
    connectedQuizTopic: 'forces'
  },
  {
    id: 'bbs_ch2_living_together',
    chapterNumber: 2,
    title: 'Living Together (Habitats & Communities)',
    term: 1,
    theme: 'Interactions',
    durationWeeks: 'Week 6 to 9 (Week 10 for Enrichment)',
    learningObjectives: [
      '1. Identify the factors of an environment that affect the survival of living things (temperature, light, moisture, air).',
      '2. Show an understanding that the factors of an environment affect different living things differently.',
      '3. Differentiate between the terms organism and habitat.',
      '4. Recognise that an organism is a living thing.',
      '5. Recognise that a habitat is the place where an organism lives.',
      '6. Recognise that habitats provide organisms with food, water, air, space, shelter and protection.',
      '7. Recognise that different habitats support different organisms, such as seashore, mangrove swamp, pond, field, garden, tree.',
      '8. Show an understanding that the factors of the environment in a habitat are unique.'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Analysis', 'Infer', 'Predicting',
      'Generating Possibilities', 'Communicating'
    ],
    formativeAssessments: [
      'Posters / Multimedia Presentations',
      'Oral Presentations on local Indonesian/Singapore ecosystems',
      'Learning Logs / Journaling',
      'Formative Quizzes'
    ],
    summativeAssessments: [
      'Topical Test (WA2) - Weighted Assessment 2'
    ],
    resources: {
      textbook: 'TB 16-31',
      workbook: 'WB 20-30',
      workout: 'WorkOut 83-90',
      notes: 'Mangrove swamp & pond microhabitats study. Week 10 designated for enrichment.'
    },
    connectedLabId: 'ecosystem',
    connectedQuizTopic: 'ecosystems'
  },

  // TERM 2
  {
    id: 'bbs_ch3_food_chains',
    chapterNumber: 3,
    title: 'Food Chains and Food Webs',
    term: 2,
    theme: 'Interactions',
    durationWeeks: 'Week 1 to 4',
    learningObjectives: [
      '1. State how organisms obtain their energy.',
      '2. Show an understanding that a producer can make its own food using sunlight.',
      '3. Show an understanding that consumers cannot make their own food, so they eat other living things for food.',
      '4. Differentiate between predator and prey.',
      '5. Show an understanding that a food chain shows the feeding and energy transfer relationships between different organisms.',
      '6. Construct a food chain and multiple interconnected food chains into a food web.',
      '7. Recognise that producers and consumers in a food chain affect one another directly and indirectly.'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Analysis', 'Infer', 'Predicting',
      'Generating Possibilities', 'Communicating'
    ],
    formativeAssessments: [
      'Interactive Food Web builder models',
      'Oral Presentations & Quizzes',
      'Learning Logs & Trophic level reflections'
    ],
    summativeAssessments: [
      'BMT1 - Bench Marking Test (WA3) conducted in Week 4 (Common across all BBS campuses)'
    ],
    resources: {
      textbook: 'TB 32-41',
      workbook: 'WB 31-36',
      workout: 'WorkOut 91-96'
    },
    connectedLabId: 'ecosystem',
    connectedQuizTopic: 'ecosystems'
  },
  {
    id: 'bbs_ch4_adaptations',
    chapterNumber: 4,
    title: 'Adaptations for Survival',
    term: 2,
    theme: 'Interactions',
    durationWeeks: 'Week 5 to 7',
    learningObjectives: [
      '1. Recognise that adaptations are special characteristics that help organisms to survive in their natural habitats.',
      '2. Differentiate between structural adaptations and behavioural adaptations.',
      '3. Show an understanding that structural adaptations are special physical parts an organism has (e.g. webbed feet, vascularized ears, blubber).',
      '4. Show an understanding that behavioural adaptations are special ways an organism acts or behaves (e.g. nocturnal hunting, hibernation, schooling).',
      '5. Identify and classify specific structural adaptations.',
      '6. Identify and classify specific behavioural adaptations.',
      '7. Describe adaptations that enhance survival in extreme environments (hot desert, arctic tundra, deep aquatic).'
    ],
    processSkills: [
      'Observing', 'Classifying', 'Comparing', 'Analysis', 'Evaluating', 'Predicting'
    ],
    formativeAssessments: [
      'KWL charts for self-checks',
      'Concept Mapping (Structural vs Behavioural)',
      'Learning Logs / Journaling',
      '3D organism models & Oral Presentations',
      'Topical Review (non-graded)'
    ],
    summativeAssessments: [
      'Performance Task (WA4): Make a 3D model (real/digital) of an imaginative organism, highlighting its different adaptations for survival!'
    ],
    resources: {
      textbook: 'TB 42-65',
      workbook: 'WB 37-49',
      workout: 'WorkOut 97-102',
      notes: '3D Maker Mindset performance assessment. Aligns directly with SciQuest 3D models.'
    },
    connectedQuizTopic: 'ecosystems'
  },
  {
    id: 'bbs_ch5_mans_impact',
    chapterNumber: 5,
    title: "Man's Impact on His Environment",
    term: 2,
    theme: 'Interactions',
    durationWeeks: 'Week 8 to 9 (Week 10 for Enrichment)',
    learningObjectives: [
      '1. Show an understanding that Man depends on Earth’s natural resources for his survival.',
      '2. Give examples of the negative impact of Man’s activities on his environment.',
      '3. Show an understanding that natural resources can become depleted if overexploited.',
      '4. Describe the negative effects of deforestation (soil erosion, loss of biodiversity, increased atmospheric CO2).',
      '5. Identify the sources of pollution (air, water, land, noise).',
      '6. Describe the negative effects of pollution (eutrophication, acid rain, respiratory distress).',
      '7. Show an understanding that global warming and climate change can be caused by Man’s activities.',
      '8. Identify the negative consequences of global warming (rising sea levels, habitat shifts, extreme weather).',
      '9. Give examples of what Man can do to make a positive impact (3Rs, conservation, reforestation, renewable energy).'
    ],
    processSkills: [
      'Observing', 'Classifying', 'Comparing', 'Analysis', 'Evaluating',
      'Predicting', 'Generating Possibilities', 'Making Hypotheses', 'Investigating'
    ],
    formativeAssessments: [
      'KWL for self-checks',
      'Learning Logs & Environmental Action Plans',
      'Eutrophication Detective Case Review',
      'Topical Review (non-graded)'
    ],
    summativeAssessments: [
      'Integrated into Term 2 Holistic Portfolio'
    ],
    resources: {
      textbook: 'TB 66-82',
      workbook: 'WB 50-55',
      workout: 'WorkOut 103-108'
    },
    connectedLabId: 'ecosystem',
    connectedQuizTopic: 'ecosystems'
  },

  // TERM 3
  {
    id: 'bbs_ch6_energy_food',
    chapterNumber: 6,
    title: 'Energy in Food & Photosynthesis',
    term: 3,
    theme: 'Energy',
    durationWeeks: 'Week 1 to 3',
    learningObjectives: [
      '1. State that living things need energy to carry out life processes (growth, repair, locomotion).',
      '2. Show an understanding that living things obtain energy stored in food.',
      '3. State the conditions (chlorophyll, sunlight) and raw materials (carbon dioxide, water) and products (glucose/sugar, oxygen) of photosynthesis.',
      '4. Describe what happens during the process of photosynthesis at the cellular/leaf level.',
      '5. Investigate the relationship between the materials and products of photosynthesis (iodine starch test, aquatic bubble count).',
      '6. Trace the fundamental energy pathway starting from nuclear fusion in the Sun to plants and animals.'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Analysis', 'Evaluating', 'Predicting',
      'Generating Possibilities', 'Making Hypotheses', 'Use of Apparatus'
    ],
    formativeAssessments: [
      'Photosynthesis light-meter experiment with aquatic Elodea',
      'Concept Maps on energy pathways',
      'Learning Logs & Exit tickets',
      'Topical Review (non-graded)'
    ],
    summativeAssessments: [
      'Formative Assessment Checkpoint (WA5 preparation)'
    ],
    resources: {
      textbook: 'TB 2-10',
      workbook: 'WB 2-14',
      workout: 'WorkOut 109-116'
    },
    connectedLabId: 'plant',
    connectedQuizTopic: 'plant_transport'
  },
  {
    id: 'bbs_ch7_forms_uses_energy',
    chapterNumber: 7,
    title: 'Forms and Uses of Energy & Conversions',
    term: 3,
    theme: 'Energy',
    durationWeeks: 'Week 4 to 7',
    learningObjectives: [
      '1. Differentiate between the different forms of energy (Kinetic, Gravitational Potential, Chemical Potential, Elastic Potential, Light, Electrical, Sound, Heat).',
      '2. Identify the different forms of energy and recognise their practical uses in everyday technologies.',
      '3. Understand and diagram the conversion of energy from one form to another, observing the Law of Conservation of Energy.'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Infer', 'Analyse', 'Communicating', 'Making Hypotheses'
    ],
    formativeAssessments: [
      'KWL for self-checks',
      'Drawing Energy Transformation Sankey Diagrams',
      'Energy Roller Coaster Lab simulations',
      'Topical Review'
    ],
    summativeAssessments: [
      'BMT2 - Bench Marking Test (WA5) conducted in Week 7 (Common across all BBS campuses)'
    ],
    resources: {
      textbook: 'TB 11-22',
      workbook: 'WB 15-26',
      workout: 'WorkOut 117-122'
    },
    connectedLabId: 'energy',
    connectedQuizTopic: 'energy'
  },
  {
    id: 'bbs_ch8_sources_energy',
    chapterNumber: 8,
    title: 'Sources of Energy & Sustainable Future',
    term: 3,
    theme: 'Energy',
    durationWeeks: 'Week 8 to 9',
    learningObjectives: [
      '1. Describe examples of the various sources of energy (Fossil fuels: coal, oil, natural gas; Renewables: solar, wind, hydro, geothermal, biomass) and their uses.',
      '2. Recognise that the Sun is the ultimate primary source of almost all energy on Earth.',
      '3. Understand the urgent need and importance of conserving energy and using energy wisely in daily life.'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Infer', 'Analyse', 'Communicating'
    ],
    formativeAssessments: [
      'KWL for self-checks',
      'Energy conservation presentations',
      'Concept Mapping & Multimedia Posters'
    ],
    summativeAssessments: [
      'Performance Task (WA6): Make a small-scale working model/version of different renewable sources of electrical energy.'
    ],
    resources: {
      textbook: 'TB 23-32',
      workbook: 'WB 27-32, 33-40',
      workout: 'WorkOut 123-128',
      notes: 'Term 4 preparation: FYE covers P3-P6 Cumulative Science.'
    },
    connectedLabId: 'circuit',
    connectedQuizTopic: 'energy'
  },

  // TERM 4 - REVISION, CIE CAMBRIDGE & EXAMINATIONS
  {
    id: 'bbs_term4_fye_revision',
    chapterNumber: 9,
    title: 'P6 Final Year Examination (FYE) Revision',
    term: 4,
    theme: 'CIE Cambridge Extension',
    durationWeeks: 'Week 1 to 2',
    learningObjectives: [
      'Cumulative revision across all 5 MOE Singapore themes:',
      '• Primary 3: Cycles & Diversity',
      '• Primary 4: Energy, Interactions, Systems',
      '• Primary 5: Cycles (Water Cycle, Reproduction) and Systems (Circulatory, Respiratory, Plant Transport)',
      '• Primary 6: Interactions (Forces, Habitats, Webs, Adaptations) and Energy (Food, Conversions, Sources)',
      'Mastery of Section B Open-Ended questions using the C-E-O (Cause -> Effect -> Observation) method.'
    ],
    processSkills: [
      'Observing', 'Inferring', 'Classifying', 'Predicting', 'Analysing', 'Evaluating'
    ],
    formativeAssessments: [
      'Timed mock exam drill papers',
      'Diagnostic error-analysis worksheets'
    ],
    summativeAssessments: [
      'Final Year Examination (FYE) - Weighted 40% of Total Annual Grade'
    ],
    resources: {
      textbook: 'All P3-P6 My Pals Are Here! Science Textbooks & Revision Guides',
      workbook: 'BBS Past Exam Papers & Benchmark Repositories',
      workout: 'Comprehensive Workout Series'
    },
    connectedQuizTopic: 'energy'
  },
  {
    id: 'bbs_term4_cie_extension_biology_chem',
    chapterNumber: 10,
    title: 'CIE Cambridge Extension: Biology & Chemistry',
    term: 4,
    theme: 'CIE Cambridge Extension',
    durationWeeks: 'Week 3',
    learningObjectives: [
      'Conduct of lessons on CIE Cambridge Stage 6 topics not covered in MPAH SOW:',
      '1. Biology: Bones and Skeletons (endoskeleton vs exoskeleton, joints, protective function of skull/ribs).',
      '2. Biology: Vertebrates and Invertebrates (classification into 5 vertebrate classes; arthropods, molluscs).',
      '3. Biology: Medicines and Infectious Diseases (pathogens, bacteria vs viruses, vaccination, hygiene).',
      '4. Chemistry: Mixing Materials and separating mixtures (sieving, filtration, evaporation, magnetism).',
      '5. Chemistry: Physical and Chemical changes using the particle model (reversible vs irreversible changes).',
      '6. Chemistry: Dissolving of substances (solute, solvent, solution, saturation, effect of temperature on solubility).'
    ],
    processSkills: [
      'Classifying', 'Comparing', 'Predicting', 'Formulating Hypotheses', 'Investigating'
    ],
    formativeAssessments: [
      'Particle model roleplay & solubility rate tests',
      'CIE Checkpoint sample question drills'
    ],
    summativeAssessments: [
      'CIE Stage 6 Practice Paper 1'
    ],
    resources: {
      textbook: 'Collins International Primary Science (2nd Ed) & Cambridge Primary Science (CUP / Hodder / Marshall Cavendish)',
      workbook: 'CIE Cambridge Stage 6 Activity Books',
      workout: 'Cambridge Checkpoint Past Papers'
    }
  },
  {
    id: 'bbs_term4_cie_extension_physics_earth',
    chapterNumber: 11,
    title: 'CIE Cambridge Extension: Physics & Earth Science',
    term: 4,
    theme: 'CIE Cambridge Extension',
    durationWeeks: 'Week 4',
    learningObjectives: [
      'Conduct of lessons on CIE Cambridge Stage 6 topics not covered in MPAH SOW:',
      '1. Physics: Reflection and Refraction of Light (law of reflection, normal, refraction through glass prisms and water lenses).',
      '2. Physics: Sound (sources, mechanical vibrations, pitch vs frequency, volume vs amplitude, transmission through solids/liquids/gases).',
      '3. Earth & Space: Structure of the Earth (crust, mantle, outer core, inner core).',
      '4. Earth & Space: Volcanoes and Earthquakes (tectonic plates, magma vs lava, seismographs).',
      '5. Earth & Space: Rocks and Soil (igneous, sedimentary, metamorphic rocks; weathering and erosion).',
      '6. Earth & Space: Earth and the Moon (29.5-day synodic month, 8 lunar phases, tidal locking, solar/lunar eclipses).',
      '7. Earth & Space: Earth and the Solar System (relative sizes, planetary order, revolution vs rotation periods).'
    ],
    processSkills: [
      'Observing', 'Comparing', 'Analysing', 'Using 3D Models', 'Predicting'
    ],
    formativeAssessments: [
      'SciQuest 3D Moon & Earth Space WebGL Lab exploration',
      'Augmented Reality (AR) lunar phase tracking',
      'Light ray prism tracing'
    ],
    summativeAssessments: [
      'CIE Stage 6 Practice Paper 2'
    ],
    resources: {
      textbook: 'Cambridge Primary Science Stage 6 (Cambridge University Press / Hodder)',
      workbook: 'Cambridge Checkpoint Skills Builder',
      workout: 'Past CIE Science Papers 2018-2025'
    },
    connectedLabId: 'moon',
    connectedQuizTopic: 'earth_space'
  },
  {
    id: 'bbs_term4_checkpoint_tests',
    chapterNumber: 12,
    title: 'Cambridge Checkpoint Examinations & Past Papers',
    term: 4,
    theme: 'CIE Cambridge Extension',
    durationWeeks: 'Week 5 (Revision) & Week 6 to 7 (Examinations)',
    learningObjectives: [
      '1. Week 5: Intensive Past Paper Revision drills (Answering past CIE Cambridge Checkpoint papers).',
      '2. Familiarisation with Cambridge mark schemes, scientific reasoning (Thinking and Working Scientifically - TWS).',
      '3. Week 6/7: Official Cambridge Primary Checkpoint Examination sitting across BBS campuses.',
      '4. Evaluation of international benchmark standards and diagnostic readiness for Secondary 1.'
    ],
    processSkills: [
      'All 13 Basic & Integrated Science Process Skills'
    ],
    formativeAssessments: [
      'Past Paper 1 & Paper 2 timed walkthroughs',
      'Examiner Report misconception highlights'
    ],
    summativeAssessments: [
      'Official Cambridge Primary Checkpoint Tests (Paper 1 & Paper 2)'
    ],
    resources: {
      textbook: 'Cambridge Assessment International Education Past Papers 0097',
      workbook: 'BBS Chief Expert Specimen Compendium',
      workout: 'Checklist of Cambridge Stage 6 Criteria'
    },
    connectedQuizTopic: 'earth_space'
  }
];

export const BBS_ASSESSMENT_CALCULATION = {
  breakdown: [
    { term: 'Term 1', assessment: 'Weighted Assessment 1 (WA1)', weight: '20%', type: 'Topical Test (Forces TB 2-15)' },
    { term: 'Term 2', assessment: 'Weighted Assessment 2 (WA2)', weight: '20%', type: 'Topical Test / BMT1 (Food Chains & Webs)' },
    { term: 'Term 3', assessment: 'Weighted Assessment 3 (WA3)', weight: '20%', type: 'Topical Test / BMT2 (Energy TB 11-22)' },
    { term: 'Term 4', assessment: 'Final Year Examination (FYE)', weight: '40%', type: 'Comprehensive Exam (P3-P6 Cumulative)' }
  ],
  total: '100%',
  glossary: [
    { term: 'WA', full: 'Weighted Assessment', description: 'Graded tasks recorded in the official student report book.' },
    { term: 'TT', full: 'Topical Tests', description: 'Written chapter assessments administered in pen and paper to gauge concept mastery.' },
    { term: 'BMT', full: 'Bench Marking Tests', description: 'Standardized common assessments taken by all Bina Bangsa School campuses nationwide to maintain academic parity.' },
    { term: 'Setter', full: 'Exam Setter', description: 'Teacher designated by the BBS Chief Expert to author the BMT or FYE paper for the grade level.' },
    { term: 'Vetter', full: 'Exam Vetter', description: 'Senior educator assigned to rigorously scrutinize, audit, and calibrate the exam paper.' },
    { term: 'Performance Task (PT)', full: 'Maker Performance Assessment', description: 'Authentic 3D model making, engineering design, or inquiry investigations assessing higher-order application.' }
  ]
};

export const BBS_MODELS_OF_INSTRUCTION = [
  {
    name: "The 5 E's Instructional Model",
    author: "Dr. Charles Chew (My Pals Are Here Primary Science Series 3rd Ed 2016)",
    phases: [
      { phase: 'Engage', description: 'Generate interest, stimulate curiosity, activate prior knowledge, and raise inquiry questions through discrepant events.' },
      { phase: 'Explore', description: 'Students directly handle apparatus, digital simulations, or evidence to address problems without premature explanation.' },
      { phase: 'Explain', description: 'Facilitate student communication of discoveries; introduce formal scientific concepts, laws, and vocabulary.' },
      { phase: 'Elaborate', description: 'Apply concepts to novel real-world challenges, engineering design tasks, or virtual lab extensions.' },
      { phase: 'Evaluate', description: 'Assess conceptual grasp, process skills, and self-regulation through formative exit slips and summative rubrics.' }
    ]
  },
  {
    name: 'Station Rotation Blended Learning',
    description: 'Students rotate on a fixed schedule between Teacher-Led Instruction, Tech Station (SciQuest Virtual Labs & AR Sandbox), Independent Practice, and Collaborative Group Investigation.'
  },
  {
    name: 'The "Flipped Classroom"',
    description: 'Students engage with foundational multimedia and theory at home, maximizing valuable in-class periods for teacher-guided inquiry, debates, and higher-order laboratory experiments.'
  }
];
