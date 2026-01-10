
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start px-4 mb-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full border dark:border-white/10 bg-indigo-500/10 flex-shrink-0 flex items-center justify-center text-indigo-500">
           <div className="flex space-x-1">
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <span className="text-slate-400 dark:text-slate-500 text-[13px] italic font-medium">AI Study Solver is thinking...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
