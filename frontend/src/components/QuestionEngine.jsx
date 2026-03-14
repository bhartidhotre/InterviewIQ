import React, { useState } from "react";
import InterviewSetup from "./InterviewSetup";
import QuestionDisplay from "./QuestionDisplay";
import QuestionSummary from "./QuestionSummary";
import Layout from "./Layout";
import { fetchRandomQuestions } from "../services/question";

export default function QuestionEngine() {
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState("SETUP"); // SETUP | INTERVIEW | SUMMARY
  const [loading, setLoading] = useState(false);

  const startInterview = async (type, difficulty,topic) => {
    try {
      setLoading(true);
      const data = await fetchRandomQuestions(token, type, difficulty,topic,5);

      if (!data || data.length === 0) {
        alert("No questions found");
        return;
      }

      // 🔥 normalize backend response
      const normalized = data.map(q => ({
        text: q.text || q.questionText,
        keywords: q.keywords || []
      }));

      setQuestions(normalized);
      setStep("INTERVIEW");
    } catch (err) {
      console.error(err);
      alert("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = () => setStep("SUMMARY");
  const restartInterview = () => {
    setQuestions([]);
    setStep("SETUP");
  };

  return (
    <Layout>
      {loading && <p className="text-lg font-semibold">Loading...</p>}

      {!loading && step === "SETUP" && (
        <InterviewSetup startInterview={startInterview} />
      )}

      {!loading && step === "INTERVIEW" && (
        <QuestionDisplay
          questions={questions}
          finishInterview={finishInterview}
        />
      )}

      {!loading && step === "SUMMARY" && (
        <QuestionSummary
          questions={questions}
          restart={restartInterview}
        />
      )}
    </Layout>
  );
}
