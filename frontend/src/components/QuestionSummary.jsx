import React from 'react';

export default function QuestionSummary({ questions, restart }) {
  return (
    <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-purple-600 text-center">Interview Summary</h2>
      {questions.map((q, idx) => (
        <div key={idx} className="bg-purple-50 p-4 rounded-lg">
          <p className="font-semibold">Q{idx+1}: {q.text}</p>
          {q.keywords && (
            <div className="mt-2 flex flex-wrap gap-2">
              {q.keywords.map(k => (
                <span key={k} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">{k}</span>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={restart} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold">
        Restart Interview
      </button>
    </div>
  );
}
