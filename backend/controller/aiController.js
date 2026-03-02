import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

//generate flashcards for document
//POST/api/ai/generate-flashcards

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;
    if (!document)
      return res.status(400).json({
        success: false,
        message: "Please provide a documentId",
      });

    const document = await Document.findOne({
      _id: documentId,
      userId: req_user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(400).json({
        success: false,
        success: "Document not found or not ready",
      });
    }

    //generate flashcards using geminiServices
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count),
    );

    //save to db;

    const flashcardSet = await FlashCard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });

    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: "Flashcards generated successfully",
    });
  } catch (err) {
    next(err);
  }
};

//generate quiz for document
//POST/api/ai/generate-quiz

export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestion = 5, title } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide documentId",
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(400).json({
        success: false,
        message: "Document not found or not ready",
      });
    }

    //generate quiz using gemini
    const questions = geminiService.generateQuiz(
      document.extractedFile,
      parseInt(numQuestion),
    );

    //save to db
    const quiz = Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: document.length,
      userAnswers: [],
      score: 0,
    });

    res.status(201).json({
      success: true,
      message: "Quiz generated successfully",
      data: quiz,
    });
  } catch (err) {
    next(err);
  }
};

//generate document summary
//POST/api/ai/generate-summary
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Please prove DocumentId",
      });
    }

    const document = Document.findOne({
      documentId: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
      });
    }

    //generate summary using gemini
    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(201).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary,
      },
      message: "Summary generated successfully",
    });
  } catch (err) {
    next(err);
  }
};

//get chat
//POST/api/ai/chat
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;
    if (!documentId || !question) {
      return res.status(404).json({
        success: false,
        message: "Please prove documentId and question",
      });
    }

    const document = await Document.findOne({
        _id : documentId,
        userId : req.user._id,
        status : 'ready'
    })

    if(!document){
        return res.status(404).json({
            success : false,
            message : 'Document not found or not ready'
        })
    }

    //find relevant chunks
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    //get or create chat history
    let chatHistory = await 
  } catch (err) {
    next(err);
  }
};

//explain concept for document
//POST/api/ai/explain-concept
export const explainConcept = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

//get chat history for a document
//POST/api/ai/chat-history
export const getChatHistory = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
