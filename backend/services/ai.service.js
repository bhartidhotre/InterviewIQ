const fetch = require("node-fetch").default;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:3000",
  "X-Title": "VirtuHire",
};

/* ------------------ HELPER ------------------ */
function extractJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

/* ------------------ GENERATE QUESTIONS ------------------ */
const generateQuestions = async ({ type, difficulty, topic, count }) => {
  const prompt = `
Generate ${count} ${type} interview questions on the topic "${topic}".
Difficulty: ${difficulty}.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations

Format:
[
  { "text": "question here" }
]
`;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("Invalid AI response");
  }

  try {
    return JSON.parse(extractJSON(raw));
  } catch (err) {
    console.error("❌ AI QUESTION PARSE ERROR");
    console.error(raw);
    throw new Error("Failed to parse AI questions");
  }
};

/* ------------------ EVALUATE ANSWERS ------------------ */
const evaluateAnswers = async (questions, answers) => {
  const prompt = `
You are an interview evaluator.

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations

Format:
[
  {
    "score": number,
    "feedback": "short feedback",
    "improvement": "how to improve"
  }
]
`;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("Invalid AI response");
  }

  try {
    return JSON.parse(extractJSON(raw));
  } catch (err) {
    console.error("❌ AI FEEDBACK PARSE ERROR");
    console.error(raw);
    throw new Error("Failed to parse AI feedback");
  }
};


/* ------------------ RESUME ANALYZER ------------------ */
const analyzeResumeAI = async (resumeText, jobDescription) => {
  // ------------------- STEP 1: ATS SCORE (job-independent) -------------------
  const atsPrompt = `
You are an AI recruiter.

Evaluate the RESUME and return ONLY valid JSON:

{
  "resumeATSScore": number,
  "matchedSkills": [],
  "missingSkills": [],
  "improvementSuggestions": [],
  "summary": ""
}

RULES:
- Evaluate the resume quality based ONLY on its content.
- Consider skills, experience, projects, formatting, readability.
- Ignore any job description.
- Scores must be realistic (0-100)
- Suggestions should help improve the resume
- STRICTLY return only JSON, no markdown, no backticks

RESUME:
${resumeText}
`;

  const atsResponse = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: atsPrompt }],
      temperature: 0.3,
    }),
  });

  const atsData = await atsResponse.json();
  const rawATS = atsData.choices?.[0]?.message?.content;
  if (!rawATS) throw new Error("Invalid AI response for ATS score");

  let atsJSON;
  try {
    atsJSON = JSON.parse(extractJSON(rawATS));
  } catch (err) {
    console.error("❌ ATS PARSE ERROR");
    console.error(rawATS);
    throw new Error("Failed to parse ATS JSON");
  }

  // ------------------- STEP 2: JOB MATCH SCORE -------------------
  const matchPrompt = `
You are an AI recruiter.

Compare the RESUME with the JOB DESCRIPTION and return ONLY valid JSON:

{
  "jobMatchScore": number,
  "matchedSkills": [],
  "missingSkills": [],
  "improvementSuggestions": [],
  "summary": ""
}

RULES:
- Job Match Score = how well the resume fits the job description
- Scores must be realistic (0-100)
- Missing skills must come from the job description
- Suggestions should help improve resume for this specific job
- STRICTLY return only JSON, no markdown, no backticks

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const matchResponse = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: matchPrompt }],
      temperature: 0.3,
    }),
  });

  const matchData = await matchResponse.json();
  const rawMatch = matchData.choices?.[0]?.message?.content;
  if (!rawMatch) throw new Error("Invalid AI response for job match");

  let matchJSON;
  try {
    matchJSON = JSON.parse(extractJSON(rawMatch));
  } catch (err) {
    console.error("❌ JOB MATCH PARSE ERROR");
    console.error(rawMatch);
    throw new Error("Failed to parse job match JSON");
  }

  // ------------------- COMBINE RESULTS -------------------
  return {
    resumeATSScore: atsJSON.resumeATSScore,
    jobMatchScore: matchJSON.jobMatchScore,
    matchedSkills: matchJSON.matchedSkills,
    missingSkills: matchJSON.missingSkills,
    improvementSuggestions: [
      ...atsJSON.improvementSuggestions,
      ...matchJSON.improvementSuggestions,
    ],
    summary: `${atsJSON.summary}\n${matchJSON.summary}`,
  };
};
module.exports = {
  generateQuestions,
  evaluateAnswers,
  analyzeResumeAI,
};
