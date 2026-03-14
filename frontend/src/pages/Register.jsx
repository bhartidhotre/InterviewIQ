import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md p-8 w-full max-w-md shadow-2xl rounded-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
            {error}
          </p>
        )}

        {/* Name */}
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#2563EB" }}
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleChange}
        />

        {/* Email */}
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#2563EB" }}
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleChange}
        />

        {/* Password */}
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#2563EB" }}
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={handleChange}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
        >
          Register
        </motion.button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
