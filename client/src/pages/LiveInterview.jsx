import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import socket from "../services/socket";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  LogOut,
  Mic,
  ShieldCheck,
  X,
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

  const [loadingInterview, setLoadingInterview] =
    useState(true);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const currentQuestionRef = useRef(0);

  // =========================================================
  // UI STATE
  // =========================================================

  const [showExitModal, setShowExitModal] =
    useState(false);

  const [showFinishModal, setShowFinishModal] =
    useState(false);

  const [loadingExit, setLoadingExit] =
    useState(false);

  const [loadingFinish, setLoadingFinish] =
    useState(false);

  const [preventExit, setPreventExit] =
    useState(true);

  // =========================================================
  // TRANSCRIPTS
  // =========================================================

  const [answers, setAnswers] = useState({});

  const [deepgramReady, setDeepgramReady] =
    useState(false);

  // =========================================================
  // MICROPHONE
  // =========================================================

  const microphoneStartedRef =
    useRef(false);

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

  const fetchInterview = useCallback(
    async () => {
      try {
        setLoadingInterview(true);

        console.log(
          "📋 Starting interview:",
          id
        );

        await api.put(
          `/interview/${id}/start`
        );

        const res = await api.get(
          `/interview/${id}`
        );

        console.log(
          "✅ Interview loaded:",
          res.data
        );

        setInterview(res.data);
        setQuestions(
          res.data.questionsList || []
        );
      } catch (error) {
        console.error(
          "❌ Failed to load interview:",
          error
        );
      } finally {
        setLoadingInterview(false);
      }
    },
    [id]
  );

  // =========================================================
  // FETCH INTERVIEW ONCE
  // =========================================================

  useEffect(() => {
    fetchInterview();
  }, [fetchInterview]);

  // =========================================================
  // SOCKET CONNECTION + LISTENERS
  // =========================================================

  useEffect(() => {
    console.log(
      "🔌 Setting up Socket.IO..."
    );

    const handleConnect = () => {
      console.log(
        "🟢 Socket connected:",
        socket.id
      );
    };

    const handleDisconnect = (
      reason
    ) => {
      console.log(
        "🔴 Socket disconnected:",
        reason
      );

      setDeepgramReady(false);
    };

    const handleDeepgramReady = () => {
      console.log(
        "✅ Deepgram ready"
      );

      setDeepgramReady(true);
    };

    const handleDeepgramError = (
      data
    ) => {
      console.error(
        "❌ Deepgram error:",
        data
      );

      setDeepgramReady(false);
    };

    const handleTranscript = (
      data
    ) => {
      console.log(
        "📝 Transcript received:",
        data
      );

      if (!data?.text) {
        return;
      }

      const questionIndex =
        currentQuestionRef.current;

      if (!data.isFinal) {
        return;
      }

      setAnswers(
        (previousAnswers) => {
          const previousAnswer =
            previousAnswers[
              questionIndex
            ] || "";

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
            [questionIndex]:
              updatedAnswer,
          };
        }
      );
    };

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

    if (
      microphoneStartedRef.current
    ) {
      console.log(
        "⚠️ Microphone already started"
      );

      return;
    }

    console.log(
      "🎤 Interview + Deepgram ready. Starting microphone..."
    );

    microphoneStartedRef.current =
      true;

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
  // CLEANUP
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

  const handleNextQuestion =
    async () => {
      if (
        currentQuestion >=
        questions.length - 1
      ) {
        return;
      }

      try {
        await saveCurrentAnswer();

        const nextQuestion =
          currentQuestion + 1;

        console.log(
          "➡️ Moving to question:",
          nextQuestion + 1
        );

        currentQuestionRef.current =
          nextQuestion;

        setCurrentQuestion(
          nextQuestion
        );
      } catch (error) {
        console.error(
          "❌ Could not move to next question because answer was not saved."
        );
      }
    };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const handlePreviousQuestion =
    () => {
      if (currentQuestion <= 0) {
        return;
      }

      const previousQuestion =
        currentQuestion - 1;

      console.log(
        "⬅️ Moving to question:",
        previousQuestion + 1
      );

      currentQuestionRef.current =
        previousQuestion;

      setCurrentQuestion(
        previousQuestion
      );
    };

  // =========================================================
  // SAVE CURRENT ANSWER
  // =========================================================

  const saveCurrentAnswer =
    async () => {
      const answer =
        answers[currentQuestion]?.trim();

      if (!answer) {
        console.log(
          "⚠️ No answer to save"
        );

        return;
      }

      try {
        console.log(
          "💾 Saving answer for question:",
          currentQuestion + 1
        );

        await api.put(
          `/interview/${id}/answer`,
          {
            questionIndex:
              currentQuestion,
            answer: answer,
          }
        );

        console.log(
          "✅ Answer saved to database"
        );
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
      document.querySelector(
        "video"
      );

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

  const handleExit =
    async () => {
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

  const handleFinish =
    async () => {
      try {
        setLoadingFinish(true);

        console.log(
          "🏁 Finishing interview..."
        );

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

        navigate(
          `/result/${id}`,
          {
            replace: true,
          }
        );
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

  const currentTranscript =
    answers[currentQuestion] ||
    "Listening...";

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingInterview) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#020b18]
          text-[#eaf4ff]
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-slate-500
          "
        >
          <div
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-slate-700
              border-t-cyan-400
            "
          />

          Loading interview...
        </div>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW NOT FOUND
  // =========================================================

  if (!interview) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#020b18]
          px-6
          text-[#eaf4ff]
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-xl
            border
            border-[#173149]
            bg-[#071525]
            p-7
            text-center
          "
        >
          <CircleDot
            size={24}
            className="
              mx-auto
              text-rose-400
            "
          />

          <h1
            className="
              mt-4
              text-lg
              font-semibold
              text-slate-200
            "
          >
            Interview not found
          </h1>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-slate-600
            "
          >
            We couldn't load this interview
            session.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="
              mt-5
              rounded-lg
              border
              border-[#24445d]
              px-4
              py-2.5
              text-xs
              font-medium
              text-slate-300
              hover:bg-white/[0.025]
            "
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (questions.length === 0) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#020b18]
          px-6
          text-[#eaf4ff]
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-xl
            border
            border-[#173149]
            bg-[#071525]
            p-7
            text-center
          "
        >
          <AlertTriangle
            size={24}
            className="
              mx-auto
              text-amber-400
            "
          />

          <h1
            className="
              mt-4
              text-lg
              font-semibold
              text-slate-200
            "
          >
            No questions available
          </h1>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-slate-600
            "
          >
            This interview does not contain
            any questions to answer.
          </p>
        </div>
      </div>
    );
  }

  const isLastQuestion =
    currentQuestion ===
    questions.length - 1;

  const answeredCount =
    Object.values(answers).filter(
      (answer) =>
        String(answer || "").trim()
    ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#020b18]
        text-[#eaf4ff]
      "
    >
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-40
          border-b
          border-[#173149]
          bg-[#020b18]/95
          backdrop-blur-sm
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[72px]
            max-w-[1440px]
            items-center
            justify-between
            gap-6
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* LEFT */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  grid
                  h-8
                  w-8
                  shrink-0
                  place-items-center
                  rounded-lg
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.05]
                  text-cyan-300
                "
              >
                <ShieldCheck
                  size={16}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-100
                  "
                >
                  MockAI
                </p>

                <p
                  className="
                    hidden
                    truncate
                    text-[9px]
                    text-slate-600
                    sm:block
                  "
                >
                  {interview.role} ·{" "}
                  {interview.technology}
                </p>
              </div>
            </div>
          </div>

          {/* CENTER */}

          <div
            className="
              hidden
              items-center
              gap-3
              md:flex
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-[#173149]
                bg-[#071525]
                px-3
                py-2
              "
            >
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.14em]
                  text-slate-600
                "
              >
                Question
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  text-slate-200
                "
              >
                {currentQuestion + 1}
              </span>

              <span
                className="
                  text-[10px]
                  text-slate-700
                "
              >
                /
              </span>

              <span
                className="
                  text-[10px]
                  text-slate-500
                "
              >
                {questions.length}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-[10px]
                text-slate-600
              "
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    deepgramReady
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }
                `}
              />

              {deepgramReady
                ? "AI listening"
                : "Connecting"}
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              sm:gap-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-[#173149]
                bg-[#071525]
                px-3
                py-2
              "
            >
              <Clock3
                size={14}
                className="text-slate-500"
                strokeWidth={1.7}
              />

              <Timer
                duration={15 * 60}
                onTimeUp={handleFinish}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowExitModal(true)
              }
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-lg
                border
                border-rose-400/15
                bg-rose-400/[0.04]
                px-3
                text-xs
                font-medium
                text-rose-300
                transition-colors
                hover:border-rose-400/25
                hover:bg-rose-400/[0.07]
              "
            >
              <LogOut
                size={14}
                strokeWidth={1.8}
              />

              <span className="hidden sm:inline">
                Exit
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          max-w-[1440px]
          px-4
          pb-8
          pt-[96px]
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            INTERVIEW STATUS STRIP
        ================================================= */}

        <div
          className="
            mb-5
            flex
            flex-col
            gap-3
            rounded-lg
            border
            border-[#10283d]
            bg-[#071525]/60
            px-4
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-[10px]
                font-medium
                text-slate-500
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                "
              />

              Interview in progress
            </div>

            <span
              className="
                hidden
                text-slate-700
                sm:inline
              "
            >
              /
            </span>

            <span
              className="
                truncate
                text-[10px]
                text-slate-600
              "
            >
              {interview.difficulty} ·{" "}
              {interview.type}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              text-[9px]
              text-slate-600
            "
          >
            <span>
              {answeredCount} answered
            </span>

            <span className="text-slate-800">
              •
            </span>

            <span>
              {questions.length -
                answeredCount} remaining
            </span>
          </div>
        </div>

        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[300px_minmax(0,1fr)]
            xl:grid-cols-[320px_minmax(0,1fr)]
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <aside className="space-y-5">
            {/* CAMERA */}

            <section
              className="
                overflow-hidden
                rounded-xl
                border
                border-[#173149]
                bg-[#071525]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#10283d]
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <CameraIcon />

                  <span
                    className="
                      text-[11px]
                      font-medium
                      text-slate-300
                    "
                  >
                    Camera
                  </span>
                </div>

                <span
                  className="
                    text-[9px]
                    text-emerald-300
                  "
                >
                  Live
                </span>
              </div>

              <div className="p-3">
                <div
                  className="
                    overflow-hidden
                    rounded-lg
                    border
                    border-[#173149]
                    bg-[#020b18]
                  "
                >
                  <CameraFeed />
                </div>
              </div>
            </section>

            {/* MICROPHONE */}

            <section
              className="
                rounded-xl
                border
                border-[#173149]
                bg-[#071525]
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <div
                    className={`
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center
                      rounded-lg
                      border
                      ${
                        isMicOn &&
                        deepgramReady
                          ? `
                            border-emerald-400/15
                            bg-emerald-400/[0.05]
                            text-emerald-300
                          `
                          : `
                            border-[#173149]
                            bg-[#0a1b2d]
                            text-slate-500
                          `
                      }
                    `}
                  >
                    <Mic
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-[11px]
                        font-medium
                        text-slate-300
                      "
                    >
                      Microphone
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[9px]
                        text-slate-600
                      "
                    >
                      {!deepgramReady
                        ? "Connecting to speech recognition..."
                        : isMicOn
                          ? "Listening for your answer"
                          : "Starting microphone..."}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    shrink-0
                    text-right
                  "
                >
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      text-[9px]
                      font-medium
                      ${
                        isMicOn &&
                        deepgramReady
                          ? "text-emerald-300"
                          : "text-slate-600"
                      }
                    `}
                  >
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${
                          isMicOn &&
                          deepgramReady
                            ? "bg-emerald-400 animate-pulse"
                            : "bg-slate-700"
                        }
                      `}
                    />

                    {isMicOn &&
                    deepgramReady
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {micError && (
                <div
                  className="
                    mt-3
                    border-t
                    border-[#10283d]
                    pt-3
                    text-[9px]
                    leading-5
                    text-rose-300
                  "
                >
                  {micError}
                </div>
              )}
            </section>

            {/* PROGRESS */}

            <section
              className="
                rounded-xl
                border
                border-[#173149]
                bg-[#071525]
                p-4
              "
            >
              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-[10px]
                    font-medium
                    text-slate-400
                  "
                >
                  Interview progress
                </span>

                <span
                  className="
                    text-[10px]
                    font-medium
                    text-cyan-300
                  "
                >
                  {Math.round(
                    ((currentQuestion + 1) /
                      questions.length) *
                      100
                  )}
                  %
                </span>
              </div>

              <ProgressBar
                current={
                  currentQuestion + 1
                }
                total={
                  questions.length
                }
              />

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  text-[9px]
                  text-slate-600
                "
              >
                <span>
                  Question{" "}
                  {currentQuestion + 1}
                </span>

                <span>
                  {questions.length} total
                </span>
              </div>
            </section>
          </aside>

          {/* =================================================
              MAIN INTERVIEW AREA
          ================================================= */}

          <section
            className="
              min-w-0
              space-y-5
            "
          >
            {/* QUESTION */}

            <div
              className="
                rounded-xl
                border
                border-[#173149]
                bg-[#071525]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#10283d]
                  px-5
                  py-3.5
                  sm:px-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-cyan-400
                    "
                  >
                    Interview question
                  </span>

                  <span className="text-slate-800">
                    /
                  </span>

                  <span
                    className="
                      text-[9px]
                      text-slate-600
                    "
                  >
                    {currentQuestion + 1} of{" "}
                    {questions.length}
                  </span>
                </div>

                {answers[
                  currentQuestion
                ]?.trim() && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-[9px]
                      text-emerald-300
                    "
                  >
                    <Check
                      size={12}
                      strokeWidth={2}
                    />

                    Answer captured
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6">
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
              </div>
            </div>

            {/* TRANSCRIPT */}

            <div
              className="
                rounded-xl
                border
                border-[#173149]
                bg-[#071525]
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-2
                  border-b
                  border-[#10283d]
                  px-5
                  py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:px-6
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-200
                    "
                  >
                    Your answer
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-slate-600
                    "
                  >
                    Speak naturally. Your response
                    will appear here as it is captured.
                  </p>
                </div>

                <div
                  className={`
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-md
                    border
                    px-2.5
                    py-1.5
                    text-[9px]
                    font-medium
                    ${
                      deepgramReady &&
                      isMicOn
                        ? `
                          border-emerald-400/10
                          bg-emerald-400/[0.04]
                          text-emerald-300
                        `
                        : `
                          border-[#173149]
                          bg-[#0a1b2d]
                          text-slate-600
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${
                        deepgramReady &&
                        isMicOn
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-slate-700"
                      }
                    `}
                  />

                  {deepgramReady &&
                  isMicOn
                    ? "Listening"
                    : "Waiting"}
                </div>
              </div>

              <div
                className="
                  min-h-[230px]
                  p-5
                  sm:min-h-[260px]
                  sm:p-6
                "
              >
                <Transcript
                  transcript={
                    currentTranscript
                  }
                />
              </div>
            </div>

            {/* NAVIGATION */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-[#10283d]
                pt-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <button
                type="button"
                disabled={
                  currentQuestion === 0
                }
                onClick={
                  handlePreviousQuestion
                }
                className="
                  inline-flex
                  min-h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-[#173149]
                  bg-[#071525]
                  px-4
                  text-xs
                  font-medium
                  text-slate-400
                  transition-colors
                  hover:border-[#24445d]
                  hover:bg-[#0a1b2d]
                  hover:text-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronLeft
                  size={15}
                  strokeWidth={1.8}
                />

                Previous
              </button>

              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowFinishModal(
                      true
                    )
                  }
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-cyan-300/20
                    bg-cyan-400
                    px-5
                    text-xs
                    font-semibold
                    text-[#03101d]
                    transition-colors
                    hover:bg-cyan-300
                  "
                >
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.9}
                  />

                  Finish interview
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleNextQuestion
                  }
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-cyan-300/20
                    bg-cyan-400
                    px-5
                    text-xs
                    font-semibold
                    text-[#03101d]
                    transition-colors
                    hover:bg-cyan-300
                  "
                >
                  Next question

                  <ChevronRight
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            BOTTOM NOTE
        ================================================= */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            text-[9px]
            text-slate-700
          "
        >
          <ShieldCheck
            size={12}
            strokeWidth={1.7}
          />

          Stay focused on the current question.
          Your progress is saved as you move
          through the interview.
        </div>
      </main>

      {/* =====================================================
          EXIT MODAL
      ===================================================== */}

      {showExitModal && (
        <ModalOverlay>
          <div
            className="
              w-full
              max-w-md
              rounded-xl
              border
              border-[#24445d]
              bg-[#071525]
              shadow-[0_24px_70px_rgba(0,0,0,.45)]
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-[#10283d]
                px-5
                py-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-lg
                    border
                    border-amber-400/15
                    bg-amber-400/[0.05]
                    text-amber-300
                  "
                >
                  <AlertTriangle
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-slate-100
                    "
                  >
                    Exit interview?
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-slate-600
                    "
                  >
                    This will end your current session.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowExitModal(
                    false
                  )
                }
                className="
                  grid
                  h-8
                  w-8
                  place-items-center
                  rounded-lg
                  text-slate-600
                  transition-colors
                  hover:bg-white/[0.03]
                  hover:text-slate-300
                "
              >
                <X
                  size={16}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="px-5 py-5">
              <p
                className="
                  text-xs
                  leading-6
                  text-slate-500
                "
              >
                Your interview will end immediately.
                Any answers that have already been
                saved will remain in your session, but
                you will not be able to continue this
                interview.
              </p>

              <div
                className="
                  mt-5
                  flex
                  flex-col-reverse
                  gap-2
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowExitModal(
                      false
                    )
                  }
                  className="
                    min-h-10
                    rounded-lg
                    border
                    border-[#173149]
                    px-4
                    text-xs
                    font-medium
                    text-slate-400
                    hover:bg-white/[0.025]
                    hover:text-slate-200
                  "
                >
                  Continue interview
                </button>

                <button
                  type="button"
                  disabled={loadingExit}
                  onClick={handleExit}
                  className="
                    min-h-10
                    rounded-lg
                    border
                    border-rose-400/15
                    bg-rose-400/[0.08]
                    px-4
                    text-xs
                    font-semibold
                    text-rose-300
                    hover:bg-rose-400/[0.12]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loadingExit
                    ? "Ending..."
                    : "End interview"}
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* =====================================================
          FINISH MODAL
      ===================================================== */}

      {showFinishModal && (
        <ModalOverlay>
          <div
            className="
              w-full
              max-w-md
              rounded-xl
              border
              border-[#24445d]
              bg-[#071525]
              shadow-[0_24px_70px_rgba(0,0,0,.45)]
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-[#10283d]
                px-5
                py-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-lg
                    border
                    border-cyan-400/15
                    bg-cyan-400/[0.05]
                    text-cyan-300
                  "
                >
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-slate-100
                    "
                  >
                    Finish interview?
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-slate-600
                    "
                  >
                    Submit your responses for evaluation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFinishModal(
                    false
                  )
                }
                className="
                  grid
                  h-8
                  w-8
                  place-items-center
                  rounded-lg
                  text-slate-600
                  transition-colors
                  hover:bg-white/[0.03]
                  hover:text-slate-300
                "
              >
                <X
                  size={16}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="px-5 py-5">
              <p
                className="
                  text-xs
                  leading-6
                  text-slate-500
                "
              >
                Once submitted, your answers will
                be sent for AI evaluation. You will
                not be able to make changes after
                submission.
              </p>

              <div
                className="
                  mt-5
                  rounded-lg
                  border
                  border-[#10283d]
                  bg-[#020b18]/60
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-[10px]
                  "
                >
                  <span className="text-slate-600">
                    Questions answered
                  </span>

                  <span className="font-medium text-slate-300">
                    {answeredCount} /{" "}
                    {questions.length}
                  </span>
                </div>
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-col-reverse
                  gap-2
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowFinishModal(
                      false
                    )
                  }
                  className="
                    min-h-10
                    rounded-lg
                    border
                    border-[#173149]
                    px-4
                    text-xs
                    font-medium
                    text-slate-400
                    hover:bg-white/[0.025]
                    hover:text-slate-200
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    loadingFinish
                  }
                  onClick={
                    handleFinish
                  }
                  className="
                    min-h-10
                    rounded-lg
                    border
                    border-cyan-300/20
                    bg-cyan-400
                    px-4
                    text-xs
                    font-semibold
                    text-[#03101d]
                    hover:bg-cyan-300
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loadingFinish
                    ? "Submitting..."
                    : "Submit interview"}
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

/* =========================================================
   SMALL UI HELPERS
========================================================= */

function CameraIcon() {
  return (
    <div
      className="
        grid
        h-6
        w-6
        place-items-center
        rounded-md
        border
        border-cyan-400/10
        bg-cyan-400/[0.04]
        text-cyan-300
      "
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 10l4.55-2.27A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.89L15 14" />
        <rect
          width="13"
          height="10"
          x="2"
          y="7"
          rx="2"
        />
      </svg>
    </div>
  );
}

function ModalOverlay({ children }) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#020b18]/80
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      {children}
    </div>
  );
}

export default LiveInterview;