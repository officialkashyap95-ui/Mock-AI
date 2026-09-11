import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Clock3,
  FileClock,
  Flame,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Target,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

import api from "../api/axios";

import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import InterviewForm from "../components/dashboard/InterviewForm";
import RecentInterviews from "../components/dashboard/RecentInterviews";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

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
        navigate("/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const completedInterviews = useMemo(() => {
    return interviews.filter(
      (item) =>
        String(item?.status || "").toLowerCase() === "completed"
    );
  }, [interviews]);

  const averageScore = useMemo(() => {
    const scored = completedInterviews.filter(
      (item) => typeof item?.score === "number"
    );

    if (!scored.length) return 0;

    const total = scored.reduce(
      (sum, item) => sum + item.score,
      0
    );

    return Math.round(total / scored.length);
  }, [completedInterviews]);

  const currentStreak = useMemo(() => {
    if (!interviews.length) return 0;

    const ONE_DAY = 24 * 60 * 60 * 1000;

    const dates = interviews
      .filter((item) => item?.createdAt)
      .map((item) => {
        const date = new Date(item.createdAt);

        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).getTime();
      })
      .filter(
        (value, index, array) =>
          array.indexOf(value) === index
      )
      .sort((a, b) => b - a);

    if (!dates.length) return 0;

    const today = new Date();

    let currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    let streak = 0;

    for (const date of dates) {
      const difference = Math.round(
        (currentDate - date) / ONE_DAY
      );

      if (difference === 0) {
        streak++;
        currentDate -= ONE_DAY;
      } else {
        break;
      }
    }

    return streak;
  }, [interviews]);

  const practiceTime = useMemo(() => {
    let totalMinutes = 0;

    interviews.forEach((item) => {
      const startValue = item?.startedAt;

      const endValue =
        item?.completedAt ||
        item?.exitedAt ||
        item?.endedAt;

      if (!startValue || !endValue) return;

      const start = new Date(startValue);
      const end = new Date(endValue);

      const minutes =
        (end - start) / (1000 * 60);

      if (minutes > 0) {
        totalMinutes += minutes;
      }
    });

    if (totalMinutes < 60) {
      return `${Math.round(totalMinutes)}m`;
    }

    return `${(totalMinutes / 60).toFixed(1)}h`;
  }, [interviews]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("mockai-user");

    setInterviews([]);

    navigate("/login");
  };

  const scrollToInterview = () => {
    const element =
      document.getElementById("create-interview");

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#020b18] text-[#eaf4ff]">

      {/* MOBILE SIDEBAR OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-[55]
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        className="
          fixed
          left-4
          top-4
          z-[70]
          grid
          h-10
          w-10
          place-items-center
          rounded-xl
          border
          border-cyan-400/20
          bg-[#061525]
          text-cyan-300
          shadow-lg
          lg:hidden
        "
      >
        <Menu size={19} />
      </button>

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
      />

      {/* MAIN */}

      <main
        className="
          min-h-screen
          pt-[76px]
          lg:ml-[250px]
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-[1440px]
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
            lg:py-9
            xl:px-10
          "
        >

          {/* HERO */}

          <section
            className="
              relative
              mb-8
              min-h-[300px]
              overflow-hidden
              rounded-[18px]
              border
              border-cyan-400/15
              bg-[#061525]
              shadow-[0_25px_70px_rgba(0,0,0,.18)]
            "
          >

            {/* GRID */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-50
                [background-image:linear-gradient(rgba(85,217,245,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(85,217,245,.045)_1px,transparent_1px)]
                [background-size:52px_52px]
              "
            />

            {/* GRADIENT */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[linear-gradient(110deg,#071a2d_0%,rgba(8,34,58,.9)_52%,rgba(7,31,54,.65)_100%)]
              "
            />

            {/* GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                -right-32
                -top-32
                h-[420px]
                w-[420px]
                rounded-full
                bg-cyan-400/10
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-48
                left-[35%]
                h-[400px]
                w-[400px]
                rounded-full
                bg-blue-500/10
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                min-h-[300px]
                flex-col
                justify-center
                gap-8
                px-6
                py-10
                sm:px-9
                lg:flex-row
                lg:items-center
                lg:justify-between
                lg:px-12
                lg:py-12
              "
            >

              <div className="max-w-[780px]">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.28em]
                    text-cyan-300
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#55d9f5]" />

                  AI-Powered Interview Practice
                </div>

                <h1
                  className="
                    mt-4
                    text-[clamp(36px,4.4vw,62px)]
                    font-semibold
                    leading-[1.02]
                    tracking-[-0.055em]
                    text-white
                  "
                >
                  Welcome back,{" "}
                  <span className="text-slate-300">
                    {user?.name || "Candidate"}
                  </span>
                  .
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-cyan-300
                      via-cyan-200
                      to-blue-500
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Ready for your next interview?
                  </span>
                </h1>

                <p
                  className="
                    mt-5
                    max-w-2xl
                    text-sm
                    leading-7
                    text-slate-400
                    sm:text-[15px]
                  "
                >
                  Practice realistic technical and HR interviews,
                  receive detailed AI-powered feedback, and
                  continuously improve your performance.
                </p>

                <div className="mt-6 flex items-center gap-3">

                  <span
                    className="
                      rounded-full
                      border
                      border-emerald-400/15
                      bg-emerald-400/[0.05]
                      px-3
                      py-1.5
                      font-mono
                      text-[9px]
                      uppercase
                      tracking-[0.13em]
                      text-emerald-300
                    "
                  >
                    AI Interviewer Ready
                  </span>

                  <span className="text-[10px] text-slate-600">
                    {completedInterviews.length} completed
                  </span>

                </div>

              </div>

              {/* HERO CTA */}

              <button
                type="button"
                onClick={scrollToInterview}
                className="
                  group
                  flex
                  min-w-[220px]
                  shrink-0
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-cyan-200/20
                  bg-gradient-to-r
                  from-cyan-300
                  to-blue-500
                  px-5
                  py-4
                  text-left
                  text-[#03101d]
                  shadow-[0_15px_45px_rgba(34,211,238,.2)]
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-[0_20px_55px_rgba(34,211,238,.3)]
                  active:scale-[.98]
                "
              >

                <span
                  className="
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-[#061525]/10
                  "
                >
                  <Plus size={20} />
                </span>

                <span className="flex-1">

                  <small
                    className="
                      block
                      font-mono
                      text-[8px]
                      uppercase
                      tracking-[0.18em]
                      opacity-60
                    "
                  >
                    Create Session
                  </small>

                  <strong className="mt-1 block text-sm">
                    Start New Interview
                  </strong>

                </span>

                <span
                  className="
                    text-xl
                    transition-transform
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

              </button>

            </div>

          </section>

          {/* PERFORMANCE */}

          <section className="mb-8">

            <div className="mb-5 flex items-end justify-between">

              <div>

                <p
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.28em]
                    text-cyan-300
                  "
                >
                  Performance Overview
                </p>

                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  Your interview practice telemetry at a glance.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  loadInterviews({ showLoader: false })
                }
                disabled={refreshing}
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-slate-800
                  bg-slate-900/40
                  px-3
                  py-1.5
                  text-[9px]
                  text-slate-500
                  transition
                  hover:border-cyan-400/20
                  hover:text-cyan-300
                  sm:flex
                "
              >
                <RefreshCw
                  size={12}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Updated just now
              </button>

            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

              <StatsCard
                title="Interviews"
                value={String(interviews.length).padStart(2, "0")}
                detail="total sessions"
                trend={
                  interviews.length
                    ? `+${interviews.length} total`
                    : "Start practicing"
                }
                icon={<LayoutDashboard size={18} />}
                tone="cyan"
              />

              <StatsCard
                title="Average Score"
                value={`${averageScore}%`}
                detail="across completed"
                trend={
                  averageScore
                    ? "Performance"
                    : "No scores yet"
                }
                icon={<Target size={18} />}
                tone="blue"
              />

              <StatsCard
                title="Current Streak"
                value={currentStreak}
                detail="days active"
                trend={
                  currentStreak
                    ? "Keep going"
                    : "Start today"
                }
                icon={<Flame size={18} />}
                tone="indigo"
              />

              <StatsCard
                title="Practice Time"
                value={practiceTime}
                detail="total practice"
                trend="Live"
                icon={<Clock3 size={18} />}
                tone="green"
              />

            </div>

          </section>

          {/* WORKSPACE */}

          <section
            id="create-interview"
            className="
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,.85fr)]
            "
          >

            {/* INTERVIEW CONFIGURATION */}

            <div
              className="
                overflow-hidden
                rounded-[18px]
                border
                border-[#1b3851]
                bg-[#061525]
                shadow-[0_20px_60px_rgba(0,0,0,.16)]
              "
            >

              <div
                className="
                  border-b
                  border-[#19334a]
                  px-6
                  py-6
                  sm:px-8
                "
              >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      grid
                      h-11
                      w-11
                      shrink-0
                      place-items-center
                      rounded-xl
                      border
                      border-cyan-400/20
                      bg-cyan-400/[0.06]
                      text-cyan-300
                    "
                  >
                    <Sparkles size={20} />
                  </div>

                  <div className="min-w-0">

                    <p
                      className="
                        font-mono
                        text-[9px]
                        uppercase
                        tracking-[0.28em]
                        text-cyan-300
                      "
                    >
                      Interview Configuration
                    </p>

                    <h2
                      className="
                        mt-2
                        text-[clamp(22px,2.2vw,31px)]
                        font-semibold
                        tracking-[-0.05em]
                        text-[#dbe8f4]
                      "
                    >
                      Create New Interview
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs
                        leading-5
                        text-slate-500
                        sm:text-[13px]
                      "
                    >
                      Configure your next AI-powered practice
                      session.
                    </p>

                  </div>

                  <span
                    className="
                      ml-auto
                      hidden
                      whitespace-nowrap
                      font-mono
                      text-[8px]
                      uppercase
                      tracking-[0.1em]
                      text-emerald-300
                      sm:block
                    "
                  >
                    ● AI INTERVIEWER READY
                  </span>

                </div>

              </div>

              <div className="p-5 sm:p-8">

                <InterviewForm
                  onCreated={() =>
                    loadInterviews({ showLoader: false })
                  }
                />

              </div>

            </div>

            {/* PRACTICE LOG */}

            <RecentInterviews
              interviews={interviews}
              loading={loading}
              onRefresh={() =>
                loadInterviews({ showLoader: false })
              }
            />

          </section>

          {/* FOOTER */}

          <footer
            className="
              mt-8
              flex
              flex-col
              gap-2
              border-t
              border-[#10283d]
              pt-5
              text-[9px]
              text-slate-700
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <span className="font-mono uppercase tracking-[0.18em]">
              mockAI candidate workspace
            </span>

            <span className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              System operational

            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;