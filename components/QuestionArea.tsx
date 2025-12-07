import React from 'react';
import { Question, SectionType } from '../types';
import { ChevronRight, ChevronLeft, Bookmark, RotateCcw } from 'lucide-react';

interface QuestionAreaProps {
  question: Question;
  selectedOption: number | undefined;
  onOptionSelect: (optionIdx: number) => void;
  onSaveNext: () => void;
  onClear: () => void;
  onMarkReview: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  canAttemptMore: boolean;
}

export const QuestionArea: React.FC<QuestionAreaProps> = ({
  question,
  selectedOption,
  onOptionSelect,
  onSaveNext,
  onClear,
  onMarkReview,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  canAttemptMore
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Question Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Question {question.id}</h2>
        <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded border shadow-sm">
          {question.section}
        </span>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-800 mb-8 leading-relaxed font-medium">
            {question.text}
          </p>
          
          {question.imageUrl && (
            <div className="mb-6 p-4 border rounded bg-gray-50 flex justify-center">
              <img src={question.imageUrl} alt="Question Diagram" className="max-h-64 object-contain" />
            </div>
          )}

          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <label 
                key={idx}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === idx 
                    ? 'border-blue-600 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  className="mt-1 mr-4 w-5 h-5 text-blue-600 focus:ring-blue-500"
                  checked={selectedOption === idx}
                  onChange={() => {
                    if (selectedOption === undefined && !canAttemptMore) {
                      alert("You have reached the maximum number of attempts allowed for this section. Clear an existing answer to attempt this one.");
                      return;
                    }
                    onOptionSelect(idx);
                  }}
                />
                <span className="text-gray-700 text-lg">
                  <span className="font-bold mr-2">({idx + 1})</span> {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={onMarkReview}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium transition-colors"
          >
            <Bookmark size={18} />
            Mark for Review
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors"
          >
            <RotateCcw size={18} />
            Clear
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
              isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <button
            onClick={onSaveNext}
            className="flex items-center gap-1 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors"
          >
            {isLast ? 'Save' : 'Save & Next'}
            {!isLast && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
