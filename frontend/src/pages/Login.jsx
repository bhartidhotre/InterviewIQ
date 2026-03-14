import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/"); // smooth redirect
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
            {error}
          </p>
        )}

        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#2563EB" }}
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#2563EB" }}
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
        >
          Login
        </motion.button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
