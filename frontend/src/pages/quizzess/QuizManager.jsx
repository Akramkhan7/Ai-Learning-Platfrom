import { useState, useEffect } from "react"
import React from "react"
import { Plus, Trash } from "lucide-react"
import toast from "react-hot-toast";

import quizeService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button"
import Modal from "../../components/common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../../components/common/EmptyState";


const QuizManager = ({documentId}) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
    const [numQuestion, setNumQuestion] = useState(5);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);


    const fetchQuizzes = () =>{
        setLoading(true);
        try{
            const data = await quizeService.getQuizzesForDocument(documentId)
            setQuizzes(data.data)
        }catch(error){
            toast.error('Failed to fetch quizzes');
            console.log(error);
        }finally{
            setLoading(true);
        }
    }

    useEffect(()=>{
        if(documentId){
            fetchQuizzes();
        }
    },[documentId])

    const handleGeneratedQuiz =async(e)=>{
        e.preventDefault();
        setGenerating(true);
        try{
            await aiService.generateQuiz(documentId, {numQuestion });
            toast.success("Quiz generated successfully");
            setIsGeneratingModalOpen(false);
            fetchQuizzes();

        }catch(error){
            toast.error(error.message || "Failed to generate quiz");
        }finally{
            setGenerating(false);
        }
    }

    const handleDeletingRequest = (quiz) =>{
        setSelectedQuiz(quiz);
        setIsDeleteModalOpen(true);
    }


    const handleConfirmDelete = () =>{

    }

    const renderQuizContent = () =>{

        if(loading){
            return <Spinner />
        }

        if(quizzes.length === 0){
             return (
                <EmptyState 
                title="No Quiz yet."
                description="Generate a quiz from document to taste your test your knowledge"
                />
             );
        }

        return(
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {quizzes.map((quiz) =>(
                    <QuizCard  key={quiz._id} quiz={quiz} onDelete={handleDeletingRequest}/>
                ))}
            </div>
        )
       
    }
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={()=>setIsGeneratingModalOpen(true)}>
            <Plus size={16}/>
            Generate Quiz
        </Button>
      </div>

    {renderQuizContent()}

    </div>


    
  )
}

export default QuizManager
