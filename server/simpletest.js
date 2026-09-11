import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

console.log("Key exists:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello in one sentence.",
  });

  console.log(response.text);
} catch (err) {
  console.error(err);
}