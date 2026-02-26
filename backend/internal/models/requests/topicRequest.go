package requests

type TopicRequest struct {
	Topic    string `json:"topic"`
	Level    string `json:"level"`
	QuizType []string `json:"quiz_type"`
	Language string `json:"language"`
}

