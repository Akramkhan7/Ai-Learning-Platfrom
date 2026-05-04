import FlashCard from "../models/FlashCard.js";

//get all cards for docs
//GET/api/:documentId
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await FlashCard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (err) {
    next(err);
  }
};

//get all cards for user
//GET/api/flashcards
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    console.log("entered");
    const flashcardSets = await FlashCard.find({
      userId: req.user._id,
    })

      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (err) {
    next(err);
  }
};

//marked cards for reviewed
//POST/api/flashcards/:cardId/review
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await FlashCard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(400).json({
        success: false,
        message: "flashcard set or card not found",
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId,
    );

    if (cardIndex === -1) {
      return res.status(400).json({
        success: true,
        message: "Card not found in set",
      });
    }

    //update review info

    flashcardSet.cards[cardIndex].lastReviwed = new Date();
    flashcardSet.cards[cardIndex].reviewCount += 1;
    await flashcardSet.save();

    res.status(200).json({
      success: true,
      message: "Flashcard reviewed successfully",
    });
  } catch (err) {
    next(err);
  }
};

//toggle stat fav on card
//PUT/api/flashcards/:cardId/star
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    console.log("params:", req.params);
    console.log("query:", req.query);

    const cardIndex = parseInt(req.query.cardIndex);
    const { cardId } = req.params;

    const flashcardSet = await FlashCard.findOne({
      _id: cardId,
      userId: req.user._id,
    });

    console.log("flashcardSet:", flashcardSet); // ← does this print?

    if (!flashcardSet) {
      return res.status(400).json({ success: false, message: "Flashcard set not found" });
    }

    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= flashcardSet.cards.length) {
      return res.status(400).json({ success: false, message: "Invalid card index" });
    }

    flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
    await flashcardSet.save();

    return res.status(200).json({ success: true, message: "Star toggled successfully" });
  } catch (err) {
    next(err);
  }
};

//delete flashcard set
//DELETE/api/flashcards/:id
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await FlashCard.findOne({
      _id: req.params._id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(400).json({
        success: false,
        message: "Flashcard set not found",
      });
    }
    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
