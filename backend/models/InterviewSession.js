const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
   
    questionId: {
      type: String, // ✅ index-based for AI questions
      required: true
    },
    answerText: {
      type: String,
      default: ""   // ✅ allow empty
    },
    timeTaken: {
      type: Number,
      default: 0
    }
  
});

const feedbackSchema = new mongoose.Schema({
  score: Number,
  feedback: String,
  improvement: String,
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

    // ✅ ADD THESE
  type: {
    type: String,
    enum: ["HR", "Tech"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
 questions: [
  {
    text: {
      type: String,
      source: { type: String, enum: ["AI", "DB"], default: "AI" },
    }
  }
],
  answers: [answerSchema],

  aiFeedback: [feedbackSchema], // ✅ ADD THIS

  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  topic: {
  type: String,
  required: true,
},

  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
});

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
