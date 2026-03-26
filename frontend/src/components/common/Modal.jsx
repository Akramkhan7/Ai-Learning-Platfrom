import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">

      {/* CENTER CONTAINER */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">

        {/* BACKDROP */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* MODAL BOX */}
        <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl border-border-slate-900/20 p-8 z-10 animation-in fade-in slide-in ">

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-400  hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <X className="w-5 h-5 text-slate-700" strokeWidth={2} />
          </button>

          {/* TITLE */}
          <div className="mb-5 pr-10">
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>

          {/* CONTENT */}
          <div className="text-sm text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;