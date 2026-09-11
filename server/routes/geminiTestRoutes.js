import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    // Check API key when the request arrives
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("Gemini key loaded:", !!apiKey);

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not loaded.",
      });
    }

    // Create Gemini client after environment variables are loaded
    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello in one short sentence.",
    });

    res.json({
      success: true,
      response: response.text,
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;