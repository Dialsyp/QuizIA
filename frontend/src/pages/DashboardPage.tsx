import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import QuizGenerator from "../components/QuizGenerator";
import { useAuthStore } from "../zustand/auth.store";
import axiosInstanceSecure from "../axios/config";
import type { QuizResponse } from "../types/question.type";
import { useQuizStore } from "../zustand/quiz.store";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const SetQuiz = useQuizStore((state) => state.setQuiz);

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
  if (!user) {
    navigate("/");
  }
}, [user, navigate]);

  // ✅ Quiz generation
  const generateQuiz = async (
    level: string,
    quizType: string,
    language: string,
  ) => {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const response = await axiosInstanceSecure.post("/api/generateQuiz", {
        topic,
        level,
        quiz_type: [quizType],
        language,
      });

      const data = response.data;

      if (data) {
        const questions: QuizResponse = data;
        SetQuiz(questions);
        navigate("/quiz");
      }
    } catch (err) {
      console.error("Quiz generation error", err);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    logout();

    window.location.href = `${import.meta.env.VITE_URL_BACKEND}/logout/google`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <Header user={user.FirstName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <QuizGenerator
          topic={topic}
          setTopic={setTopic}
          loading={loading}
          onGenerate={generateQuiz}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
