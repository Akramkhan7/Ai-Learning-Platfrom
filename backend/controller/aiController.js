import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";


// Generate Flashcards
// POST /api/ai/generate-flashcards
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a documentId",
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

    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count)
    );

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


// Generate Quiz
// POST /api/ai/generate-quiz
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

    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestion)
    );

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
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


// Generate Summary
// POST /api/ai/generate-summary
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

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
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
      });
    }

    const summary = await geminiService.generateSummary(
      document.extractedText
    );

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


// Chat with Document
// POST /api/ai/chat
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        message: "Please provide documentId and question",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map((c) => c.chunkIndex);

    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        message: [],
      });
    }

    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks
    );

    chatHistory.message.push(
      {
        role: "user",
        content: question,
        timestamp: new Date(),
        relevantChunks: [],
      },
      {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices,
      }
    );

    await chatHistory.save();

    res.status(201).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id,
      },
      message: "Response generated successfully",
    });
  } catch (err) {
    next(err);
  }
};


// Explain Concept
// POST /api/ai/explain-concept
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        message: "Please provide documentId and concept",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
      });
    }

    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    const context = relevantChunks.map((c) => c.content).join("\n\n");

    const explanation = await geminiService.explainConcept(
      concept,
      context
    );

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map((c) => c.chunkIndex),
      },
      message: "Explanation generated successfully",
    });
  } catch (err) {
    next(err);
  }
};


// Get Chat History
// POST /api/ai/chat-history
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide documentId",
      });
    }

    const chatHistory = await ChatHistory.findOne({
      documentId: documentId,
      userId: req.user._id,
    }).select("message");

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No chat history for this document",
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory.message,
      message: "Chat retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};