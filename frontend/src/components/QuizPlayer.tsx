import type { FC } from 'react'
import type { QuestionResponse} from '../types/question.type'



interface QuizPlayerProps {
  questions: QuestionResponse[]
  currentQuestion: number

  onAnswer: (answer: string) => void
}

const QuizPlayer: FC<QuizPlayerProps> = ({ questions, currentQuestion, onAnswer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">
            Question {currentQuestion + 1} sur {questions.length}
          </span>
        
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {questions[currentQuestion].question}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizPlayer