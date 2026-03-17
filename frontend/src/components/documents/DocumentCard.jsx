import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ doc, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${doc._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(doc);
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
      onClick={handleNavigate}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-12 h-12 p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-500 transition"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold text-slate-900 mb-3 line-clamp-2"
        title={doc.title}
      >
        {doc.title}
      </h3>

      {/* Document Info */}
      <div className="text-sm text-slate-500 mb-4">
        {doc.fileSize !== undefined && (
          <span>{formatFileSize(doc.fileSize)}</span>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex items-center gap-3">
        {doc.flashcardCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
            <span className="text-xs font-semibold text-purple-700">
              {doc.flashcardCount} Flashcards
            </span>
          </div>
        )}

        {doc.quizCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg">
            <BrainCircuit
              className="w-3.5 h-3.5 text-emerald-600"
              strokeWidth={2}
            />
            <span className="text-xs font-semibold text-emerald-700">
              {doc.quizCount} Quizzes
            </span>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex items-center text-xs text-slate-400 mt-4">
        <Clock className="w-4 h-4 mr-1" strokeWidth={2} />
        <span>Uploaded {moment(doc.createdAt).fromNow()}</span>
      </div>
    </div>
  );
};

export default DocumentCard;