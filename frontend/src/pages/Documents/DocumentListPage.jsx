import React from "react";
import Spinner from "../../components/common/Spinner";
import documentService from "../../services/documentService";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Plus, TurkishLira, FileText, X, Upload, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";


const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();

      setDocuments(data.data);
    } catch (err) {
      toast.error("Failed to fetch documents.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);

    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title}deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (err) {
      toast.err(err.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return <div className="text-center mt-20">No Documents Yet</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            doc={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and organize your learning materials
            </p>
          </div>

          {/* ✅ Always show the button, not just when documents exist */}
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        </div>

        {renderContent()}
      </div>


{isUploadModalOpen &&  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
<div className="p-6 w-full max-w-lg relative bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-xl shadow-slate-900/20">

  {/* Close Button */}
  <button
    onClick={() => setIsUploadModalOpen(false)}
    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
  >
    <X className="w-5 h-5" strokeWidth={2} />
  </button>

  {/* Modal Header */}
  <div className="mb-6">
    <h2 className="text-xl font-medium text-gray-900 tracking-tight">
      Upload New Document
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Add a PDF document to your library
    </p>
  </div>

  {/* Form */}
  <form onSubmit={handleUpload} className="space-y-5">

    {/* Title Input */}
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
        Document Title
      </label>
      <input
        type="text"
        value={uploadTitle}
        onChange={(e) => setUploadTitle(e.target.value)}
        required
        className="w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 font-medium text-sm transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg"
        placeholder="e.g. React Interview Prep"
      />
    </div>

    {/* File Upload Box */}
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
        PDF File
      </label>

      <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-400 hover:bg-slate-50/30 transition-all duration-200 p-6 flex flex-col items-center justify-center text-center">

        {/* Hidden Input */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          required
        />

        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-emerald-600" strokeWidth={2} />
        </div>

        {/* Text */}
        <p className="text-sm text-slate-600">
          <span className="text-emerald-600 font-medium">
            Click to upload
          </span>{" "}
          or drag and drop
        </p>

        <p className="text-xs text-slate-400 mt-1">
          PDF up to 10MB
        </p>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 pt-2">

{/* Cancel Button */}
<button
type="button"
onClick={() => setIsUploadModalOpen(false)}
disabled={uploading}
className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-100 transition"
>
Cancel
</button>

{/* Upload Button */}
<button
type="submit"
disabled={uploading}
className="flex-1 h-11 px-4 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition flex items-center justify-center"
>
{uploading ? (
  <span className="flex items-center justify-center gap-2">
    {/* Spinner */}
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    Uploading...
  </span>
) : (
  "Upload"
)}
</button>

</div>

  </form>
</div>
</div>}

{isDeleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">

    <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-6">

      {/* Close Button */}
      <button
        onClick={() => setIsDeleteModalOpen(false)}
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
      >
        <X className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Modal Header */}
      <div className="mb-6">

        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-600" strokeWidth={2} />
        </div>

        <h2 className="text-xl font-medium text-slate-900 tracking-tight">
          Confirm Deletion
        </h2>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-600 mb-6">
        Are you sure you want to delete the document:{" "}
        <span className="font-semibold text-slate-900">
          {selectedDoc?.title}
        </span>
        ? This action cannot be undone.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 ">

        {/* Cancel */}
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(false)}
          disabled={deleting}
          className="flex-1 h-11 px-4 border-2 border-slate-200  bg-white rounded-xl text-slate-700  text-sm font-semibold tracking-wide hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
        >
          Cancel
        </button>

        {/* Delete */}
        <button
          onClick={handleConfirmDelete}
          disabled={deleting}
          className="flex-1 h-11 px-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed  active:scale-[0.50]"
        >
          {deleting ? (
            <span className="flex items-center justify-center gap-2 ">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
};

export default DocumentListPage;
