import React, { useState } from "react";
import { motion } from "framer-motion";

export default function InterviewSetup({ startInterview }) {
  const [interviewType, setInterviewType] = useState("HR");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState(""); // ✅ ADD

  const handleStart = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }
    startInterview(interviewType, difficulty, topic.trim());
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-700">
        Setup Your Interview
      </h2>

      <div className="flex flex-col space-y-4">
        {/* INTERVIEW TYPE */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Interview Type
          </label>
          <select
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
          >
            <option value="HR">HR</option>
            <option value="Tech">TECH</option>
          </select>
        </div>

        {/* DIFFICULTY */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Difficulty
          </label>
          <select
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* TOPIC */}
        <div>
          <label className="block mb-2 font-semibold text-gray-600">
            Topic
          </label>
          <input
            type="text"
            placeholder="e.g. React, MERN, Cyber Security"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition duration-300"
        >
          Start Interview
        </button>
      </div>
    </motion.div>
  );
}
