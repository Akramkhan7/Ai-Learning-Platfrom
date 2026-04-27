import React from "react";
import { Trash2, Award, BarChart2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 hover:border-emerald-300 rounded-2xl p-5 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between">

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400  hover:text-red-500 transition"
      >
        <Trash2 strokeWidth={2} />
      </button>

      {/* Status Badge */}
      <div className="mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-medium">
          <Award strokeWidth={2.5} className="w-4 h-4" />
          <span>Score: {quiz?.score ?? 0}</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h3
          className="text-base font-semibold text-slate-900 line-clamp-2"
          title={quiz?.title}
        >
          {quiz?.title ||
            `Quiz - ${moment(quiz?.createdAt).format("MMM D, YYYY")}`}
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Created {moment(quiz?.createdAt).format("MMM D, YYYY")}
        </p>
      </div>

      {/* Quiz Info */}
      <div className="mb-4">
        <span className="text-xs text-slate-500">
          {quiz?.questions?.length || 0}{" "}
          {quiz?.questions?.length === 1 ? "Question" : "Questions"}
        </span>
      </div>

      {/* Action Button */}
      <div>
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg transition">
              <BarChart2 strokeWidth={2.5} className="w-4 h-4" />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transition">
              <Play strokeWidth={2.5} className="w-4 h-4" />
              Start Quiz
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;