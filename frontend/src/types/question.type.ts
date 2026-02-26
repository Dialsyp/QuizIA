export interface QuestionResponse {
  type: string;
  question: string;
  options: string[];
}

export interface QuizResponse {
  topic: string;
  topic_id: string;
  questions: QuestionResponse[];
}

export interface CorrectionResponse {
  ai_response: [
    {
      type: string;
      question: string;
      Options: string[];
      answer: string;
      explanation: string;
    },
  ];
}
