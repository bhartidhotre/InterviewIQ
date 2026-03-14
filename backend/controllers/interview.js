const InterviewSession = require("../models/InterviewSession");
const {
  generateQuestions,
  evaluateAnswers,
} = require("../services/ai.service");

const Question = require("../models/question");

// ---------------- NORMALIZE TOPIC ----------------

function normalizeTopic(topic) {
  return topic.toLowerCase().trim();
}

// ---------------- FILLER WORD DETECTION ----------------

const fillerWords = ["um", "uh", "like", "basically", "actually", "you know"];

function countFillerWords(text = "") {
  let count = 0;

  fillerWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });

  return count;
}

// ---------------- COMMUNICATION SCORE ----------------

function calculateCommunicationScore(answerText = "", speechConfidence = 0) {
  let score = 0;

  // answer length score
  if (answerText.length > 80) score += 30;
  else if (answerText.length > 40) score += 20;
  else score += 10;

  // speech confidence score
  score += speechConfidence * 30;

  // filler penalty
  const fillerCount = countFillerWords(answerText);
  score -= fillerCount * 2;

  return {
    fillerCount,
    communicationScore: Math.max(Math.round(score), 0),
  };
}

// ================= START INTERVIEW =================

exports.start = async (req, res) => {
  try {
    const { type, difficulty, topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const normalizedTopic = normalizeTopic(topic);

    const dbQuestions = await Question.find({
      type,
      difficulty,
      topic: normalizedTopic,
    }).limit(5);

    let aiQuestions = [];

    if (dbQuestions.length < 10) {
      aiQuestions = await generateQuestions({
        type,
        difficulty,
        topic: normalizedTopic,
        count: 10 - dbQuestions.length,
      });
    }

    const finalQuestions = [
      ...dbQuestions.map((q) => ({
        text: q.text,
        source: "DB",
      })),
      ...aiQuestions.map((q) => ({
        text: q.text,
        source: "AI",
      })),
    ];

    const session = await InterviewSession.create({
      userId: req.user.userId,
      topic: normalizedTopic,
      type,
      difficulty,
      questions: finalQuestions,
      status: "in-progress",
      startTime: new Date(),
    });

    res.json({
      sessionId: session._id,
      questions: session.questions,
    });
  } catch (err) {
    console.error("Failed to start interview:", err);
    res.status(500).json({ message: "Failed to start interview" });
  }
};

// ================= SAVE ANSWER =================

exports.answer = async (req, res) => {
  try {
    const { sessionId, questionId, answerText, timeTaken, speechConfidence } =
      req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session || session.status !== "in-progress") {
      return res.status(400).json({ message: "Invalid session" });
    }

    const analysis = calculateCommunicationScore(
      answerText,
      speechConfidence
    );

    session.answers.push({
      questionId,
      answerText,
      timeTaken,
      speechConfidence,
      fillerCount: analysis.fillerCount,
      communicationScore: analysis.communicationScore,
    });

    session.currentQuestionIndex += 1;

    await session.save();

    res.json({ message: "Answer saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save answer" });
  }
};

// ================= END INTERVIEW =================

exports.end = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const questionsForAI = session.questions.map((q) => ({
      text: q.text,
    }));

    const aiFeedback = await evaluateAnswers(
      questionsForAI,
      session.answers
    );

    session.aiFeedback = aiFeedback;
    session.status = "completed";
    session.endTime = new Date();

    await session.save();

    res.json({ message: "Interview completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to end interview" });
  }
};

// ================= ACTIVE SESSION =================

exports.getActiveSession = async (req, res) => {
  const session = await InterviewSession.findOne({
    userId: req.user.userId,
    status: "in-progress",
  }).lean();

  if (!session) {
    return res.json({ active: false });
  }

  const questions = session.questions.map((q) => ({
    text: q.text,
  }));

  res.json({
    active: true,
    sessionId: session._id,
    questions,
    currentQuestionIndex: session.currentQuestionIndex,
    answers: session.answers,
  });
};

// ================= SUMMARY =================

exports.getSummary = async (req, res) => {
  const session = await InterviewSession.findById(req.params.id).lean();

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const summary = session.answers.map((ans, index) => ({
    questionText: session.questions[index]?.text || "Question missing",

    answerText: ans.answerText,

    timeTaken: ans.timeTaken,

    speechConfidence: ans.speechConfidence,

    fillerWords: ans.fillerCount,

    communicationScore: ans.communicationScore,

    score: session.aiFeedback?.[index]?.score,

    feedback: session.aiFeedback?.[index]?.feedback,

    improvement: session.aiFeedback?.[index]?.improvement,
  }));

  res.json({ summary });
};

// ================= ADMIN STATS =================

exports.adminStats = async (req, res) => {
  const total = await InterviewSession.countDocuments();

  const completed = await InterviewSession.countDocuments({
    status: "completed",
  });

  res.json({
    totalInterviews: total,
    completedInterviews: completed,
  });
};

// ================= HISTORY =================

exports.getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user.userId,
    })
      .sort({ startTime: -1 })
      .select("type difficulty status startTime endTime");

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch interview history" });
  }
};