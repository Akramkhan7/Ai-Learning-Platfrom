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

router.get('/', getAllFlashcardSets);
router.get('/document/:documentId', getFlashcards); // ✅ specific routes FIRST
router.post('/:cardId/review', reviewFlashcard);     // ✅ POST to match service
router.patch('/:cardId/star', toggleStarFlashcard);  // ✅ PATCH, not GET
router.delete('/:id', deleteFlashcardSet);

export default router;

