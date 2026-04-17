import express from 'express';
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,

} from '../controller/aiController.js'

import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);


router.post('/generate-flashcards',generateFlashcards)
router.post('/generate-quiz',generateQuiz)
router.post('/generate-summary',generateSummary)
router.post('/explain-concept',explainConcept)
router.post('/get-chat-history', getChatHistory)
router.post("/chat", chat);

export default router;