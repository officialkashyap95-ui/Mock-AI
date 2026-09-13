import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileClock,
  Flame,
  Gauge,
  History,
  LayoutDashboard,
  Mic2,
  Play,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import api from "../api/axios";

import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import InterviewForm from "../components/dashboard/InterviewForm";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import "../styles/Dashboard.css";

const SYSTEM_CHECKS = [
  {
    label: "Question generation",
    icon: BrainCircuit,
  },
  {
    label: "Voice analysis",
    icon: Mic2,
  },
  {
    label: "Answer evaluation",
    icon: Gauge,
  },
  {
    label: "Performance tracking",
    icon: Activity,
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /*
   * USER
   */

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  /*
   * LOAD INTERVIEWS
   */

  const loadInterviews = async ({ showLoader = true } = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await api.get("/interview");

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.interviews)
          ? response.data.interviews
          : [];

      setInterviews(data);
    } catch (error) {
      console.error("Failed to load interviews:", error);

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("mockai-user");

        navigate("/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
   * INITIAL LOAD
   */

  useEffect(() => {
    loadInterviews();
  }, []);

  /*
   * COMPLETED INTERVIEWS
   */

  const completedInterviews = useMemo(() => {
    return interviews.filter(
      (item) =>
        String(item?.status || "").toLowerCase() === "completed",
    );
  }, [interviews]);

  /*
   * AVERAGE SCORE
   */

  const averageScore = useMemo(() => {
    const scored = completedInterviews.filter(
      (item) => typeof item?.score === "number",
    );

    if (!scored.length) {
      return 0;
    }

    const total = scored.reduce(
      (sum, item) => sum + item.score,
      0,
    );

    return Math.round(total / scored.length);
  }, [completedInterviews]);

  /*
   * CURRENT STREAK
   */

  const currentStreak = useMemo(() => {
    if (!interviews.length) {
      return 0;
    }

    const oneDay = 24 * 60 * 60 * 1000;

    const dates = interviews
      .filter((item) => item?.createdAt)
      .map((item) => {
        const date = new Date(item.createdAt);

        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        ).getTime();
      })
      .filter(
        (value, index, array) =>
          array.indexOf(value) === index,
      )
      .sort((a, b) => b - a);

    if (!dates.length) {
      return 0;
    }

    const today = new Date();

    let currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).getTime();

    let streak = 0;

    for (const date of dates) {
      const difference = Math.round(
        (currentDate - date) / oneDay,
      );

      if (difference === 0) {
        streak += 1;
        currentDate -= oneDay;
      } else {
        break;
      }
    }

    return streak;
  }, [interviews]);

  /*
   * PRACTICE TIME
   */

  const practiceTime = useMemo(() => {
    let totalMinutes = 0;

    interviews.forEach((item) => {
      const startValue = item?.startedAt;

      const endValue =
        item?.completedAt ||
        item?.exitedAt ||
        item?.endedAt;

      if (!startValue || !endValue) {
        return;
      }

      const start = new Date(startValue);
      const end = new Date(endValue);

      const minutes = (end - start) / (1000 * 60);

      if (minutes > 0) {
        totalMinutes += minutes;
      }
    });

    if (totalMinutes < 60) {
      return `${Math.round(totalMinutes)}m`;
    }

    return `${(totalMinutes / 60).toFixed(1)}h`;
  }, [interviews]);

  /*
   * TODAY'S DATE
   */

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  /*
   * NAVIGATION
   */

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

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  /*
   * LOGOUT
   */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("mockai-user");

    setInterviews([]);
    navigate("/login");
  };

  /*
   * SCROLL TO CREATE INTERVIEW
   */

  const scrollToInterview = () => {
    const element = document.getElementById("create-interview");

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /*
   * UI
   */

  return (
    <div className="dashboard-page min-h-screen min-w-0 overflow-x-hidden bg-[#060c18] text-[#e8f1ff]">
      <style>{`
        @keyframes mockaiSignal {
          to {
            transform: scaleY(.55);
            opacity: .35;
          }
        }
      `}</style>

      {/* NAVBAR */}

      <Navbar
        user={user}
        onMenu={() => setSidebarOpen(true)}
        onSignOut={handleLogout}
      />

      {/* SIDEBAR */}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={handleLogout}
        navigation={navigation}
        onNavigate={handleNavigation}
        user={user}
      />

      {/* MAIN CONTENT */}

      <main className="min-h-screen min-w-0 overflow-x-hidden pt-[74px] md:ml-[250px]">
        <div className="mx-auto w-full min-w-0 max-w-[1440px] px-4 py-[35px] sm:px-6 lg:px-[38px] lg:py-[35px]">
          {/* PAGE INTRO */}

          <div className="mb-[22px] flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#66809f]">
                Overview
              </span>

              <h2 className="mt-[7px] text-2xl font-semibold tracking-[-0.04em] text-[#e9f3ff] sm:text-[24px]">
                Your command center
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  loadInterviews({ showLoader: false })
                }
                disabled={refreshing}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-[#1a2b44]
                  bg-[#0a1525]
                  px-3
                  py-[9px]
                  text-[10px]
                  text-[#8aa1bd]
                  transition-colors
                  hover:border-[#24466b]
                  hover:text-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={14}
                  strokeWidth={1.8}
                  className={refreshing ? "animate-spin" : ""}
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>

              <div
                className="
                  flex
                  items-center
                  gap-[9px]
                  rounded-md
                  border
                  border-[#1a2b44]
                  bg-[#0a1525]
                  px-3
                  py-[9px]
                  text-[10px]
                  text-[#8aa1bd]
                "
              >
                <CalendarDays size={14} strokeWidth={1.8} />

                <span className="hidden sm:inline">
                  {todayLabel}
                </span>

                <ChevronDown
                  size={12}
                  strokeWidth={1.8}
                  className="text-[#57708d]"
                />
              </div>
            </div>
          </div>

          {/* HERO PANEL */}

          <section
            className="
              relative
              flex
              min-h-[252px]
              min-w-0
              flex-col
              items-start
              justify-between
              gap-8
              overflow-hidden
              rounded-xl
              border
              border-[#1a3e62]
              bg-[#0b192c]
              px-6
              py-[30px]
              shadow-[0_0_34px_rgba(25,101,153,0.08)]
              sm:px-[42px]
              sm:py-[37px]
              lg:flex-row
              lg:items-center
            "
          >
            {/* GRID BACKDROP */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.27]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(83,174,221,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(83,174,221,.14) 1px,transparent 1px)",
                backgroundSize: "32px 32px",
                WebkitMaskImage:
                  "linear-gradient(90deg,black 0%,transparent 85%)",
                maskImage:
                  "linear-gradient(90deg,black 0%,transparent 85%)",
              }}
            />

            <div
              className="pointer-events-none absolute right-[7%] top-[-130px] h-[300px] w-[430px] rounded-full opacity-90"
              style={{
                background: "rgba(39,174,220,.09)",
                filter: "blur(70px)",
              }}
            />

            {/* HERO CONTENT */}

            <div className="relative z-[1] min-w-0 max-w-[650px]">
              <div className="flex items-center gap-[7px] text-[9px] font-bold tracking-[0.16em] text-[#5fe3ff]">
                <Sparkles size={13} strokeWidth={1.8} />
                AI INTERVIEW PLATFORM
              </div>

              <h1 className="mt-[15px] text-[27px] font-semibold leading-[1.11] tracking-[-0.05em] text-[#f0f6ff] sm:text-[39px]">
                Welcome back,{" "}
                <span className="text-[#5fe3ff]">
                  {user?.name || "Candidate"}.
                </span>
                <br />
                Ready for your next interview?
              </h1>

              <p className="mt-[11px] max-w-[590px] text-xs leading-[1.7] text-[#7f99b7]">
                Practice interviews, review your performance, and
                build confidence — one AI-powered session at a time.
              </p>

              <div className="mt-[25px] flex flex-wrap gap-[10px]">
                <button
                  type="button"
                  onClick={scrollToInterview}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-[9px]
                    rounded-md
                    border
                    border-[#78e9ff]
                    bg-[#5fe3ff]
                    px-[17px]
                    py-3
                    text-[11px]
                    font-bold
                    text-[#05101c]
                    shadow-[0_0_22px_rgba(95,227,255,0.18)]
                    transition-all
                    duration-200
                    hover:-translate-y-px
                    hover:bg-[#9aefff]
                  "
                >
                  <Play size={14} strokeWidth={1.8} />
                  Start New Interview
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-[9px]
                    rounded-md
                    border
                    border-[#294662]
                    bg-[#0a192b]/70
                    px-[17px]
                    py-3
                    text-[11px]
                    font-bold
                    text-[#a9c0d8]
                    transition-colors
                    hover:border-[#4c769b]
                    hover:text-[#e1effe]
                  "
                >
                  <History size={14} strokeWidth={1.8} />
                  View History
                </button>
              </div>
            </div>

            {/* LIVE SIGNAL */}

            <div className="relative z-[1] hidden min-w-[140px] pb-1 lg:block">
              <span className="text-[8px] tracking-[0.16em] text-[#597794]">
                LIVE SYSTEM
              </span>

              <div className="my-2 flex h-8 items-center gap-1">
                {[
                  { height: 12, delay: "0s" },
                  { height: 26, delay: ".1s" },
                  { height: 17, delay: ".3s" },
                  { height: 30, delay: ".2s" },
                  { height: 14, delay: ".5s" },
                  { height: 25, delay: ".15s" },
                  { height: 18, delay: ".4s" },
                  { height: 29, delay: ".25s" },
                ].map((bar, index) => (
                  <span
                    key={index}
                    className="w-[5px] rounded-[4px] bg-[#5fe3ff] opacity-75"
                    style={{
                      height: `${bar.height}px`,
                      animation:
                        "mockaiSignal 1.2s ease-in-out infinite alternate",
                      animationDelay: bar.delay,
                    }}
                  />
                ))}
              </div>

              <div className="text-[19px] font-semibold tracking-[-0.03em] text-[#dceeff]">
                99.8%
                <small className="ml-1 text-[10px] font-normal text-[#5d7895]">
                  uptime
                </small>
              </div>
            </div>
          </section>

          {/* METRICS GRID */}

          <section className="my-4 grid min-w-0 grid-cols-1 gap-[13px] sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Interviews Completed"
              value={String(interviews.length)}
              detail={
                interviews.length
                  ? "practice activity"
                  : "start practicing"
              }
              trend={`${completedInterviews.length} completed`}
              icon={
                <LayoutDashboard
                  size={13}
                  strokeWidth={1.8}
                />
              }
              tone="blue"
            />

            <StatsCard
              title="Average Score"
              value={`${averageScore}%`}
              detail="completed interviews"
              trend={
                averageScore
                  ? "current average"
                  : "no scores yet"
              }
              icon={<Target size={13} strokeWidth={1.8} />}
              tone="cyan"
            />

            <StatsCard
              title="Current Streak"
              value={`${currentStreak} days`}
              detail="consecutive days"
              trend={
                currentStreak
                  ? "keep it going"
                  : "practice today"
              }
              icon={<Flame size={13} strokeWidth={1.8} />}
              tone="purple"
            />

            <StatsCard
              title="Practice Time"
              value={practiceTime}
              detail="total session time"
              trend="all sessions"
              icon={<Clock3 size={13} strokeWidth={1.8} />}
              tone="green"
            />
          </section>

          {/* WORKSPACE GRID */}

          <section
            id="create-interview"
            className="
              grid
              min-w-0
              grid-cols-1
              gap-4
              xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]
            "
          >
            {/* INTERVIEW CONFIGURATION */}

            <div
              className="
                min-w-0
                rounded-[9px]
                border
                border-[#1a2b44]
                bg-[#0b1424]
                p-[22px]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#66809f]">
                    Build Your Session
                  </span>

                  <h3 className="mt-1.5 text-[15px] font-semibold tracking-[-0.02em] text-[#dceaff]">
                    Interview configuration
                  </h3>
                </div>

                <span className="shrink-0 pt-1 font-mono text-[9px] text-[#4d6886]">
                  CONFIG_01
                </span>
              </div>

              <div className="mt-[18px] min-w-0">
                <InterviewForm
                  onCreated={() =>
                    loadInterviews({ showLoader: false })
                  }
                />
              </div>
            </div>

            {/* RECENT INTERVIEWS */}

            <div className="min-w-0">
              <RecentInterviews
                interviews={interviews}
                loading={loading}
                onRefresh={() =>
                  loadInterviews({ showLoader: false })
                }
              />
            </div>
          </section>

          {/* SYSTEM MONITOR */}

          <section
            className="
              mt-4
              flex
              min-w-0
              flex-col
              items-start
              gap-[25px]
              rounded-[9px]
              border
              border-[#1a2b44]
              bg-[#091421]
              px-[22px]
              py-[19px]
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex min-w-0 items-center gap-[13px]">
              <div
                className="
                  grid
                  h-[38px]
                  w-[38px]
                  shrink-0
                  place-items-center
                  rounded-lg
                  border
                  border-[#285a73]
                  bg-[#399fbf]/[0.12]
                  text-[#5fe3ff]
                "
              >
                <BrainCircuit size={20} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#66809f]">
                  System Monitor
                </span>

                <h3 className="mt-1.5 flex flex-wrap items-center gap-[9px] text-[15px] font-semibold tracking-[-0.02em] text-[#dceaff]">
                  AI Interview Engine

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-[5px]
                      rounded
                      border
                      border-[#5de5ad]/25
                      bg-[#5de5ad]/[0.08]
                      px-1.5
                      py-1
                      text-[8px]
                      font-medium
                      text-[#5de5ad]
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5de5ad]" />
                    Ready
                  </span>
                </h3>

                <p className="mt-1.5 text-[10px] leading-relaxed text-[#657e9b]">
                  Your practice environment is calibrated and
                  ready for your next session —{" "}
                  {completedInterviews.length} interviews completed
                  so far.
                </p>
              </div>
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
              {SYSTEM_CHECKS.map((check) => {
                const Icon = check.icon;

                return (
                  <div
                    key={check.label}
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-1.5
                      text-[9px]
                      text-[#7188a3]
                    "
                  >
                    <Icon
                      size={13}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#6894b2]"
                    />

                    <span className="truncate">
                      {check.label}
                    </span>

                    <Check
                      size={12}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#5de3ad]"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* FOOTER STATUS */}

          <section
            className="
              mt-6
              flex
              flex-col
              gap-3
              border-t
              border-[#1a2b44]
              pt-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5de5ad]" />

              <span className="text-[11px] text-[#5c7693]">
                AI interviewer operational
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#4d6886]">
              <span>
                {completedInterviews.length} completed
              </span>

              <span className="h-3 w-px bg-[#1a2b44]" />

              <span>MockAI workspace</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;