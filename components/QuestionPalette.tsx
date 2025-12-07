import React from 'react';
import { Question, QuestionStatus, SectionType, ExamConfig } from '../types';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionId: number;
  questionStatus: { [id: number]: QuestionStatus };
  currentSection: SectionType;
  onNavigate: (id: number) => void;
  config: ExamConfig;
  attemptedCount: number;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionId,
  questionStatus,
  currentSection,
  onNavigate,
  config,
  attemptedCount
}) => {
  const sectionQuestions = questions.filter(q => q.section === currentSection);
  const maxAttempts = config.sections[currentSection].maxToAnswer;

  const getStatusColor = (status: QuestionStatus, isCurrent: boolean) => {
    if (isCurrent) return 'ring-2 ring-offset-2 ring-blue-500 border-blue-500';
    switch (status) {
      case QuestionStatus.ANSWERED: return 'bg-green-500 text-white border-green-600';
      case QuestionStatus.NOT_ANSWERED: return 'bg-red-500 text-white border-red-600';
      case QuestionStatus.MARKED: return 'bg-purple-600 text-white border-purple-700';
      case QuestionStatus.MARKED_AND_ANSWERED: return 'bg-purple-600 text-white border-purple-700 relative after:content-["✓"] after:absolute after:top-0 after:right-1 after:text-xs after:text-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
    }
  };

  const counts = {
    answered: Object.values(questionStatus).filter(s => s === QuestionStatus.ANSWERED || s === QuestionStatus.MARKED_AND_ANSWERED).length,
    notAnswered: Object.values(questionStatus).filter(s => s === QuestionStatus.NOT_ANSWERED).length,
    marked: Object.values(questionStatus).filter(s => s === QuestionStatus.MARKED).length,
    markedAnswered: Object.values(questionStatus).filter(s => s === QuestionStatus.MARKED_AND_ANSWERED).length,
    notVisited: questions.length - Object.keys(questionStatus).length
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800">Question Palette</h3>
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Attempted: {attemptedCount}/{maxAttempts}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Answered</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Not Answered</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded-sm border border-gray-300"></span> Not Visited</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-600 rounded-sm"></span> Marked</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">{currentSection}</h4>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {sectionQuestions.map((q, idx) => {
            // Calculate absolute index within section for display
            const displayNum = idx + 1;
            const status = questionStatus[q.id] || QuestionStatus.NOT_VISITED;
            return (
              <button
                key={q.id}
                onClick={() => onNavigate(q.id)}
                className={`h-10 w-10 flex items-center justify-center rounded-md font-medium text-sm transition-all border ${getStatusColor(status, currentQuestionId === q.id)}`}
              >
                {displayNum}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          CSIR NET Physical Sciences
        </div>
      </div>
    </div>
  );
};
