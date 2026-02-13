import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardListPage from "./pages/Dashboard/Dashboard";
import DocumentDetailsPage from "./pages/Documents/DocumentDetailsPage"
import FlashCardsListPage from "./pages/Flashcards/FlashCardsListPage"
import FlashCard from "./pages/Flashcards/FlashCard"
import QuizTakePage from "./pages/Quizzes/QuizTakePage"
import QuizResultPage from "./pages/Quizzes/QuizResultPage"
import ProfilePage from "./pages/Profile/ProfilePage"

function App() {
  const loading = false;
  const isAuthenticated = false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<DashboardListPage />} />
        <Route path="/documents/:id" element={<DocumentDetailsPage />} />
        <Route path="/flashcards" element={<FlashCardsListPage />} />
        <Route path="/documents/:id/flashcards" element={<FlashCard />} />
        <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
        <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
