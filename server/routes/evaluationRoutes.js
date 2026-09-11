import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/evaluate-answer", async (req, res) => {
  try {
    const { question, expectedAnswer, candidateAnswer } = req.body;

    // Validate input
    if (!question || !expectedAnswer || !candidateAnswer) {
      return res.status(400).json({
        success: false,
        error: "question, expectedAnswer and candidateAnswer are required.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not loaded.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are an AI interview evaluator.

Evaluate the candidate's answer to the interview question.

Interview Question:
${question}

Expected Answer:
${expectedAnswer}

Candidate Answer:
${candidateAnswer}

Evaluate the candidate based on:
1. Technical correctness
2. Relevance to the question
3. Completeness
4. Clarity

Return ONLY valid JSON in this exact format:

{
  "score": 0,
  "feedback": "short constructive feedback"
}

The score must be an integer from 0 to 100.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();

    // Remove markdown code fences if Gemini adds them
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const evaluation = JSON.parse(cleanedText);

    res.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("Answer evaluation error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;