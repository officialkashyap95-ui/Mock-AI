import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const res = await api.get(`/interview/${id}`);
      setInterview(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load interview.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this interview setup?"
    );

    if (confirmLeave) {
      navigate("/dashboard");
    }
  };

  const startInterview = () => {
    setStarting(true);
    navigate(`/device-check/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-white">
          Loading Interview...
        </h1>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h1 className="text-2xl text-red-400">
          Interview not found.
        </h1>
      </div>
    );
  }

  const estimatedTime = interview.questions * 2;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">

      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-10">

          <h1 className="text-3xl font-bold text-white mb-8">
            Interview Details
          </h1>

          <div className="grid grid-cols-2 gap-y-6 text-lg">

            <span className="text-slate-400">Role</span>
            <span className="text-white font-medium">
              {interview.role}
            </span>

            <span className="text-slate-400">Difficulty</span>
            <span className="text-white font-medium">
              {interview.difficulty}
            </span>

            <span className="text-slate-400">Interview Type</span>
            <span className="text-white font-medium">
              {interview.type}
            </span>

            <span className="text-slate-400">Questions</span>
            <span className="text-white font-medium">
              {interview.questions}
            </span>

            <span className="text-slate-400">Estimated Time</span>
            <span className="text-white font-medium">
              {estimatedTime} Minutes
            </span>

            <span className="text-slate-400">Status</span>

            <span>
              <span className="inline-flex px-3 py-1 rounded-full bg-green-600/20 text-green-400 font-semibold">
                {interview.status}
              </span>
            </span>

          </div>

          <div className="mt-10 border-t border-slate-800 pt-8">

            <h2 className="text-xl font-semibold text-white mb-4">
              Before You Start
            </h2>

            <ul className="list-disc pl-6 space-y-3 text-slate-300">
              <li>🎤 Make sure your microphone is working.</li>
              <li>📷 Ensure your camera is enabled.</li>
              <li>🤫 Sit in a quiet environment.</li>
              <li>💬 Answer each question clearly and confidently.</li>
              <li>🚫 You cannot skip interview questions.</li>
              <li>📊 Your performance will be evaluated automatically.</li>
            </ul>

          </div>

          <button
            onClick={startInterview}
            disabled={starting}
            className="w-full mt-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition duration-300 py-4 rounded-xl text-white text-lg font-semibold"
          >
            {starting
              ? "Preparing Interview..."
              : "🚀 Start AI Interview"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Interview;