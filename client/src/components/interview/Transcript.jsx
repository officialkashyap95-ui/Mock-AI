function Transcript({ transcript }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64">

      <h2 className="text-xl font-bold text-white mb-4">
        🎤 Live Transcript
      </h2>

      <div className="text-slate-300 leading-8 overflow-y-auto h-44">

        {transcript ? (
          transcript
        ) : (
          <p className="text-slate-500 italic">
            Listening...
          </p>
        )}

      </div>

    </div>
  );
}

export default Transcript;