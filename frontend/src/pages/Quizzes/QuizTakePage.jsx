import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, data } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, Users } from 'lucide-react'
import quizService from '../../services/quizService'
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';


const QuizTakePage = () => {
const {quizId} = useParams();
const navigate = useNavigate();
const [quiz, setQuiz] = useState(null);
const [loading, setLoading ] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState({});
const [submitting, setSubmitting] = useState(false);


useEffect(()=>{
  const fetchQuiz = async() =>{
    try{
      const res = await quizService.getQuizById(quizId)
      setQuiz(res.data)
    }catch(error){
      toast.error("Failed to fetch quiz.")
      console.log(error)
    }finally{
      setLoading(false);

    }
  }
  quizId();
},[quizId])

const handleOptionChange = ({questionId, optionIndex}) =>{
setSelectedAnswer((prev)=>({
  ...prev,
  [questionId] : optionIndex,
}))
}


const handleNextOption = () =>{
  if(currentQuestionIndex < quiz.questions.length-1){
    setCurrentQuestionIndex((prev) =>prev + 1)
  }
}

const handlePreviousOption = () =>{
  if(currentQuestionIndex > 0){
    setCurrentQuestionIndex((prev) =>prev - 1)
  }
}

const handleSubmitQuiz = async() =>{
setSubmitting(true);
try{
  const formattedAnswer = Object.keys(selectedAnswer).map(questionId =>{
    const question = quiz.questions.find((q) => q._id === questionId);
    const questionIndex = quiz.questions.findIndex((q) => q._id === questionId);
    const optionIndex = selectedAnswer[questionId];
    const selectedAnswer = question.options[questionIndex];
    return {questionIndex, selectedAnswer};

  })

  await quizService.submitQuiz(quizId, formattedAnswer);
  toast.success('Quiz submitting successfully');
  navigate(`/quizzes/${quizId}/results`);

}catch(error){
toast.error('Failed to submit quiz || error.message');
}finally{
  setSubmitting(false);
}
}

if(loading){
  return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <Spinner />
    </div>
  )
}

if(!quiz || quiz.questions.length===0){
 <div className=' flex items-center justify-center min-h-[60vh]'>
  <div className='text-center'>
    <p className='text-slate-600 text-lg'>Quiz not found or has no questions.</p>
  </div>
</div>
}

const currentQuestion = quiz.questions[currentQuestionIndex];
const isAnswered = selectedAnswer.hasOwnProperty[currentQuestion._id];
const answerCount = Object.keys(selectedAnswer).length;


  return (
     <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {answeredCount} answered
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6">

        {/* Question Number Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-white">
            Question {currentQuestionIndex + 1}
          </span>
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                className={`group relative flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                }`}
              >
                {/* Hidden Radio */}
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="hidden"
                />

                {/* Custom Radio */}
                <div
                  className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                {/* Option Text */}
                <span
                  className={`ml-4 text-sm font-medium transition-colors duration-200 
                  ${
                    isSelected
                      ? "text-emerald-900"
                      : "text-slate-700 group-hover:text-slate-900"
                  }`}
                >
                  {option}
                </span>

                {/* Check Icon */}
                {isSelected && (
                  <CheckCircle2
                    className="ml-auto w-5 h-5  text-emerald-500"
                    strokeWidth={2.5}
                  />
                )}
              </label>
            );
          })}
        </div>



{/* Navigation Buttons */}
<div className="flex items-center justify-between mt-8">

  {/* Previous */}
  <button
    onClick={handlePreviousQuestion}
    disabled={currentQuestionIndex === 0 || submitting}
    className="px-4 py-2 rounded-lg border border-slate-300 flex items-center gap-2 disabled:opacity-50"
  >
    ← Previous
  </button>

  {/* Right Side */}
  {currentQuestionIndex === quiz.questions.length - 1 ? (
    
    // ✅ Submit Button
    <button
      onClick={handleSubmitQuiz}
      disabled={submitting}
      className="px-6 py-2 rounded-lg bg-emerald-500 text-white flex items-center gap-2 disabled:opacity-50"
    >
      {submitting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <CheckCircle2 strokeWidth={2.5} />
          Submit Quiz
        </>
      )}
    </button>

  ) : (
    
    // ✅ Next Button
    <button
      onClick={handleNextQuestion}
      disabled={submitting}
      className="px-4 py-2 rounded-lg bg-slate-900 text-white flex items-center gap-2 disabled:opacity-50"
    >
      Next →
    </button>
  )}
</div>


      </div>
    </div>
  )
}

export default QuizTakePage
