export enum SectionType {
  PART_A = 'Part A',
  PART_B = 'Part B',
  PART_C = 'Part C',
}

export enum QuestionStatus {
  NOT_VISITED = 'not_visited',
  NOT_ANSWERED = 'not_answered',
  ANSWERED = 'answered',
  MARKED = 'marked',
  MARKED_AND_ANSWERED = 'marked_and_answered',
}

export interface Question {
  id: number;
  section: SectionType;
  text: string;
  options: string[];
  correctOptionIndex: number; // 0-3
  imageUrl?: string;
}

export interface ExamConfig {
  totalTimeMinutes: number;
  sections: {
    [key in SectionType]: {
      totalQuestions: number;
      maxToAnswer: number;
      marksPerQuestion: number;
      negativeMarking: number;
    }
  }
}

export interface UserState {
  answers: { [questionId: number]: number }; // questionId -> optionIndex
  status: { [questionId: number]: QuestionStatus };
  visited: Set<number>;
  markedForReview: Set<number>;
}

export interface MockTest {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  tags: string[];
  category: 'Full Length' | 'Topic Wise';
}