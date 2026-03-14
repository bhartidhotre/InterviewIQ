import { useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert("Please upload a resume file");
      return;
    }

  if (!jobDescription.trim()) {
    alert("Please enter a job description");
    return;
  }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const res = await api.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen bg-gray-50">
      <Navbar />
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Resume Match Analyzer
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8">
        {/* Upload Box */}
        <motion.label
          whileHover={{ scale: 1.03 }}
          htmlFor="resumeUpload"
          className="flex flex-col items-center justify-center
          w-full h-44 border-2 border-dashed border-gray-300
          rounded-xl cursor-pointer hover:border-blue-500
          hover:bg-blue-50 transition"
        >
          <FaCloudUploadAlt size={50} className="text-blue-500" />
          <p className="mt-3 font-medium text-gray-700">
            Click to Upload Resume
          </p>
          <p className="text-sm text-gray-400">PDF or DOCX</p>
        </motion.label>

        <input
          id="resumeUpload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />

        {resumeFile && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-sm mt-3"
          >
            Selected: {resumeFile.name}
          </motion.p>
        )}

        {/* Job Description */}
        <textarea
          className="w-full border rounded-xl p-4 mt-6
          focus:ring-2 focus:ring-blue-500 transition"
          rows="6"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {/* Analyze Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAnalyze}
          className="w-full bg-blue-600 text-white py-3
          rounded-xl mt-6 hover:bg-blue-700 transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </motion.button>
      </div>

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-2xl p-8 mt-8"
        >
          {/* ATS Score */}
          <h2 className="text-xl font-semibold mb-2">
            Resume ATS Score: {result.resumeATSScore}%
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.resumeATSScore}%` }}
              transition={{ duration: 1 }}
              className="bg-blue-500 h-4 rounded-full"
            />
          </div>

          {/* Job Match Score */}
          <h2 className="text-xl font-semibold mb-2">
            Job Match Score: {result.jobMatchScore}%
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.jobMatchScore}%` }}
              transition={{ duration: 1 }}
              className="bg-green-500 h-4 rounded-full"
            />
          </div>

          {/* Matched Skills */}
          {result.matchedSkills?.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-2">
                Matched Skills
              </h3>
              <ul className="list-disc ml-6 text-gray-700">
                {result.matchedSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </>
          )}

          {/* Missing Skills */}
          {result.missingSkills?.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-2">
                Missing Skills
              </h3>
              <ul className="list-disc ml-6 text-gray-700">
                {result.missingSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </>
          )}

          {/* Suggestions */}
          {result.improvementSuggestions?.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-2">
                Suggestions
              </h3>
              <ul className="list-disc ml-6 text-gray-700">
                {result.improvementSuggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}

          {/* Summary */}
          {result.summary && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-2">Summary</h3>
              <p className="text-gray-700">{result.summary}</p>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
    </div>
  );
}