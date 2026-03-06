import FlashCard from '../models/FlashCard';
import Quiz from '../models/Quiz';
import Document from '../models/Document';

//get user leaning statistics
//GET/api/progress/dashboard

export const getDashboard = async(req, res, next) =>{
    try{

        const userId = req.user._id;

        //get all counts
        const totalDocuments = await Document.countDocuments({userId});
        const totalFlashcardSets = await FlashCard.countDocuments({userId});
        const totalQuizzes = await Quiz.countDocuments({userId});
        const completeQuizzes = await Quiz.countDocuments({userId, completedAt : {$ne : null}});

         //get flashcard statistics
         const flashcardSets = await FlashCard.find({userId});
         let totalFlashcards = 0;
         let reviewedFlashcards= 0;
         let starredFlashcards = 0;


         flashcardSets.forEach(set =>{
            totalFlashcards += set.cards.length;
         })

         //get quiz statistics

         const quizzes = await Quiz({userId, completedAt})

    }catch(err){

    }
}
