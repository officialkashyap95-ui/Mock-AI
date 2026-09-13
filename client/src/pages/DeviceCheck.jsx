import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  CircleAlert,
  Loader2,
  Mic,
  Play,
  ShieldCheck,
} from "lucide-react";

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

  /* =========================================================
     CHECK CAMERA + MICROPHONE
  ========================================================= */

  const checkPermissions = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setCameraReady(true);
      setMicReady(true);

      stream
        .getTracks()
        .forEach((track) => track.stop());
    } catch (err) {
      console.log(err);

      setCameraReady(false);
      setMicReady(false);
    }
  };

  /* =========================================================
     FETCH INTERVIEW
  ========================================================= */

  const fetchInterview = async () => {
    try {
      const res = await api.get(
        `/interview/${id}`
      );

      setInterview(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================================================
     START INTERVIEW
  ========================================================= */

  const startInterview = async () => {
    try {
      setLoading(true);

      await api.put(
        `/interview/${id}/start`
      );

      navigate(
        `/live-interview/${id}`
      );
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

  /* =========================================================
     LOADING
  ========================================================= */

  if (!interview) {
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
          <Loader2
            size={18}
            className="animate-spin text-cyan-400"
          />

          Loading interview...
        </div>
      </div>
    );
  }

  const permissionsReady =
    cameraReady && micReady;

  return (
    <div
      className="
        min-h-screen
        bg-[#020b18]
        text-[#eaf4ff]
      "
    >
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          h-[72px]
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
            h-full
            max-w-[1200px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* BRAND */}

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
                place-items-center
                rounded-lg
                border
                border-cyan-400/15
                bg-cyan-400/[0.05]
                text-cyan-300
              "
            >
              <ShieldCheck
                size={17}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p
                className="
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
                  text-[9px]
                  text-slate-600
                  sm:block
                "
              >
                Interview setup
              </p>
            </div>
          </div>

          {/* STEP INDICATOR */}

          <div
            className="
              hidden
              items-center
              gap-2
              sm:flex
            "
          >
            <span
              className="
                rounded-full
                border
                border-cyan-400/15
                bg-cyan-400/[0.05]
                px-3
                py-1.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-cyan-300
              "
            >
              Device Check
            </span>

            <span className="text-slate-700">
              /
            </span>

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-slate-600
              "
            >
              Interview
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1200px]
          px-4
          pb-10
          pt-[104px]
          sm:px-6
          lg:px-8
        "
      >
        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            text-xs
            font-medium
            text-slate-500
            transition-colors
            hover:text-slate-300
          "
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.8}
          />

          Back to dashboard
        </button>

        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <section className="mb-8">
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-cyan-400
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-cyan-400
                  "
                >
                  Pre-interview check
                </span>
              </div>

              <h1
                className="
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                  text-slate-100
                  sm:text-3xl
                "
              >
                Prepare for your interview
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Check your camera and microphone
                before entering the interview room.
              </p>
            </div>

            <div
              className={`
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-lg
                border
                px-3
                py-2
                text-[10px]
                font-medium

                ${
                  permissionsReady
                    ? `
                      border-emerald-400/15
                      bg-emerald-400/[0.04]
                      text-emerald-300
                    `
                    : `
                      border-amber-400/15
                      bg-amber-400/[0.04]
                      text-amber-300
                    `
                }
              `}
            >
              {permissionsReady ? (
                <CheckCircle2
                  size={14}
                  strokeWidth={1.8}
                />
              ) : (
                <CircleAlert
                  size={14}
                  strokeWidth={1.8}
                />
              )}

              {permissionsReady
                ? "All devices ready"
                : "Device check required"}
            </div>
          </div>
        </section>

        {/* =================================================
            WORKSPACE
        ================================================= */}

        <section
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[minmax(0,1.3fr)_minmax(360px,.7fr)]
          "
        >
          {/* =================================================
              CAMERA PANEL
          ================================================= */}

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-[#173149]
              bg-[#071525]
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#10283d]
                px-5
                py-4
                sm:px-6
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
                    place-items-center
                    rounded-lg
                    border
                    border-cyan-400/15
                    bg-cyan-400/[0.05]
                    text-cyan-300
                  "
                >
                  <Camera
                    size={15}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-200
                    "
                  >
                    Camera preview
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-slate-600
                    "
                  >
                    Make sure your face is clearly visible.
                  </p>
                </div>
              </div>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[9px]
                  font-medium

                  ${
                    cameraReady
                      ? `
                        border-emerald-400/10
                        bg-emerald-400/[0.04]
                        text-emerald-300
                      `
                      : `
                        border-rose-400/10
                        bg-rose-400/[0.04]
                        text-rose-300
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
                      cameraReady
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                    }
                  `}
                />

                {cameraReady
                  ? "Ready"
                  : "Unavailable"}
              </span>
            </div>

            {/* CAMERA */}

            <div
              className="
                p-4
                sm:p-5
              "
            >
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

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  text-slate-600
                "
              >
                <Camera
                  size={13}
                  strokeWidth={1.7}
                />

                Camera access is used only during
                your interview session.
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-5">
            {/* PERMISSIONS */}

            <div
              className="
                rounded-xl
                border
                border-[#173149]
                bg-[#071525]
                p-5
              "
            >
              <div className="mb-4">
                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-200
                  "
                >
                  Device permissions
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    leading-5
                    text-slate-600
                  "
                >
                  Both devices are required to start.
                </p>
              </div>

              <div className="space-y-3">
                <PermissionCard
                  title="Camera"
                  ready={cameraReady}
                />

                <PermissionCard
                  title="Microphone"
                  ready={micReady}
                />
              </div>
            </div>

            {/* INTERVIEW SUMMARY */}

            <div
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
                  border-b
                  border-[#10283d]
                  px-5
                  py-4
                "
              >
                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-200
                  "
                >
                  Interview summary
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-600
                  "
                >
                  Your selected interview configuration.
                </p>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  <SummaryRow
                    label="Role"
                    value={interview.role}
                  />

                  <SummaryRow
                    label="Technology"
                    value={interview.technology}
                  />

                  <SummaryRow
                    label="Difficulty"
                    value={interview.difficulty}
                  />

                  <SummaryRow
                    label="Interview type"
                    value={interview.type}
                  />

                  <SummaryRow
                    label="Questions"
                    value={interview.questions}
                  />

                  <SummaryRow
                    label="Status"
                    value={interview.status}
                    status
                  />
                </div>

                {/* START */}

                <button
                  type="button"
                  disabled={
                    !cameraReady ||
                    !micReady ||
                    loading
                  }
                  onClick={startInterview}
                  className={`
                    mt-6
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    px-4
                    text-sm
                    font-semibold
                    transition-colors

                    ${
                      cameraReady &&
                      micReady &&
                      !loading
                        ? `
                          border-cyan-300/20
                          bg-cyan-400
                          text-[#03101d]
                          hover:bg-cyan-300
                        `
                        : `
                          cursor-not-allowed
                          border-[#173149]
                          bg-[#0a1b2d]
                          text-slate-600
                        `
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Starting interview...
                    </>
                  ) : (
                    <>
                      <Play
                        size={16}
                        fill="currentColor"
                        strokeWidth={1.8}
                      />

                      Start interview
                    </>
                  )}
                </button>

                {!permissionsReady && (
                  <p
                    className="
                      mt-3
                      text-center
                      text-[10px]
                      leading-5
                      text-slate-600
                    "
                  >
                    Allow camera and microphone access
                    to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            TRUST NOTE
        ================================================= */}

        <section
          className="
            mt-6
            flex
            items-start
            gap-3
            rounded-lg
            border
            border-[#10283d]
            bg-[#071525]/60
            px-4
            py-3.5
          "
        >
          <ShieldCheck
            size={15}
            className="
              mt-0.5
              shrink-0
              text-slate-500
            "
            strokeWidth={1.7}
          />

          <p
            className="
              text-[10px]
              leading-5
              text-slate-600
            "
          >
            Your device permissions are checked before
            entering the interview. You can leave this
            screen without starting the assessment.
          </p>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  status = false,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-[#10283d]
        pb-3
        last:border-b-0
        last:pb-0
      "
    >
      <span
        className="
          text-[11px]
          text-slate-600
        "
      >
        {label}
      </span>

      <span
        className={`
          max-w-[58%]
          truncate
          text-right
          text-[11px]
          font-medium

          ${
            status
              ? "text-cyan-300"
              : "text-slate-300"
          }
        `}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default DeviceCheck;