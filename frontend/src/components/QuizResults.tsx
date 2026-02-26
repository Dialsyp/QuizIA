import type { FC } from "react";
import { useQuizStore } from "../zustand/quiz.store";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBack: () => void;
}

const QuizResults: FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
  onBack,
}) => {
  const getMessage = () => {
    if (score === totalQuestions) return "Parfait !";
    if (score > totalQuestions / 2) return "Bien joué !";
    return "Continuez à vous entraîner !";
  };
  const userAnswers = useQuizStore((state) => state.userAnswers);
  console.log("userAnswers dans QuizResults:", userAnswers);

  

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Terminé !
        </h2>
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-xl text-gray-600 mb-2">
          Votre score final :{" "}
          <span className="font-bold text-purple-600">
            {score} / {totalQuestions}
          </span>
        </p>
        <p className="text-gray-500">{getMessage()}</p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onRestart}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Nouveau Quiz
        </button>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
