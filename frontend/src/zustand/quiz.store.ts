import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CorrectionResponse, QuizResponse } from "../types/question.type";
import axiosInstanceSecure from "../axios/config";

interface QuizState {
  Quiz: QuizResponse | null;
  currentQuestionIndex: number;
  score: number;
  userAnswers: Record<string, string>;
  quizCompleted: boolean;

  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
  setQuiz: (quiz: QuizResponse | null) => void;
  addAnswer: (question: string, answer: string) => void;
  setQuizCompleted: (completed: boolean) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      Quiz: null,
      currentQuestionIndex: 0,
      score: 0,
      quizCompleted: false,

      userAnswers: {},

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),

      previousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex - 1,
        })),

      addAnswer: (question, answer) =>
        set((state) => ({
          userAnswers: {
            ...state.userAnswers,
            [question]: answer,
          },
        })),

      resetQuiz: () =>{
        window.location.href = `/dashboard`;
        set({
          quizCompleted: false,
          Quiz: null,
          currentQuestionIndex: 0,
          score: 0,
          userAnswers: {},
        })
      },
        

      setQuiz: (quiz: QuizResponse | null) =>
        set({
          Quiz: quiz,
          currentQuestionIndex: 0,
          score: 0,
          userAnswers: {},
        }),

      setQuizCompleted: async (completed) => {
        const quiz = useQuizStore.getState().Quiz;
        if (!quiz) return;

        const response = await axiosInstanceSecure.post<CorrectionResponse>(
          "/api/respondQuiz",
          {
            topic_id: quiz.topic_id,
          },
        );
        
        console.log("QuizAnswers:", response.data.ai_response);

        const userAnswers = useQuizStore.getState().userAnswers;

        console.log("userAnswers dans setQuizCompleted:", userAnswers);
        let newScore = 0;
        response.data.ai_response.map((question) => {
          const UserChose = userAnswers[question.question] || "";
          if (UserChose === question.answer) {
            newScore += 1;
          } 
        });
      

        set({
            score: newScore,
          quizCompleted: completed,
        });
      },
    }),
    {
      name: "quiz-storage",
    },
  ),
);
