import React from 'react'
import { useState, useEffect } from 'react'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from "../../components/common/EmptyState"
import flashCardService from "../../services/flashCardService";


const FlashCardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchFlashcardSets = async() =>{
      try{
        const res = await flashCardService.getAllFlashcardSets();

        console.log("fetchFlashcard---",res.data[0]);
        setFlashcardSets(res)
      }catch(error){
        toast.error("Failed to fetch flashcard s")
      }finally{
        setLoading(false);
      }
    }

    fetchFlashcardSets();
  },[])

  const renderContent = () =>{
    if(loading){
      return <Spinner />
    }

    if(flashcardSets.length === 0){
      return(
        <EmptyState
        title='No Flashcard sets Found'
        description='You have not generated any flashcards yet. go to document to create your first set.'
        />
      )

return ( 
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
  {flashcardSets.map((set)=>(
    <FlashcardSetCard  key={set._id} flashcardSet={set}/>
  ))}
  </div>
)
    }
  };


  return (
    <div>
      <PageHeader title='All Flashcard Sets'/>
      {renderContent()};
    </div>
  )
}

export default FlashCardsListPage
