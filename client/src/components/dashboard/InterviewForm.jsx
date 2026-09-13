import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  Code2,
  Gauge,
  Loader2,
  MessageSquareText,
  Minus,
  Plus,
  Users,
  Zap,
} from "lucide-react";

import api from "../../api/axios";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Java Developer",
  "MERN Stack Developer",
  "Python Developer",
  "Data Analyst",
  "Software Development Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Machine Learning Engineer",
];

const TECHNOLOGIES = [
  "React",
  "JavaScript",
  "Node.js",
  "Java",
  "Spring Boot",
  "Python",
  "C++",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
];

const DIFFICULTIES = [
  "Easy",
  "Medium",
  "Hard",
];

const TYPES = [
  "Technical",
  "HR",
  "Behavioral",
  "Mixed",
];

function SelectField({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[10px] text-[#7189a5]">
        {label}
      </span>

      <div
        className="
          relative
          flex
          h-[38px]
          items-center
          gap-2
          rounded-[6px]
          border
          border-[#1c3553]
          bg-[#0a1525]
          px-2.5
          transition-colors
          hover:border-[#35678f]
          focus-within:border-cyan-400/50
          focus-within:ring-2
          focus-within:ring-cyan-400/10
        "
      >
        {Icon && (
          <Icon
            size={14}
            strokeWidth={1.8}
            className="shrink-0 text-[#5c8bb3]"
          />
        )}

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-full
            flex-1
            appearance-none
            border-0
            bg-transparent
            pr-5
            text-[10px]
            font-medium
            text-[#bad0e7]
            outline-none
          "
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#0a1525] text-[#bad0e7]"
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={12}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-2.5 text-[#526b88]"
        />
      </div>
    </label>
  );
}

function InterviewForm({ onCreated }) {
  const navigate = useNavigate();

  const [role, setRole] = useState(
    "Frontend Developer"
  );

  const [technology, setTechnology] = useState(
    "React"
  );

  const [difficulty, setDifficulty] = useState(
    "Medium"
  );

  const [type, setType] = useState(
    "Technical"
  );

  const [questions, setQuestions] = useState(10);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const createInterview = async (event) => {
    event.preventDefault();

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!role || !technology) {
      setError(
        "Complete the required fields before starting your session."
      );
      return;
    }

    if (questions < 5 || questions > 30) {
      setError(
        "Question count must be between 5 and 30."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/interview", {
        role,
        technology,
        difficulty,
        type,
        questions: Number(questions),
      });

      const interview =
        response?.data?.interview ||
        response?.data;

      const interviewId =
        interview?._id ||
        interview?.id;

      if (!interviewId) {
        throw new Error(
          "Interview ID was not returned by the server."
        );
      }

      onCreated?.(interview);

      navigate(`/interview/${interviewId}`);
    } catch (err) {
      console.error(
        "Failed to create interview:",
        err
      );

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to create the interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuestions = () => {
    setQuestions((value) =>
      Math.max(5, Number(value) - 1)
    );
  };

  const increaseQuestions = () => {
    setQuestions((value) =>
      Math.min(30, Number(value) + 1)
    );
  };

  return (
    <form onSubmit={createInterview}>
      {/* CONFIGURATION */}

      <div className="grid grid-cols-1 gap-x-3 gap-y-[15px] md:grid-cols-2">
        <SelectField
          label="Job Role"
          value={role}
          options={ROLES}
          onChange={setRole}
          icon={Users}
        />

        <SelectField
          label="Primary Technology"
          value={technology}
          options={TECHNOLOGIES}
          onChange={setTechnology}
          icon={Code2}
        />

        <SelectField
          label="Difficulty"
          value={difficulty}
          options={DIFFICULTIES}
          onChange={setDifficulty}
          icon={Gauge}
        />

        <SelectField
          label="Interview Type"
          value={type}
          options={TYPES}
          onChange={setType}
          icon={MessageSquareText}
        />
      </div>

      {/* NUMBER OF QUESTIONS */}

      <div className="mt-[18px] flex flex-col gap-4 border-t border-[#1a2b44] pt-[15px] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#7189a5]">
              Number of questions
            </span>

            <span className="text-[9px] text-[#5c7693]">
              5–30
            </span>
          </div>

          <div
            className="
              mt-[9px]
              flex
              h-[38px]
              overflow-hidden
              rounded-[5px]
              border
              border-[#203a59]
              bg-[#091524]
            "
          >
            <button
              type="button"
              onClick={decreaseQuestions}
              disabled={loading || questions <= 5}
              aria-label="Decrease number of questions"
              className="
                grid
                w-10
                shrink-0
                place-items-center
                border-r
                border-[#203a59]
                text-[#7890ab]
                transition-colors
                hover:bg-white/[0.03]
                hover:text-[#dceaff]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Minus size={14} strokeWidth={1.8} />
            </button>

            <input
              type="number"
              min="5"
              max="30"
              value={questions}
              disabled={loading}
              onChange={(event) => {
                const value = Number(event.target.value);

                if (Number.isNaN(value)) {
                  setQuestions(5);
                  return;
                }

                setQuestions(
                  Math.min(30, Math.max(5, value))
                );
              }}
              aria-label="Number of questions"
              className="
                h-full
                min-w-0
                flex-1
                border-0
                bg-transparent
                text-center
                text-[11px]
                font-semibold
                text-[#bceeff]
                outline-none
              "
            />

            <button
              type="button"
              onClick={increaseQuestions}
              disabled={loading || questions >= 30}
              aria-label="Increase number of questions"
              className="
                grid
                w-10
                shrink-0
                place-items-center
                border-l
                border-[#203a59]
                text-[#7890ab]
                transition-colors
                hover:bg-white/[0.03]
                hover:text-[#dceaff]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Plus size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[9px] leading-[1.5] text-[#657e9b]">
          <Zap size={14} strokeWidth={1.8} className="shrink-0 text-[#5fe3ff]" />

          <span>
            Estimated duration
            <br />
            <strong className="text-[10px] text-[#adbed2]">
              {Math.max(5, Math.round(questions * 2.5))}–
              {Math.round(questions * 3)} minutes
            </strong>
          </span>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mt-[18px]
            flex
            items-start
            gap-3
            rounded-lg
            border
            border-red-400/15
            bg-red-400/[0.04]
            px-3.5
            py-3
          "
        >
          <AlertCircle
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-red-300"
          />

          <p className="text-xs leading-5 text-red-200/80">
            {error}
          </p>
        </div>
      )}

      {/* SESSION SUMMARY */}

      <div
        className="
          mt-[18px]
          flex
          items-center
          gap-3
          rounded-lg
          border
          border-[#1a2b44]
          bg-[#0a1525]
          px-3.5
          py-3
        "
      >
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.12em] text-[#5c7693]">
            Session configuration
          </p>

          <p className="mt-1 truncate text-[11px] text-[#8aa1bd]">
            {role}
            <span className="mx-1.5 text-[#334c6b]">•</span>
            {technology}
            <span className="mx-1.5 text-[#334c6b]">•</span>
            {difficulty}
            <span className="mx-1.5 text-[#334c6b]">•</span>
            {type}
            <span className="mx-1.5 text-[#334c6b]">•</span>
            {questions} questions
          </p>
        </div>
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={loading}
        className={`
          mt-[18px]
          flex
          min-h-[44px]
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-[6px]
          border
          text-[11px]
          font-bold
          transition-all
          duration-200

          ${
            loading
              ? "cursor-wait border-[#1a2b44] bg-[#102238] text-[#5c7693]"
              : "border-[#276f8d] bg-[#1d82a3]/[0.15] text-[#bceeff] hover:border-[#5fe3ff] hover:bg-[#5fe3ff] hover:text-[#071521]"
          }
        `}
      >
        {loading ? (
          <>
            <Loader2 size={16} strokeWidth={1.8} className="animate-spin" />
            Generating interview...
          </>
        ) : (
          <>
            <Plus size={15} strokeWidth={2} />
            Start an interview
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-[10px] leading-4 text-[#5c7693]">
        AI-generated questions based on your selected configuration.
      </p>
    </form>
  );
}

export default InterviewForm;