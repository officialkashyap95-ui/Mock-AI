
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileClock,
  LayoutDashboard,
  MessageSquareText,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import api from "../api/axios";

import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import "./Result.css";

function getScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Developing";
  return "Needs practice";
}

function getScoreTone(score) {
  if (score >= 85) {
    return {
      text: "text-emerald-300",
      border: "border-emerald-400/25",
      background: "bg-emerald-400/10",
      bar: "bg-emerald-400",
    };
  }

  if (score >= 70) {
    return {
      text: "text-cyan-300",
      border: "border-cyan-400/25",
      background: "bg-cyan-400/10",
      bar: "bg-cyan-400",
    };
  }

  if (score >= 50) {
    return {
      text: "text-amber-300",
      border: "border-amber-400/25",
      background: "bg-amber-400/10",
      bar: "bg-amber-400",
    };
  }

  return {
    text: "text-rose-300",
    border: "border-rose-400/25",
    background: "bg-rose-400/10",
    bar: "bg-rose-400",
  };
}

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(interview) {
  const startValue =
    interview?.startedAt ||
    interview?.createdAt ||
    interview?.startTime;

  const endValue =
    interview?.completedAt ||
    interview?.endedAt ||
    interview?.exitedAt ||
    interview?.updatedAt;

  if (!startValue || !endValue) {
    return "Not available";
  }

  const start = new Date(startValue).getTime();
  const end = new Date(endValue).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return "Not available";
  }

  const minutes = Math.round((end - start) / (1000 * 60));

  if (minutes < 1) {
    return "< 1 min";
  }

  return `${minutes} min`;
}

function ScoreBar({ label, score, description }) {
  const safeScore = getScore(score);
  const tone = getScoreTone(safeScore);

  return (
    <div className="rounded-xl border border-[#173149] bg-[#071525] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200">{label}</p>

          {description && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className={`text-lg font-semibold ${tone.text}`}>
            {safeScore}
            <span className="ml-1 text-xs font-normal text-slate-500">
              /100
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#10283d]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${tone.bar}`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-600">0</span>

        <span className={`text-[11px] ${tone.text}`}>
          {getScoreLabel(safeScore)}
        </span>

        <span className="text-[11px] text-slate-600">100</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail, icon }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#173149] bg-[#071525] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
          {label}
        </span>

        <span className="text-cyan-300">{icon}</span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-100">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function FeedbackList({ title, items, positive = true }) {
  const Icon = positive ? CheckCircle2 : XCircle;

  return (
    <section className="min-w-0 rounded-xl border border-[#173149] bg-[#071525] p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            positive ? "bg-emerald-400/10" : "bg-amber-400/10"
          }`}
        >
          <Icon
            size={18}
            className={positive ? "text-emerald-300" : "text-amber-300"}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {positive
              ? "What you performed well"
              : "What you should improve next"}
          </p>
        </div>
      </div>

      {items?.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex items-start gap-3 text-sm leading-6 text-slate-300"
            >
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                  positive ? "bg-emerald-300" : "bg-amber-300"
                }`}
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-slate-500">
          No {positive ? "strengths" : "weaknesses"} available for this
          interview.
        </p>
      )}
    </section>
  );
}

