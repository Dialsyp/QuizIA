import type { FC } from "react";
import { useState } from "react";

interface QuizGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  loading: boolean;
  onGenerate: (level: string, quizType: string, language: string) => void;
}
const quizTypes = [
  { label: "QCM", value: "qcm" },
  { label: "Choix unique", value: "single_choice" },
  { label: "Vrai / Faux", value: "true_false" },
  // { label: "Texte libre", value: "text" },
  // { label: "Sélection multiple", value: "multiple_select" },
  // { label: "Association", value: "matching" },
  // { label: "Ordre logique", value: "ordering" },
  // { label: "Texte à trou", value: "fill_blank" },
  // { label: "Scénario métier", value: "scenario" },
  // { label: "Question Code", value: "code_question" },
];
const QuizGenerator: FC<QuizGeneratorProps> = ({
  topic,
  setTopic,
  loading,
  onGenerate,
}) => {
  const [level, setLevel] = useState("beginner");
  const [quizType, setQuizType] = useState(["qcm"]);

  const handleGenerate = () => {
    onGenerate(level, quizType.join(","), "francais");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Générer un Quiz
        </h2>

        <p className="text-gray-500">Créez un quiz personnalisé avec l'IA</p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Topic Input */}
        <div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Go Programming, Histoire, Maths..."
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Level Select */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Niveau</label>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </div>

        <div>
          <label className="block mb-3 font-medium text-gray-700">
            Type de Quiz
          </label>

          <div className="grid grid-cols-2 gap-3">
            {quizTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-purple-50"
              >
                <input
                  type="checkbox"
                  checked={quizType.includes(type.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQuizType([...quizType, type.value]);
                    } else {
                      setQuizType(quizType.filter((t) => t !== type.value));
                    }
                  }}
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? "Génération en cours..." : "Générer le Quiz 🚀"}
        </button>
      </div>
    </div>
  );
};

export default QuizGenerator;
