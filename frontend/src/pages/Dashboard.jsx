import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/interview/history")
      .then(res => setHistory(res.data))
      .catch(() => console.log("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  const completed = history.filter(i => i.status === "completed").length;
  const inProgress = history.filter(i => i.status === "in-progress").length;

  if (loading) return <p className="text-center mt-10">Loading interviews...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
    <Navbar/>
     <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Interviews</h1>
        <button
          onClick={() => navigate("/interview")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Start New Interview
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Interviews" value={history.length} color="bg-gray-800" />
        <StatCard title="Completed" value={completed} color="bg-green-500" />
        <StatCard title="In Progress" value={inProgress} color="bg-yellow-500" />
      </div>

      {/* History Cards */}
      <h2 className="text-2xl font-bold mb-4">Interview History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No interviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((i) => (
            <motion.div
              key={i._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  {new Date(i.startTime).toLocaleDateString()} | {i.type} | {i.difficulty}
                </p>
                <h3 className="text-xl font-semibold mb-3">{i.type} Interview</h3>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full ${
                      i.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{
                      width: i.status === "completed" ? "100%" : "50%",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>

                <span className={`px-2 py-1 rounded-full text-white text-sm ${
                  i.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                }`}>
                  {i.status.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => navigate(i.status === "completed" ? `/summary/${i._id}` : `/interview`)}
                className={`mt-4 py-2 rounded-xl w-full font-semibold ${
                  i.status === "completed" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                {i.status === "completed" ? "View Summary" : "Resume Interview"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`${color} text-white rounded-2xl p-6 shadow flex flex-col items-center justify-center`}
  >
    <p className="text-sm">{title}</p>
    <h3 className="text-3xl font-bold mt-2">{value}</h3>
  </motion.div>
);
