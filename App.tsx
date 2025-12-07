import React, { useState, useEffect } from 'react';
import { getQuestionsForTest, EXAM_CONFIG, ALL_TESTS } from './services/mockData';
import { QuestionStatus, SectionType, UserState, MockTest, Question } from './types';
import { ExamHeader } from './components/ExamHeader';
import { QuestionPalette } from './components/QuestionPalette';
import { QuestionArea } from './components/QuestionArea';
import { LandingPage } from './components/LandingPage';
import { BarChart, Clock, Award, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'instruction' | 'exam' | 'result'>('landing');
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  // Exam State
  const [timeLeft, setTimeLeft] = useState(EXAM_CONFIG.totalTimeMinutes * 60);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [userState, setUserState] = useState<UserState>({
    answers: {},
    status: {},
    visited: new Set([1]),
    markedForReview: new Set(),
  });

  // Calculate current section based on question ID
  const currentQuestion = examQuestions.find(q => q.id === currentQuestionId) || examQuestions[0];
  // Guard clause for when questions aren't loaded yet
  const currentSection = currentQuestion ? currentQuestion.section : SectionType.PART_A;

  // Timer Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (view === 'exam' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view, timeLeft]);

  // --- Handlers ---

  const handleSelectTest = (testId: number) => {
    // Find test details
    const testDetails = ALL_TESTS.find(t => t.id === testId) || null;
    setSelectedTest(testDetails);

    const questions = getQuestionsForTest(testId);
    setExamQuestions(questions);
    
    // Reset User State
    setUserState({
      answers: {},
      status: {},
      visited: new Set([1]),
      markedForReview: new Set(),
    });
    setTimeLeft(EXAM_CONFIG.totalTimeMinutes * 60);
    setCurrentQuestionId(1);
    
    setView('instruction');
  };

  const handleStartExam = () => {
    setView('exam');
  };

  const handleFinishExam = () => {
    setView('result');
  };

  const handleReturnToHome = () => {
    setView('landing');
    setSelectedTest(null);
  };

  const getSectionAttemptCount = (section: SectionType) => {
    return examQuestions
      .filter(q => q.section === section)
      .filter(q => userState.answers[q.id] !== undefined).length;
  };

  const canAttemptMoreInSection = (section: SectionType) => {
    const attempts = getSectionAttemptCount(section);
    return attempts < EXAM_CONFIG.sections[section].maxToAnswer;
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (userState.answers[currentQuestionId] === undefined && !canAttemptMoreInSection(currentSection)) {
      return; 
    }

    setUserState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestionId]: optionIdx },
      status: { ...prev.status, [currentQuestionId]: QuestionStatus.ANSWERED }
    }));
  };

  const handleClear = () => {
    setUserState(prev => {
      const newAnswers = { ...prev.answers };
      delete newAnswers[currentQuestionId];
      
      const newMarked = new Set(prev.markedForReview);
      const newStatus = { ...prev.status };
      if (newMarked.has(currentQuestionId)) {
        newStatus[currentQuestionId] = QuestionStatus.MARKED;
      } else {
        newStatus[currentQuestionId] = QuestionStatus.NOT_ANSWERED;
      }

      return {
        ...prev,
        answers: newAnswers,
        status: newStatus,
        markedForReview: newMarked
      };
    });
  };

  const handleMarkForReview = () => {
    setUserState(prev => {
      const newMarked = new Set(prev.markedForReview);
      const isAnswered = prev.answers[currentQuestionId] !== undefined;
      
      let status;
      if (newMarked.has(currentQuestionId)) {
        newMarked.delete(currentQuestionId);
        status = isAnswered ? QuestionStatus.ANSWERED : QuestionStatus.NOT_ANSWERED;
      } else {
        newMarked.add(currentQuestionId);
        status = isAnswered ? QuestionStatus.MARKED_AND_ANSWERED : QuestionStatus.MARKED;
      }

      return {
        ...prev,
        markedForReview: newMarked,
        status: { ...prev.status, [currentQuestionId]: status }
      };
    });
    handleNext();
  };

  const handleNext = () => {
    const nextId = currentQuestionId + 1;
    if (nextId <= examQuestions.length) {
      handleNavigate(nextId);
    }
  };

  const handlePrevious = () => {
    const prevId = currentQuestionId - 1;
    if (prevId >= 1) {
      handleNavigate(prevId);
    }
  };

  const handleNavigate = (id: number) => {
    setCurrentQuestionId(id);
    setUserState(prev => {
      const oldId = currentQuestionId;
      const oldStatus = prev.status[oldId];
      const newStatus = { ...prev.status };
      
      if (!oldStatus || oldStatus === QuestionStatus.NOT_VISITED) {
        if (!prev.answers[oldId] && !prev.markedForReview.has(oldId)) {
           newStatus[oldId] = QuestionStatus.NOT_ANSWERED;
        }
      }

      const newVisited = new Set(prev.visited).add(id);
      
      return {
        ...prev,
        visited: newVisited,
        status: newStatus
      };
    });
  };

  const handleSaveAndNext = () => {
    const isAnswered = userState.answers[currentQuestionId] !== undefined;
    
    setUserState(prev => ({
      ...prev,
      status: { 
        ...prev.status, 
        [currentQuestionId]: isAnswered 
          ? (prev.markedForReview.has(currentQuestionId) ? QuestionStatus.MARKED_AND_ANSWERED : QuestionStatus.ANSWERED)
          : (prev.markedForReview.has(currentQuestionId) ? QuestionStatus.MARKED : QuestionStatus.NOT_ANSWERED)
      }
    }));
    handleNext();
  };

  // --- View Rendering ---

  if (view === 'landing') {
    return <LandingPage onSelectTest={handleSelectTest} />;
  }

  if (view === 'instruction') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
            <button onClick={handleReturnToHome} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Exam Instructions</h1>
              <p className="opacity-90 text-sm">
                {selectedTest ? selectedTest.title : 'CSIR NET Physics'}
              </p>
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">CSIR NET Physical Sciences - Rules</h2>
            <ul className="space-y-4 text-gray-600 mb-8">
              <li className="flex items-start gap-3">
                <Clock className="mt-1 text-blue-500 shrink-0" size={20} />
                <span><strong>Duration:</strong> 180 Minutes (3 Hours)</span>
              </li>
              <li className="flex items-start gap-3">
                <Award className="mt-1 text-blue-500 shrink-0" size={20} />
                <span><strong>Pattern:</strong> The test consists of three parts. All parts contain Multiple Choice Questions (MCQs).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-blue-500 shrink-0 font-bold border rounded w-5 h-5 flex items-center justify-center text-xs">A</div>
                <span><strong>Part A:</strong> General Aptitude. 20 questions. Answer max 15. (2 Marks each, 0.5 Neg)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-blue-500 shrink-0 font-bold border rounded w-5 h-5 flex items-center justify-center text-xs">B</div>
                <span><strong>Part B:</strong> Core Physics. 25 questions. Answer max 20. (3.5 Marks each, 0.875 Neg)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-blue-500 shrink-0 font-bold border rounded w-5 h-5 flex items-center justify-center text-xs">C</div>
                <span><strong>Part C:</strong> Advanced Physics. 30 questions. Answer max 20. (5 Marks each, 1.25 Neg)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 text-green-500 shrink-0" size={20} />
                <span><strong>Total Marks:</strong> 200</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="mt-1 text-red-500 shrink-0" size={20} />
                <span><strong>Warning:</strong> You will not be allowed to leave the exam screen once started.</span>
              </li>
            </ul>
            <div className="flex gap-4">
              <button 
                onClick={handleReturnToHome}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-lg text-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleStartExam}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-md"
              >
                I am ready to begin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'result') {
    // Score Calculation
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    
    const sectionScores = {
      [SectionType.PART_A]: { score: 0, attempted: 0, correct: 0, wrong: 0 },
      [SectionType.PART_B]: { score: 0, attempted: 0, correct: 0, wrong: 0 },
      [SectionType.PART_C]: { score: 0, attempted: 0, correct: 0, wrong: 0 },
    };

    examQuestions.forEach(q => {
      const userAnswer = userState.answers[q.id];
      if (userAnswer !== undefined) {
        sectionScores[q.section].attempted++;
        const config = EXAM_CONFIG.sections[q.section];
        
        if (userAnswer === q.correctOptionIndex) {
          totalScore += config.marksPerQuestion;
          sectionScores[q.section].score += config.marksPerQuestion;
          sectionScores[q.section].correct++;
          correctCount++;
        } else {
          totalScore -= config.negativeMarking;
          sectionScores[q.section].score -= config.negativeMarking;
          sectionScores[q.section].wrong++;
          wrongCount++;
        }
      }
    });

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Summary Sidebar */}
          <div className="bg-slate-800 p-8 text-white md:w-1/3 flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl font-bold mb-6">Score Card</h1>
            <div className="mb-4 text-gray-400 font-medium">
              {selectedTest ? selectedTest.title : 'Test Result'}
            </div>
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4 bg-slate-700">
              <div>
                <div className="text-3xl font-bold">{totalScore.toFixed(2)}</div>
                <div className="text-xs text-gray-300">/ 200</div>
              </div>
            </div>
            <div className="space-y-4 w-full">
              <div className="flex justify-between border-b border-slate-600 pb-2">
                <span className="text-gray-300">Correct</span>
                <span className="text-green-400 font-bold">{correctCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-600 pb-2">
                <span className="text-gray-300">Wrong</span>
                <span className="text-red-400 font-bold">{wrongCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-600 pb-2">
                <span className="text-gray-300">Accuracy</span>
                <span className="text-blue-400 font-bold">
                  {Object.keys(userState.answers).length > 0 
                    ? Math.round((correctCount / Object.keys(userState.answers).length) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Detailed Content */}
          <div className="p-8 md:w-2/3">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart size={24} className="text-blue-600" /> Section Analysis
            </h3>
            
            <div className="space-y-6">
              {Object.entries(sectionScores).map(([section, data]) => {
                const config = EXAM_CONFIG.sections[section as SectionType];
                const maxMarks = config.maxToAnswer * config.marksPerQuestion;
                const percentage = Math.max(0, (data.score / maxMarks) * 100);
                
                return (
                  <div key={section} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700">{section}</span>
                      <span className={`text-sm font-medium ${data.score >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {data.score.toFixed(2)} <span className="text-gray-400">/ {maxMarks}</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full rounded-full ${percentage >= 50 ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <div><span className="text-green-600 font-bold">{data.correct}</span> Correct</div>
                      <div><span className="text-red-600 font-bold">{data.wrong}</span> Wrong</div>
                      <div><span className="text-blue-600 font-bold">{data.attempted}</span> Attempted</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleReturnToHome}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Mock Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam View
  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <ExamHeader 
        timeLeft={timeLeft} 
        examName={selectedTest ? selectedTest.title : "CSIR NET Exam"}
        candidateName="Student"
        onSubmit={() => {
          if(window.confirm("Are you sure you want to submit the exam?")) {
            handleFinishExam();
          }
        }}
      />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Main Question Area - Takes majority space */}
        <section className="flex-1 overflow-hidden relative">
          <QuestionArea 
            question={currentQuestion}
            selectedOption={userState.answers[currentQuestionId]}
            onOptionSelect={handleOptionSelect}
            onSaveNext={handleSaveAndNext}
            onClear={handleClear}
            onMarkReview={handleMarkForReview}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirst={currentQuestionId === 1}
            isLast={currentQuestionId === examQuestions.length}
            canAttemptMore={canAttemptMoreInSection(currentSection)}
          />
        </section>

        {/* Sidebar - Fixed width on desktop, hidden/drawer on mobile */}
        <aside className="w-80 hidden md:block h-full border-l border-gray-200 shadow-xl z-20">
          <QuestionPalette 
            questions={examQuestions}
            currentQuestionId={currentQuestionId}
            questionStatus={userState.status}
            currentSection={currentSection}
            onNavigate={handleNavigate}
            config={EXAM_CONFIG}
            attemptedCount={getSectionAttemptCount(currentSection)}
          />
        </aside>
      </main>
    </div>
  );
};

export default App;