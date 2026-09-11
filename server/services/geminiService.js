import { GoogleGenAI } from "@google/genai";

export const generateInterviewQuestions = async (
  role,
  technology,
  difficulty,
  type,
  totalQuestions
) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const prompt = `
You are a senior software engineer conducting an interview.

Generate exactly ${totalQuestions} interview questions.

Job Role:
${role}

Primary Technology:
${technology}

Difficulty:
${difficulty}

Interview Type:
${type}

Rules:

1. Every question MUST be related to the selected technology.

2. If Technology is Node.js, ask Node.js questions.

3. If Technology is React, ask React questions.

4. If Technology is Java, ask Java questions.

5. If Technology is MongoDB, ask MongoDB questions.

6. Do NOT generate questions from unrelated technologies.

7. Return ONLY valid JSON.

Example:

[
  {
    "question": "Explain JWT authentication in Node.js."
  }
]
`;

  let response;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🚀 Gemini Attempt ${attempt}/${MAX_RETRIES}`);

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      console.log("✅ Gemini Success");
      break;

    } catch (err) {
      console.log(`❌ Attempt ${attempt} Failed`);

      if (attempt === MAX_RETRIES) {
        throw err;
      }

      console.log("Waiting 2 seconds before retry...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const text = response.text;

  console.log("RAW RESPONSE:");
  console.log(text);

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.log("Invalid JSON returned by Gemini:");
    console.log(cleaned);

    throw new Error("Gemini returned invalid JSON.");
  }
};

console.log("Using Gemini API Key:", process.env.GEMINI_API_KEY);