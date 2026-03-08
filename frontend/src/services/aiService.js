import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import axios from "axios";

const generateFlashcards = async (documentId, options) =>{
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_FLASHCARDS,
      { documentId, ...options },
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to generate flashcards" };
  }
};


const generateQuiz = async (documentId, options) =>{
    try{
        const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_QUIZ,
      { documentId, ...options },
    );
     return response.data;
    }catch(err){
    throw err.response?.data || { message: "Failed to generate flashcards" };

    }
}

const generateSummary = async (documentId) =>{
    try{
        const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_SUMMARY,
      { documentId },
    );
     return response.data;
    }catch(err){
    throw err.response?.data || { message: "Failed to generate flashcards" };

    }
}

const chat = async (documentId, message) =>{
    try{
        const response = await axiosInstance.post(
      API_PATHS.AI.CHAT,
      { documentId ,question : message},
    );
     return response.data;
    }catch(err){
    throw err.response?.data || { message: "Failed to generate flashcards" };

    }
}

const explainConcept = async (documentId, concept) =>{
try{
        const response = await axiosInstance.post(
      API_PATHS.AI.EXPLAIN_CONCEPT,
      { documentId ,concept},
    );
     return response.data;
    }catch(err){
    throw err.response?.data || { message: "Failed to generate flashcards" };

    } 
}


const getChatHistory = async (documentId) =>{
try{
        const response = await axiosInstance.post(
      API_PATHS.AI.GET_CHAT_HISTORY,
      { documentId ,concept},
    );
     return response.data;
    }catch(err){
    throw err.response?.data || { message: "Failed to generate flashcards" };

    } 
}


const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
}

export default aiService;