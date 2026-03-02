import express from 'express';
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet,
} from '../controller/flashCardController.js';
import protect from '../middleware/auth.js'

const router = express.Router();
router.use(protect);

router.get('/',getAllFlashcardSets);
router.get('/:documentId',getFlashcards);
router.get('/:cardId/review',reviewFlashcard);
router.get('/:cardId/star',toggleStarFlashcard);
router.get('/:id',deleteFlashcardSet);

export default router;

