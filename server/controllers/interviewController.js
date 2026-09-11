import Interview from "../models/Interview.js";
import { getRandomQuestions } from "../services/questionService.js";
import { evaluateInterview } from "../services/evaluationService.js";

// CREATE INTERVIEW
export const createInterview = async (req, res) => {
  try {
    console.log("==================================");
    console.log("CREATE INTERVIEW REQUEST RECEIVED");
    console.log("==================================");

    const {
      role,
      technology,
      difficulty,
      type,
      questions,
    } = req.body;

    console.log("Role:", role);
    console.log("Difficulty:", difficulty);
    console.log("Type:", type);
    console.log("Questions:", questions);

    console.log("➡️ Loading questions from local question bank...");

    const interviewQuestions = getRandomQuestions(
      technology,
      difficulty,
      questions
    );

    console.log("✅ Questions loaded.");
    console.log("Questions Generated:", interviewQuestions.length);

    console.log("➡️ Saving interview to MongoDB...");

    const interview = await Interview.create({
      user: req.user,
      role,
      technology,
      difficulty,
      type,
      questions,
      questionsList: interviewQuestions,
      status: "Pending",
    });

    console.log("✅ Interview saved.");
    console.log("Interview ID:", interview._id);

    res.status(201).json(interview);

  } catch (err) {
    console.error("❌ CREATE INTERVIEW ERROR");
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL INTERVIEWS
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user,
    }).sort({
      createdAt: -1,
    });

    res.json(interviews);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// GET SINGLE INTERVIEW
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.json(interview);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// START INTERVIEW
export const startInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Prevent restarting completed interviews
    if (
      interview.status === "Completed" ||
      interview.status === "Exited"
    ) {
      return res.status(400).json({
        message: "Interview has already ended.",
      });
    }

    // Start only once
    if (interview.status === "Pending") {
      interview.status = "In Progress";
      interview.startedAt = new Date();

      await interview.save();
    }

    res.json(interview);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// EXIT INTERVIEW
export const exitInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.status = "Exited";
    interview.endedAt = new Date();

    await interview.save();

    res.json({
      message: "Interview exited successfully.",
      interview,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// FINISH INTERVIEW
export const finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    console.log("=================================");
    console.log("FINISH INTERVIEW");
    console.log("Interview ID:", interview._id);
    console.log("Questions:", interview.questionsList.length);
    console.log("=================================");

    // Evaluate complete interview using Gemini
    console.log("🤖 Sending interview to Gemini...");

    const evaluation = await evaluateInterview(
      interview.questionsList
    );

    console.log("✅ Gemini evaluation received.");

    // Save question-level evaluations
    evaluation.questions.forEach((result) => {
      const index = result.questionNumber - 1;

      if (
        index >= 0 &&
        index < interview.questionsList.length
      ) {
        interview.questionsList[index].score = result.score;
        interview.questionsList[index].feedback =
          result.feedback;
      }
    });

    // Calculate overall score locally
    const scores = interview.questionsList.map(
      (item) => item.score || 0
    );

    const totalScore = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    const overallScore =
      scores.length > 0
        ? Math.round(totalScore / scores.length)
        : 0;

    // Save overall evaluation
    interview.score = overallScore;
    interview.technicalScore =
      evaluation.technicalScore;
    interview.communicationScore =
      evaluation.communicationScore;
    interview.confidenceScore =
      evaluation.confidenceScore;

    interview.strengths = evaluation.strengths;
    interview.weaknesses = evaluation.weaknesses;
    interview.overallFeedback =
      evaluation.overallFeedback;

    // Complete interview
    interview.status = "Completed";
    interview.completedAt = new Date();

    await interview.save();

    console.log("✅ Interview evaluation saved.");
    console.log("Overall Score:", overallScore);

    res.json({
      message:
        "Interview completed and evaluated successfully.",
      interview,
    });

  } catch (err) {
    console.error("❌ FINISH INTERVIEW ERROR");
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// SAVE ANSWER
export const saveAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.questionsList[questionIndex].answer = answer;
    interview.questionsList[questionIndex].answeredAt =
      new Date();

    await interview.save();

    res.json({
      message: "Answer saved successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};