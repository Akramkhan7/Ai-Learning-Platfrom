import React from 'react'
import {star, RotateCcw} from "lucide-react"

const FlashCard = ({flashcard, ogToggleStar}) => {
  const [isFlipped, setIsFlliped] = useState(false);

  const handleFlip = () = {
    setIsFlliped(!isFlipped)
  }
  return (
    <div className="" style={{perspective : '1000px'}}>
  
    </div>
  )
}

export default FlashCard
