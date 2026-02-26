import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import QuizPlayer from "../components/QuizPlayer";
import QuizResults from "../components/QuizResults";
import { useAuthStore } from "../zustand/auth.store";
import { useQuizStore } from "../zustand/quiz.store";

const QuizPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const Quiz = useQuizStore((state) => state.Quiz);
  const currentQuestionIndex = useQuizStore(
    (state) => state.currentQuestionIndex,
  );
  const score = useQuizStore((state) => state.score);
  const addAnswer = useQuizStore((state) => state.addAnswer);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const quizCompleted = useQuizStore((state) => state.quizCompleted);
  const setQuizCompleted = useQuizStore((state) => state.setQuizCompleted);
  
  const navigate = useNavigate();

  // ✅ Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (!Quiz) return null;
  const handleAnswer = (selectedAnswer: string) => {
    const currentQuestion = Quiz.questions[currentQuestionIndex];

    addAnswer(currentQuestion.question, selectedAnswer);

    if (currentQuestionIndex < Quiz.questions.length - 1) {
      nextQuestion();
    } else {
      setQuizCompleted(true);
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    window.location.href = `http://localhost:${import.meta.env.VITE_PORT}/logout/google`;
  };

  if (!user || Quiz.questions.length === 0) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <Header user={user.FirstName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizCompleted ? (
          <QuizPlayer
            questions={Quiz.questions}
            currentQuestion={currentQuestionIndex}
            onAnswer={handleAnswer}
          />
        ) : (
          <QuizResults
            score={score}
            totalQuestions={Quiz.questions.length}
            onRestart={resetQuiz}
            onBack={goBack}
          />
        )}
      </main>
    </div>
  );
};

export default QuizPage;
