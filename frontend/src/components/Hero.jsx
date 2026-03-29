import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Hero = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/interview" : "/login");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* 🔮 Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Ace Your <span className="text-blue-600">Interviews</span>
            <br />
            With Confidence
          </h1>

          <p className="text-lg text-gray-600 max-w-xl">
            Practice HR & technical interviews in a real-world environment.
            Get AI-driven feedback, communication insights, and performance
            analytics — all in one platform.
          </p>

          <div className="flex flex-wrap gap-5">
            <button
              onClick={handleStartInterview}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Start Interview
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white/70 backdrop-blur border border-gray-300 rounded-xl font-semibold hover:bg-white hover:shadow-md transition-all"
            >
              Login
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative flex justify-center"
        >
          <motion.img
            src="/hero.jpg"
            alt="Interview Illustration"
            className="w-full max-w-lg rounded-2xl drop-shadow-2xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
