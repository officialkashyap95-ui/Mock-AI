import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Menu,
  MessageSquareQuote,
  Mic,
  Play,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import "./Home.css";

const navItems = [
  ["Features", "product"],
  ["How it works", "how-it-works"],
  ["Interview", "interview"],
];

const fadeUp = {
  initial: {
    opacity: 0,
    y: 30,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    amount: 0.2,
  },
  transition: {
    duration: 0.7,
    ease: "easeOut",
  },
};

function Reveal({ children, className = "" }) {
  return (
    <motion.div {...fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* =========================
   NAVBAR
========================= */

function Navbar({ onStartInterview }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="home-navbar">
      <nav className="home-nav">
        <a href="#top" className="home-brand">
          <span className="brand-icon">
            <Sparkles size={17} />
          </span>

          mock<span>AI</span>
        </a>

        <div className="desktop-nav">
          {navItems.map(([label, id]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <a href="/login" className="login-link">
            Log in
          </a>

          <button
            onClick={onStartInterview}
            className="primary-button small-button"
          >
            Get started
            <ArrowRight size={16} />
          </button>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="mobile-nav">
          {navItems.map(([label, id]) => (
            <a
              href={`#${id}`}
              key={id}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}

          <a href="/login" className="primary-button">
            Get started
          </a>
        </div>
      )}
    </header>
  );
}

/* =========================
   HERO
========================= */

function Hero({ onStartInterview }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="hero-content">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow-dot" />
            AI-POWERED INTERVIEW PRACTICE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Practice interviews.
            <br />

            <span>Build confidence.</span>

            <br />

            Get hired.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Practice realistic technical and HR interviews
            with an AI interviewer, voice interaction, and
            personalized performance feedback.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={onStartInterview}
              className="primary-button"
            >
              Start Mock Interview
              <ArrowRight size={17} />
            </button>

            <a href="#how-it-works" className="secondary-button">
              <span className="play-circle">
                <Play size={13} fill="currentColor" />
              </span>

              See how it works
            </a>
          </motion.div>

          <motion.div
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="trust-items">
              <span>Technical</span>
              <span>HR</span>
              <span>Voice Interviews</span>
            </div>
          </motion.div>
        </div>

        <InterviewPreview />
      </div>
    </section>
  );
}

/* =========================
   INTERVIEW PREVIEW
========================= */

function InterviewPreview() {
  const bars = [
    20, 35, 24, 45, 30, 60, 42, 72, 48, 82,
    58, 90, 62, 45, 70, 35, 50, 25, 40, 20,
  ];

  return (
    <motion.div
      className="interview-preview-wrap"
      initial={{
        opacity: 0,
        scale: 0.94,
        x: 30,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
      }}
      transition={{
        duration: 0.9,
        delay: 0.2,
      }}
    >
      <motion.div
        className="interview-dashboard"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="dashboard-top">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>

          <span>mockAI / interview session</span>

          <span className="live-status">
            <i />
            Live
          </span>
        </div>

        <div className="dashboard-body">
          <aside className="dashboard-sidebar">
            <div className="mini-brand">
              <span className="brand-icon">
                <Sparkles size={12} />
              </span>

              mockAI
            </div>

            <div className="sidebar-link active">
              <Mic size={14} />
              Interview
            </div>

            <div className="sidebar-link">
              <BarChart3 size={14} />
              My progress
            </div>

            <div className="sidebar-link">
              <Target size={14} />
              Goals
            </div>

            <div className="profile-section">
              <div className="profile-avatar">
                JD
              </div>

              <span>Candidate</span>

              <ChevronDown size={13} />
            </div>
          </aside>

          <div className="dashboard-main">
            <div className="dashboard-heading">
              <div>
                <small>TECHNICAL INTERVIEW</small>
                <h3>Frontend Engineer</h3>
              </div>

              <span className="interview-timer">
                12:48
              </span>
            </div>

            <div className="question-card">
              <div className="question-icon">
                <BrainCircuit size={16} />
              </div>

              <div>
                <small>QUESTION 04 OF 10</small>

                <p>
                  How would you optimize a React
                  application experiencing performance
                  issues?
                </p>
              </div>
            </div>

            <div className="voice-area">
              <div className="ai-voice-icon">
                <Sparkles size={17} />
              </div>

              <div className="waveform">
                {bars.map((height, index) => (
                  <motion.i
                    key={index}
                    animate={{
                      height: [
                        height * 0.55,
                        height,
                        height * 0.7,
                      ],
                    }}
                    transition={{
                      duration: 1.1 + index * 0.03,
                      repeat: Infinity,
                      delay: index * 0.02,
                    }}
                  />
                ))}
              </div>

              <span>Listening...</span>
            </div>

            <div className="dashboard-footer">
              <span>
                <Mic size={14} />
                Your answer
              </span>

              <span className="recording-dot">
                Recording
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="floating-score"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        <div className="score-circle">
          <strong>86</strong>
          <small>/100</small>
        </div>

        <div>
          <span>Confidence score</span>
          <b>
            +12%
            <ChevronRight size={12} />
          </b>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================
   STATS
========================= */

function Stats() {
  const stats = [
    ["10+", "Interview questions"],
    ["5", "Interview types"],
    ["24/7", "Practice anytime"],
    ["AI", "Personal feedback"],
  ];

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map(([number, label], index) => (
          <Reveal key={label}>
            <div className="stat-item">
              <strong>{number}</strong>
              <span>{label}</span>

              {index !== stats.length - 1 && (
                <div className="stat-divider" />
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================
   FEATURES
========================= */

function Features() {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Questions",
      text:
        "Practice relevant technical and HR questions based on your selected role, technology, and difficulty.",
    },
    {
      icon: Mic,
      title: "Voice-Based Interviews",
      text:
        "Answer naturally using your microphone and experience a realistic interview conversation.",
    },
    {
      icon: BarChart3,
      title: "Performance Analysis",
      text:
        "Understand your technical performance, communication, confidence, and overall interview score.",
    },
    {
      icon: MessageSquareQuote,
      title: "Personalized Feedback",
      text:
        "Identify your strengths and weaknesses and understand exactly where you can improve.",
    },
    {
      icon: Target,
      title: "Interview History",
      text:
        "Review your previous interviews, questions, answers, scores, and feedback.",
    },
    {
      icon: Sparkles,
      title: "Practice Smarter",
      text:
        "Turn every interview into an opportunity to improve before the real one.",
    },
  ];

  return (
    <section className="section" id="product">
      <div className="section-container">
        <Reveal>
          <div className="section-kicker">
            WHY MOCKAI
          </div>

          <h2>
            Everything you need to
            <br />
            <span>prepare with confidence.</span>
          </h2>

          <p className="section-description">
            Practice realistic interviews and understand
            exactly how you can improve.
          </p>
        </Reveal>

        <div className="feature-grid">
          {features.map(
            ({ icon: Icon, title, text }, index) => (
              <Reveal key={title}>
                <motion.div
                  className="feature-card"
                  whileHover={{
                    y: -8,
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <div className="feature-top">
                    <div className="feature-icon">
                      <Icon size={22} />
                    </div>

                    <span>
                      0{index + 1}
                    </span>
                  </div>

                  <h3>{title}</h3>

                  <p>{text}</p>

                  <a href="#interview">
                    Start practicing
                    <ArrowRight size={15} />
                  </a>
                </motion.div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   HOW IT WORKS
========================= */

function HowItWorks() {
  const steps = [
    [
      "01",
      "Choose your interview",
      "Select your role, technology, difficulty, interview type, and number of questions.",
    ],
    [
      "02",
      "Start the interview",
      "Enable your microphone and camera, then begin your AI-powered interview.",
    ],
    [
      "03",
      "Answer naturally",
      "Respond to questions using your voice while MockAI records your answers.",
    ],
    [
      "04",
      "Review & improve",
      "Get your scores, feedback, strengths, weaknesses, and interview history.",
    ],
  ];

  return (
    <section
      className="section process-section"
      id="how-it-works"
    >
      <div className="section-container">
        <Reveal>
          <div className="section-kicker">
            HOW IT WORKS
          </div>

          <h2>
            From nervous to
            <br />
            <span>ready.</span>
          </h2>
        </Reveal>

        <div className="process-grid">
          {steps.map(([number, title, text]) => (
            <Reveal key={number}>
              <motion.div
                className="process-card"
                whileHover={{ x: 6 }}
              >
                <span className="process-number">
                  {number}
                </span>

                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>

                <ChevronRight
                  className="process-arrow"
                  size={20}
                />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================
   FEEDBACK
========================= */

function FeedbackPreview() {
  return (
    <section className="feedback-section">
      <div className="feedback-container">
        <Reveal>
          <div className="feedback-copy">
            <div className="section-kicker">
              AI PERFORMANCE ANALYSIS
            </div>

            <h2>
              Know where you
              <br />
              <span>can improve.</span>
            </h2>

            <p>
              Every answer tells a story. MockAI helps
              you understand your technical knowledge,
              communication, confidence, and overall
              performance.
            </p>

            <a href="#interview" className="primary-button">
              Start an interview
              <ArrowRight size={17} />
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="feedback-card">
            <div className="feedback-header">
              <div>
                <small>SAMPLE INTERVIEW FEEDBACK</small>
                <h3>Frontend Engineer</h3>
              </div>

              <div className="feedback-score">
                <strong>86</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="overall-progress">
              <div className="progress-label">
                <span>Overall performance</span>
                <b>Great work</b>
              </div>

              <div className="progress-track">
                <motion.i
                  initial={{ width: 0 }}
                  whileInView={{ width: "86%" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            <div className="metrics">
              {[
                ["Technical", "88%", "Strong understanding"],
                ["Communication", "79%", "Needs more clarity"],
                ["Confidence", "86%", "Clear delivery"],
              ].map(([label, score, feedback]) => (
                <div className="metric" key={label}>
                  <div className="metric-heading">
                    <span>{label}</span>
                    <b>{score}</b>
                  </div>

                  <div className="mini-progress">
                    <i
                      style={{
                        width: score,
                      }}
                    />
                  </div>

                  <small>
                    <Check size={12} />
                    {feedback}
                  </small>
                </div>
              ))}
            </div>

            <div className="ai-insight">
              <Sparkles size={17} />

              <p>
                <strong>AI Insight </strong>
                <span>
                  Your answer was structured and clear. Try adding a concrete example next time.
                </span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================
   TECHNOLOGIES
========================= */

function Technologies() {
  const categories = [
    {
      title: "Frontend",
      technologies: ["React", "Next.js", "Angular", "Vue.js"],
    },
    {
      title: "Backend",
      technologies: ["Node.js", "Express.js", "Spring Boot", "Django", "Flask"],
    },
    {
      title: "Languages",
      technologies: ["Java", "Python", "C++"],
    },
    {
      title: "Databases",
      technologies: ["MongoDB", "MySQL", "PostgreSQL"],
    },
    {
      title: "DevOps & Cloud",
      technologies: ["Docker", "Kubernetes", "AWS"],
    },
    {
      title: "AI / Machine Learning",
      technologies: ["TensorFlow", "PyTorch"],
    },
  ];

  return (
    <section className="technology-section">
      <div className="technology-layout">

        <div className="technology-intro">
          <div className="section-kicker">
            BUILT FOR DEVELOPERS
          </div>

          <h2>
            Practice the technologies
            <span> you work with.</span>
          </h2>
        </div>

        <div className="technology-categories">
          {categories.map(({ title, technologies }) => (
            <div className="technology-category" key={title}>
              <h3 className="technology-category-title">
                {title}
              </h3>

              <div className="technology-category-grid">
                {technologies.map((technology) => (
                  <div className="technology-card" key={technology}>
                    <Code2 size={16} />
                    <span>{technology}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
/* =========================
   CTA
========================= */

function CTA({ onStartInterview }) {
  return (
    <section className="cta-section" id="interview">
      <div className="cta-glow" />

      <div className="cta-content">
        <Reveal>
          <div className="section-kicker">
            YOUR NEXT INTERVIEW STARTS HERE
          </div>

          <h2>
            Practice today.
            <br />
            <span>Perform better tomorrow.</span>
          </h2>

          <p>
            Build confidence before the real interview.
          </p>

          <button
            onClick={onStartInterview}
            className="primary-button"
          >
            Start Mock Interview
            <ArrowRight size={17} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================
   FOOTER
========================= */

function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <a href="#top" className="home-brand">
          <span className="brand-icon">
            <Sparkles size={17} />
          </span>

          mock<span>AI</span>
        </a>

        <p>
          AI-powered interview practice for the next
          generation of developers.
        </p>

        <div className="footer-links">
          <a href="#product">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#interview">Start Interview</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 MockAI</span>
        <span>Built for better interviews.</span>
      </div>
    </footer>
  );
}

/* =========================
   HOME
========================= */

export default function Home() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const handleStartInterview = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className={reduceMotion ? "reduce-motion" : ""}>
      <Navbar onStartInterview={handleStartInterview} />

      <Hero onStartInterview={handleStartInterview} />

      <Stats />

      <Features />

      <HowItWorks />

      <FeedbackPreview />

      <Technologies />

      <CTA onStartInterview={handleStartInterview} />

      <Footer />
    </main>
  );


}