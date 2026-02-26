package responses


type QuizQuestion struct {
	Type string `bson:"type" json:"type"`

	Question string `bson:"question" json:"question"`

	Options []string `bson:"options" json:"options"`
}

type QuizResponse struct {
	Topic    string         `json:"topic"`
	Questions []QuizQuestion  `json:"questions"`
}