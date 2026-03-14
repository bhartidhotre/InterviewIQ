import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InterviewSetup from "./InterviewSetup";
import InterviewSession from "./InterviewSession";
import api from "../services/api";

export default function InterviewController() {
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const checkSession = async () => {
      const res = await api.get("/api/interview/active");

      if (res.data.active) {
        setSessionId(res.data.sessionId);
        setQuestions(res.data.questions);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
  const resumeInterview = async () => {
    const res = await api.get("/api/interview/active");

    if (res.data.active) {
      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setCurrentIndex(res.data.currentQuestionIndex);
    }
  };

  resumeInterview();
}, []);

  

  const startInterview = async ({ type, difficulty,topic }) => {
    try {
      setLoading(true);

      const res = await api.post("/api/interview/start", {
        type,
        difficulty,
        topic,
      });

      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    await api.post("/api/interview/end", { sessionId });
    navigate("/dashboard");
  };

  if (!sessionId) {
    return (
      <InterviewSetup
        startInterview={startInterview}
        loading={loading}
      />
    );
  }

  return (
    <InterviewSession
      sessionId={sessionId}
      questions={questions}
      startIndex={currentIndex}
      endInterview={endInterview}
    />
  );
}
