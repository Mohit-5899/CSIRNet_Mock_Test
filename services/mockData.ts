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

export const MOCK_TESTS: MockTest[] = [
  { id: 1, title: "CSIR NET Physics Mock 1", description: "Full length paper focusing on Classical Mechanics and EMP.", difficulty: "Moderate", tags: ["Full Syllabus", "2023 Pattern"] },
  { id: 2, title: "CSIR NET Physics Mock 2", description: "High difficulty level questions on Quantum Mechanics.", difficulty: "Hard", tags: ["Quantum Heavy", "Advanced"] },
  { id: 3, title: "CSIR NET Physics Mock 3", description: "Balanced paper covering all core topics.", difficulty: "Moderate", tags: ["Standard", "Balanced"] },
  { id: 4, title: "CSIR NET Physics Mock 4", description: "Focus on Mathematical Physics and Electronics.", difficulty: "Easy", tags: ["Math Physics", "Electronics"] },
  { id: 5, title: "CSIR NET Physics Mock 5", description: "Previous year trends based mock test.", difficulty: "Moderate", tags: ["PYQ Pattern"] },
  { id: 6, title: "CSIR NET Physics Mock 6", description: "Condensed Matter Physics and Thermodynamics special.", difficulty: "Hard", tags: ["CMP", "Thermo"] },
  { id: 7, title: "CSIR NET Physics Mock 7", description: "Nuclear and Particle Physics focus.", difficulty: "Moderate", tags: ["Nuclear", "Particle"] },
  { id: 8, title: "CSIR NET Physics Mock 8", description: "Comprehensive test for final revision.", difficulty: "Hard", tags: ["Full Syllabus"] },
  { id: 9, title: "CSIR NET Physics Mock 9", description: "Speed test with moderate difficulty questions.", difficulty: "Moderate", tags: ["Speed Test"] },
  { id: 10, title: "CSIR NET Physics Mock 10", description: "The ultimate challenge. Very hard.", difficulty: "Hard", tags: ["Challenger"] },
];

export const getQuestionsForTest = (testId: number): Question[] => {
  const questions: Question[] = [];
  let idCounter = 1;

  // In a real app, this would fetch specific questions for the testId from a DB.
  // Here we generate them dynamically to simulate different tests.

  // Part A: General Aptitude (20 Qs)
  for (let i = 0; i < 20; i++) {
    questions.push({
      id: idCounter++,
      section: SectionType.PART_A,
      text: `[Test ${testId}] Part A Q${i + 1}: A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?`,
      options: ['120 metres', '180 metres', '324 metres', '150 metres'],
      correctOptionIndex: 3,
    });
  }

  // Part B: Core Physics (25 Qs)
  for (let i = 0; i < 25; i++) {
    questions.push({
      id: idCounter++,
      section: SectionType.PART_B,
      text: `[Test ${testId}] Part B Q${i + 1}: For a quantum particle in a 1D box of length L, the energy of the first excited state is:`,
      options: [
        'h² / (8mL²)',
        '4h² / (8mL²)',
        '9h² / (8mL²)',
        '2h² / (8mL²)'
      ],
      correctOptionIndex: 1,
    });
  }

  // Part C: Advanced Physics (30 Qs)
  for (let i = 0; i < 30; i++) {
    questions.push({
      id: idCounter++,
      section: SectionType.PART_C,
      text: `[Test ${testId}] Part C Q${i + 1}: Considered a system of N non-interacting distinguishable particles. The partition function Z is given by...`,
      options: [
        'Z = Σ exp(-βEi)',
        'Z = [Σ exp(-βEi)]^N',
        'Z = (1/N!) [Σ exp(-βEi)]^N',
        'Z = Π exp(-βEi)'
      ],
      correctOptionIndex: 1,
    });
  }

  return questions;
};