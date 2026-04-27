import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Brain,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import flashcardService from "../../services/flashCardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import FlashCard from "../../components/flashcards/Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currCardIndex, setCurrCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardsSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcard generated successfully.");
      fetchFlashcardsSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currCardIndex);
      setCurrCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
    }
  };

  const handlePreviousCard = () => {
    if (selectedSet) {
      handleReview(currCardIndex);
      setCurrCardIndex(
        (prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[index];
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed successfully");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  const handleToggleStar = async(cardId) => {
    try{
      await flashCardService.toggleStar(cardId);
      const updateSets = flashcardSets.map((set)=>{
        if(set._id === selectedSet._id){
          const updatedCards = set.cards.map((card)=>
            card._id === cardId ? {...card , isStarred :!card.isStarred } : card 
          )
          return {...set,  cards : updatedCards}
        }
        return set;
      });
      setFlashcardSets(updateSets);
      setSelectedSet(updatedCards.find((set)=> set._id === selectedSet._id));
      toast.success("Flashcard starred status successfully");
    }catch(error){
      toast.error("Failed to update star status")
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted.");
      setFlashcardSets((prev) => prev.filter((s) => s._id !== setToDelete._id));
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
    } catch (error) {
      toast.error("Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrCardIndex(0);
  };

  // FIX: was returning a plain string
  const renderFlashcardViewer = () => {
    if (!selectedSet) return null;
    const currentCard = selectedSet.cards[currCardIndex];

    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSet(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to sets
          </button>
          <span className="text-sm font-medium text-slate-400">
            {currCardIndex + 1} / {selectedSet.cards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
            style={{
              width: `${((currCardIndex + 1) / selectedSet.cards.length) * 100}%`,
            }}
          />
        </div>

        {/* Card */}
        <div className="min-h-[260px] flex items-center justify-center">
          <FlashCard card={currentCard} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousCard}
            disabled={selectedSet.cards.length <= 1}
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>

          <span className="text-sm font-semibold text-slate-500 tabular-nums w-20 text-center">
            Card {currCardIndex + 1}
          </span>

          <button
            onClick={handleNextCard}
            disabled={selectedSet.cards.length <= 1}
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        // FIX: h3, p, and button were incorrectly nested inside the icon div
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
            <Brain className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {generating ? (
              <>
                {/* FIX: was "animation-spin" — corrected to "animate-spin" */}
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {/* List header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"} available
            </p>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-4 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {generating ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              // FIX: was onClick={()=>handleSelectSet} — missing (set) argument
              onClick={() => handleSelectSet(set)}
              className="relative group flex items-center gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/8 cursor-pointer transition-all duration-200 active:scale-[0.99]"
            >
              {/* Delete button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* Icon */}
              <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-100">
                <Brain className="w-6 h-6 text-emerald-600" strokeWidth={2} />
              </div>

              {/* Info */}
              <div className="flex flex-col min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 truncate">
                  Flashcard Set
                </h4>
                {/* FIX: moment().format() takes one argument — was passing two */}
                <p className="text-xs text-slate-400 mt-0.5">
                  Created {moment(set.createdAt).format("MMM D, YYYY")}
                </p>
              </div>

              {/* Card count badge */}
              <div className="ml-auto pr-8 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                  {set.cards.length}{" "}
                  {set.cards.length === 1 ? "card" : "cards"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSetToDelete(null);
        }}
        title="Delete Flashcard Set"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSetToDelete(null);
              }}
              className="px-4 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {deleting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                  Delete Set
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;