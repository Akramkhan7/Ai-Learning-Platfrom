import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  // ❌ No Data
  if (!results || !results.data) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-slate-600">Quiz results not found.</p>
      </div>
    );
  }

  // ✅ Safe destructuring
  const {
    quiz,
    results: detailedResults,
  } = results.data;

  const score = quiz.score || 0;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // 🎨 Score color
  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  // 🧠 Score message
  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! 🚀";
    if (score >= 80) return "Great job! 🔥";
    if (score >= 70) return "Good work! 👍";
    if (score >= 60) return "Not bad! 🙂";
    return "Keep practicing! 💪";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* 🔙 Back */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document?._id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document
        </Link>
      </div>

      {/* Header */}
      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* 🏆 Score Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 text-center space-y-6">

        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100">
            <Trophy className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-500 uppercase">
          Your Score
        </p>

        <div
          className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(
            score
          )} bg-clip-text text-transparent`}
        >
          {score}%
        </div>

        <p className="text-lg text-slate-700">
          {getScoreMessage(score)}
        </p>
      </div>

      {/* 📊 Stats */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-lg">
          <Target className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">
            {totalQuestions} Total
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">
            {correctAnswers} Correct
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border rounded-lg">
          <XCircle className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-semibold text-rose-700">
            {incorrectAnswers} Incorrect
          </span>
        </div>
      </div>

      {/* 📘 Detailed Review */}
      <div className="space-y-6">

        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Detailed Review</h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer
          );

          const correctAnswerIndex = result.options.findIndex(
            (opt) => opt === result.correctAnswer
          );

          const isCorrect = result.isCorrect;

          return (
            <div
              key={index}
              className="bg-white/80 border rounded-2xl p-6 shadow-sm"
            >
              {/* Question */}
              <div className="flex justify-between mb-4">
                <div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                    Question {index + 1}
                  </span>
                  <h4 className="mt-2 font-semibold">
                    {result.question}
                  </h4>
                </div>

                {isCorrect ? (
                  <CheckCircle2 className="text-emerald-600" />
                ) : (
                  <XCircle className="text-rose-600" />
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption =
                    optIndex === correctAnswerIndex;
                  const isUserAnswer =
                    optIndex === userAnswerIndex;
                  const isWrongAnswer =
                    isUserAnswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`px-4 py-2 rounded-lg border flex justify-between
                      ${
                        isCorrectOption
                          ? "bg-emerald-50 border-emerald-300"
                          : isWrongAnswer
                          ? "bg-rose-50 border-rose-300"
                          : "bg-slate-50"
                      }`}
                    >
                      <span>{option}</span>

                      <div className="flex gap-2 text-xs">
                        {isCorrectOption && (
                          <span className="text-emerald-700">
                            ✔ Correct
                          </span>
                        )}
                        {isWrongAnswer && (
                          <span className="text-rose-700">
                            ✖ Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="p-4 bg-linear-to-br from-slate-50 to-stone-100/50 border border-slate-200  rounded-xl">
                <div className="flex items-center gap-3">
                  <div className=" shrink-0 w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center mt-0">
                    <BookOpen className="w-4 h-4 text-slate-600" strokeWidth={2}/>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1"> Explanation</p>
                     <p className="text-sm text-slate-700 leading-relaxed">
                    {result.explanation}
                  </p>
                  </div>
                </div>
                
                 
                </div>
              )}
            </div>
          );
        })}
      </div>


      <div className="mt-8 flex justify-center">
        <Link to={`/documents${quiz.document._id}`} >
        <button className="group relative px-8 h-12 bg-linear-to-br from-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 overflow-hidden">
        <span className="relative z-10 flex items-center ">
          <ArrowLeft className="w-4 h-4  group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2}/>
          Return to Document
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;