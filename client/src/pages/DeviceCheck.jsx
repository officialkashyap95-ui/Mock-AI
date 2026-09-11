import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api/axios";

import CameraFeed from "../components/interview/CameraFeed";
import PermissionCard from "../components/interview/PermissionCard";

function DeviceCheck() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermissions();
    fetchInterview();
  }, []);

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setCameraReady(true);
      setMicReady(true);

      stream.getTracks().forEach((track) => track.stop());

    } catch (err) {
      console.log(err);

      setCameraReady(false);
      setMicReady(false);
    }
  };

  const fetchInterview = async () => {
    try {
      const res = await api.get(`/interview/${id}`);
      setInterview(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const startInterview = async () => {
    try {
      setLoading(true);

      await api.put(`/interview/${id}/start`);

      navigate(`/live-interview/${id}`);

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to start interview."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-8">

      <div className="max-w-5xl w-full">

        <h1 className="text-4xl font-bold text-center">
          Prepare for Your Interview
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Let's make sure your camera and microphone are working properly.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {/* Camera */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

            <h2 className="text-2xl font-semibold mb-5">
              📷 Camera Preview
            </h2>

            <CameraFeed />

          </div>

          {/* Right Side */}

          <div className="space-y-5">

            <PermissionCard
              title="Camera"
              ready={cameraReady}
            />

            <PermissionCard
              title="Microphone"
              ready={micReady}
            />

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

              <h2 className="text-xl font-bold mb-5">
                Interview Summary
              </h2>

              <div className="space-y-4 text-slate-300">

                <div className="flex justify-between">
                  <span>Role</span>
                  <span>{interview.role}</span>
                </div>

                <div className="flex justify-between">
                  <span>Technology</span>
                  <span>{interview.technology}</span>
                </div>

                <div className="flex justify-between">
                  <span>Difficulty</span>
                  <span>{interview.difficulty}</span>
                </div>

                <div className="flex justify-between">
                  <span>Interview Type</span>
                  <span>{interview.type}</span>
                </div>

                <div className="flex justify-between">
                  <span>Questions</span>
                  <span>{interview.questions}</span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{interview.status}</span>
                </div>

              </div>

              <button
                disabled={
                  !cameraReady ||
                  !micReady ||
                  loading
                }
                onClick={startInterview}
                className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                  cameraReady &&
                  micReady &&
                  !loading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-slate-700 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Starting Interview..."
                  : "🚀 Start Assessment"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DeviceCheck;