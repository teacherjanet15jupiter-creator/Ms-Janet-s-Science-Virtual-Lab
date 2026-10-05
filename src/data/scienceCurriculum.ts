import { AchievementBadge, QuizQuestion, ScienceMystery, ScienceTopic, UserProgress } from '../types/science';

export interface TopicMeta {
  id: ScienceTopic;
  title: string;
  tagline: string;
  p6CoreConcept: string;
  iconName: string;
  cambridgeCode: string;
  cambridgeStrand: string;
  myPalsTheme: 'Energy' | 'Interactions' | 'Systems' | 'Cycles';
  myPalsUnit: string;
  myPalsBook: string;
  myPalsPages: string;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    accent: string;
    border: string;
  };
}

export const TOPICS_META: Record<ScienceTopic, TopicMeta> = {
  energy: {
    id: 'energy',
    title: 'Energy Forms & Conversions',
    tagline: 'Kinetic, Gravitational Potential & Conservation of Energy',
    p6CoreConcept: 'Energy cannot be created or destroyed, only converted from one form to another.',
    iconName: 'Zap',
    cambridgeCode: '6Pf.01 & 6Pf.02',
    cambridgeStrand: 'Physics (Forces & Energy)',
    myPalsTheme: 'Energy',
    myPalsUnit: 'Unit 2: Forms & Uses of Energy · Unit 3: Conversions',
    myPalsBook: 'Textbook 6A',
    myPalsPages: 'pp. 42–71',
    colorScheme: {
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      accent: '#D97706',
      border: 'border-amber-200'
    }
  },
  forces: {
    id: 'forces',
    title: 'Forces & Motion',
    tagline: 'Frictional, Gravitational & Elastic Spring Forces',
    p6CoreConcept: 'A force is a push or pull. Unbalanced forces change the speed or direction of motion.',
    iconName: 'Move',
    cambridgeCode: '6Pf.03 & 6Pf.04',
    cambridgeStrand: 'Physics (Forces & Motion)',
    myPalsTheme: 'Interactions',
    myPalsUnit: 'Unit 1: Forces & Motion (Friction & Elastic Spring)',
    myPalsBook: 'Textbook 6A',
    myPalsPages: 'pp. 2–39',
    colorScheme: {
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-800',
      accent: '#0284C7',
      border: 'border-blue-200'
    }
  },
  plant_transport: {
    id: 'plant_transport',
    title: 'Plant Transport & Water Uptake',
    tagline: 'Xylem, Phloem, Stomata & Transpiration Pull',
    p6CoreConcept: 'Xylem transports water and dissolved mineral salts upwards; Phloem transports food both ways.',
    iconName: 'Leaf',
    cambridgeCode: '6Bp.01 & 6Bp.02',
    cambridgeStrand: 'Biology (Plant Biology)',
    myPalsTheme: 'Systems',
    myPalsUnit: 'Unit 1: Plant Transport System & Water Uptake',
    myPalsBook: 'Textbook 6B',
    myPalsPages: 'pp. 1–28',
    colorScheme: {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-800',
      accent: '#059669',
      border: 'border-emerald-200'
    }
  },
  ecosystems: {
    id: 'ecosystems',
    title: 'Ecosystems & Adaptations',
    tagline: 'Food Chains, Energy Pyramids & Structural Adaptations',
    p6CoreConcept: 'Energy from the Sun flows through producers to consumers; decomposers return nutrients to soil.',
    iconName: 'Trees',
    cambridgeCode: '6Be.01, 6Be.02 & 6Be.03',
    cambridgeStrand: 'Biology (Living Things in Their Environment)',
    myPalsTheme: 'Interactions',
    myPalsUnit: 'Unit 2: Living Together & Adaptations',
    myPalsBook: 'Textbook 6A',
    myPalsPages: 'pp. 74–120',
    colorScheme: {
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-800',
      accent: '#0D9488',
      border: 'border-teal-200'
    }
  },
  circulatory_respiratory: {
    id: 'circulatory_respiratory',
    title: 'Human Transport & Breathing',
    tagline: 'Heart, Blood Vessels, Lungs & Gaseous Exchange',
    p6CoreConcept: 'The heart pumps oxygen-rich and nutrient-rich blood to all body parts and returns carbon dioxide to the lungs.',
    iconName: 'Activity',
    cambridgeCode: '6Bs.01 & 6Bs.02',
    cambridgeStrand: 'Biology (Humans and Animals)',
    myPalsTheme: 'Systems',
    myPalsUnit: 'Unit 2: Human Circulatory & Respiratory Systems',
    myPalsBook: 'Textbook 6B',
    myPalsPages: 'pp. 32–64',
    colorScheme: {
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-800',
      accent: '#E11D48',
      border: 'border-rose-200'
    }
  },
  circuits: {
    id: 'circuits',
    title: 'Electrical Circuits & Systems',
    tagline: 'Series vs Parallel, Conductivity & Fuses',
    p6CoreConcept: 'Parallel circuits allow bulbs to shine brightly and independently; opening one branch does not break the other.',
    iconName: 'Cpu',
    cambridgeCode: '6Pe.01, 6Pe.02 & 6Pe.03',
    cambridgeStrand: 'Physics (Electricity & Magnetism)',
    myPalsTheme: 'Systems',
    myPalsUnit: 'Unit 3: Electrical Systems (P5/P6 Extension)',
    myPalsBook: 'Textbook 5A & 6B',
    myPalsPages: 'pp. 122–165',
    colorScheme: {
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-800',
      accent: '#6366F1',
      border: 'border-indigo-200'
    }
  },
  earth_space: {
    id: 'earth_space',
    title: 'Earth Science & Moon Phases',
    tagline: '29.5-Day Lunar Cycle, Eclipses & Planetary Geometry',
    p6CoreConcept: 'The Moon reflects sunlight; we see different phases as it orbits Earth every 29.5 days.',
    iconName: 'Moon',
    cambridgeCode: '6Es.01 & 6Es.02',
    cambridgeStrand: 'Earth and Space (Earth, Moon & Sun)',
    myPalsTheme: 'Cycles',
    myPalsUnit: 'Theme Cycles: Earth & Solar System',
    myPalsBook: 'Textbook 5B & 6A',
    myPalsPages: 'pp. 140–182',
    colorScheme: {
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-800',
      accent: '#0284C7',
      border: 'border-sky-200'
    }
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_eng_1',
    topic: 'energy',
    topicTitle: 'Energy Forms & Conversions',
    question: 'A rubber ball is dropped from a height of 2 metres onto a concrete floor. It bounces up to only 1.4 metres. Why did the ball NOT reach its original height?',
    scenario: 'Ball dropped from 2.0 m -> Bounces back to 1.4 m only.',
    options: [
      'Some gravitational potential energy was destroyed upon impact.',
      'Some kinetic energy was converted into sound energy and heat energy during impact.',
      'The force of gravity became stronger as the ball touched the floor.',
      'The ball lost its elastic potential energy completely.'
    ],
    correctIndex: 1,
    explanation: 'By the Principle of Conservation of Energy, energy cannot be created or destroyed. When the ball struck the concrete floor, part of its kinetic energy was converted into sound energy and thermal (heat) energy due to friction and deformation, leaving less kinetic energy to be converted back into gravitational potential energy.',
    p6KeyConcept: 'Total energy is conserved. "Lost" energy is dissipated into the surroundings as heat and sound energy.',
    commonPitfall: 'Never write "energy was destroyed" or "energy was lost" in exams! Always specify what form it was converted into.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.01 & 6Pf.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Energy changes & Law of conservation of energy',
      cambridgeTws: '6TWSm.01: Model energy transfer in bouncing objects',
      myPalsUnit: 'Unit 2: Forms and Uses of Energy',
      myPalsTheme: 'Energy',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 42–71',
      keyInquiryQuestion: 'Can energy ever be created or destroyed in collisions?',
      examFocus: 'C-E-O: Collision (Cause) -> Heat/Sound (Effect) -> Lower Bounce (Observation)'
    }
  },
  {
    id: 'q_eng_2',
    topic: 'energy',
    topicTitle: 'Energy Forms & Conversions',
    question: 'At which point of a roller coaster track is the cart’s Gravitational Potential Energy (GPE) at its MAXIMUM?',
    scenario: 'Track with Hill A (highest, 30m), Valley B (0m), Hill C (18m), Loop D (15m).',
    options: [
      'At Valley B (ground level), where speed is greatest',
      'At the highest peak, Hill A (30m above ground)',
      'At the top of the Loop D, where inverted',
      'At the braking zone right at the end of the ride'
    ],
    correctIndex: 1,
    explanation: 'Gravitational potential energy depends directly on the mass of the object and its vertical height above the reference ground (GPE = mgh). Therefore, GPE is at its maximum at the highest point of the ride (Hill A).',
    p6KeyConcept: 'Maximum height = Maximum GPE. As it descends, GPE is converted into Kinetic Energy (KE).',
    commonPitfall: 'Confusing KE and GPE: KE is highest at the lowest point (fastest speed), while GPE is highest at the top.',
    difficulty: 'Foundation',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.01',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Describe changes in energy when objects move and drop',
      cambridgeTws: '6TWSc.01: Quantitative measurements of height vs velocity',
      myPalsUnit: 'Unit 2: Forms & Uses of Energy',
      myPalsTheme: 'Energy',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 48–56',
      keyInquiryQuestion: 'Where does maximum potential energy exist on a coaster?',
      examFocus: 'Height determines stored GPE'
    }
  },
  {
    id: 'q_eng_3',
    topic: 'energy',
    topicTitle: 'Energy Forms & Conversions',
    question: 'When a battery-powered toy car climbs up an inclined ramp, what is the primary sequence of energy conversions occurring?',
    options: [
      'Chemical Potential Energy -> Electrical Energy -> Kinetic Energy + Gravitational Potential Energy',
      'Electrical Energy -> Gravitational Potential Energy -> Heat Energy -> Sound Energy',
      'Kinetic Energy -> Chemical Potential Energy -> Light Energy',
      'Gravitational Potential Energy -> Kinetic Energy -> Electrical Energy'
    ],
    correctIndex: 0,
    explanation: 'The chemical potential energy stored in the battery is converted into electrical energy in the circuit. The motor converts electrical energy into kinetic energy (movement), and as the car ascends the ramp, kinetic energy is converted into gravitational potential energy (along with some heat and sound).',
    p6KeyConcept: 'Trace each conversion step: Stored source -> Carrier -> Useful work output + Dissipated heat.',
    commonPitfall: 'Skipping the electrical step: the battery produces electrical energy first before the motor produces kinetic motion.',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.01 & 6Pf.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Energy chains & transformations in electrical devices',
      cambridgeTws: '6TWSm.01: Tracing multi-step energy flows',
      myPalsUnit: 'Unit 3: Energy Conversions',
      myPalsTheme: 'Energy',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 58–71',
      keyInquiryQuestion: 'How does stored chemical energy turn into vertical height?',
      examFocus: 'Full sequential energy transformation chains'
    }
  },
  {
    id: 'q_frc_1',
    topic: 'forces',
    topicTitle: 'Forces & Motion',
    question: 'A 2 kg wooden block is pulled across 4 different surfaces using a spring balance at a steady speed. Which surface exerts the GREATEST frictional force?',
    scenario: 'Spring balance readings: Surface W (1.2 N), Surface X (4.8 N), Surface Y (0.4 N), Surface Z (2.5 N).',
    options: [
      'Surface Y (0.4 N)',
      'Surface W (1.2 N)',
      'Surface Z (2.5 N)',
      'Surface X (4.8 N)'
    ],
    correctIndex: 3,
    explanation: 'When moving at a steady speed, the pulling force measured on the spring balance equals the opposing frictional force. Surface X requires 4.8 N of pulling force, indicating the greatest roughness and strongest frictional resistance.',
    p6KeyConcept: 'Greater pulling force required to maintain steady motion = greater opposing frictional force.',
    commonPitfall: 'Thinking the smoothest surface has the highest reading; smooth surfaces produce less friction, hence lower force readings.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.03 & 6Pf.04',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Measure forces in Newtons (N) using forcemeters and investigate friction',
      cambridgeTws: '6TWSp.01: Identifying variables in a fair test',
      myPalsUnit: 'Unit 1: Forces & Motion (Frictional Force)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 12–25',
      keyInquiryQuestion: 'How is friction measured with a spring balance?',
      examFocus: 'Force equilibrium: Pulling force = Opposing frictional force'
    }
  },
  {
    id: 'q_frc_2',
    topic: 'forces',
    topicTitle: 'Forces & Motion',
    question: 'Why do racing car tyres have deep grooves (treads) in wet weather conditions, but remain completely smooth ("slicks") on dry tracks?',
    options: [
      'Treads help channel rainwater away, preventing a layer of water from reducing friction between tyre and tarmac.',
      'Treads make the car lighter so it accelerates faster in the rain.',
      'Smooth tyres produce more aerodynamic lift to jump over puddles.',
      'Deep treads decrease the contact area to reduce gravitational pull.'
    ],
    correctIndex: 0,
    explanation: 'On wet roads, water can form a film between the tyre and road surface (hydroplaning), causing loss of friction and skidding. Tread patterns provide channels for water to escape, allowing rubber to maintain direct contact with the road to provide adequate friction for steering and braking.',
    p6KeyConcept: 'Friction is necessary for grip and control. Water acts as a lubricant unless channeled away.',
    commonPitfall: 'Assuming treads always increase friction because they are "rougher"; on dry tarmac, smooth slicks maximize surface area contact.',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.04',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Investigate factors affecting friction and practical applications',
      cambridgeTws: '6TWSe.01: Evaluating real-world engineering solutions for friction',
      myPalsUnit: 'Unit 1: Forces & Motion (Applications of Friction)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 20–31',
      keyInquiryQuestion: 'When is friction useful and how do humans control it?',
      examFocus: 'Water as a lubricant vs tread water dispersion'
    }
  },
  {
    id: 'q_frc_3',
    topic: 'forces',
    topicTitle: 'Forces & Motion',
    question: 'A spring has an original unextended length of 10 cm. When a 100 g weight is hung, its total length is 13 cm. What will its total length be when a 300 g weight is hung (assuming within elastic limit)?',
    scenario: 'Original: 10 cm | +100 g -> 13 cm (Extension = 3 cm)',
    options: [
      '16 cm',
      '19 cm',
      '21 cm',
      '39 cm'
    ],
    correctIndex: 1,
    explanation: 'The extension of the spring is proportional to the applied force. Original length = 10 cm. With 100 g, extension = 13 - 10 = 3 cm. With 300 g (3 times the mass), extension = 3 x 3 cm = 9 cm. Total length = 10 cm + 9 cm = 19 cm.',
    p6KeyConcept: 'Extension = Total Length - Original Length. Extension is proportional to load, not total length!',
    commonPitfall: 'Multiplying the total length (13 cm x 3 = 39 cm) instead of finding the extension first!',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pf.03',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Describe forces acting on springs and elastic limit',
      cambridgeTws: '6TWSc.01: Calculating linear extension from data tables',
      myPalsUnit: 'Unit 1: Forces & Motion (Elastic Spring Force)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 32–39',
      keyInquiryQuestion: 'How does Hooke\'s law govern spring extension?',
      examFocus: 'Extension vs Total Length calculation technique'
    }
  },
  {
    id: 'q_plt_1',
    topic: 'plant_transport',
    topicTitle: 'Plant Transport System',
    question: 'A white carnation flower with its stem cut is placed in a beaker containing water mixed with red food dye. After 6 hours, the white petals turn red. Which statement correctly explains this observation?',
    scenario: 'White flower stem placed in red water -> Petals turn red.',
    options: [
      'Phloem tubes absorbed the red dye and transported it to the leaves and petals.',
      'Xylem vessels transported water and the dissolved red dye upwards to the petals.',
      'The red dye was absorbed through stomata on the petals directly from the air.',
      'Photosynthesis in the stem produced red glucose that colored the petals.'
    ],
    correctIndex: 1,
    explanation: 'Xylem vessels are continuous hollow tubes that transport water and dissolved minerals from roots/cut stem upwards to all parts of the plant, including leaves and flower petals. The red dye traveled with the water through the xylem.',
    p6KeyConcept: 'Xylem = Water and mineral salts upwards from roots to leaves and flowers.',
    commonPitfall: 'Confusing Xylem and Phloem: Phloem transports food (sugars) made in leaves, Xylem transports water.',
    difficulty: 'Foundation',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Bp.01',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Transport of water and mineral salts from roots to leaves',
      cambridgeTws: '6TWSc.01: Making qualitative observations of dye transport',
      myPalsUnit: 'Unit 1: Plant Transport System & Water Uptake',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 6B',
      myPalsPages: 'pp. 2–15',
      keyInquiryQuestion: 'Which vessels transport water against gravity in plants?',
      examFocus: 'Xylem vessels transport water and dissolved minerals upwards'
    }
  },
  {
    id: 'q_plt_2',
    topic: 'plant_transport',
    topicTitle: 'Plant Transport System',
    question: 'In a classic P6 experiment, a complete outer ring of bark (containing the phloem tubes) is removed from a woody tree stem, while the inner wood (xylem) is left intact. After several weeks, a swelling is observed directly ABOVE the cut ring. What caused this swelling?',
    scenario: 'Stem ringed: Phloem removed, Xylem intact. Swelling forms above the cut.',
    options: [
      'Excess water pumped up by the xylem accumulated because it could not pass the cut.',
      'Food (sugar) manufactured by the leaves was transported downwards by phloem and got blocked at the cut.',
      'Bacterial infection caused a gall tumor to grow at the damaged bark.',
      'Stomata closed, causing excess carbon dioxide gas to inflate the stem tissue.'
    ],
    correctIndex: 1,
    explanation: 'Leaves make food (sugars) during photosynthesis. Phloem vessels in the outer bark transport this food downwards to roots and lower stem. Removing the phloem ring blocks downward transport, causing sugars and nutrients to accumulate and pool above the cut, leading to swelling.',
    p6KeyConcept: 'Phloem is located towards the outer layer of the stem; Xylem is located towards the interior.',
    commonPitfall: 'Thinking xylem is blocked: if xylem were removed, the leaves above would wither and die from lack of water.',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Bp.01 & 6Bp.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Functions of xylem and phloem transport vessels',
      cambridgeTws: '6TWSe.01: Deducing physiological cause from morphological changes',
      myPalsUnit: 'Unit 1: Plant Transport System (Ringing of Stem)',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 6B',
      myPalsPages: 'pp. 16–28',
      keyInquiryQuestion: 'Why does a girdled or ringed tree stem swell above the cut?',
      examFocus: 'Phloem food blockage causing accumulation above cut ring'
    }
  },
  {
    id: 'q_plt_3',
    topic: 'plant_transport',
    topicTitle: 'Plant Transport System',
    question: 'On a hot, dry, and windy day, how does the rate of transpiration (water loss through stomata) change compared to a cool, humid day?',
    options: [
      'Transpiration rate increases significantly because water evaporates faster into dry, moving air.',
      'Transpiration rate decreases because plants absorb water through leaves from the wind.',
      'Transpiration stops completely because wind closes all xylem vessels.',
      'Transpiration remains identical regardless of environmental conditions.'
    ],
    correctIndex: 0,
    explanation: 'Transpiration is the evaporation of water from leaves through stomata. High temperature, low humidity (dry air), and high wind speed all increase the rate of evaporation, creating a steeper water vapor gradient and pulling more water up the xylem (transpiration pull).',
    p6KeyConcept: 'Transpiration factors: Increased temperature, wind, and light increase transpiration; high humidity decreases it.',
    commonPitfall: 'Forgetting that extreme drought can cause stomata to close to prevent desiccation; under standard well-watered conditions, wind and heat accelerate transpiration.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Bp.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Role of leaves in transpiration and water loss',
      cambridgeTws: '6TWSp.01: Environmental factors affecting evaporation rates',
      myPalsUnit: 'Unit 1: Plant Transport System (Transpiration Pull)',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 6B',
      myPalsPages: 'pp. 8–18',
      keyInquiryQuestion: 'What environmental conditions accelerate water loss in plants?',
      examFocus: 'Transpiration pull accelerated by temperature, wind and light'
    }
  },
  {
    id: 'q_eco_1',
    topic: 'ecosystems',
    topicTitle: 'Ecosystems & Adaptations',
    question: 'Consider the food chain: Sunlight -> Grass -> Grasshopper -> Frog -> Python -> Eagle. If a farmer sprays insecticide that wipes out 95% of the grasshoppers, which of the following population changes is most likely to happen first?',
    scenario: 'Grass -> Grasshopper -> Frog -> Python -> Eagle. Grasshoppers drastically reduced.',
    options: [
      'The grass population will increase, while the frog population will decrease.',
      'The python population will increase rapidly.',
      'The eagle will start eating grass instead.',
      'The frog population will double due to less competition.'
    ],
    correctIndex: 0,
    explanation: 'With fewer grasshoppers feeding on grass, less grass is consumed, so the grass population increases. Meanwhile, frogs rely on grasshoppers as their primary food source; with scarce food, the frog population will decline due to starvation and lack of reproduction.',
    p6KeyConcept: 'Trophic relationships: Reduction in a primary consumer allows producers to flourish while starving the secondary consumer.',
    commonPitfall: 'Assuming animals easily switch food sources without population impact; predatory birds cannot switch to eating grass.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Be.01 & 6Be.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Interpret food chains and webs and predict environmental impacts',
      cambridgeTws: '6TWSe.01: Predicting multi-population ecological dynamics',
      myPalsUnit: 'Unit 2: Living Together (Food Chains & Webs)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 74–95',
      keyInquiryQuestion: 'How does removing one organism cascade through a community?',
      examFocus: 'Interdependence: Consumer decrease -> Producer increase & Predator decrease'
    }
  },
  {
    id: 'q_eco_2',
    topic: 'ecosystems',
    topicTitle: 'Ecosystems & Adaptations',
    question: 'Why does an energy pyramid always become narrower at each successive trophic level from producers up to apex predators?',
    scenario: 'Producers (10,000 J) -> Primary Consumers (1,000 J) -> Secondary Consumers (100 J) -> Apex (10 J).',
    options: [
      'Top predators are physically smaller than grass plants.',
      'Only about 10% of energy is passed to the next level; the rest is lost as heat, respiration, and undigested waste.',
      'Decomposers consume all the sunlight before top predators can absorb it.',
      'Energy is destroyed by herbivores when chewing plants.'
    ],
    correctIndex: 1,
    explanation: 'At each trophic stage, organisms use energy for life processes (movement, respiration, cell repair) and release heat into the environment. Energy in uneaten parts and waste also goes to decomposers. Typically only ~10% is incorporated into new biomass and passed to the next level.',
    p6KeyConcept: 'Energy decreases along a food chain. This limits food chains to 4 or 5 trophic levels.',
    commonPitfall: 'Stating "energy is recycled": nutrients and minerals are recycled by decomposers, but energy flows one-way and dissipates as heat!',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Be.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Energy transfer and loss through trophic pyramids',
      cambridgeTws: '6TWSm.01: Analyzing energy flow diagrams',
      myPalsUnit: 'Unit 2: Living Together (Energy Flow in Communities)',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 88–104',
      keyInquiryQuestion: 'Why can an ecosystem not support an infinite chain of predators?',
      examFocus: '10% trophic transfer: energy dissipated as heat and respiration'
    }
  },
  {
    id: 'q_eco_3',
    topic: 'ecosystems',
    topicTitle: 'Ecosystems & Adaptations',
    question: 'The Fennec Fox lives in the hot Sahara Desert and has unusually large ears with extensive networks of blood vessels. How does this structural adaptation aid its survival?',
    options: [
      'Large ears shade its eyes from bright desert sunlight.',
      'Blood circulating through the thin, large ear surface radiates excess heat into the air, helping the fox cool down.',
      'The ears flap like wings to blow sand off its face.',
      'Large ears absorb moisture directly from desert morning fog.'
    ],
    correctIndex: 1,
    explanation: 'The large ear surface area rich in blood capillaries allows thermal radiation to escape into the cooler surrounding air when resting, cooling the blood before it returns to the body core. This is a vital structural thermoregulation adaptation.',
    p6KeyConcept: 'Large surface-area-to-volume ratio in extremities helps desert animals lose heat to prevent overheating.',
    commonPitfall: 'Confusing structural adaptation (physical body structure) with behavioral adaptation (e.g. hunting at night/nocturnal).',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Be.03',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Structural and behavioural adaptations of organisms for survival',
      cambridgeTws: '6TWSe.01: Relating anatomy to environmental challenges',
      myPalsUnit: 'Unit 3: Adaptations for Survival',
      myPalsTheme: 'Interactions',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 106–120',
      keyInquiryQuestion: 'How do desert mammals prevent dangerous overheating?',
      examFocus: 'Structural adaptations: large vascularized surface area for heat radiation'
    }
  },
  {
    id: 'q_crt_1',
    topic: 'circuits',
    topicTitle: 'Electrical Circuits & Systems',
    question: 'In a room, two light bulbs are wired in PARALLEL to a power source. What happens to Bulb B if the filament in Bulb A melts and breaks?',
    scenario: 'Two identical bulbs in parallel branches. Bulb A breaks.',
    options: [
      'Bulb B goes out immediately because the circuit is broken.',
      'Bulb B stays lit with the same brightness because its closed loop branch remains intact.',
      'Bulb B explodes due to receiving twice the electrical voltage.',
      'Bulb B starts blinking as alternating current reverses.'
    ],
    correctIndex: 1,
    explanation: 'In a parallel circuit, each electrical branch forms an independent closed loop with the power supply. If Bulb A breaks, its individual branch becomes open, but the branch containing Bulb B is still complete and connected across the full voltage, so Bulb B remains brightly lit.',
    p6KeyConcept: 'Advantage of parallel circuits: If one appliance/bulb fails, others continue operating independently.',
    commonPitfall: 'Applying series circuit rules: In a series circuit, one broken bulb breaks the entire single path, turning all bulbs off.',
    difficulty: 'Foundation',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pe.01 & 6Pe.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Construct series and parallel circuits; compare lamp brightness and switches',
      cambridgeTws: '6TWSm.01: Testing virtual circuit loop integrity',
      myPalsUnit: 'Unit 3: Electrical Systems',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 5A & 6B',
      myPalsPages: 'pp. 122–148',
      keyInquiryQuestion: 'Why are household appliances connected in parallel?',
      examFocus: 'Independent closed circuit loops in parallel branches'
    }
  },
  {
    id: 'q_crt_2',
    topic: 'circuits',
    topicTitle: 'Electrical Circuits & Systems',
    question: 'A student tests several everyday objects by placing them in an open gap in an electrical circuit. Which of the following objects will close the circuit and cause the bulb to light up?',
    options: [
      'A plastic ballpoint pen barrel',
      'The graphite core of a wooden pencil',
      'A dry rubber pencil eraser',
      'A clear glass microscope slide'
    ],
    correctIndex: 1,
    explanation: 'Graphite is a form of carbon that possesses delocalized electrons, making it an electrical conductor even though it is a non-metal! Plastic, rubber, and glass are electrical insulators and will not allow electric current to pass through.',
    p6KeyConcept: 'Conductors allow electric current to flow through them; insulators resist current flow. Graphite is a classic non-metal conductor.',
    commonPitfall: 'Thinking all non-metals are insulators; graphite (pencil lead) conducts electricity.',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Pe.03',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Physics',
      cambridgeDescription: 'Classify electrical conductors and insulators',
      cambridgeTws: '6TWSc.01: Experimental testing of material conductivity',
      myPalsUnit: 'Unit 3: Electrical Systems (Conductors & Insulators)',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 5A',
      myPalsPages: 'pp. 140–152',
      keyInquiryQuestion: 'Can non-metals ever conduct electricity?',
      examFocus: 'Graphite is a non-metal electrical conductor'
    }
  },
  {
    id: 'q_hum_1',
    topic: 'circulatory_respiratory',
    topicTitle: 'Human Systems & Transport',
    question: 'Which of the following correctly describes the main difference in blood composition between blood leaving the lungs and blood returning to the heart from the rest of the body?',
    options: [
      'Blood leaving lungs is rich in oxygen and low in carbon dioxide; blood returning from body is rich in carbon dioxide and low in oxygen.',
      'Blood leaving lungs contains no white blood cells; blood returning from body contains only platelets.',
      'Blood leaving lungs carries only water; blood returning from body carries only solid waste.',
      'Both streams of blood have identical concentrations of oxygen and carbon dioxide.'
    ],
    correctIndex: 0,
    explanation: 'In the lungs, gaseous exchange occurs across the alveoli: oxygen diffuses into the blood, while carbon dioxide diffuses out into the lungs to be exhaled. Body cells consume oxygen for cellular respiration and produce carbon dioxide as waste, which the returning blood transports.',
    p6KeyConcept: 'Lungs = Oxygen uptake & CO2 removal. Body tissues = Oxygen consumption & CO2 production.',
    commonPitfall: 'Saying blood has "no carbon dioxide" or "no oxygen"; blood always carries both, but the relative proportions change (oxygen-rich vs oxygen-poor).',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Bs.01 & 6Bs.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Biology',
      cambridgeDescription: 'Circulatory and respiratory systems and gaseous exchange',
      cambridgeTws: '6TWSc.01: Comparing inhaled and exhaled gas concentrations',
      myPalsUnit: 'Unit 2: Human Circulatory & Respiratory Systems',
      myPalsTheme: 'Systems',
      myPalsBook: 'Textbook 6B',
      myPalsPages: 'pp. 32–64',
      keyInquiryQuestion: 'How do lungs and heart collaborate to fuel body cells?',
      examFocus: 'Oxygen-rich blood in pulmonary vein vs oxygen-poor in vena cava'
    }
  },
  {
    id: 'q_moon_1',
    topic: 'earth_space',
    topicTitle: 'Earth Science & Moon Phases',
    question: 'Why does the Moon appear to change its shape in a repeating cycle of approximately 29.5 days?',
    scenario: 'Observer in Singapore / Bina Bangsa School records Moon phases from Day 0 to Day 29.5.',
    options: [
      'Earth’s shadow falls onto the Moon and gradually covers it every night.',
      'As the Moon orbits Earth, observers on Earth see varying fractions of the sunlit hemisphere of the Moon.',
      'The Moon produces its own light which turns on and off during the month.',
      'Clouds in Earth’s atmosphere block different portions of the lunar surface.'
    ],
    correctIndex: 1,
    explanation: 'The Moon is non-luminous; it reflects light from the Sun. Exactly 50% of the Moon is always illuminated by sunlight (except during lunar eclipses). As the Moon revolves around Earth once every 29.5 days, our vantage point from Earth changes, allowing us to see different amounts of that illuminated half.',
    p6KeyConcept: 'Moon phases are caused by the Moon orbiting Earth, changing the angle from which we view its sunlit half. It is NOT caused by Earth\'s shadow!',
    commonPitfall: 'The #1 science misconception: Thinking normal moon phases are caused by Earth\'s shadow. Earth\'s shadow only causes Lunar Eclipses!',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Es.01 & 6Es.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Earth and Space',
      cambridgeDescription: 'Relative movements of Earth, Moon and Sun and 29.5-day lunar phases',
      cambridgeTws: '6TWSm.01: Using 3D models to contrast space view vs observer sky view',
      myPalsUnit: 'Theme Cycles: Earth & The Solar System',
      myPalsTheme: 'Cycles',
      myPalsBook: 'Textbook 5B & 6A',
      myPalsPages: 'pp. 140–182',
      keyInquiryQuestion: 'Why does the Moon appear to change shape over a month?',
      examFocus: 'C-E-O: Moon orbits Earth (Cause) -> Viewing angle of sunlit hemisphere changes (Effect) -> Different phase shapes observed (Observation)'
    }
  },
  {
    id: 'q_moon_2',
    topic: 'earth_space',
    topicTitle: 'Earth Science & Moon Phases',
    question: 'During which phase of the Moon can a SOLAR ECLIPSE occur, and what is the relative alignment of the celestial bodies?',
    options: [
      'New Moon (Sun -> Moon -> Earth in a straight line)',
      'Full Moon (Sun -> Earth -> Moon in a straight line)',
      'First Quarter (Sun and Moon at 90° right angles to Earth)',
      'Third Quarter (Moon in Earth’s polar shadow)'
    ],
    correctIndex: 0,
    explanation: 'A solar eclipse can only happen during a New Moon, when the Moon passes directly between the Sun and Earth. The Moon casts its dark shadow (umbra) onto a small path of Earth\'s surface, temporarily blocking the Sun in daytime.',
    p6KeyConcept: 'Solar Eclipse = Sun -> Moon -> Earth (New Moon). Lunar Eclipse = Sun -> Earth -> Moon (Full Moon).',
    commonPitfall: 'Swapping solar and lunar eclipse alignments: remember in a solar eclipse, the MOON is in the middle!',
    difficulty: 'Standard',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Es.01',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Earth and Space',
      cambridgeDescription: 'Solar and lunar eclipse planetary alignments and shadow geometry',
      cambridgeTws: '6TWSm.01: Raycasting umbra and penumbra shadow cones',
      myPalsUnit: 'Theme Cycles: Earth & Space (Eclipses)',
      myPalsTheme: 'Cycles',
      myPalsBook: 'Textbook 6A',
      myPalsPages: 'pp. 160–175',
      keyInquiryQuestion: 'What celestial alignment produces a solar eclipse?',
      examFocus: 'New Moon phase and Sun-Moon-Earth syzygy'
    }
  },
  {
    id: 'q_moon_3',
    topic: 'earth_space',
    topicTitle: 'Earth Science & Moon Phases',
    question: 'Why do observers on Earth always see the exact same side (craters and maria) of the Moon throughout the entire year?',
    options: [
      'The Moon does not rotate on its axis at all.',
      'The Moon’s period of rotation on its axis exactly equals its period of revolution around Earth (synchronous rotation/tidal locking).',
      'The far side of the Moon is permanently hidden behind a thick cloud layer.',
      'Earth’s magnetic field prevents the Moon from spinning.'
    ],
    correctIndex: 1,
    explanation: 'The Moon takes approximately 27.3 days to rotate once on its axis and the exact same time (27.3 days) to orbit Earth once! Because its rotation speed matches its orbital revolution speed (tidal locking), the same geographic hemisphere of the Moon always faces Earth.',
    p6KeyConcept: 'Tidal locking / Synchronous rotation: Period of Rotation = Period of Revolution.',
    commonPitfall: 'Saying the Moon does not rotate: If the Moon didn\'t rotate, we would see all sides of it as it circled Earth!',
    difficulty: 'Challenger',
    curriculumAlignment: {
      cambridgeObjectiveCode: '6Es.02',
      cambridgeStage: 'Stage 6',
      cambridgeStrand: 'Earth and Space',
      cambridgeDescription: 'Synchronous rotation and tidal locking of the Moon',
      cambridgeTws: '6TWSe.01: Explaining observable phenomena using rotational geometry',
      myPalsUnit: 'Theme Cycles: Earth & Solar System',
      myPalsTheme: 'Cycles',
      myPalsBook: 'Textbook 5B & 6A',
      myPalsPages: 'pp. 170–182',
      keyInquiryQuestion: 'Why does the same side of the Moon always face Earth?',
      examFocus: 'Period of rotation equals period of revolution'
    }
  }
];

