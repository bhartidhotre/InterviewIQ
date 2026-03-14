const Question = require("../models/question");
const { generateQuestions } = require("../services/ai.service");

exports.question = async (req, res) => {
  try {
    const { text, type, difficulty, topic,keywords } = req.body;

    if (!text || !type || !difficulty || !topic) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const question = new Question({ text, type, difficulty, keywords,topic: topic.toLowerCase().trim(),source:'DB' });
    await question.save();

    res.status(201).json({
      message: "Question added successfully",
      question
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.randomQuestion = async (req, res) => {
  try {
    const { type, difficulty,topic, count = 5 } = req.query;
    if (!type || !difficulty || !topic) {
      return res.status(400).json({
        message: "type, difficulty and topic are required",
      });
    }

    const dbQuestions = await Question.aggregate([
      {
        $match: {
          type,
          difficulty,
          topic: topic.toLowerCase().trim(),
        },
      },
      { $sample: { size: parseInt(count) } },
    ])

   let aiQuestions = [];
   if(dbQuestions.length < count) {
    aiQuestions = await generateQuestions({
      type,
      difficulty,
      topic,
      count: count - dbQuestions.length,
    });
   }

    // 3️⃣ Normalize response
    const finalQuestions = [
      ...dbQuestions.map(q => ({
        text: q.text,
        source: "DB",
      })),
      ...aiQuestions.map(q => ({
        text: q.text,
        source: "AI",
      })),
    ];

    res.json(finalQuestions);
  } catch (err) {
    console.error("RANDOM QUESTION ERROR ❌", err);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};
