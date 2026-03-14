import { useState } from "react";
import { addQuestion } from "../services/question";

const AddQuestion = () => {
  const [form, setForm] = useState({
    text: "",
    topic: "",              // ✅ ADD
    type: "HR",
    difficulty: "easy",
    keywords: [],
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addQuestion(token, {
        ...form,
        topic: form.topic.toLowerCase().trim(), // ✅ normalize
      });

      setMessage("Question added successfully!");
      setForm({
        text: "",
        topic: "",
        type: "HR",
        difficulty: "easy",
        keywords: [],
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding question");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-8 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-600 text-center">
          Add Question
        </h2>

        {message && (
          <p className="text-center text-green-500">{message}</p>
        )}

        {/* QUESTION */}
        <input
          type="text"
          name="text"
          placeholder="Write your question..."
          value={form.text}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* TOPIC */}
        <input
          type="text"
          name="topic"
          placeholder="Topic (e.g. React, MERN, Cyber Security)"
          value={form.topic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* TYPE */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="HR">HR</option>
          <option value="Tech">TECH</option>
        </select>

        {/* DIFFICULTY */}
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* KEYWORDS */}
        <input
          type="text"
          name="keywords"
          placeholder="Keywords (comma separated)"
          value={form.keywords.join(",")}
          onChange={(e) =>
            setForm({
              ...form,
              keywords: e.target.value
                .split(",")
                .map(k => k.trim())
                .filter(Boolean),
            })
          }
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
