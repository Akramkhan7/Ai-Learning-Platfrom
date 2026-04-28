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
  const fetchQuiz = () =>{
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
  return (
    <div>
      
    </div>
  )
}

export default QuizTakePage
