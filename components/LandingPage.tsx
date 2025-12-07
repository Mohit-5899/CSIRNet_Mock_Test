import React from 'react';
import { MOCK_TESTS } from '../services/mockData';
import { BookOpen, Clock, Award, ChevronRight, Atom, Zap, Activity } from 'lucide-react';

interface LandingPageProps {
  onSelectTest: (testId: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectTest }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Atom size={300} />
        </div>
        <div className="absolute bottom-0 left-0 p-8 opacity-10">
          <Zap size={200} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              CSIR NET <span className="text-blue-300">Physical Sciences</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light">
              Master the concepts with our comprehensive mock test series designed to simulate the actual exam environment.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-full"><Clock size={20} /></div>
                <h3 className="font-bold text-lg">Real-time Simulation</h3>
              </div>
              <p className="text-blue-100 text-sm">3-hour strict timer with section-wise constraints just like the real exam.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500 rounded-full"><Activity size={20} /></div>
                <h3 className="font-bold text-lg">Performance Analytics</h3>
              </div>
              <p className="text-blue-100 text-sm">Detailed breakdown of your score, accuracy, and section-wise performance.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500 rounded-full"><Award size={20} /></div>
                <h3 className="font-bold text-lg">Quality Content</h3>
              </div>
              <p className="text-blue-100 text-sm">Curated questions covering Part A (Aptitude), Part B (Core), and Part C (Advanced).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Tests Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 -mt-16 mb-12 relative z-20 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="text-indigo-600" /> Available Mock Tests
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTS.map((test) => (
            <div 
              key={test.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    test.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">ID: #{test.id.toString().padStart(3, '0')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{test.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {test.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="block font-semibold text-gray-700">200 Marks</span>
                  <span>180 Mins</span>
                </div>
                <button 
                  onClick={() => onSelectTest(test.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  Start Test <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CSIR NET Mock Prep Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};