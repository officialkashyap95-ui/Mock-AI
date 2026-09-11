import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import { setupDeepgramSocket } from "./sockets/deepgramSocket.js";
import geminiTestRoutes from "./routes/geminiTestRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";

const app = express();

const PORT = process.env.PORT || 8000;

// ==========================================
// HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Setup Deepgram Socket
setupDeepgramSocket(io);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// LOGGER
// ==========================================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/gemini", geminiTestRoutes);
app.use("/api/evaluation", evaluationRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// ==========================================
// DATABASE + SERVER
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  })

// ==========================================
// EXPORT SOCKET.IO
// ==========================================

export { io };