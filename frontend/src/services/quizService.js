import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const getQuizzesForDocument = async (documentId) => {
  try {
    const res = await axiosInstance.post(
      API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch quiz" };
  }
};

const getQuizById = async (quizId) => {
  try {
    const res = await axiosInstance.post(
      API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch quiz" };
  }
};

const submitQuiz = async (quizId, answer) => {
  try {
    const res = await axiosInstance.post(
      API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId),
      { answer }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to submit quiz" };
  }
};

const getQuizResult = async (quizId) => {
  try {
    const res = await axiosInstance.post(
      API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId)
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch quiz results" };
  }
};

const quizService = {
  getQuizzesForDocument,
  getQuizById,
  submitQuiz,
  getQuizResult,
};

export default quizService;