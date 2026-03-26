import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const AiActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [concept, setConcept] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)
const [modalTitle, setModalTitle] = useState("");
const [modalContent, setModalContent] = useState("");

  // ================= SUMMARY =================
  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.GenerateModalSummary(documentId);
      toast.success("Summary Generated");
      console.log(summary);
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setLoadingAction(null);
    }
  };

  // ================= EXPLAIN =================
  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept");
      return;
    }

    setLoadingAction("explain");

    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept,
      );
      toast.success("Explanation Ready");
      console.log(explanation);
      setConcept("");
    } catch (err) {
      toast.error("Failed to explain concept");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5">
        <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  p-2 bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25 flex items-center  justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-600">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        <div className=" p-6 space-y-6">
          {/* ================= GENERATE SUMMARY ================= */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 hover:shadow-300/60 hover-shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <BookOpen
                      className="w-4 h-4 text-blue-600"
                      strokeWidth={2}
                    />
                  </div>

                  <h4 className="font-semibold text-slate-900">
                    Generate Summary
                  </h4>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Get a concise summary of the entire document.
                </p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 h-10 px-5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-600 hover:to-teal-600 text-white rounded-xl  text-sm font-semibold transition-all duration-200 shadow-lg shadow:blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* ================= EXPLAIN CONCEPT ================= */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200">
            <form onSubmit={handleExplainConcept}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-omber-100 to -orange-100 flex items-center justify-center">
                  <Lightbulb
                    className="w-4 h-4 text-amber-600"
                    strokeWidth={2}
                  />
                </div>

                <h4 className="font-semibold text-slate-900">
                  Explain a Concept
                </h4>
              </div>

              <p className="text-sm text-slate-600 mb-3">
                Enter a topic or concept from the document to get a detailed
                explanation.
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g., 'React Hooks'"
                  className="flex-1 h-11 px-4  border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200  focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg  focus:shadow-purple-100"
                  disabled={loadingAction === "explain"}
                />

                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className="shrink-0 h-11 px-5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-600 hover:to-emerald-600 text-sm text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow:purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loadingAction === "explain" ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={modalTitle}
>
  <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate whitespace-pre-wrap">
    {modalContent}
  </div>
</Modal>
    </div>
  );
};

export default AiActions;
