const fs = require("fs");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const { analyzeResumeAI } = require("../services/ai.service");

exports.analyzeResume = async (req, res) => {
  try {

    const file = req.file;
    const jobDescription = req.body.jobDescription;

    if (!file) {
      return res.status(400).json({
        message: "Resume file required"
      });
    }

    let resumeText = "";

    /* -------- PDF PARSE -------- */

    if (file.mimetype === "application/pdf") {

      const buffer = fs.readFileSync(file.path);

      const data = await pdfParse(buffer);

      resumeText = data.text;

    }

    /* -------- DOCX PARSE -------- */

    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {

      const result = await mammoth.extractRawText({
        path: file.path
      });

      resumeText = result.value;

    }

    /* -------- AI ANALYSIS -------- */

    const result = await analyzeResumeAI(
      resumeText,
      jobDescription
    );

    /* -------- DELETE FILE AFTER USE (optional) -------- */

    fs.unlinkSync(file.path);

    res.json(result);

  } catch (error) {

    console.error("Resume analysis error:", error);

    res.status(500).json({
      message: "Resume analysis failed"
    });

  }
};