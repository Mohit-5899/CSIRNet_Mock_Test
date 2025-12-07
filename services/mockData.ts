import { Question, SectionType, ExamConfig, MockTest } from '../types';

export const EXAM_CONFIG: ExamConfig = {
  totalTimeMinutes: 180, // 3 Hours
  sections: {
    [SectionType.PART_A]: {
      totalQuestions: 20,
      maxToAnswer: 15,
      marksPerQuestion: 2.0,
      negativeMarking: 0.5,
    },
    [SectionType.PART_B]: {
      totalQuestions: 25,
      maxToAnswer: 20,
      marksPerQuestion: 3.5,
      negativeMarking: 0.875,
    },
    [SectionType.PART_C]: {
      totalQuestions: 30,
      maxToAnswer: 20,
      marksPerQuestion: 5.0,
      negativeMarking: 1.25,
    },
  },
};

export const FULL_LENGTH_TESTS: MockTest[] = [
  { id: 1, title: "CSIR NET Physics Mock 1", description: "Full length paper focusing on Classical Mechanics and EMP.", difficulty: "Moderate", tags: ["Full Syllabus", "2023 Pattern"], category: 'Full Length' },
  { id: 2, title: "CSIR NET Physics Mock 2", description: "High difficulty level questions on Quantum Mechanics.", difficulty: "Hard", tags: ["Quantum Heavy", "Advanced"], category: 'Full Length' },
  { id: 3, title: "CSIR NET Physics Mock 3", description: "Balanced paper covering all core topics.", difficulty: "Moderate", tags: ["Standard", "Balanced"], category: 'Full Length' },
  { id: 4, title: "CSIR NET Physics Mock 4", description: "Focus on Mathematical Physics and Electronics.", difficulty: "Easy", tags: ["Math Physics", "Electronics"], category: 'Full Length' },
  { id: 5, title: "CSIR NET Physics Mock 5", description: "Previous year trends based mock test.", difficulty: "Moderate", tags: ["PYQ Pattern"], category: 'Full Length' },
  { id: 6, title: "CSIR NET Physics Mock 6", description: "Condensed Matter Physics and Thermodynamics special.", difficulty: "Hard", tags: ["CMP", "Thermo"], category: 'Full Length' },
  { id: 7, title: "CSIR NET Physics Mock 7", description: "Nuclear and Particle Physics focus.", difficulty: "Moderate", tags: ["Nuclear", "Particle"], category: 'Full Length' },
  { id: 8, title: "CSIR NET Physics Mock 8", description: "Comprehensive test for final revision.", difficulty: "Hard", tags: ["Full Syllabus"], category: 'Full Length' },
  { id: 9, title: "CSIR NET Physics Mock 9", description: "Speed test with moderate difficulty questions.", difficulty: "Moderate", tags: ["Speed Test"], category: 'Full Length' },
  { id: 10, title: "CSIR NET Physics Mock 10", description: "The ultimate challenge. Very hard.", difficulty: "Hard", tags: ["Challenger"], category: 'Full Length' },
];

export const TOPIC_TESTS: MockTest[] = [
  { id: 101, title: "Classical Mechanics", description: "Lagrangian, Hamiltonian, and Rigid Body Dynamics.", difficulty: "Moderate", tags: ["Topic Wise", "CM"], category: 'Topic Wise' },
  { id: 102, title: "Quantum Mechanics", description: "Perturbation Theory, WKB, and Operators.", difficulty: "Hard", tags: ["Topic Wise", "QM"], category: 'Topic Wise' },
  { id: 103, title: "Electromagnetic Theory", description: "Maxwell's Equations, Waveguides, and Radiation.", difficulty: "Moderate", tags: ["Topic Wise", "EMT"], category: 'Topic Wise' },
  { id: 104, title: "Mathematical Physics", description: "Complex Analysis, Differential Equations, and Matrices.", difficulty: "Easy", tags: ["Topic Wise", "Math"], category: 'Topic Wise' },
  { id: 105, title: "Thermodynamics & Stat Mech", description: "Ensembles, Phase Transitions, and Laws of Thermo.", difficulty: "Moderate", tags: ["Topic Wise", "Thermo"], category: 'Topic Wise' },
  { id: 106, title: "Electronics & Experimental", description: "Op-Amps, Digital Electronics, and Error Analysis.", difficulty: "Easy", tags: ["Topic Wise", "Electronics"], category: 'Topic Wise' },
  { id: 107, title: "Atomic & Molecular Physics", description: "Spectroscopy, Lasers, and Zeeman Effect.", difficulty: "Moderate", tags: ["Topic Wise", "Atomic"], category: 'Topic Wise' },
  { id: 108, title: "Condensed Matter Physics", description: "Crystal Structure, Superconductivity, and Band Theory.", difficulty: "Hard", tags: ["Topic Wise", "CMP"], category: 'Topic Wise' },
  { id: 109, title: "Nuclear & Particle Physics", description: "Shell Model, Conservation Laws, and Quarks.", difficulty: "Moderate", tags: ["Topic Wise", "Nuclear"], category: 'Topic Wise' },
];

export const ALL_TESTS = [...FULL_LENGTH_TESTS, ...TOPIC_TESTS];

export const getQuestionsForTest = (testId: number): Question[] => {
  const questions: Question[] = [];
  let idCounter = 1;

  // Identify if it's a topic test or full length
  const isTopicTest = testId > 100;
  
  // Topic tests might have fewer questions in a real scenario, 
  // but for the CBT simulation structure we will keep the standard 3 sections
  // but customize the text.

  const testTitle = ALL_TESTS.find(t => t.id === testId)?.title || `Test ${testId}`;

  // Part A: General Aptitude (20 Qs)
  for (let i = 0; i < 20; i++) {
    questions.push({
      id: idCounter++,
      section: SectionType.PART_A,
      text: `[${testTitle}] Part A Q${i + 1}: General Aptitude Question relating to logic, series, or data analysis.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: Math.floor(Math.random() * 4),
    });
  }

  // Part B: Core Physics (25 Qs)
  for (let i = 0; i < 25; i++) {
    questions.push({
      id: idCounter++,
      section: SectionType.PART_B,
      text: `[${testTitle}] Part B Q${i + 1}: Conceptual physics question. If this is a topic test, imagine it is specific to that topic.`,
      options: ['Concept 1', 'Concept 2', 'Concept 3', 'Concept 4'],
      correctOptionIndex: Math.floor(Math.random() * 4),
    });
  }

  // Part C: Advanced Physics (30 Qs)
  for (let i = 0; i < 30; i++) {
    questions.push({
      id: idCounter++,
      section: SectionType.PART_C,
      text: `[${testTitle}] Part C Q${i + 1}: Advanced analytical problem requiring detailed calculation.`,
      options: ['Result X', 'Result Y', 'Result Z', 'Result W'],
      correctOptionIndex: Math.floor(Math.random() * 4),
    });
  }

  return questions;
};