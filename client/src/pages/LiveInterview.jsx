import { useEffect, useState, useCallback, useRef } from "react";
import socket from "../services/socket";
import { useNavigate, useParams } from "react-router-dom";

import {
  LogOut,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import api from "../api/axios";

import CameraFeed from "../components/interview/CameraFeed";
import QuestionCard from "../components/interview/QuestionCard";
import Transcript from "../components/interview/Transcript";
import Timer from "../components/interview/Timer";
import ProgressBar from "../components/interview/ProgressBar";

import usePreventExit from "../hooks/usePreventExit";
import usePreventBack from "../hooks/usePreventBack";
import useMicrophone from "../hooks/useMicrophone";

function LiveInterview() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================================================
  // INTERVIEW STATE
  // =========================================================

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loadingInterview, setLoadingInterview] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  // IMPORTANT:
  // Socket.IO callbacks can keep an old React state value.
  // This ref always contains the actual active question.
  const currentQuestionRef = useRef(0);

  // =========================================================
  // UI STATE
  // =========================================================

  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const [loadingExit, setLoadingExit] = useState(false);
  const [loadingFinish, setLoadingFinish] = useState(false);

  const [preventExit, setPreventExit] = useState(true);

  // =========================================================
  // TRANSCRIPTS
  // =========================================================

  // Each question has its own transcript.
  //
  // Example:
  //
  // answers = {
  //   0: "I am Piyush...",
  //   1: "Spring Boot is...",
  //   2: "MongoDB is..."
  // }
  //
  const [answers, setAnswers] = useState({});

  const [deepgramReady, setDeepgramReady] = useState(false);

  // =========================================================
  // MICROPHONE
  // =========================================================

  const microphoneStartedRef = useRef(false);

  const {
    startMicrophone,
    stopMicrophone,
    isMicOn,
    micError,
  } = useMicrophone();

  // =========================================================
  // EXIT PROTECTION
  // =========================================================

  usePreventExit(preventExit);

  usePreventBack(() => {
    setShowExitModal(true);
  });

  // =========================================================
  // FETCH INTERVIEW
  // =========================================================

  const fetchInterview = useCallback(async () => {
    try {
      setLoadingInterview(true);

      console.log("📋 Starting interview:", id);

      await api.put(`/interview/${id}/start`);

      const res = await api.get(`/interview/${id}`);

      console.log("✅ Interview loaded:", res.data);

      setInterview(res.data);
      setQuestions(res.data.questionsList || []);
    } catch (error) {
      console.error("❌ Failed to load interview:", error);
    } finally {
      setLoadingInterview(false);
    }
  }, [id]);

  // =========================================================
  // FETCH INTERVIEW ONCE
  // =========================================================

  useEffect(() => {
    fetchInterview();
  }, [fetchInterview]);

  // =========================================================
  // SOCKET CONNECTION + SOCKET LISTENERS
  // =========================================================

  useEffect(() => {
    console.log("🔌 Setting up Socket.IO...");

    // -------------------------------------------------------
    // SOCKET CONNECT
    // -------------------------------------------------------

    const handleConnect = () => {
      console.log(
        "🟢 Socket connected:",
        socket.id
      );
    };

    // -------------------------------------------------------
    // SOCKET DISCONNECT
    // -------------------------------------------------------

    const handleDisconnect = (reason) => {
      console.log(
        "🔴 Socket disconnected:",
        reason
      );

      setDeepgramReady(false);
    };

    // -------------------------------------------------------
    // DEEPGRAM READY
    // -------------------------------------------------------

    const handleDeepgramReady = () => {
      console.log("✅ Deepgram ready");

      setDeepgramReady(true);
    };

    // -------------------------------------------------------
    // DEEPGRAM ERROR
    // -------------------------------------------------------

    const handleDeepgramError = (data) => {
      console.error(
        "❌ Deepgram error:",
        data
      );

      setDeepgramReady(false);
    };

    // -------------------------------------------------------
    // TRANSCRIPT
    // -------------------------------------------------------

    const handleTranscript = (data) => {
      console.log(
        "📝 Transcript received:",
        data
      );

      if (!data?.text) {
        return;
      }

      // IMPORTANT:
      //
      // Always use the ref here instead of currentQuestion.
      // This prevents the Socket.IO callback from writing
      // speech into the wrong question.
      const questionIndex =
        currentQuestionRef.current;

      // We only store FINAL Deepgram results.
      //
      // This prevents interim results from being
      // repeatedly appended.
      if (!data.isFinal) {
        return;
      }

      setAnswers((previousAnswers) => {
        const previousAnswer =
          previousAnswers[questionIndex] || "";

        const newText =
          data.text.trim();

        if (!newText) {
          return previousAnswers;
        }

        const updatedAnswer =
          previousAnswer
            ? `${previousAnswer} ${newText}`
            : newText;

        return {
          ...previousAnswers,
          [questionIndex]: updatedAnswer,
        };
      });
    };

    // -------------------------------------------------------
    // REGISTER LISTENERS
    // -------------------------------------------------------

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "deepgram-ready",
      handleDeepgramReady
    );

    socket.on(
      "deepgram-error",
      handleDeepgramError
    );

    socket.on(
      "transcript",
      handleTranscript
    );

    // -------------------------------------------------------
    // CONNECT SOCKET
    // -------------------------------------------------------

    if (!socket.connected) {
      console.log(
        "🔌 Connecting Socket.IO..."
      );

      socket.connect();
    } else {
      console.log(
        "🟢 Socket already connected:",
        socket.id
      );
    }

    // -------------------------------------------------------
    // CLEANUP LISTENERS
    // -------------------------------------------------------

    return () => {
      console.log(
        "🧹 Removing Socket.IO listeners"
      );

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "deepgram-ready",
        handleDeepgramReady
      );

      socket.off(
        "deepgram-error",
        handleDeepgramError
      );

      socket.off(
        "transcript",
        handleTranscript
      );
    };
  }, []);

  // =========================================================
  // START MICROPHONE
  // =========================================================

  useEffect(() => {
    if (
      loadingInterview ||
      !interview ||
      !deepgramReady
    ) {
      return;
    }

    if (microphoneStartedRef.current) {
      console.log(
        "⚠️ Microphone already started"
      );

      return;
    }

    console.log(
      "🎤 Interview + Deepgram ready. Starting microphone..."
    );

    microphoneStartedRef.current = true;

    startMicrophone();
  }, [
    loadingInterview,
    interview,
    deepgramReady,
    startMicrophone,
  ]);

  // =========================================================
  // STOP MICROPHONE
  // =========================================================

  const stopInterviewAudio =
    useCallback(() => {
      console.log(
        "🛑 Stopping interview audio..."
      );

      if (
        microphoneStartedRef.current
      ) {
        stopMicrophone();

        microphoneStartedRef.current =
          false;
      }

      if (socket.connected) {
        console.log(
          "🛑 Sending stop-transcription"
        );

        socket.emit(
          "stop-transcription"
        );
      }

      setDeepgramReady(false);
    }, [stopMicrophone]);

  // =========================================================
  // CLEANUP WHEN COMPONENT UNMOUNTS
  // =========================================================

  useEffect(() => {
    return () => {
      console.log(
        "🧹 LiveInterview unmounted"
      );

      if (
        microphoneStartedRef.current
      ) {
        stopMicrophone();

        microphoneStartedRef.current =
          false;
      }

      if (socket.connected) {
        console.log(
          "🛑 Component cleanup: stopping transcription"
        );

        socket.emit(
          "stop-transcription"
        );
      }
    };
  }, [stopMicrophone]);

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNextQuestion = async () => {
    if (currentQuestion >= questions.length - 1) {
      return;
    }

    try {
      // Save current answer before moving
      await saveCurrentAnswer();

      const nextQuestion = currentQuestion + 1;

      console.log(
        "➡️ Moving to question:",
        nextQuestion + 1
      );

      // Update ref BEFORE changing React state
      currentQuestionRef.current = nextQuestion;

      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error(
        "❌ Could not move to next question because answer was not saved."
      );
    }
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePreviousQuestion = () => {
    if (currentQuestion <= 0) {
      return;
    }

    const previousQuestion =
      currentQuestion - 1;

    console.log(
      "⬅️ Moving to question:",
      previousQuestion + 1
    );

    // IMPORTANT:
    // Update ref BEFORE changing React state.
    currentQuestionRef.current =
      previousQuestion;

    setCurrentQuestion(
      previousQuestion
    );
  };


  // =========================================================
  // SAVE CURRENT ANSWER TO DATABASE
  // =========================================================

  const saveCurrentAnswer = async () => {
    const answer = answers[currentQuestion]?.trim();

    if (!answer) {
      console.log("⚠️ No answer to save");
      return;
    }

    try {
      console.log(
        "💾 Saving answer for question:",
        currentQuestion + 1
      );

      await api.put(`/interview/${id}/answer`, {
        questionIndex: currentQuestion,
        answer: answer,
      });

      console.log("✅ Answer saved to database");
    } catch (error) {
      console.error(
        "❌ Failed to save answer:",
        error
      );

      throw error;
    }
  };
  // =========================================================
  // STOP CAMERA
  // =========================================================

  const stopCamera = () => {
    const video =
      document.querySelector("video");

    if (
      video &&
      video.srcObject
    ) {
      const stream =
        video.srcObject;

      stream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      video.srcObject = null;

      console.log(
        "📷 Camera stopped"
      );
    }
  };

  // =========================================================
  // EXIT INTERVIEW
  // =========================================================

  const handleExit = async () => {
    try {
      setLoadingExit(true);

      console.log(
        "🚪 Exiting interview..."
      );

      setPreventExit(false);

      stopInterviewAudio();

      stopCamera();

      await api.put(
        `/interview/${id}/exit`
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "❌ Exit error:",
        error
      );
    } finally {
      setLoadingExit(false);
    }
  };

  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

  const handleFinish = async () => {
    try {
      setLoadingFinish(true);

      console.log("🏁 Finishing interview...");

      // Save the current/last answer first
      await saveCurrentAnswer();

      console.log(
        "📝 Interview answers:",
        answers
      );

      setPreventExit(false);

      stopInterviewAudio();

      stopCamera();

      await api.put(
        `/interview/${id}/finish`
      );

      navigate(`/result/${id}`, {
        replace: true,
      });

    } catch (error) {
      console.error(
        "❌ Finish error:",
        error
      );
    } finally {
      setLoadingFinish(false);
    }
  };
  // =========================================================
  // CURRENT TRANSCRIPT
  // =========================================================

  // Only show the answer belonging to the current question.
  const currentTranscript =
    answers[currentQuestion] ||
    "Listening...";

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingInterview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl">
          Loading Interview...
        </p>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW NOT FOUND
  // =========================================================

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl">
          Interview not found.
        </p>
      </div>
    );
  }

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl">
          No interview questions found.
        </p>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-800 px-8 py-5 flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            AI Mock Interview
          </h1>

          <p className="text-slate-400 mt-1">
            {interview.role} •{" "}
            {interview.technology}
          </p>

          <p className="text-slate-500 text-sm">
            Question{" "}
            {currentQuestion + 1} of{" "}
            {questions.length}
          </p>

        </div>

        <div className="flex items-center gap-5">

          <Timer
            duration={15 * 60}
            onTimeUp={handleFinish}
          />

          <button
            onClick={() =>
              setShowExitModal(true)
            }
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl transition"
          >
            <LogOut size={18} />
            Exit
          </button>

        </div>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="grid grid-cols-3 gap-8 p-8">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="space-y-6">

          <CameraFeed />

          {/* MICROPHONE */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="font-semibold text-lg">
                  Microphone
                </p>

                <p className="text-sm text-slate-400 mt-1">

                  {!deepgramReady
                    ? "Connecting to speech recognition..."
                    : isMicOn
                      ? "🎤 Listening..."
                      : "Starting microphone..."}

                </p>

              </div>

              <div className="flex items-center gap-3">

                <div
                  className={`w-3 h-3 rounded-full ${isMicOn &&
                    deepgramReady
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                    }`}
                />

                <span className="text-sm text-slate-300">

                  {isMicOn &&
                    deepgramReady
                    ? "Microphone active"
                    : "Microphone inactive"}

                </span>

              </div>

            </div>

            {micError && (
              <p className="text-red-400 text-sm mt-3">
                {micError}
              </p>
            )}

          </div>

          <ProgressBar
            current={
              currentQuestion + 1
            }
            total={
              questions.length
            }
          />

        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className="col-span-2 space-y-6">

          <QuestionCard
            question={
              questions[
                currentQuestion
              ]?.question
            }
            current={
              currentQuestion + 1
            }
            total={
              questions.length
            }
          />

          {/* =================================================
              TRANSCRIPT
          ================================================= */}

          <Transcript
            transcript={
              currentTranscript
            }
          />

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="flex justify-between items-center">

            {/* PREVIOUS */}

            <button
              disabled={
                currentQuestion === 0
              }
              onClick={
                handlePreviousQuestion
              }
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-6 py-3 rounded-xl"
            >

              <ChevronLeft
                size={18}
              />

              Previous

            </button>

            {/* NEXT / FINISH */}

            {currentQuestion ===
              questions.length - 1 ? (

              <button
                onClick={() =>
                  setShowFinishModal(
                    true
                  )
                }
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl"
              >

                <CheckCircle2
                  size={18}
                />

                Finish Interview

              </button>

            ) : (

              <button
                onClick={
                  handleNextQuestion
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
              >

                Next

                <ChevronRight
                  size={18}
                />

              </button>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          EXIT MODAL
      ===================================================== */}

      {showExitModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[450px] p-8 shadow-2xl">

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">

                <AlertTriangle
                  className="text-yellow-400"
                  size={28}
                />

                <h2 className="text-2xl font-bold">
                  Exit Interview?
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowExitModal(false)
                }
              >
                <X />
              </button>

            </div>

            <p className="text-slate-300 mt-6 leading-7">

              ⚠️ This action cannot be undone.

              <br />
              <br />

              Your interview will end immediately.

              <br />
              <br />

              No additional answers can be submitted after exiting.

            </p>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() =>
                  setShowExitModal(false)
                }
                className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl"
              >
                Continue Interview
              </button>

              <button
                disabled={loadingExit}
                onClick={handleExit}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 px-5 py-3 rounded-xl"
              >
                {loadingExit
                  ? "Ending..."
                  : "End Interview"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          FINISH MODAL
      ===================================================== */}

      {showFinishModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[460px] p-8 shadow-2xl">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Finish Interview?
              </h2>

              <button
                onClick={() =>
                  setShowFinishModal(false)
                }
              >
                <X />
              </button>

            </div>

            <p className="text-slate-300 mt-6 leading-7">

              Once submitted, you won't be able to change your answers.

              <br />
              <br />

              Your answers will be submitted for AI evaluation.

              <br />
              <br />

              You won't be able to make any changes afterward.

            </p>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() =>
                  setShowFinishModal(false)
                }
                className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                disabled={loadingFinish}
                onClick={handleFinish}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 px-5 py-3 rounded-xl"
              >
                {loadingFinish
                  ? "Submitting..."
                  : "Submit Interview"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default LiveInterview;
