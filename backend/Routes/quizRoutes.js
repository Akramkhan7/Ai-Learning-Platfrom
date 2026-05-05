import express from 'express';
import {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
} from '../controller/quizController.js'
import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/document/:documentId', getQuizzes); // ← distinct path
router.get('/:id/results', getQuizResults);
router.post('/:id/submit', submitQuiz);
router.get('/:id', getQuizById);
router.delete('/:id', deleteQuiz);

export default router;