export const SCIENCE_MYSTERIES: ScienceMystery[] = [
  {
    id: 'mystery_celery',
    topic: 'plant_transport',
    title: 'The Case of the Wilted Celery Stalk',
    summary: 'A botanist left three celery stalks in different liquid solutions overnight. One stalk shrank and became limp, while another stood stiff and upright. What happened at the cellular level?',
    caseBrief: 'Detective Quark arrives at Botanical Lab 4. Celery A was in pure distilled water, Celery B was in concentrated salt water (brine), and Celery C was kept dry. Celery B is completely floppy, limp, and has lost weight!',
    curriculumAlignment: {
      cambridgeCode: '6Bp.01 (Water Transport & Plant Support)',
      myPalsUnit: 'My Pals 6B - Unit 1: Plant Transport & Osmosis'
    },
    clues: [
      {
        id: 'c1',
        label: 'Weight Scale Measurement',
        observation: 'Celery A gained 8% mass. Celery B lost 14% mass!',
        scientificDeduction: 'Mass change points to movement of water into or out of the plant cells.'
      },
      {
        id: 'c2',
        label: 'Microscopic Cell Wall View',
        observation: 'In Celery B, the cytoplasm has pulled away from the cell wall (plasmolysis).',
        scientificDeduction: 'Water moved out from high water potential inside cells into the salty exterior.'
      },
      {
        id: 'c3',
        label: 'Crispness Test (Turgor Pressure)',
        observation: 'Celery A snaps crisply when bent; Celery B bends without breaking.',
        scientificDeduction: 'Water pressure against cell walls gives non-woody plants firmness and support.'
      }
    ],
    verdictOptions: [
      {
        id: 'v1',
        text: 'Water moved out of Celery B cells into the concentrated salt solution, causing loss of turgor pressure.',
        isCorrect: true,
        explanation: 'Correct! By osmosis, water moves from a region of higher water potential (inside cells) to lower water potential (salt brine). As water exited, the cells became flaccid, causing the celery to wilt.'
      },
      {
        id: 'v2',
        text: 'Salt particles entered Celery B and dissolved the cell walls completely.',
        isCorrect: false,
        explanation: 'Cell walls remain intact (made of cellulose). It was the water loss and shrinking vacuoles that caused the limpness.'
      },
      {
        id: 'v3',
        text: 'The phloem was poisoned by chlorine in the salt water.',
        isCorrect: false,
        explanation: 'This is a physical osmosis effect affecting all plant tissue cells, not a chemical poison of phloem tubes.'
      }
    ]
  },
  {
    id: 'mystery_coaster',
    topic: 'energy',
    title: 'The Stalled Coaster Mystery',
    summary: 'An engineer designed a roller coaster with a second hill taller than the first launch hill. Why does the cart always roll backwards before reaching the summit of Hill 2?',
    caseBrief: 'Theme Park ThrillWorld had to shut down "The ThunderHawk". Carts launched from Hill 1 (height 20m) never make it over Hill 2 (height 24m) without a secondary motor assist. The park manager asks you to explain the physics violation!',
    curriculumAlignment: {
      cambridgeCode: '6Pf.01 & 6Pf.02 (Conservation of Energy)',
      myPalsUnit: 'My Pals 6A - Unit 2: Energy Conversions & Dissipated Heat'
    },
    clues: [
      {
        id: 'c1',
        label: 'Height Altimeter Log',
        observation: 'Hill 1 peak is 20m. Hill 2 peak is 24m.',
        scientificDeduction: 'GPE at Hill 2 summit requires more energy than total initial GPE at Hill 1.'
      },
      {
        id: 'c2',
        label: 'Thermal Camera Scan',
        observation: 'Tracks and cart wheel bearings glow warm (45°C) along the run.',
        scientificDeduction: 'Friction and air resistance constantly convert mechanical energy into heat and sound.'
      },
      {
        id: 'c3',
        label: 'Energy Audit',
        observation: 'No booster motors exist between Hill 1 and Hill 2.',
        scientificDeduction: 'Without an external energy input, total mechanical energy cannot increase.'
      }
    ],
    verdictOptions: [
      {
        id: 'v1',
        text: 'The cart cannot climb higher than 20m because total energy is conserved, and friction also converted some energy into heat and sound.',
        isCorrect: true,
        explanation: 'Spot on! The cart starts with GPE corresponding to 20m. Since energy cannot be created from nothing, and some is lost to friction, the cart can never climb higher than its starting height without an external motor.'
      },
      {
        id: 'v2',
        text: 'The cart ran out of electrical charge in its wheels.',
        isCorrect: false,
        explanation: 'Roller coaster carts are passive unpowered vehicles once released from the first lift hill; they operate purely on GPE and KE.'
      },
      {
        id: 'v3',
        text: 'Gravity was pulling sideways against the cart at Hill 2.',
        isCorrect: false,
        explanation: 'Gravity always acts downwards towards the Earth’s centre.'
      }
    ]
  },
  {
    id: 'mystery_pond',
    topic: 'ecosystems',
    title: 'The Silent Lily Pond Mystery',
    summary: 'A once clear pond suddenly turned murky green with floating scum, and fish began dying at sunrise. What triggered this sudden collapse?',
    caseBrief: 'Gardeners noticed that after fertilizing the surrounding lawns heavily before a torrential rainstorm, the pond became choked with thick green algae, followed by fish gasping at the surface and dying.',
    curriculumAlignment: {
      cambridgeCode: '6Be.01 (Ecosystem Equilibrium & Human Impact)',
      myPalsUnit: 'My Pals 6A - Unit 2: Living Together & Decomposers'
    },
    clues: [
      {
        id: 'c1',
        label: 'Water Chemistry Kit',
        observation: 'Nitrate and phosphate levels are 20x higher than normal.',
        scientificDeduction: 'Fertilizer runoff washed into the pond during the heavy rain.'
      },
      {
        id: 'c2',
        label: 'Microscopic Pond Sample',
        observation: 'Dense bloom of single-celled green algae blocking sunlight from reaching submerged plants.',
        scientificDeduction: 'Rapid algae proliferation prevents underwater plants from photosynthesizing.'
      },
      {
        id: 'c3',
        label: 'Dissolved Oxygen Meter at Dawn',
        observation: 'Oxygen level is nearly 0 mg/L at dawn!',
        scientificDeduction: 'Decomposers feeding on dying algae consumed all dissolved oxygen during respiration.'
      }
    ],
    verdictOptions: [
      {
        id: 'v1',
        text: 'Fertilizer runoff caused an algal bloom (eutrophication). When algae died, decomposers multiplied and consumed dissolved oxygen, suffocating the fish.',
        isCorrect: true,
        explanation: 'Outstanding scientific detective work! This is eutrophication: excess nutrients -> algal bloom -> light blocked -> plants & algae die -> bacteria/decomposers multiply and respire -> oxygen depletion -> aquatic animals die.'
      },
      {
        id: 'v2',
        text: 'The fish ate too much fertilizer directly and had indigestion.',
        isCorrect: false,
        explanation: 'Fish die from suffocation (anoxia) due to oxygen depletion by decomposers, not direct fertilizer poisoning.'
      },
      {
        id: 'v3',
        text: 'The algae produced poisonous carbon dioxide that dissolved the fish scales.',
        isCorrect: false,
        explanation: 'Algae do not produce poisonous CO2; it is the severe drop in dissolved oxygen (O2) that causes fish mortality.'
      }
    ]
  }
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge_energy_master',
    title: 'Kinetic Dynamo',
    description: 'Experiment with the Energy Roller Coaster and identify energy transformation at all 4 stages.',
    icon: '⚡',
    unlocked: false,
    topic: 'energy'
  },
  {
    id: 'badge_friction_pro',
    title: 'Friction Conqueror',
    description: 'Test block friction across all 4 surfaces and observe Hooke’s spring extension.',
    icon: '🛷',
    unlocked: false,
    topic: 'forces'
  },
  {
    id: 'badge_xylem_detective',
    title: 'Botanical Investigator',
    description: 'Run the plant dye uptake simulation and ring the phloem to observe stem swelling.',
    icon: '🌿',
    unlocked: false,
    topic: 'plant_transport'
  },
  {
    id: 'badge_food_web_hero',
    title: 'Ecological Balancer',
    description: 'Run the ecosystem simulation and survive a trophic cascade scenario.',
    icon: '🦅',
    unlocked: false,
    topic: 'ecosystems'
  },
  {
    id: 'badge_circuit_wizard',
    title: 'Circuit Architect',
    description: 'Build a working parallel circuit and test materials with the conductivity probe.',
    icon: '💡',
    unlocked: false,
    topic: 'circuits'
  },
  {
    id: 'badge_quiz_novice',
    title: 'Lab Apprentice',
    description: 'Complete your first P6 Science quiz session.',
    icon: '🧪',
    unlocked: false,
    topic: 'general'
  },
  {
    id: 'badge_quiz_sharpshooter',
    title: 'P6 Science Sharpshooter',
    description: 'Achieve a 5-question answer streak in the Quiz Arena.',
    icon: '🎯',
    unlocked: false,
    topic: 'general'
  },
  {
    id: 'badge_mystery_sleuth',
    title: 'Master Science Detective',
    description: 'Crack any P6 Science Mystery case with all clues unlocked.',
    icon: '🔍',
    unlocked: false,
    topic: 'general'
  },
  {
    id: 'badge_energy_conservation',
    title: 'Law of Conservation',
    description: 'Maintain 100% total energy balance in the Roller Coaster Lab.',
    icon: '⚖️',
    unlocked: false,
    topic: 'energy'
  },
  {
    id: 'badge_grand_scholar',
    title: 'Distinction Scholar',
    description: 'Earn 500 XP and reach Junior Scientist Rank.',
    icon: '🏆',
    unlocked: false,
    topic: 'general'
  },
  {
    id: 'badge_moon_astronomer',
    title: 'Lunar Astronomer',
    description: 'Track the 8 lunar phases and observe synchronous rotation in 3D.',
    icon: '🌖',
    unlocked: false,
    topic: 'earth_space'
  },
  {
    id: 'badge_ar_pioneer',
    title: 'AR Hologram Explorer',
    description: 'Project a live 3D Moon or Earth hologram in your classroom and capture an AR photo.',
    icon: '📱',
    unlocked: false,
    topic: 'general'
  }
];

export const INITIAL_USER_PROGRESS: UserProgress = {
  xp: 120,
  level: 1,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  quizzesCompleted: 1,
  correctAnswersCount: 4,
  totalQuestionsAttempted: 5,
  experimentsRunCount: 2,
  mysteriesSolved: [],
  unlockedBadges: ['badge_quiz_novice'],
  topicMastery: {
    energy: 45,
    forces: 30,
    plant_transport: 60,
    ecosystems: 40,
    circulatory_respiratory: 25,
    circuits: 35,
    earth_space: 50
  },
  masteredCompetencies: ['comp_energy_1', 'comp_plant_1', 'comp_forces_2', 'comp_moon_1']
};
