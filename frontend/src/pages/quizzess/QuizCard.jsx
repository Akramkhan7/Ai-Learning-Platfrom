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
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-rose-50 transition-all text-slate-400  hover:text-rose-500  opacity-0 group-hover:opacity-100"
      >
        <Trash2 strokeWidth={2} />
      </button>

      {/* Status Badge */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 py-1 rounded-lg text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1">
          <Award strokeWidth={2.5} className="w-3.5 h-3.5" />
          <span className="text-emerald-700">Score: {quiz?.score ?? 0}</span>
          </div>
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

        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide ">
          Created {moment(quiz?.createdAt).format("MMM D, YYYY")}
        </p>
      </div>

      {/* Quiz Info */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100 ">
        <div className=" px-3 py-1.5 text-xs text-slate-50 border border-slate-200 rounded-lg">
        <span className="text-sm font-semibold text-slate-700">
          {quiz?.questions?.length || 0}{" "}
          {quiz?.questions?.length === 1 ? "Question" : "Questions"}
        </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-2 pt-4 border-t border-slate-100">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            <button className="group/btn  w-full inline-flex items-center justify-center gap-2 h-11 bg-slate-100 hover:bg-slate-200 text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ">
              <BarChart2 strokeWidth={2.5} className="w-4 h-4" />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="group/btn  relative  w-full h-11 bg-linear-to-r bg-emerald-500 to-teal-500  hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald/25 active:scale-95  overflow-hidden ">
           <span className=" relative  z-10 flex items-center justify-center gap-2 ">
              <Play strokeWidth={2.5} className="w-4 h-4" />
              Start Quiz
              </span>

              <div className="absolute insert-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-all duration-700"/>
            </button>
            
            
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;