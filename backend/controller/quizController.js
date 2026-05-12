import Quiz from "../models/Quiz.js";
import Document from "../models/Document.js";

//get all quiz for a document
//GET/api/quizzes/:documentId
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
  userId: req.user._id,
  documentId: req.params.documentId,
}).populate("documentId", "title filename")
  .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (err) {
    next(err);
  }
};

//get a quiz by ID
//GET/api/quizzes/quiz/:id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    next(err);
  }
};

//get a quiz by ID
//POST/api/quizzes/:id/submit
export const submitQuiz = async (req, res, next) => {
  try {
    const answers = req.body.answers || req.body.answer;
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Please provide answer array",
      });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz already completed",
      });
    }

    let correctCount = 0;
    const userAnswers = [];

    answers.forEach((answer) => {
      const questionIndex = Number(answer.questionIndex);
      const selectAnswer = answer.selectAnswer ?? answer.selectedAnswer;

      console.log("Processing answer:", { questionIndex, selectAnswer });
      console.log("Question:", quiz.questions[questionIndex]);

      if (
        Number.isInteger(questionIndex) &&
        questionIndex >= 0 &&
        questionIndex < quiz.questions.length &&
        typeof selectAnswer !== "undefined"
      ) {
        const question = quiz.questions[questionIndex];
        const selectedOptionIndex = Number(selectAnswer);
        
        console.log("Selected Option Index:", selectedOptionIndex);
        console.log("Options:", question.options);
        console.log("Correct Answer:", question.correctAnswer);

        if (
          Number.isInteger(selectedOptionIndex) &&
          selectedOptionIndex >= 0 &&
          selectedOptionIndex < question.options.length
        ) {
          const selectedOptionText = question.options[selectedOptionIndex]?.trim();
          const correctAnswerText = question.correctAnswer?.trim();
          const isCorrect = selectedOptionText === correctAnswerText;

          console.log(
            `Comparing "${selectedOptionText}" with "${correctAnswerText}" = ${isCorrect}`
          );

          if (isCorrect) correctCount++;

          userAnswers.push({
            questionIndex,
            selectedAnswer: Number(selectAnswer),
            isCorrect,
            answeredAt: new Date(),
          });
        } else {
          console.log("Invalid option index:", selectedOptionIndex);
        }
      }
    });

    if (userAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid answers provided",
      });
    }

    //calculate score
    const score = Math.round((correctCount / quiz.totalQuestions) * 100);

    //Update quiz
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();
    await quiz.save();

    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: score,
        userAnswers,
      },
      message: "Quiz submitted successfully",
    });
  } catch (err) {
    next(err);
  }
};

//get a quiz by ID
//GET/api/quizzes/:id/results
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("documentId", "title");

    if (!quiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz is not completed yet",
      });
    }

    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        (a) => a.questionIndex === index,
      );

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || null,
        explanation: question.explanation,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt,
        },
        results: detailedResults,
      },
    });
  } catch (err) {
    next(err);
  }
};

//get a quiz by ID
//POST/api/quizzes/:id
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("documentId", "title");

    if (!quiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz not found",
      });
    }

    await quiz.deleteOne();
    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
