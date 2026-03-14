import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

export default function InterviewSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    api
      .get(`/api/interview/summary/${sessionId}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Analyzing your interview...
        </p>
      </div>
    );
  }

  if (!data || !data.summary?.length)
 {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg">No answers found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900"
        >
          Interview Summary
        </motion.h2>

        <AnimatePresence>
          {data.summary.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="mb-8 rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:scale-[1.01] transition-all duration-300"
            >
              {/* Question */}
              <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">
  Q{i + 1}. {a.questionText || "Question"}
</p>


                  <span className="text-sm opacity-90">
                    ⏱ {a.timeTaken}s
                  </span>
                </div>
              </div>

              {/* Answer */}
              <div className="p-6 bg-white">
                <p className="text-gray-800 leading-relaxed">
                  {a.answerText || "No answer provided"}
                </p>

                {/* AI Feedback */}
                {(a.score !== undefined || a.feedback || a.improvement) && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Score */}
                    {a.score !== undefined && (
                      <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="text-2xl font-bold text-green-700">
                          {a.score}/10
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    {a.feedback && (
                      <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-4 md:col-span-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          AI Feedback
                        </p>
                        <p className="text-gray-800 text-sm">
                          {a.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Improvement */}
                {a.improvement && (
                  <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-100 border-l-4 border-orange-400 p-4 rounded-xl">
                    <p className="font-semibold text-orange-700 mb-1">
                      💡 Improvement Tip
                    </p>
                    <p className="text-gray-800 text-sm">
                      {a.improvement}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
