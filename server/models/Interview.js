import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    // Candidate
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Interview Details
    role: {
      type: String,
      required: true,
    },

    technology: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    questions: {
      type: Number,
      required: true,
    },

    // AI Generated Questions
    questionsList: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        feedback: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },

        answeredAt: {
          type: Date,
          default: null,
        },
      },
    ],

    // Interview Status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Exited"],
      default: "Pending",
    },

    // Interview Timing
    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    exitedAt: {
      type: Date,
      default: null,
    },

    // Overall AI Evaluation
    score: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    overallFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);