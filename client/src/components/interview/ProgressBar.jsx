function ProgressBar({ current, total }) {

  const progress = (current / total) * 100;

  return (
    <div>

      <div className="flex justify-between text-sm text-slate-400 mb-2">
        <span>Progress</span>
        <span>{current}/{total}</span>
      </div>

      <div className="w-full h-3 bg-slate-800 rounded-full">

        <div
          className="h-3 bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

      </div>

    </div>
  );
}

export default ProgressBar;