function QuestionReview({ questions }) {
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  if (!questions?.length) {
    return (
      <section className="rounded-xl border border-[#173149] bg-[#071525] p-5">
        <h2 className="text-sm font-semibold text-slate-100">
          Question review
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          No question-level feedback is available for this interview.
        </p>
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-xl border border-[#173149] bg-[#071525]">
      <div className="flex flex-col gap-2 border-b border-[#173149] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
            Detailed review
          </p>

          <h2 className="mt-1 text-base font-semibold text-slate-100">
            Question-by-question feedback
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Review your answers and the AI evaluator's feedback.
          </p>
        </div>

        <span className="text-xs text-slate-500">
          {questions.length} questions
        </span>
      </div>

      <div className="divide-y divide-[#173149]">
        {questions.map((item, index) => {
          const score = getScore(item?.score);
          const tone = getScoreTone(score);
          const isOpen = expandedQuestion === index;

          return (
            <div key={item?._id || index} className="min-w-0">
              <button
                type="button"
                onClick={() =>
                  setExpandedQuestion(isOpen ? -1 : index)
                }
                className="flex w-full min-w-0 items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#0a1b2d]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#24445d] bg-[#0a1b2d] text-xs font-semibold text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {item?.question || `Question ${index + 1}`}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {item?.answer ? "Answer submitted" : "Not answered"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={`text-sm font-semibold ${tone.text}`}>
                    {score}
                  </span>

                  {isOpen ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="space-y-4 bg-[#050f1d] px-5 pb-5 pt-1">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      Question
                    </p>

                    <p className="text-sm leading-6 text-slate-200">
                      {item?.question || "Question unavailable."}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      Your answer
                    </p>

                    <div className="rounded-lg border border-[#173149] bg-[#071525] p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {item?.answer || "You did not provide an answer."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        AI feedback
                      </p>

                      <span className={`text-xs font-semibold ${tone.text}`}>
                        {score}/100
                      </span>
                    </div>

                    <div className="rounded-lg border border-[#173149] bg-[#071525] p-4">
                      <p className="text-sm leading-6 text-slate-300">
                        {item?.feedback || "No feedback available."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Result() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const fetchResult = async ({ showLoader = true } = {}) => {
    try {
      setError("");

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await api.get(`/interview/${id}`);

      setInterview(response.data);
    } catch (err) {
      console.error("Failed to fetch interview result:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("mockai-user");
        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Failed to load interview result.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [id]);

  const navigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Interview History",
      icon: FileClock,
      path: "/history",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const overallScore = getScore(interview?.score);

  const completedQuestions = interview?.questionsList?.filter(
    (item) => item?.answer,
  )?.length || 0;

  const totalQuestions = interview?.questionsList?.length || 0;

  const answeredPercentage = totalQuestions
    ? Math.round((completedQuestions / totalQuestions) * 100)
    : 0;

  const scoreTone = getScoreTone(overallScore);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020b18] text-slate-200">
        <Navbar
          user={user}
          onMenu={() => setSidebarOpen(true)}
          onSignOut={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("mockai-user");
            navigate("/login");
          }}
        />

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSignOut={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("mockai-user");
            navigate("/login");
          }}
          navigation={navigation}
          onNavigate={(path) => {
            setSidebarOpen(false);
            navigate(path);
          }}
          user={user}
        />

        <main className="min-h-screen pt-[74px] md:ml-[250px]">
          <div className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1360px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">
              <RefreshCw
                size={26}
                className="mx-auto animate-spin text-cyan-300"
              />

              <p className="mt-4 text-sm text-slate-300">
                Loading interview result...
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Preparing your performance report
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-[#020b18] text-slate-200">
        <Navbar
          user={user}
          onMenu={() => setSidebarOpen(true)}
          onSignOut={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("mockai-user");
            navigate("/login");
          }}
        />

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSignOut={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("mockai-user");
            navigate("/login");
          }}
          navigation={navigation}
          onNavigate={(path) => {
            setSidebarOpen(false);
            navigate(path);
          }}
          user={user}
        />

        <main className="min-h-screen pt-[74px] md:ml-[250px]">
          <div className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1360px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-2xl border border-[#173149] bg-[#071525] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/10">
                <XCircle size={24} className="text-rose-300" />
              </div>

              <h1 className="mt-4 text-lg font-semibold text-slate-100">
                Unable to load result
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {error || "This interview result could not be found."}
              </p>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#03101d] transition-colors hover:bg-cyan-300"
              >
                <ArrowLeft size={16} />
                Back to dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#020b18] text-[#e8f1ff]">
      <Navbar
        user={user}
        onMenu={() => setSidebarOpen(true)}
        onSignOut={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("mockai-user");
          navigate("/login");
        }}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("mockai-user");
          navigate("/login");
        }}
        navigation={navigation}
        onNavigate={(path) => {
          setSidebarOpen(false);
          navigate(path);
        }}
        user={user}
      />

      <main className="min-w-0 overflow-x-hidden pt-[74px] md:ml-[250px]">
        <div className="mx-auto w-full min-w-0 max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          {/* PAGE HEADER */}
          <header className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="mb-4 inline-flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-cyan-300"
                >
                  <ArrowLeft size={14} />
                  Back to dashboard
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    Performance report
                  </span>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    Completed
                  </span>
                </div>

                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-100 sm:text-3xl">
                  Interview results
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Review your performance, understand your strengths, and
                  identify the areas that need more practice.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchResult({ showLoader: false })}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#173149] bg-[#071525] px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-[#24445d] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-[#03101d] transition-colors hover:bg-cyan-300"
                >
                  Practice again
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </header>

          {/* SCORE OVERVIEW */}
          <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="relative min-w-0 overflow-hidden rounded-2xl border border-[#173149] bg-[#071525] p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_42%)]" />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-cyan-300" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Overall performance
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                  <div
                    className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#22d3ee ${overallScore}%, #10283d ${overallScore}% 100%)`,
                    }}
                  >
                    <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#071525]">
                      <span className="text-4xl font-semibold tracking-[-0.06em] text-slate-100">
                        {overallScore}
                      </span>

                      <span className="mt-1 text-xs text-slate-500">
                        out of 100
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className={`text-lg font-semibold ${scoreTone.text}`}>
                      {getScoreLabel(overallScore)}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {interview?.overallFeedback ||
                        "Your interview evaluation is ready. Review the detailed feedback below to improve your next attempt."}
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <span className="rounded-full border border-[#24445d] bg-[#0a1b2d] px-3 py-1 text-xs text-slate-400">
                        {interview?.role || "Interview session"}
                      </span>

                      <span className="rounded-full border border-[#24445d] bg-[#0a1b2d] px-3 py-1 text-xs text-slate-400">
                        {interview?.technology || "General"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricCard
                label="Interview date"
                value={formatDate(
                  interview?.completedAt || interview?.createdAt,
                )}
                detail="Session completion date"
                icon={<Clock3 size={16} />}
              />

              <MetricCard
                label="Duration"
                value={formatDuration(interview)}
                detail="Total session time"
                icon={<Clock3 size={16} />}
              />

              <MetricCard
                label="Questions"
                value={`${completedQuestions}/${totalQuestions || 0}`}
                detail={`${answeredPercentage}% answered`}
                icon={<MessageSquareText size={16} />}
              />

              <MetricCard
                label="Interview type"
                value={interview?.type || "Technical"}
                detail={interview?.difficulty || "Standard difficulty"}
                icon={<ShieldCheck size={16} />}
              />
            </div>
          </section>

          {/* SCORE BREAKDOWN */}
          <section className="mt-5">
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
                Evaluation breakdown
              </p>

              <h2 className="mt-1 text-base font-semibold text-slate-100">
                Understand your performance
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your score across the main evaluation dimensions.
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
              <ScoreBar
                label="Technical knowledge"
                score={interview?.technicalScore}
                description="Accuracy, understanding, and technical depth."
              />

              <ScoreBar
                label="Communication"
                score={interview?.communicationScore}
                description="Clarity, structure, and explanation quality."
              />

              <ScoreBar
                label="Confidence"
                score={interview?.confidenceScore}
                description="Confidence and consistency while answering."
              />
            </div>
          </section>

          {/* STRENGTHS AND WEAKNESSES */}
          <section className="mt-5 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <FeedbackList
              title="Your strengths"
              items={interview?.strengths}
              positive
            />

            <FeedbackList
              title="Areas to improve"
              items={interview?.weaknesses}
              positive={false}
            />
          </section>

          {/* OVERALL FEEDBACK */}
          <section className="mt-5 min-w-0 rounded-xl border border-[#173149] bg-[#071525] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">
                <Sparkles size={18} className="text-cyan-300" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
                  AI evaluation
                </p>

                <h2 className="mt-1 text-base font-semibold text-slate-100">
                  Overall feedback
                </h2>
              </div>
            </div>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {interview?.overallFeedback ||
                "No overall feedback is available for this interview."}
            </p>
          </section>

          {/* QUESTION REVIEW */}
          <div className="mt-5">
            <QuestionReview questions={interview?.questionsList} />
          </div>

          {/* BOTTOM ACTIONS */}
          <section className="mt-5 flex flex-col gap-4 rounded-xl border border-[#173149] bg-[#071525] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100">
                Ready for your next attempt?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Use this feedback to improve and start another practice
                interview.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-lg border border-[#24445d] bg-[#0a1b2d] px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
              >
                <ArrowLeft size={14} />
                Dashboard
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-[#03101d] transition-colors hover:bg-cyan-300"
              >
                Start new interview
                <ArrowRight size={14} />
              </button>
            </div>
          </section>

          <footer className="py-6 text-center text-[11px] text-slate-600">
            MockAI performance report · Keep practicing, keep improving.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Result;