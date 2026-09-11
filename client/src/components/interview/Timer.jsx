import { useEffect, useState } from "react";

function Timer({ duration = 900, onTimeUp }) {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  const danger = seconds <= 60;

  return (
    <div
      className={`border rounded-xl px-5 py-3 font-bold text-lg transition
      ${
        danger
          ? "bg-red-600 border-red-500 text-white animate-pulse"
          : "bg-slate-900 border-slate-800 text-white"
      }`}
    >
      ⏱ {String(minutes).padStart(2, "0")}:
      {String(remaining).padStart(2, "0")}
    </div>
  );
}

export default Timer;