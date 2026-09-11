import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createInterview,
  getInterviews,
  getInterviewById,
  startInterview,
  exitInterview,
  finishInterview,
  saveAnswer,
} from "../controllers/interviewController.js";

const router = express.Router();

// Create Interview
router.post("/", authMiddleware, createInterview);

// Get All Interviews
router.get("/", authMiddleware, getInterviews);

// Get Single Interview
router.get("/:id", authMiddleware, getInterviewById);

// Start Interview
router.put("/:id/start", authMiddleware, startInterview);

// Exit Interview
router.put("/:id/exit", authMiddleware, exitInterview);

// Finish Interview
router.put("/:id/finish", authMiddleware, finishInterview);

// Save Answer
router.put("/:id/answer", authMiddleware, saveAnswer);

export default router;