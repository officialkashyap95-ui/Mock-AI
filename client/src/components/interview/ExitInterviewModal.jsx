import { AlertTriangle, X } from "lucide-react";

function ExitInterviewModal({
  isOpen,
  onClose,
  onExit,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-6">

          <div className="flex gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
              <AlertTriangle
                size={24}
                className="text-red-400"
              />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                Exit Interview?
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}
        <div className="p-6">

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

            <p className="font-semibold text-red-300">
              Your interview will end immediately.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">

              <li>
                No additional answers can be submitted.
              </li>

              <li>
                Your current progress will be evaluated.
              </li>

              <li>
                You cannot resume this interview later.
              </li>

            </ul>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-800 p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-slate-700 px-6 py-3 font-medium text-white transition hover:bg-slate-600 disabled:opacity-50"
          >
            Continue Interview
          </button>

          <button
            onClick={onExit}
            disabled={loading}
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Ending..." : "End Interview"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ExitInterviewModal;