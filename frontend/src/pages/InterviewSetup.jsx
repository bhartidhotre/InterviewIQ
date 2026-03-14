import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function InterviewSetup({ startInterview, loading }) {
  const [type, setType] = useState("HR");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");

  const handleStart = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }
    startInterview({ type, difficulty, topic });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md my-12 mx-auto bg-gradient-to-tr from-white/90 to-blue-50/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
          Configure Interview
        </h2>

        {/* Interview Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Interview Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:shadow-md"
          >
            <option value="HR">HR</option>
            <option value="Tech">Tech</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm hover:shadow-md"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Topic */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Interview Topic
          </label>
          <input
            type="text"
            placeholder="e.g. Cyber Security, React, System Design"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm hover:shadow-md"
          />
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          {loading ? "Starting..." : "Start Interview"}
        </motion.button>
      </motion.div>
    </div>
  );
}
