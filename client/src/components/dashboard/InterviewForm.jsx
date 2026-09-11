import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  Sparkles,
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
}) {
  return (
    <label className="block">

      <span
        className="
          mb-2
          block
          font-mono
          text-[9px]
          font-medium
          uppercase
          tracking-[0.16em]
          text-slate-500
        "
      >
        {label}
      </span>

      <div className="relative">

        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="
            h-[48px]
            w-full
            appearance-none
            rounded-[9px]
            border
            border-[#1b3851]
            bg-[#081b2e]
            px-4
            pr-10
            text-[13px]
            text-[#e4f0fb]
            outline-none
            transition
            hover:border-cyan-400/25
            focus:border-cyan-400/60
            focus:ring-4
            focus:ring-cyan-400/10
          "
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#081b2e] text-white"
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="
            pointer-events-none
            absolute
            right-3.5
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
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
    <form
      onSubmit={createInterview}
      className="relative"
    >

      {/* FORM */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <SelectField
          label="Job Role"
          value={role}
          options={ROLES}
          onChange={setRole}
        />

        <SelectField
          label="Primary Technology"
          value={technology}
          options={TECHNOLOGIES}
          onChange={setTechnology}
        />

        <SelectField
          label="Difficulty"
          value={difficulty}
          options={DIFFICULTIES}
          onChange={setDifficulty}
        />

        <SelectField
          label="Interview Type"
          value={type}
          options={TYPES}
          onChange={setType}
        />

      </div>

      {/* QUESTIONS */}

      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between">

          <label
            className="
              font-mono
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-slate-500
            "
          >
            Number of Questions
          </label>

          <span className="font-mono text-[9px] text-slate-600">
            5 — 30
          </span>

        </div>

        <div
          className="
            flex
            h-[48px]
            overflow-hidden
            rounded-[9px]
            border
            border-[#1b3851]
            bg-[#081b2e]
          "
        >

          <button
            type="button"
            onClick={decreaseQuestions}
            disabled={loading || questions <= 5}
            className="
              grid
              h-full
              w-12
              shrink-0
              place-items-center
              border-r
              border-[#1b3851]
              text-slate-500
              transition
              hover:bg-white/[0.025]
              hover:text-cyan-300
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <Minus size={15} />
          </button>

          <input
            type="number"
            min="5"
            max="30"
            value={questions}
            disabled={loading}
            onChange={(event) => {
              const value = Number(
                event.target.value
              );

              if (Number.isNaN(value)) {
                setQuestions(5);
                return;
              }

              setQuestions(
                Math.min(
                  30,
                  Math.max(5, value)
                )
              );
            }}
            className="
              h-full
              min-w-0
              flex-1
              border-0
              bg-transparent
              text-center
              text-sm
              font-semibold
              text-white
              outline-none
            "
          />

          <button
            type="button"
            onClick={increaseQuestions}
            disabled={loading || questions >= 30}
            className="
              grid
              h-full
              w-12
              shrink-0
              place-items-center
              border-l
              border-[#1b3851]
              text-slate-500
              transition
              hover:bg-white/[0.025]
              hover:text-cyan-300
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <Plus size={15} />
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mt-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-400/15
            bg-red-400/[0.04]
            p-3.5
          "
        >

          <AlertCircle
            size={16}
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
          mt-6
          rounded-xl
          border
          border-[#17344c]
          bg-[#081a2d]/60
          px-4
          py-3.5
        "
      >

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">

          <div className="flex items-center gap-2">

            <Sparkles
              size={13}
              className="text-cyan-300"
            />

            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
              {role}
            </span>

          </div>

          <span className="text-slate-700">•</span>

          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
            {technology}
          </span>

          <span className="text-slate-700">•</span>

          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
            {difficulty}
          </span>

          <span className="text-slate-700">•</span>

          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
            {questions} questions
          </span>

        </div>

      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={loading}
        className={`
          group
          mt-6
          flex
          min-h-[52px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          px-5
          text-sm
          font-semibold
          transition-all
          duration-200

          ${
            loading
              ? `
                cursor-wait
                bg-slate-700
                text-slate-400
              `
              : `
                bg-gradient-to-r
                from-cyan-300
                to-blue-500
                text-[#03101d]
                shadow-[0_10px_30px_rgba(34,211,238,.12)]
                hover:-translate-y-0.5
                hover:shadow-[0_15px_40px_rgba(34,211,238,.22)]
              `
          }
        `}
      >

        {loading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />

            Generating AI Interview...
          </>
        ) : (
          <>
            <Sparkles size={17} />

            Start Interview

            <ArrowRight
              size={17}
              className="
                transition-transform
                group-hover:translate-x-1
              "
            />
          </>
        )}

      </button>

      <p
        className="
          mt-3
          text-center
          font-mono
          text-[8px]
          uppercase
          tracking-[0.16em]
          text-slate-700
        "
      >
        Your session will be generated from the selected configuration
      </p>

    </form>
  );
}

export default InterviewForm;