function QuestionCard({ question, current, total }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <p className="text-blue-400 font-semibold">
        Question {current} of {total}
      </p>

      <h2 className="text-2xl text-white font-bold mt-6 leading-relaxed">
        {question}
      </h2>

    </div>
  );
}

export default QuestionCard;