import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashCardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Fetch flashcards
  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  // 🔹 Generate flashcards
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // 🔹 Next card
  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex + 1) % flashcards.length
    );
  };

  // 🔹 Previous card
  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  // 🔹 Review card
  const handleReview = async (index) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  // 🔹 Toggle star
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);

      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId
            ? { ...card, isStarred: !card.isStarred }
            : card
        )
      );

      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  // 🔹 Delete flashcard set
  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  // 🔹 Render content
  const renderFlashcardContent = () => {
    if (loading) return <Spinner />;

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards from your document to start learning."
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-md">
        <Flashcard
          flashcard={currentCard}
          onToggleStar={handleToggleStar}
        />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <span className="text-sm text-neutral-500qq">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Flashcards"
        action={
          <Button onClick={handleGenerateFlashcards} loading={generating}>
            <Plus size={16} /> Generate
          </Button>
        }
      />

      {renderFlashcardContent()}
    </div>
  );
};

export default FlashcardPage;