import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionDisplay({ questions, finishInterview }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!questions || questions.length === 0) {
  return <p>No questions available</p>;
}

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else finishInterview();
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="max-w-2xl w-full space-y-6">
      {/* Progress */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-semibold">Question {currentIndex+1}/{questions.length}</span>
        <div className="h-2 bg-gray-300 rounded-full w-1/2">
          <div className="h-2 bg-purple-500 rounded-full transition-all duration-500" 
            style={{ width: `${((currentIndex+1)/questions.length)*100}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-8 text-gray-700 text-lg"
        >
          {questions[currentIndex].text}
          {questions[currentIndex].keywords && (
            <div className="mt-4 flex flex-wrap gap-2">
              {questions[currentIndex].keywords.map(k => (
                <span key={k} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                  {k}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button 
          onClick={prevQuestion} 
          disabled={currentIndex === 0}
          className={`px-6 py-2 rounded-xl font-semibold transition ${currentIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
        >
          Previous
        </button>
        <button 
          onClick={nextQuestion} 
          className="px-6 py-2 rounded-xl font-semibold bg-purple-500 hover:bg-purple-600 text-white transition"
        >
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
