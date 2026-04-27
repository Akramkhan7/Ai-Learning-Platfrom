import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, data } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import documentService from "../../services/documentService";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AiActions from "../../components/ai/AiActions";
import FlashCard from "../../components/flashcards/Flashcard";
import FlashcardManager from "../../components/flashcards/FlashcardManger";

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState([]);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    const fetchDOc = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
        console.log(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDOc();
  }, [id]);

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    // If already full URL
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (!document || !document.data || !document.data.filePath) {
      return <div className="">PDF file not found!</div>;
    }
    const pdfUrl = getPdfUrl();

    return (
      <div className="">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-slate-900">Document Viewer</span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-emerald-600 hover:underline"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        <div className="">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh] rounded-lg border"
            title="PDF Viewer"
            frameBorder="0"
            style={{
              colorScheme: "light",
            }}
          ></iframe>
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />
  };

  const renderAiActions = () => {
    return <AiActions />
  };

  const renderFlashCardsTabs = () => {
    return <FlashcardManager documentId={id}/>
  };

  const renderQuizzesTabs = () => {
    return <QuizManager documentId={id} />
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "Ai Action", content: renderAiActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashCardsTabs() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTabs() },
  ];

  if (loading) {
    return <Spinner />;
  }
  if (!document || !document.data || !document.data.filePath) {
    return <div className="">Document not found!</div>;
  }

  return (
    <div className="">
      <div className="mb-4">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      <PageHeader title={document.data.title} />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
};

export default DocumentDetailsPage;
