import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import VoiceRecorder from "../components/VoiceRecorder";

export default function InterviewSession({
  questions,
  sessionId,
  startIndex,
  endInterview
}) {

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [speechConfidence, setSpeechConfidence] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const question = questions?.[current];

  // Restore question index after refresh
  useEffect(() => {
    setCurrent(startIndex);
  }, [startIndex]);

  // Submit Answer
  const handleSubmit = async () => {

    await api.post("/api/interview/answer", {
      sessionId,
      questionId: current,
      answerText: answer,
      timeTaken: 60 - timeLeft,
      speechConfidence
    });

    setAnswer("");
    setSpeechConfidence(0);
    setTimeLeft(60);

    if (current === questions.length - 1) {
      endInterview();
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  // Timer
  useEffect(() => {

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [timeLeft]);

  if (!question) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading question...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">

        <div className="flex justify-between mb-4">
          <p className="text-gray-500">
            Question {current + 1}/{questions.length}
          </p>

          <span className="font-bold text-red-500">
            ⏱ {timeLeft}s
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-6">
          {question.text}
        </h2>

        {/* Answer textarea */}

        <textarea
          className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500"
          rows="6"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer or use voice..."
        />

        {/* Voice Recorder */}

        <div className="mt-4">
          <VoiceRecorder
            setAnswer={setAnswer}
            setConfidence={setSpeechConfidence}
          />
        </div>

        {/* Speech Confidence */}

        {speechConfidence > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Speech Confidence: {(speechConfidence * 100).toFixed(1)}%
          </p>
        )}

        {/* Submit Button */}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
        >
          {current === questions.length - 1
            ? "Finish Interview"
            : "Next Question"}
        </button>

        {/* Browser Note */}

        <p className="text-xs text-gray-400 mt-4">
          Voice answering works best in Chrome.
        </p>

      </div>
    </motion.div>
  );
}