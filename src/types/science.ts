export type ScienceTopic = 
  | 'energy'
  | 'forces'
  | 'plant_transport'
  | 'ecosystems'
  | 'circulatory_respiratory'
  | 'circuits'
  | 'earth_space';

export interface CurriculumAlignment {
  cambridgeObjectiveCode: string; // e.g. "5Bp.01" or "6Pf.01"
  cambridgeStage: 'Stage 5' | 'Stage 6';
  cambridgeStrand: 'Physics' | 'Biology' | 'Chemistry' | 'Earth and Space' | 'Thinking and Working Scientifically';
  cambridgeDescription: string;
  cambridgeTws: string; // e.g. "6TWSm.01: Use virtual models to test scientific predictions"
  myPalsUnit: string; // e.g. "Unit 2: Forms & Uses of Energy"
  myPalsTheme: 'Energy' | 'Interactions' | 'Systems' | 'Cycles';
  myPalsBook: string;
  myPalsPages: string; // e.g. "Textbook 6A pp. 45–68 · Activity Book pp. 31–44"
  keyInquiryQuestion: string;
  examFocus: string;
}

export interface QuizQuestion {
  id: string;
  topic: ScienceTopic;
  topicTitle: string;
  gradeLevel?: 'Primary 5' | 'Primary 6';
  question: string;
  scenario?: string;
  diagramSvg?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  p6KeyConcept: string;
  commonPitfall: string;
  difficulty: 'Foundation' | 'Standard' | 'Challenger';
  curriculumAlignment?: CurriculumAlignment;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  topic: ScienceTopic | 'general';
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  quizzesCompleted: number;
  correctAnswersCount: number;
  totalQuestionsAttempted: number;
  experimentsRunCount: number;
  mysteriesSolved: string[];
  unlockedBadges: string[];
  topicMastery: Record<ScienceTopic, number>; // 0 to 100%
  masteredCompetencies?: string[]; // Cambridge & My Pals checklist item IDs
}

export interface ScienceMystery {
  id: string;
  title: string;
  summary: string;
  caseBrief: string;
  clues: {
    id: string;
    label: string;
    observation: string;
    scientificDeduction: string;
  }[];
  verdictOptions: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  topic: ScienceTopic;
  curriculumAlignment?: {
    cambridgeCode: string;
    myPalsUnit: string;
  };
}

export interface Lesson5EPlan {
  engage: string;
  explore: string;
  explain: string;
  elaborate: string;
  evaluate: string;
}

export interface CurriculumLessonModule {
  id: string;
  topic: ScienceTopic;
  title: string;
  myPalsTheme: 'Energy' | 'Interactions' | 'Systems' | 'Cycles';
  myPalsUnit: string;
  myPalsBook: string;
  myPalsPages: string;
  myPalsWorkbookActivity: string;
  cambridgeCode: string;
  cambridgeStrand: string;
  cambridgeObjective: string;
  cambridgeTws: string;
  keyInquiryQuestion: string;
  coreVocabulary: string[];
  misconceptionsToAddress: string[];
  labId: 'energy' | 'plant' | 'forces' | 'ecosystem' | 'circuit' | 'moon' | null;
  labTitle: string;
  quizTopic: ScienceTopic;
  detectiveId?: string;
  competencies: {
    id: string;
    statement: string;
    curriculumTag: 'Cambridge' | 'My Pals' | 'Both';
  }[];
  lesson5E: Lesson5EPlan;
}
