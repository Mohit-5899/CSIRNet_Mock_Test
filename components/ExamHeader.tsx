import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

interface ExamHeaderProps {
  timeLeft: number;
  examName: string;
  candidateName: string;
  onSubmit: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ timeLeft, examName, candidateName, onSubmit }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 300; // Less than 5 mins

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded">CSIR NET</div>
        <h1 className="text-lg font-semibold text-gray-800 hidden md:block">{examName}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm font-medium text-gray-600 hidden sm:block">
          Candidate: <span className="text-gray-900">{candidateName}</span>
        </div>
        
        <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1 rounded border ${isLowTime ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-50 text-blue-700 border-gray-200'}`}>
          {isLowTime && <AlertTriangle size={20} />}
          <Timer size={20} />
          {formatTime(timeLeft)}
        </div>

        <button 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Submit
        </button>
      </div>
    </header>
  );
};
