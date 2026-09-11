import { GoogleGenAI } from "@google/genai";

export const evaluateInterview = async (questionsList) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not loaded.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const interviewData = questionsList.map((item, index) => ({
    questionNumber: index + 1,
    question: item.question,
    candidateAnswer: item.answer || "",
  }));

  const prompt = `
You are an expert human technical interviewer evaluating a spoken mock interview.

Your job is to evaluate the candidate FAIRLY and realistically.

IMPORTANT SCORING RULES:

1. There is NO predefined expected answer.
   Evaluate the candidate using your own knowledge of the question.

2. Evaluate the candidate's UNDERSTANDING, not exact wording.
   Different correct explanations should receive good scores.

3. The candidate's answers may come from speech-to-text.
   Therefore, minor grammar mistakes, spelling mistakes, repeated words,
   incomplete sentences, and transcription errors should NOT receive heavy penalties
   when the intended technical meaning is clear.

4. Do NOT give an extremely low score simply because an answer is incomplete.
   Give partial credit based on what the candidate got correct.

5. A score below 30 should generally be used only when:
   - the answer is mostly incorrect,
   - the answer is irrelevant,
   - the candidate demonstrates a serious misunderstanding,
   - or the candidate does not answer the question.

6. A definition that is technically correct but lacks implementation details
   should receive PARTIAL CREDIT, not a very low score.

7. If a question asks "how would you implement..." and the candidate only gives
   a definition, reduce the COMPLETENESS score, but still give credit for the
   technically correct concept.

8. If the candidate mentions correct techniques or concepts but does not fully
   explain them, give reasonable partial credit.

9. Incorrect technical claims should be penalized more strongly than grammar mistakes.

10. Do not confuse communication quality with technical knowledge.

QUESTION SCORE:

Calculate each question's score using:

- Technical correctness: 60%
- Completeness and depth: 30%
- Communication clarity: 10%

Technical correctness is the most important factor.

COMMUNICATION:

Communication should measure whether the candidate's answer can be understood.

Do NOT heavily penalize:
- grammar mistakes
- spelling mistakes
- speech-to-text mistakes
- minor repetition
- informal wording

Only significantly reduce communication score when the answer is genuinely
difficult to understand or poorly structured.

CONFIDENCE:

You do NOT have access to the candidate's actual voice, facial expressions,
or body language.

Therefore, confidenceScore should NOT pretend to measure real physical confidence.

Instead, estimate confidence from the candidate's answer style:

- clear and decisive explanations → higher confidence
- uncertain language such as "maybe", "I think", "probably" → lower confidence
- fragmented or hesitant answers → somewhat lower confidence

Do not make confidence the dominant part of the evaluation.

QUESTION-SPECIFIC SCORING:

For each question:

1. Understand exactly what the question is asking.
2. Identify the technically correct concepts required to answer it.
3. Compare the candidate's answer against those concepts.
4. Identify what the candidate got correct.
5. Identify what is missing or incorrect.
6. Consider whether the question asks for a definition, explanation,
   comparison, implementation, example, or problem-solving approach.
7. Give partial credit whenever the candidate demonstrates genuine understanding.

EXAMPLE:

Question:
"What is React Router and how is it used for navigation?"

Candidate:
"React Router is a library used in React applications to handle navigation
between different pages or views without reloading the browser."

This answer contains a correct understanding that React Router handles navigation
between views in a React application.

Even if the candidate incorrectly says something about browser reloading,
DO NOT give an extremely low score.

A reasonable score would be around 60-75 depending on the exact explanation,
because the candidate understands the main purpose but has a technical
misunderstanding about client-side routing.

ANOTHER EXAMPLE:

Question:
"How would you implement lazy loading in React?"

Candidate:
"Lazy loading means loading a component only when it is needed."

This demonstrates a correct understanding of lazy loading, but does not explain
the implementation.

Therefore:
- technical understanding should receive substantial credit
- completeness should be reduced
- overall score should normally be around the middle range, not near zero

Do not reward an answer merely because it contains technical keywords.
The candidate must demonstrate some actual understanding.

Do not punish an answer merely because it is short if the question itself
can reasonably be answered briefly.

If the answer is empty or the candidate clearly did not answer:
- score should normally be between 0 and 20
- explain that the question was not answered.

INTERVIEW DATA:

${JSON.stringify(interviewData, null, 2)}

For EACH question provide:

- questionNumber
- score: integer from 0 to 100
- feedback: short, specific and constructive feedback

The feedback MUST mention:
- what the candidate did correctly
- what was incorrect or missing
- how the candidate could improve

Also provide:

- technicalScore: integer from 0 to 100
- communicationScore: integer from 0 to 100
- confidenceScore: integer from 0 to 100
- strengths: array containing 2 to 4 concise points
- weaknesses: array containing 2 to 4 concise points
- overallFeedback: concise overall assessment

OVERALL SCORE GUIDANCE:

Use the following general interpretation:

90-100 = Excellent
80-89  = Very good
70-79  = Good
60-69  = Fair / decent understanding
50-59  = Basic understanding with important gaps
40-49  = Weak understanding
30-39  = Poor understanding
0-29   = Very poor / mostly incorrect / unanswered

Do NOT artificially lower the score simply to make the evaluation strict.

The goal is to provide a realistic human-interviewer assessment.

Return ONLY valid JSON.

Return EXACTLY this structure:

{
  "questions": [
    {
      "questionNumber": 1,
      "score": 0,
      "feedback": "..."
    }
  ],
  "technicalScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "strengths": [],
  "weaknesses": [],
  "overallFeedback": "..."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text.trim();

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleanedText);
};