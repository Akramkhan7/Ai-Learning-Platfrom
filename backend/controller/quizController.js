import Quiz from "../models/Quiz";
import Document from "../models/Document";

//get all quiz for a document
//GET/api/quizzes/:documentId
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      userId: user._id,
      documentId: documentId,
    }).populate("documentId", "title filename");
    sort({ createdAt: -1 });

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
      _id: req.params._id,
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
    const { answers } = req.body;
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
        success: "Quiz not found",
      });
    }

    if (quiz.CompletedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz already completed",
      });
    }

    let correctCount = 0;
    const userAnswers = [];

    answers.forEach((answer) => {
      const { questionIndex, selectAnswer } = answer;

      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex];
        const isCorrect = selectAnswer === question.correctAnswer;

        if (isCorrect) correctCount++;

        userAnswers.push({
          questionIndex,
          selectAnswer,
          isCorrect,
          createdAt: new Date(),
        });

        //calculate score
        const score = Math.round(correctCount / quiz.totalQuestions) * 100;

        //Update quiz
        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

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
      }
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
      _id: req.params._id,
      userId: req.user._id,
    })
    .populate('documentId', 'title');

    if(!quiz){
        return res.status(400).json({
            success : false,
            message : 'Quiz not found',
        })
    }

    if(!quiz.completedAt){
        return res.status(400).json({
            success : false,
            message : 'Quiz is not completed yet',
        })
    }

    const detailedResults = quiz.questions.map((question, index) =>{
        const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

        return {
            questionIndex : index,
            question : question.question,
            options : question.options,
            correctAnswer : question.correctAnswer,
            selectAnswer : userAnswer?.selectedAnswer || null,
            isCorrect : userAnswer?.isCorrect || null,
            explanation : question.explanation,

        }
    });

    res.status(200).json({
        success : true,
        data : {
            quiz :{
                id : quiz._id,
                title : quiz.title,
                document : quiz.documentId,
                score : quiz.score,
                totalQuestions : quiz.totalQuestions,
                completedAt : quiz.completedAt,
            },
            results : detailedResults,
        }
    })

  } catch (err) {
    next(err);
  }
};

//get a quiz by ID
//POST/api/quizzes/:id
export const deleteQuiz = async (req, res, next) => {
  try {
      const quiz = await Quiz.findOne({
      _id: req.params._id,
      userId: req.user._id,
    })
    .populate('documentId', 'title');

    if(!quiz){
        return res.status(400).json({
            success : false,
            message : 'Quiz not found',
        })
    }

    await quiz.deleteOne();
    res.status(200).json({
        success : true,
        message : 'Quiz deleted successfully',
    })
  } catch (err) {
    next(err);
  }
};
