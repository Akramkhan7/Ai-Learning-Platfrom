import React from 'react'
import { useState } from 'react'

const FlashCard = ({flashcard, onToggleStar}) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const handleFlip = () =>{
        setIsFlipped(!isFlipped);
    }
  return (
    <div>
      
    </div>
  )
}

export default FlashCard
