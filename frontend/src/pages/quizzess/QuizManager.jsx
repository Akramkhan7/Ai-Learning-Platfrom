import { useState, useEffect } from "react"
import React from "react"
import { Plus, Trash } from "lucide-react"
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
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


    const fetchQuizzes = async() =>{
        setLoading(true);
        try{
            const data = await quizService.getQuizzesForDocument(documentId)
            setQuizzes(data)
        }catch(error){
            toast.error('Failed to fetch quizzes1');
            console.log(error);
        }finally{
            setLoading(false);
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


    const handleConfirmDelete = async() =>{
        if(!selectedQuiz) return;
        setDeleting(true);

        try{
            await quizService.deleteQuiz(selectedQuiz._id);
            toast.success(`'${selectedQuiz.title || 'Quiz '}' deleted.`);
            setIsDeleteModalOpen(false);
            setQuizzes(quizzes.filter((q)=> q._id !== selectedQuiz._id))
        }catch(error){
             toast.error("Failed to delete flashcard set.");
        }finally{
            setDeleting(false)
        }

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


{/* Generate Quiz */}
<Modal
  isOpen={isGeneratingModalOpen}
  onClose={() => setIsGeneratingModalOpen(false)}
  title="Generate New Quiz"
>
  <form onSubmit={handleGeneratedQuiz} className="space-y-4">
    <div>
      <label className="block text-xs font-medium text-neutral-700 mb-1.5">
        Number of Questions
      </label>

      <input
        type="number"
        value={numQuestion}
        onChange={(e) =>
          setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
        }
        min="1"
        required
        className="w-full h-9 px-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent  "
      />
    </div>

    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="secondary"
       onClick={() => setIsGeneratingModalOpen(false)}
        disabled={generating}
      >
        Cancel
      </Button>

      <Button type="submit" disabled={generating}>
        {generating ? "Generating..." : "Generate"}
      </Button>
    </div>
  </form>
</Modal>


{/* Delete Confirmation */}
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Confirm Delete Quiz"
>
  <div className="space-y-4">
    <p className="text-sm text-neutral-600">
      Are you sure you want to delete the quiz:{" "}
      <span className="font-semibold">
        {selectedQuiz?.title}
      </span>
      ?
    </p>

    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsDeleteModalOpen(false)}
        disabled={deleting}
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={handleConfirmDelete}
        disabled={deleting}
        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white"
      >
        {deleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  </div>
</Modal>

    </div>


    
  )
}

export default QuizManager
